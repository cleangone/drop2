<template>
	<div>
		<div v-if="displayIsMini">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 260px;" :class="textBgColor">				
				<item-thumb :item="item" :image="image" vImageWidth="125" hImageWidth="262" imageMaxHeight="200" :tagId="tagId"/>
				<q-card-section class="text-caption q-pa-xs" :class="purple">
					<div style="line-height: 1.25em" :class="orange">
                  <span>{{ item.name }}</span>
                  <span v-if="hasArtist && this.image.isHorizontal" class="float-right">{{artist}}</span>
               </div>
               <div v-if="hasArtist && !this.image.isHorizontal" style="line-height: 1.5em" class="q-ma-none q-pa-none"> {{artist}} </div>
               <div v-if="priceTextBgColor" :class="priceTextBgColor" class="text-bold q-px-xs">{{ priceTextMini }}</div>	
					<div v-else :class="blue">{{ priceTextMini }}</div>	
					<item-timer v-if="isDropping" :item="item"/>
				</q-card-section>	
			</q-card>
      </div>
      <div v-else-if="displayIsCart">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 260px;" :class="textBgColor">				
				<item-thumb :item="item" :image="image" vImageWidth="125" hImageWidth="262" imageMaxHeight="200" :tagId="tagId"/>
				<q-card-section class="text-caption q-pa-xs" :class="purple">
					<div style="line-height: 1.25em" :class="orange">
                  <span>{{ item.name }}</span>
                  <span v-if="hasArtist && this.image.isHorizontal" class="float-right">{{artist}}</span>
               </div>
               <div v-if="hasArtist && !this.image.isHorizontal" style="line-height: 1.5em" class="q-ma-none q-pa-none"> {{artist}} </div>
               <div v-if="priceTextBgColor" :class="priceTextBgColor" class="text-bold q-px-xs">{{ priceTextMini }}</div>	
					<div v-else :class="blue">{{ priceTextMini }}</div>	
				</q-card-section>	
            <q-card-actions class="q-my-none q-px-none q-pb-xs q-pt-none" style="width: 100%" :class="blue">      
               <div class="col" align="right" :class="yellow">
                  <q-btn  @click="removeFromCart()" label="Remove" color="primary" size="sm" dense no-caps/>
               </div>
            </q-card-actions>
			</q-card>
      </div>
		<div v-else-if="displayIsThumb || displayIsBidThumb">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 320px;" :class="textBgColor">
				<item-thumb :item="item" :image="image" vImageWidth="150" hImageWidth="316" imageMaxHeight="250" :tagId="tagId"/>
				<q-card-section class="text-caption q-px-xs q-pt-xs q-pb-none" :class="purple">
					<div style="line-height: 1.25em" :class="orange">
                  <span class="text-weight-bold">{{ item.name }}</span>
                  <span v-if="hasArtist && this.image.isHorizontal" class="float-right">{{artist}}</span>
               </div>
               <div v-if="hasArtist && !this.image.isHorizontal" style="line-height: 1.5em" :class="pink"> {{artist}} </div>
               <div style="line-height: 1.5em" :class="indigo">
                  {{ priceText }}
                  <span v-if="hasBids && displayIsThumb"> - <a :href="'#/bids/' + item.id">{{ bidText }}</a></span>
               </div>
               <div v-if="userIsBuyer" class="text-bold" style="line-height: 1.5em">You are the buyer</div> 
               <div v-else-if="userIsWinningBidder" class="text-bold" style="line-height: 1.5em">You are the winning bidder</div> 
               <div v-else-if="userHasRequested" class="text-bold">You have requested</div>                
               <div v-else-if="isDropping">
                  <item-timer :item="item" :tagId="tagId"/>
                  <div v-if="userIsHighBidder" :class="classHighBidder">You are High Bidder</div>
                  <div v-if="userHasHigherMax" :class="classHighBidder">Max bid {{ userMaxBid }}</div>
                  <div v-if="userIsOutbid"     :class="classOutbid">You have been outbid</div> 
               </div> 
				</q-card-section>	
            <div v-if="isAvailable || (userIsAdmin && isSetup)" style="height:25px"/> <!-- spacer for actions when expanded -->
				<q-card-section class="absolute-bottom-left q-px-xs q-pt-xs q-pb-none" style="width: 100%" :class="green">
               <item-actions :item="item" :displayType="itemDisplayType"/>
			   </q-card-section>	
         </q-card>
		</div>
		<div v-else>
			<q-card-section :class="textFullBgColor">
            <div class="row q-mb-sm text-caption text-bold"> 
               <div class="col-5" :class="green">
                  <router-link v-if="prev" :to="{ name: itemPageRoute, params: { itemId: prev.id } }" class="col-5" :class="red">
                     <q-btn icon="arrow_back_ios" size="sm" flat dense color="primary"/>{{prev.name}}
                  </router-link> 
               </div>
               <div class="col" align="center" :class="yellow">
                  <router-link :to="itemsCollectionRouterLink" :class="red">{{ itemsCollectionName }}</router-link>                  
               </div>
               <div class="col-5" align="right" :class="red">
                  <router-link v-if="next" :to="{ name: itemPageRoute, params: { itemId: next.id } }" :class="yellow">
                     {{next.name}}<q-btn icon="arrow_forward_ios" size="sm" flat dense color="primary"/>
                  </router-link> 
               </div>
            </div>
            <q-card-section class="bg-white column">					
               <item-image-full :src="image.url" :width="imageFullWidth"/>
               <item-liked :item="item" size="lg"/> 
            </q-card-section>	
            <q-card-section class="text-subtitle2 q-pa-xs q-mt-sm">
               <div class="text-bold" :class="orange">{{ item.name }}</div>
               <div v-if="hasArtist"> {{artist}} </div>
               <div>
                  {{ priceText }}    
                  <span v-if="hasBids"> - <a :href="'#/bids/' + item.id">{{ bidText }}</a></span>
               </div>
               <div v-if="userIsBuyer" class="text-bold">You are the buyer</div>
               <div v-else-if="userIsWinningBidder" class="text-bold">You are the winning bidder</div> 
               <div v-else-if="userHasRequested" class="text-bold">You have requested</div>                
               <div v-else-if="isDropping">
                  <item-timer :item="item"/>
                  <div v-if="userIsHighBidder" :class="classHighBidder">You are High Bidder</div>
                  <div v-if="userHasHigherMax" :class="classHighBidder">Max bid {{ userMaxBid }}</div>
                  <div v-if="userIsOutbid"     :class="classOutbid">You have been outbid</div> 
               </div> 
               <div v-if="hasDescription" class="text-grey-8" v-html="item.description" />
            </q-card-section>	
            <item-actions :item="item" :displayType="itemDisplayType" class="q-mt-md"/>
         </q-card-section>
		</div>
  	</div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { CategoryMgr } from 'src/managers/CategoryMgr'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr'
	import { SessionMgr } from 'src/managers/SessionMgr'
	import { ItemDisplayType, SaleType, Route, Colors } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   
   const BgColors = {
      AVAILABLE:'bg-grey-3', // used for full image page
      DROPPING: 'bg-yellow',
      SOLD:     'bg-grey-7',
      BUYER:    'bg-green',
      OUTBID:   'bg-red-5',
   }
	export default {
      props: ['item', 'displayType', 
         'prev', 'next', // used when displaying full image
         'tagId'], // used when displaying full image from a page with tagged sections
      data() {
			return {
			}
		},
		computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
			...mapGetters('user', ['isAdmin']),
         ...mapGetters('drop', ['getDrop']),
         ...mapGetters('color', Colors),
			itemDisplayType() { return this.displayType  ? this.displayType : ItemDisplayType.THUMB },
			displayIsMini() { return this.itemDisplayType == ItemDisplayType.MINI },
			displayIsCart() { return this.itemDisplayType == ItemDisplayType.CART },
			displayIsThumb() { return this.itemDisplayType ==  ItemDisplayType.THUMB },
         displayIsBidThumb() { return this.itemDisplayType ==  ItemDisplayType.BID },
         itemsCollection() { return SessionMgr.getDisplayItemsDesc() },
         itemsCollectionName() { return this.itemsCollection.name },
         itemsCollectionRouterLink() { 
            if (SessionMgr.isHome(this.itemsCollection))           { return { name: Route.HOME } }
            else if (SessionMgr.isRecent(this.itemsCollection))    { return { name: Route.RECENT } }
            else if (SessionMgr.isCurrent(this.itemsCollection))   { return { name: Route.CURRENT } }
            else if (SessionMgr.isActivity(this.itemsCollection))  { return { name: Route.ACTIVITY } }
            else if (SessionMgr.isRoute(this.itemsCollection, Route.SEARCH))   { return { name: Route.SEARCH } }
            else if (SessionMgr.isRoute(this.itemsCollection, Route.FAVORITE)) { return { name: Route.FAVORITE } }
            else if (SessionMgr.isDrop(this.itemsCollection))      { return { name: Route.DROP, params: { id: this.itemsCollection.id } } }
            else if (SessionMgr.isCategory(this.itemsCollection))  { 
               const tagId = SessionMgr.getCategoryTag()
               return { name: Route.CATEGORY, params: { id: this.itemsCollection.id, tagId: tagId } }
            }
            else { return null } 
         },
			drop() { return this.getDrop(this.item.dropId) },
			image() { return this.item.primaryImage }, 
         hasImageUrl() { return (this.image.url ? true : false) },
			hasDescription() { return this.item.description && this.item.description.length },
			imageUrl() { return this.image.url ? this.image.url : 'statics/image-placeholder.png' },
			imageWidth() { return ("width: " + (this.image.isHorizontal ? this.hImageWidth : this.vImageWidth)) },		
         imageFullWidth() { 
            // todo - doesn't factor in layout drawer open 
            let width = this.image.isHorizontal ? "700" : "400"
            if (width > this.$q.screen.width - 100) { width = this.$q.screen.width - 100 }
            return width
         },	
         classHighBidder() { return "text-bold q-px-xs " + BgColors.BUYER },
         classOubtid() { return "text-bold q-px-xs" + BgColors.OUTBID },
         textBgColor() {
				if (this.isSetup) { return "bg-grey" }
				else if (this.isNotAvailable) { return (this.userIsBuyer || this.userIsHighBidder ? BgColors.BUYER : BgColors.SOLD) }
            else if (this.isDropping) { return BgColors.DROPPING }
            else { return "" }
         },
         textFullBgColor() {
            const color = this.textBgColor
            return color == "" ? BgColors.AVAILABLE : color
         },
         hasArtist() { return this.artist.length > 0 },
         artist() { return CategoryMgr.categoryName(this.item) },
         itemSaleType() { return (this.item.saleType == SaleType.DEFAULT ? this.drop.defaultSaleType : this.item.saleType) },
			style() { return (this.image.isHorizontal ? "width: 300px" : "width: 200px") },			
         userIsAdmin() { return this.isAdmin(this.userId) },
         isSetup() { return ItemMgr.isSetup(this.item) },
         isAvailable() { return ItemMgr.isAvailable(this.item) || ItemMgr.isDropping(this.item)  },
         isNotAvailable() { return ItemMgr.isHold(this.item) || ItemMgr.isInvoiced(this.item) || ItemMgr.isSold(this.item) },
         isDropping() { return ItemMgr.isDropping(this.item) },
			isBid() { return this.itemSaleType == SaleType.BID },
			isBuy() { return this.itemSaleType == SaleType.BUY },			
			numberOfBids() { return this.item.bids ? Object.keys(this.item.bids).length : 0 },
			currPrice() { return dollars(this.item.buyPrice > this.item.startPrice ? this.item.buyPrice : this.item.startPrice) },
			priceText() { 
            const prefix = ItemMgr.isDropping(this.item) ? "Current Bid: " : "Price: "
            return this.buildPriceText(prefix) 
         },
			priceTextMini() { return this.buildPriceText("") + (this.isDropping && this.hasBids ? " (" + this.bidText + ")" : "") },
			priceTextBgColor() { 
				if (this.isDropping && this.userIsHighBidder)  { return BgColors.BUYER }
				else if (this.isDropping && this.userIsOutbid) { return BgColors.SOLD }
				else  {return "" }
         },
         hasBids() { return this.item.numberOfBids && this.item.numberOfBids > 0 },
			bidText() { 
            if (!this.hasBids) { return "" }
            else if (this.item.numberOfBids == 1) { return "1 Bid" }
            else { return this.item.numberOfBids + " Bids" }
         },
         isHorizontal() { return ItemMgr.isSetup(this.item) },
			userHasRequested()    { return this.loggedIn && ItemMgr.isRequestedByUser(this.item, this.userId) },
         userIsBuyer()         { return this.loggedIn && this.isNotAvailable && !this.item.currBid && (this.item.buyerId == this.userId) },
			userIsWinningBidder() { return this.loggedIn && this.isNotAvailable && this.item.currBid  && (this.item.buyerId == this.userId) },
			userIsHighBidder() { return this.loggedIn && this.item.currBid && (this.item.currBid.userId == this.userId) },
			userIsOutbid() { return this.loggedIn && !this.userIsHighBidder && this.item.bidderIds && this.item.bidderIds.includes(this.userId) },
         userHasHigherMax() { return this.userIsHighBidder && (this.item.currBid.amount > this.item.buyPrice) },
         userMaxBid() { return dollars(this.item.currBid.amount) },
         itemPageRoute() { return Route.ITEM },
      },
      methods: {
         ...mapActions('cart', ['removeItemFromCart']),
         buildPriceText(prefix) {
				if (ItemMgr.isSold(this.item)) { return ItemStatus.SOLD }
				else if (ItemMgr.isHold(this.item) || ItemMgr.isInvoiced(this.item)) { return ItemStatus.HOLD + " (" + this.currPrice + ")" }
            else if (ItemMgr.isDropping(this.item)) { return prefix + this.currPrice }
            else return prefix + this.currPrice
         },
         removeFromCart() { this.removeItemFromCart(this.item.id) },
      },
		filters: {
			formatPrice(priceObj) { return "$" + priceObj + (String(priceObj).includes(".") ? "" : ".00") }
      },	
		components: {
			'item-thumb'      : require('components/Item/ItemThumb.vue').default,
         'item-actions'    : require('components/Item/ItemActions.vue').default,
			'item-image-full' : require('components/Item/ItemImageFull.vue').default,
     	   'item-liked'      : require('components/Item/ItemLiked.vue').default,
			'item-timer'      : require('components/Item/ItemTimer.vue').default,
		}
   }
   
</script>


