<template>
	<q-page class="q-pa-md">
		<div class="q-mt-sm text-h5">Cart</div>
      <div v-if="cartItemsExist">
         <div class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in cartItems" :key="key" :item="item" :displayType="displayType" />
			</div>
         <div v-if="!loggedIn && !editAnonUser && !anonUserUpdated" class="q-my-md">
            <q-btn label="Login" :to="loginPage" color="primary" class="q-mr-sm"/>
            or 
            <q-btn label="Enter Shipping Info" @click="updateAnonUser()" color="primary" class="q-ml-sm"/>
         </div>
         <q-card v-if="!loggedIn && (editAnonUser || anonUserUpdated)" class="form-card flat q-mt-md" 
            :style="'width:' + userInfoWidth">
            <q-card-section>
               <div v-if="editAnonUser" class="row">
                  <div class="col q-gutter-sm">
                     <q-input v-model="anonUserToUpdate.anonUserEmail" label="Email" ref="email" type="email" autocomplete="email" 
                        lazy-rules :rules="[ val => validEmailAddress(val) || 'Not a valid email']" 
                        filled />
                     <div class="row">
                        <q-input v-model="anonUserToUpdate.firstName" label="First Name" class="col-5" filled />
                        <q-input v-model="anonUserToUpdate.lastName"  label="Last Name"  class="col q-ml-sm"  filled />
                     </div>               
                     <q-input v-model="anonUserToUpdate.address" label="Address" filled/>
                     <q-input v-model="anonUserToUpdate.city"    label="City" filled />
                     <div class="row">
                        <q-input v-model="anonUserToUpdate.state"   label="State" class="col-3" filled />
                        <q-input v-model="anonUserToUpdate.zip"     label="Zip"   class="col-4 q-ml-sm" filled />
                        <q-input v-model="anonUserToUpdate.country" label="Country (if not USA)" class="col q-ml-sm" filled />
                     </div>
                     <div class="q-mt-md">
                        <q-btn label="Done"   @click="persistAnonUser()"    color="primary" />
                        <q-btn label="Cancel" @click="editAnonUser = false" color="primary" class="q-ml-md"/>
                     </div>
                  </div>
               </div>
               <div v-else>
                  <div>{{user.firstName}} {{user.lastName}} </div>
                  <div>{{user.anonUserEmail}}</div>
                  <div>{{user.address}}</div>
                  <div>{{user.city}}<span v-if="user.city && user.state">, </span>{{user.state}}</div>
                  <div>{{user.zip}}</div>
                  <div>{{user.country}}</div>
                  <q-btn label="Update" @click="updateAnonUser()" color="primary" :size="updateAnonInfoButtonSize" class="q-mr-sm q-mt-sm"/>
               </div>
            </q-card-section>
         </q-card>
		   
         <div v-if="loggedIn || (anonUserValid && !editAnonUser)" class="q-mt-md">
            <q-btn label="Submit Purchase Request" @click="submitReq()" color="primary"  />
         </div>      
      </div>
      <div v-else class="q-mt-md">
         Cart is empty
      </div>
	</q-page>
</template>

<script>
   import { mapGetters, mapActions  } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr'
   import { ItemDisplayType, Route } from 'src/utils/Constants'
   import { isValidEmailAddress } from 'src/utils/EmailUtils'
   
	export default {
		data() {
		   return {		
            editAnonUser: false,
            anonUserToUpdate: {},
         }
		},
	  	computed: {
			...mapGetters('auth', ['loggedIn', 'anonLoggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
			...mapGetters('cart', ['cartSize', 'getCartItemIds']),
         ...mapGetters('item', ['getItems']),
         user() { return this.getUser(this.userId) }, // can be anon or regular
         displayType() { return ItemDisplayType.CART },
         userInfoWidth() { return this.$q.screen.width > 600 ? "600px" : "75%"},
         cartItemsExist() { return this.cartSize > 0 },
         cartItems() { 
            let items = this.getItems(this.getCartItemIds)
            return items.sort((a,b) => a.sortName.localeCompare(b.sortName))
         },
         loginPage() { return "/auth/login/" + Route.CART },
         anonUserUpdated() { 
            // true if any user field filled in
            return this.user.anonUserEmail || this.user.phone || this.user.firstName || this.user.lastName ||
               this.user.address || this.user.city || this.user.state || this.user.country
         },
         anonUserValid() {
            return (this.user.anonUserEmail &&
               this.user.firstName &&
               this.user.lastName)
         },
         updateAnonInfoButtonSize() { return this.anonUserValid ? "sm"  : "md"  },
      },
		methods: {
         ...mapActions('action', ['submitPurchaseRequests']),
         ...mapActions('cart', ['clearCart']),
         ...mapActions('user', ['setUser']),
         updateAnonUser() { 
            this.anonUserToUpdate = Object.assign({}, this.user) 
            this.editAnonUser = true
         },
         persistAnonUser() {
            this.anonUserToUpdate.email = true
            this.setUser(this.anonUserToUpdate)
            this.editAnonUser = false
         },
         validEmailAddress(email) { return isValidEmailAddress(email) },
         submitReq() { 
            let actions = []
            for (var item of this.cartItems) {
               actions.push({ itemId: item.id, itemName: item.name, amount: item.startPrice, 
                              userId: this.user.id, userNickname: UserMgr.getNickname(this.user) })
            }
            this.submitPurchaseRequests(actions)
            this.clearCart()
         },
      },
		components: {
         'item' : require('components/Item/Item.vue').default,
      },
	}

</script>
