<template>   
   <div v-if="userIsLoggedIn" />
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   
   export default {
      data () {
         return {
            boundUserId: null,
            unboundCartItems: [],
         }
      },
      computed: {
         ...mapGetters('auth', ['userId', 'loggedIn', 'anonLoggedIn']),
         ...mapGetters('action', ['actionsExist']),
         ...mapGetters('cart', ['getCartItems']),
         ...mapGetters('invoice', ['invoicesExist']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         
         userIsLoggedIn() { 
            if (this.loggedIn) {
               console.log("Bindings: userIsLoggedIn: user " + this.userId)
               const user = this.getUser(this.userId)
               if (user && user.isAdmin) {
                  if (!this.actionsExist) { this.bindActions() }
                  if (!this.invoicesExist) { this.bindInvoices() }
                  this.bindEmailErrors()
               }

               if (this.userId != this.boundUserId) { 
                  this.bindUserActions(this.userId) 
                  this.bindUserInvoices(this.userId) 
                  this.bindCart() 
                  this.boundUserId = this.userId
               }
            }
            else if (this.anonLoggedIn) {
               console.log("Bindings: userIsLoggedIn: anon user " + this.userId)
               if (this.userId != this.boundUserId) { 
                  this.bindCart() 
                  this.boundUserId = this.userId
               }
            }
            else {
               console.log("Bindings: userIsLoggedIn: none")
               if (this.boundUserId != null) { 
                  console.log("unbinding userId " + this.boundUserId)
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
      },
      methods: {
         ...mapActions('action',  ['bindActions', 'bindUserActions', 'unbindUserActions']),
         ...mapActions('auth',    ['loginAnonUser']),
         ...mapActions('cart',    ['bindUserCart', 'unbindUserCart', 'addItemsToCart']),
         ...mapActions('drop',    ['bindDrops']),
         ...mapActions('error',   ['bindEmailErrors']),
         ...mapActions('category',['bindCategories']),         
         ...mapActions('invoice', ['bindInvoices', 'bindUserInvoices', 'unbindUserInvoices']),
         ...mapActions('item',    ['bindItems', 'bindRecentItems' ]),
         ...mapActions('setting', ['bindSettings']),
         ...mapActions('shipment',['bindShipments']),
         ...mapActions('tag',     ['bindTags']),
         ...mapActions('user',    ['bindUsers']),
         
         bindCart() { 
            // preserve any items in current cart or in cart when logged out  
            const currItems = this.getCartItems
            this.bindUserCart(this.userId)  
            this.addItemsToCart(currItems)  
            this.addItemsToCart(this.unboundCartItems)  
            this.unboundCartItems = []
         },
         
      },
      created() {
         this.bindDrops()
         this.bindCategories()
         this.bindItems()
         this.bindRecentItems()
         this.bindSettings()
         this.bindTags()
         this.bindUsers()
         this.bindShipments()
      },
  }

</script>
