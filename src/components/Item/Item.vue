<template>
	<div>
		<div v-if="displayIsMini">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 260px;" :class="textBgColor">				
				<item-thumb :item="item" :image="image" vImageWidth="125" hImageWidth="262" imageMaxHeight="200" :tagId="tagId"/>
				<q-card-section class="text-caption q-pa-xs" :class="purple">
               <div style="line-height: 1.25em" class="text-weight-bold" :class="orange">{{ item.name }}</div>
               <div v-if="hasArtist" style="line-height: 1.5em" class="q-ma-none q-pa-none">{{ artist }}</div>
               <div v-if="priceTextBgColor" :class="priceTextBgColor" class="text-bold q-px-xs">{{ priceTextMini }}</div>	
					<div v-else :class="blue">{{ priceTextMini }}</div>	
					<item-timer v-if="isDropping && isDrop" :item="item"/>
				</q-card-section>	
			</q-card>
      </div>
      <div v-else-if="displayIsCart">
			<q-card v-if="hasImageUrl" class="q-pt-xs q-px-xs" style="min-height: 260px;" :class="textBgColor">				
				<item-thumb :item="item" :image="image" vImageWidth="125" hImageWidth="262" imageMaxHeight="200" :tagId="tagId"/>
				<q-card-section class="text-caption q-pa-xs" :class="purple">
					<div style="line-height: 1.25em" class="text-weight-bold" :class="orange">{{ item.name }}</div>
               <div v-if="hasArtist" style="line-height: 1.5em" class="q-ma-none q-pa-none">{{ artist }}</div>
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
					<div style="line-height: 1.25em" class="text-weight-bold" :class="orange">{{ item.name }}</div>
               <div v-if="hasArtist" style="line-height: 1.5em" :class="pink">{{ artist }}</div>
               <div style="line-height: 1.5em" :class="indigo">
                  {{ priceText }}
                  <span v-if="hasBids && displayIsThumb"> - <a :href="'#/bids/' + item.id">{{ bidText }}</a></span>
               </div>
               <div v-if="userIsBuyer" class="text-bold" style="line-height: 1.5em">You are the buyer</div> 
               <div v-else-if="userIsWinningBidder" class="text-bold" style="line-height: 1.5em">You are the winning bidder</div> 
               <div v-else-if="userHasRequested" class="text-bold">You have requested</div>                
               <div v-else-if="isDroppingOrLive">
                  <item-timer v-if="isDrop" :item="item" :tagId="tagId"/>
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
                  <router-link v-if="prev" :to="prevItemLink" class="col-5" :class="red">
                     <q-btn icon="arrow_back_ios" size="sm" flat dense color="primary"/>{{prev.name}}
                  </router-link> 
               </div>
               <div class="col" align="center" :class="yellow">
                  <router-link :to="itemsCollectionRouterLink" :class="red">{{ itemsCollectionName }}</router-link>                  
               </div>
               <div class="col-5" align="right" :class="red">
                  <router-link v-if="next" :to="nextItemLink" :class="yellow">
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
               <div v-else-if="isDroppingOrLive">
                  <item-timer v-if="isDrop" :item="item"/>
                  <div v-if="userIsHighBidder" :class="classHighBidder">You are High Bidder</div>
                  <div v-if="userHasHigherMax" :class="classHighBidder">Max bid {{ userMaxBid }}</div>
                  <div v-if="userIsOutbid"  :class="classOutbid" >You have been outbid</div> 
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
   import { ItemMgr, ItemStatus, ItemSaleType } from 'src/managers/ItemMgr'
	import { SessionMgr } from 'src/managers/SessionMgr'
	import { ItemDisplayType, Route, Colors } from 'src/utils/Constants'
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
			itemDisplayType() { return this.displayType ? this.displayType : ItemDisplayType.THUMB },
			displayIsMini()     { return this.itemDisplayType == ItemDisplayType.MINI },
			displayIsCart()     { return this.itemDisplayType == ItemDisplayType.CART },
			displayIsThumb()    { return this.itemDisplayType == ItemDisplayType.THUMB },
         displayIsBidThumb() { return this.itemDisplayType == ItemDisplayType.BID },
         itemsCollection() { return SessionMgr.getDisplayItemsDesc() },
         itemsCollectionName() { return this.itemsCollection.name },
         itemsCollectionRouterLink() { 
            if (SessionMgr.isHome(this.itemsCollection))           { return { name: Route.HOME } }
            else if (SessionMgr.isRecent(this.itemsCollection))    { return { name: Route.RECENT } }
            else if (SessionMgr.isCurrent(this.itemsCollection))   { return { name: Route.CURRENT } }
            else if (SessionMgr.isRoute(this.itemsCollection, Route.ACTIVITY)) { return { name: Route.ACTIVITY } }
            else if (SessionMgr.isRoute(this.itemsCollection, Route.SEARCH))   { return { name: Route.SEARCH } }
            else if (SessionMgr.isRoute(this.itemsCollection, Route.FAVORITE)) { return { name: Route.FAVORITE } }
            else if (SessionMgr.isRoute(this.itemsCollection, Route.CART))     { return { name: Route.CART } }
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
			imageUrl() { return this.image.url ? this.image.url : 'image-placeholder.png' },
			imageWidth() { return ("width: " + (this.image.isHorizontal ? this.hImageWidth : this.vImageWidth)) },		
         imageFullWidth() { 
            // todo - doesn't factor in layout drawer open 
            let width = this.image.isHorizontal ? "700" : "400"
            if (width > this.$q.screen.width - 100) { width = this.$q.screen.width - 100 }
            return width
         },	
         classHighBidder() { return "text-bold q-px-xs " + BgColors.BUYER },
         classOutbid() { return "text-bold q-px-xs " + BgColors.OUTBID },
         textBgColor() {
				if (this.isSetup) { return "bg-grey" }
				else if (this.isNotAvailable) { return (this.userIsBuyer || this.userIsHighBidder ? BgColors.BUYER : BgColors.SOLD) }
            else if (this.isDroppingOrLive) { return BgColors.DROPPING }
            else { return "" }
         },
         textFullBgColor() {
            const color = this.textBgColor
            return color == "" ? BgColors.AVAILABLE : color
         },
         hasArtist() { return this.artist.length > 0 },
         artist() { return CategoryMgr.categoryName(this.item) },
         style() { return (this.image.isHorizontal ? "width: 300px" : "width: 200px") },			
         userIsAdmin() { return this.isAdmin(this.userId) },
         isSetup() { return ItemMgr.isSetup(this.item) },
         isAvailable() { return ItemMgr.isAvailable(this.item) || this.isDroppingOrLive || ItemMgr.isRequested(this.item)  },
         isNotAvailable() { 
            return ItemMgr.isHold(this.item) || ItemMgr.isInvoiced(this.item) || 
               ItemMgr.isClosed(this.item) || ItemMgr.isSold(this.item) 
         },
         isDropping() { return ItemMgr.isDropping(this.item) },
			isDroppingOrLive() { return this.isDropping || ItemMgr.isLive(this.item) },  // both are stats with active bids
         isBid() { return this.item.saleType == ItemSaleType.BID },
			isBuy() { return this.item.saleType == ItemSaleType.BUY },			
			isDrop() { return this.item.saleType == ItemSaleType.DROP },			
			numberOfBids() { return this.item.bids ? Object.keys(this.item.bids).length : 0 },
			currPrice() { return dollars(this.item.buyPrice > this.item.startPrice ? this.item.buyPrice : this.item.startPrice) },
			priceText() { 
            const prefix = this.isDroppingOrLive ? "Current Bid: " : "Price: "
            return this.buildPriceText(prefix) 
         },
			priceTextMini() { return this.buildPriceText("") + (this.isDropping && this.hasBids ? " (" + this.bidText + ")" : "") },
			priceTextBgColor() { 
				if (this.isDroppingOrLive && this.userIsHighBidder)  { return BgColors.BUYER }
				else if (this.isDroppingOrLive && this.userIsOutbid) { return BgColors.OUTBID }
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
         prevItemLink() { return "/item/" + this.prev.id + this.dropParam(this.prev) },
         nextItemLink() { return "/item/" + this.next.id + this.dropParam(this.next) },
      },
      methods: {
         ...mapActions('cart', ['removeItemFromCart']),
         buildPriceText(prefix) {
				if (ItemMgr.isSold(this.item)) { return ItemStatus.SOLD }
				else if (ItemMgr.isClosed(this.item)) { return ItemStatus.CLOSED + " (" + this.currPrice + ")" }
            else if (ItemMgr.isHold(this.item) || ItemMgr.isInvoiced(this.item)) { return ItemStatus.HOLD + " (" + this.currPrice + ")" }
            else if (ItemMgr.isDropping(this.item)) { return prefix + this.currPrice }
            else return prefix + this.currPrice
         },
         dropParam(item) { return item.dropId ? "/" + item.dropId : "" },
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


