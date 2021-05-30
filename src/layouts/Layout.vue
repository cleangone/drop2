<template>
   <q-layout view="hHh lpr lFf">
      <q-header class="header" elevated>
         <q-toolbar class="row">
            <q-btn @click="toggleDrawerLock()" icon-right="menu" flat dense />
            <router-link to="/" class="col">
               <span class="absolute-center text-h5 text-white">Dropzone</span>
            </router-link>                     
            <q-btn v-if="userIsLoggedIn" icon-right="account_circle" :label="userDisplayName" flat dense >
               <q-menu content-class="bg-white">
                  <q-list dense style="min-width: 100px">
                     <list-item path="/activity"  label="Activity" />
                     <list-item path="/favorites" label="Favorites" />    
                     <list-item path="/actions"   label="History" />           
                     <list-item path="/invoices"  label="Invoices" />
                     <list-item path="/account"   label="Settings" />
                     <q-separator />
                     <q-item clickable v-close-popup><q-item-section @click="logoutUser">Logout</q-item-section></q-item>
                  </q-list>
               </q-menu>
            </q-btn>        
            <q-btn v-else icon-right="account_circle" :to="loginPage" :label="loginDisplay" dense flat />
            
            <q-btn icon="search" @click="searchString=''; showSearch=true" flat dense />
            <div style="height:30px">
               <q-menu v-model="showSearch" content-class="bg-white">
                  <div class="q-pa-xs row">
                  <q-input label="Search" v-model="searchString" @keydown.enter.prevent="search()" autofocus autogrow dense errorfilled /> 
                  <q-btn label="Search" @click="search()" color="primary" class="q-ml-xs" />
                  </div>
               </q-menu>
            </div>
            <q-btn v-if="showCart" icon="shopping_cart" to="/cart" dense flat >
               <q-badge v-if="cartItemsExist" color="blue" floating>{{cartItemCount}}</q-badge>
            </q-btn>
         </q-toolbar>
      </q-header>

      <!-- 
         desktop - mini is always shown, hamburger locks it open, mouseover also opens, drawer pushes content to right
         mobile - drawer not shown, hamburger shows it, no mini mode, drawer overlays content 
      -->
      <q-drawer id="drawer" v-model="showDrawer" :breakpoint="767" :width="210" bordered
         :mini="drawerMini" :overlay="$q.platform.is.mobile ? true : false"
         @mouseover="drawerMouseover=true" @mouseout="drawerMouseover=false">
         <q-list> 
            <layout-item v-if="currentUserActionsExist" primary :class="activeItemsClass"
               path="/current" label="Current Activity" iconName="fas fa-gavel" />
            <q-expansion-item v-model="artistsExpanded" label="Artists" icon="brush" expand-separator>
               <layout-item v-for="(category, key) in categories" :key="key" 
                  :path="'/category/' + category.id" :label="category.name" 
                  :avatarImage="category.primaryImage ? category.primaryImage.thumbUrl : null" 
                  :topLabel="category.topLineName" :botLabel="category.bottomLineName"/>
               <div class="q-pb-md"/>
            </q-expansion-item>
            <q-expansion-item v-if="loggedIn" label="My Account" icon="account_circle" :content-inset-level="0.25" expand-separator>  
               <layout-item path="/activity"  label="Activity"  iconName="fas fa-gavel"/>
               <layout-item path="/favorites" label="Favorites" iconName="favorite" />    
               <layout-item path="/actions"   label="History"   iconName="history"/>           
               <layout-item path="/invoices"  label="Invoices"  iconName="shopping_cart" />           
               <layout-item path="/account"   label="Settings"  iconName="account_circle" class="q-pb-md"/>
            </q-expansion-item>
            <q-expansion-item v-if="userIsAdmin" label="Admin" icon="settings" :content-inset-level="0.25" expand-separator>               
               <layout-item v-if="todosExist" path="/admin/todo" label="ToDo" iconName="fas fa-check-circle"/>
               <layout-item path="/admin/drops"      label="Drops"      iconName="system_update"/>
               <layout-item path="/admin/categories" label="Artists"    iconName="brush"/>
               <layout-item path="/admin/users"      label="Users"      iconName="group"/>
               <layout-item path="/admin/invoices"   label="Invoices"   iconName="shopping_cart"/>
               <layout-item path="/admin/tags"       label="Tags"       iconName="topic"/>
               <layout-item path="/admin/settings"   label="Settings"   iconName="settings"/>
               <q-toggle label="Admin Footer" v-model="showAdminFooter" color="blue" />
            </q-expansion-item>
            <layout-item v-if="showAppInstall" path="/install" label="Install" iconName="get_app"/>
         </q-list>
         <q-list class="fixed-bottom">
            <q-item-label header class="text-caption">{{ version }}</q-item-label>       
         </q-list>
      </q-drawer>

      <q-page-container>
         <router-view />
      </q-page-container>

      <!-- now only showing footer to admin -->
      <q-footer v-if="userIsAdmin && showAdminFooter" class="footer q-px-xs q-py-none">
         <q-tabs indicator-color="transparent" class="row q-my-none q-py-none q-px-none">
            <footer-tab                   icon="system_update"       label="Drops"    to="/admin/drops"      tabClass="col-2" /> 
            <footer-tab                   icon="brush"               label="Artists"  to="/admin/categories" tabClass="col-2" /> 
            <footer-tab v-if="todosExist" icon="fas fa-check-circle" label="ToDo"     to="/admin/todo"       tabClass="col text-yellow" /> 
            <footer-tab                   icon="group"               label="Users"    to="/admin/users"      tabClass="col-2" /> 
            <footer-tab                   icon="shopping_cart"       label="Invoices" to="/admin/invoices"   tabClass="col-2" /> 
         </q-tabs>
         <!-- <q-tabs v-else indicator-color="transparent"  class="row q-my-none q-py-none q-px-none">
            <q-route-tab icon="home" to="/" size="sm" class="q-pa-none q-ma-none" dense />    
            <span class="col"/>
            <q-route-tab v-if="currentUserActionsExist" icon="fas fa-gavel" to="/current" size="sm" class="q-pa-none q-ma-none" dense />    
         </q-tabs>    -->
      </q-footer>

      <q-dialog v-model="userHasAlert">
         <user-alert :alert="userAlert" :user="user" :cancelledAlertIds="cancelledAlertIds" />
      </q-dialog>
  </q-layout>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import algoliasearch from 'algoliasearch/lite'
   import { AlgoliaConfig } from 'boot/algoliaConfig'
   import { LocalStorageMgr, InstallStatus } from 'src/managers/storage/LocalStorageMgr'
   import { Route, Versions } from 'src/utils/Constants'
   import { getIds } from 'src/utils/Utils'
   
   export default {
      name: 'MyLayout',
      data () {
         return {
            artistsExpanded: true,
            showDrawer: true,
            drawerLockedOpen: false,
            drawerMouseover: false,
            boundUserId: null,
            unboundCartItems: [],
            cancelledAlertIds: [],
            showAdminFooter: true,
            showSearch: false,
            searchIndex: null,
            searchString: ""
         }
      },
      computed: {
         ...mapGetters('auth', ['userId', 'loggedIn', 'anonLoggedIn']),
         ...mapGetters('action', ['actionsExist', 'getUserActions']),
         ...mapGetters('cart', ['cartSize', 'getCartItems']),
         ...mapGetters('category', ['getPublicCategories']),
         ...mapGetters('current', ['currentActivityExists']),
         ...mapGetters('drop', ['getHomePageDrops']),
         ...mapGetters('error', ['visibleEmailErrorsExist']),
         ...mapGetters('invoice', ['invoicesExist']),
         ...mapGetters('item', ['requestedItemsExist', 'holdItemsExist', 'getItems']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         ...mapGetters('install', ['canInstallApp', 'installStatusExists', 'getInstallStatus']),
         drawerMini() { return this.$q.platform.is.mobile ? false : (!this.drawerLockedOpen && !this.drawerMouseover) },
         drawerOverlay() { return this.$q.platform.is.mobile ? true : false },
         user() { return this.getUser(this.userId)},
         userIsLoggedIn() { 
            if (this.loggedIn) {
               console.log("userIsLoggedIn: user " + this.userId)
               if (this.userId != this.boundUserId) { 
                  this.bindUserActions(this.userId) 
                  this.bindUserInvoices(this.userId) 
                  this.bindCart() 
                  this.boundUserId = this.userId
               }
            }
            else if (this.anonLoggedIn) {
               console.log("userIsLoggedIn: anon user " + this.userId)
               if (this.userId != this.boundUserId) { 
                  this.bindCart() 
                  this.boundUserId = this.userId
               }
            }
            else {
               // console.log("userIsLoggedIn: none")
               if (this.boundUserId != null) { 
                  // console.log("unbinding userId " + this.boundUserId)
                  this.unbindUserActions() 
                  this.unbindUserInvoices() 
                  
                  this.unboundCartItems = this.getCartItems
                  this.unbindUserCart()
                  this.boundUserId = null
               }

               // wait 2 secs to let auth settle, and then anon login if not logged in
               setTimeout(() => { 
                  if (!this.loggedIn && !this.anonLoggedIn) {
                     // console.log("userIsLoggedIn: logging in anon user")
                     this.loginAnonUser()
                  }
               }, 2000) 
            }
            return this.loggedIn
         },
         loginPage() { return "/auth/login/" + Route.HOME },
         userIsAdmin() { 
            const isAdmin = this.user && this.user.isAdmin
            // console.log("Layout.userIsAdmin", isAdmin)
            if (isAdmin) {
               if (!this.actionsExist) { this.bindActions() }
               if (!this.invoicesExist) { this.bindInvoices() }
               this.bindEmailErrors()
            }
            return isAdmin 
         },
         largeScreen() { return this.$q.screen.width > 450 },
         userDisplayName() { return this.largeScreen ? 
            (this.user.firstName ? this.user.firstName : this.user.authEmailCopy) : ""  },
         loginDisplay() { return this.largeScreen ? "Login" : "" },
         showCart() { return this.largeScreen || this.cartItemsExist },         
         userAlert() { 
            if (this.loggedIn && this.user.alerts) { 
               for (var alert of this.user.alerts) {
                  if (!this.cancelledAlertIds.includes(alert.id)) { return alert }
               }
            }
            return null
         },
         userHasAlert() { return this.userAlert != null },
         todosExist() { return this.requestedItemsExist || this.holdItemsExist || this.visibleEmailErrorsExist},
         currentUserActionsExist() { 
            const yesterday = new Date().getTime() - 1000*60*60*24 // 24 hours ago in millis
            for (var action of this.getUserActions(this.userId)) {
               if (action.createdDate > yesterday) { return true }
            }
            return false
         }, 
         activeItemsClass() { 
            if (!this.currentActivityExists) { return "" }
            setTimeout(() => { this.setCurrentActivity(false) }, 3000)              
            return "text-bold bg-yellow-4"
         },
         cartItemsExist() { return this.cartItemCount > 0 },
         cartItemCount() { return this.cartSize },
         categories() { 
            // piggyback drop binding 
            const drops = this.getHomePageDrops
            // console.log('Layout: binding drops', drops)
            if (drops.length) {
               this.bindDropItems(getIds(drops)) // drop bind a no-op if already bound    
            }

            const categories = this.getPublicCategories
            this.bindCategoryItems(getIds(categories)) // category binding a no-op if already bound
            return categories
         },
         showAppInstall() { return this.canInstallApp || this.installStatusExists },
         version() { return Versions[0] },
      },
      methods: {
         ...mapActions('action',  ['bindActions', 'bindUserActions', 'unbindUserActions']),
         ...mapActions('auth',    ['loginAnonUser', 'logoutUser']),
         ...mapActions('cart',    ['bindUserCart', 'unbindUserCart', 'addItemsToCart']),
         ...mapActions('current', ['setCurrentActivity']),
         ...mapActions('drop',    ['bindDrops']),
         ...mapActions('error',   ['bindEmailErrors']),
         ...mapActions('category',['bindCategories']),         
         ...mapActions('invoice', ['bindInvoices', 'bindUserInvoices', 'unbindUserInvoices']),
         ...mapActions('item',    ['bindItems', 'bindCategoryItems', 'bindDropItems', 'bindRecentItems' ]),
         ...mapActions('search',  ['setSearchStart', 'setSearchResults']),         
         ...mapActions('setting', ['bindSettings']),
         ...mapActions('tag',     ['bindTags']),
         ...mapActions('user',    ['bindUsers']),
         ...mapActions('install', ['setDeferredPrompt', 'setInstallStatus']),
         toggleDrawerLock() { 
            if (this.$q.platform.is.mobile) {
               this.showDrawer = !this.showDrawer
               // console.log("mobile - showDrawer", this.showDrawer)
            }
            else {
               this.drawerLockedOpen = !this.drawerLockedOpen
               // console.log("desktop - drawerLockedOpen", this.drawerLockedOpen)
            }
         },
         bindCart() { 
            // preserve any items in current cart or in cart when logged out  
            const currItems = this.getCartItems
            this.bindUserCart(this.userId)  
            this.addItemsToCart(currItems)  
            this.addItemsToCart(this.unboundCartItems)  
            this.unboundCartItemIds = []
         },
         logout() {        
            this.logoutUser()
            if (this.$route.path != "/") { this.$router.push("/") }
         },
         search() {
            this.showSearch = false
            if (!this.searchString || !this.searchString.length ) { return }
            
            this.setSearchStart(this.searchString)
            this.searchIndex.search(this.searchString)
               .then((responses) => {
                  const itemIds = []
                  if (responses.hits) {
                      for (var hit of responses.hits) {
                        itemIds.push(hit.objectID)
                     }
                  }
                  const items = this.getItems(itemIds)
                  items.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
                  this.setSearchResults(items) 
               })

            if (this.$route.name != Route.SEARCH) {
               this.$router.push("/search")
            }
         }
      },
      created() {
         if (this.$q.platform.is.mobile) { this.showDrawer = false }
         this.bindDrops()
         this.bindCategories()
         this.bindItems()
         this.bindRecentItems()
         this.bindSettings()
         this.bindTags()
         this.bindUsers()

         const searchClient = algoliasearch(AlgoliaConfig.appId, AlgoliaConfig.searchKey)
         this.searchIndex = searchClient.initIndex(AlgoliaConfig.index);
            
         // local storage for device-specific state, store for async responsivness 
         this.setInstallStatus(LocalStorageMgr.getAppInstall())
         window.addEventListener('beforeinstallprompt', (e) => {
            console.log('Processing beforeinstallprompt event')
            e.preventDefault() // prevent mini-infobar from appearing on mobile
            this.setDeferredPrompt(e)
            if (this.getInstallStatus == InstallStatus.INSTALLED) {
               this.setInstallStatus(LocalStorageMgr.setAppInstall("")) // presence of prompt overrides installed state
            }
         })
      },
      components: {
         'layout-item' : require('layouts/LayoutItem.vue').default,
         'list-item'   : require('layouts/ListItem.vue').default,
         'footer-tab'  : require('layouts/FooterTab.vue').default,
         'user-alert'  : require('components/User/UserAlert.vue').default,
      },
  }


// When the user scrolls down 50px from the top of the document, resize the header's font size
// window.onscroll = function() {scrollFunction()};

// function scrollFunction() {  
//   if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
//     document.getElementById("header").style.fontSize = "30px";
//   } else {
//     document.getElementById("header").style.fontSize = "90px";
//   }
  
  
//   var scrollBottom = document.documentElement.scrollHeight - window.innerHeight - document.documentElement.scrollTop
//   console.log(scrollBottom + " - win: " + window.innerHeight + ", doc: " + document.documentElement.scrollHeight + ", scrollTop: " + document.documentElement.scrollTop)
  
//   if (scrollBottom > 100) {
//     document.getElementById("footer").style.height = "10px";
//   } else {
//     document.getElementById("footer").style.height = "60px";
//   }
// }

</script>

<style>
	/* .footer { 
      background-color: rgba(0, 0, 0, 0.7);
      height: 40px;
      transition: height .25s; 
   } 
   */
   
   .header { 
      background-color: rgba(0, 0, 0, 0.8);
   } 
   .footer { 
      background-color: rgba(0, 0, 0, 0.65);
   } 
   /* 
   .footer:hover { background-color: black;
      height: 60px;
   } 
   */ 
</style>
