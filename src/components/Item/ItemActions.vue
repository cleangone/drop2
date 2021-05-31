<template>
	<q-card-actions class="q-my-none q-px-none q-pb-xs q-pt-none" style="width: 100%" :class="blue"> 
      <div v-if="isListed && loggedIn && !userHasRequested" class="row" style="width: 100%" :class="pink">
         <div class="col-6">
            <q-btn v-if="isBid"  @click="showBidModal=true" :label="purchaseAction" color="primary" :size="buttonSize" dense no-caps/>
            <q-btn v-else-if="isBuy" @click="promptToBuy()" :label="purchaseAction" color="primary" :size="buttonSize" dense no-caps/>
         </div>
         <div class="col" align="right" :class="yellow">
            <q-btn v-if="isBuy" @click="addToCart()" label="Add to Cart" color="primary" :size="buttonSize" dense no-caps/>
         </div>
      </div>
      <div v-else-if="isListed && !loggedIn" class="row" style="width: 100%" :class="pink">
         <div class="col-6">
            <router-link :to="loginPage" class="text-weight-medium" :style="'font-size:'+fontSize">Login to {{purchaseAction}}</router-link> 
         </div>
         <div class="col" align="right" :class="yellow">
            <q-btn v-if="isBuy" @click="addToCart()" label="Add to Cart" color="primary" :size="buttonSize" dense no-caps/>
         </div>
      </div>
      <div v-else-if="isAdminSetup" class="row" style="width: 100%" :class="pink">
         <div class="col-6">
            <q-btn v-if="isBid || isBuy" :label="purchaseAction" disable color="primary" :size="buttonSize" dense/>
         </div>
         <div class="col" align="right" :class="yellow">
            <q-btn v-if="isBuy" label="Add to Cart" disable color="primary" :size="buttonSize" dense no-caps/>
         </div>
      </div>
      <q-dialog v-model="showBidModal">
			<item-bid :item ="item" @close="showBidModal=false" />
		</q-dialog>
	</q-card-actions>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr, ItemSaleType } from 'src/managers/ItemMgr'
   import { DropMgr } from 'src/managers/DropMgr'
   import { UserMgr } from 'src/managers/UserMgr'
   import { SettingsMgr } from 'src/managers/SettingsMgr'
   import { ItemDisplayType, Route, Colors } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   
	export default {
		props: ['item', 'displayType'], 
		data() {
			return {
            showBidModal: false,
			}
		},
		computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
			...mapGetters('user', ['getUser']),
         ...mapGetters('drop', ['getDrop']),
         ...mapGetters('setting', ['getSetting']),
         ...mapGetters('color', Colors),
         setting() { return this.getSetting },
         confirmPurchaseText() { return SettingsMgr.isAutoPurchaseReqProcessing(this.setting) ? 'Confirm Purchase' : 'Confirm Purchase Request' },
         isListed() { return ItemMgr.isListed(this.item) },
         isAdminSetup() { return this.userIsAdmin && ItemMgr.isSetup(this.item) },         
			drop() { return this.getDrop(this.item.dropId) },
         itemSaleType() {  
            let itemSaleType = this.item.saleType
            // todo - reexamine this change to buy once drop has finished
            if (DropMgr.isDropped(this.drop)) { itemSaleType = ItemSaleType.BUY }
            if (itemSaleType == ItemSaleType.DROP && this.item.numberOfBids == 0) {
               // todo - reexamine this - overly complicated
               const bidPeriodEndMillis = this.drop.startDate.seconds*1000 + this.setting.bidPeriod*60*1000
               if (new Date().getTime() > bidPeriodEndMillis) { itemSaleType = ItemSaleType.BUY }
            }
            return itemSaleType
         },
         purchaseAction() { return this.itemSaleType == ItemSaleType.BUY ? "Buy Now" : "Bid" },
         buttonSize() { return this.displayType == ItemDisplayType.FULL ? "md"  : "sm"  },        
         fontSize()   { return this.displayType == ItemDisplayType.FULL ? "1em" : ".65em"  },        
         user() { return this.getUser(this.userId)},
         userHasRequested() { return this.loggedIn && ItemMgr.isRequestedByUser(this.item, this.userId) },
         userIsAdmin() { return this.user && this.user.isAdmin },
			isBid() { return (this.itemSaleType == ItemSaleType.BID || this.itemSaleType == ItemSaleType.DROP) && this.item.startPrice },
			isBuy() { return this.itemSaleType == ItemSaleType.BUY && this.item.startPrice },	
         loginPage() { return "/auth/login/" + Route.HOME },  // todo - update to be this page
      },
		methods: {
         ...mapActions('action', ['submitBid', 'submitPurchaseRequest']),
         ...mapActions('cart', ['addItemToCart']),
         ...mapActions('current', ['setCurrentActivity']),
         ...mapActions('user', ['setLikes']),
			login() { this.$router.push("/auth/login") },
			promptToBuy() {
            this.$q.dialog({title: this.confirmPurchaseText, message: 'Buy ' + this.item.name + ' for ' + dollars(this.item.startPrice) + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
               this.submitPurchaseRequest( {
                  itemId: this.item.id, itemName: this.item.name, amount: this.item.startPrice, 
                  userId: this.userId, userNickname: UserMgr.getNickname(this.user) 
               }) 
               this.setCurrentActivity(true) 
				})
			},
         addToCart() { this.addItemToCart(this.item) },			
		},
		filters: {
			formatPrice(priceObj) { return "$" + priceObj + (String(priceObj).includes(".") ? "" : ".00") }
		},	
		components: {
			'item-bid' : require('components/Item/ItemBid.vue').default
		},
	}
</script>

<style>
	.card {
		max-width: 500px;
		transition: background 0.3s;
	}
	.card-clickable { cursor: pointer; }
	.card-clickable:hover {
		background: #bdbdbd!important;
	}
</style>


