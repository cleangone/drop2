<template>
	<q-page class="q-pa-sm" :class="pink"> 
		<!-- have to wait for item if user followed an external link directly to this page -->
      <!-- todo - keydown semi-works - user has to click on page for focus first -->
      <div v-if="itemsExist" class="column" :class="orange" tabindex="0" 
         v-touch-swipe.mouse="handleSwipe" @keydown.left="prev()" @keydown.right="next()" >
         <item :item="item" :displayType="displayTypeFull" :prev="prevItem" :next="nextItem" class="self-center"/>
      </div>
	</q-page>
</template>

<script>
	import { TouchSwipe } from 'quasar'
   import { mapGetters } from 'vuex'
   import { SessionMgr } from 'src/managers/SessionMgr'
	import { ItemDisplayType, Colors } from 'src/utils/Constants'
	import { isSwipeLeft, isSwipeRight } from 'src/utils/Utils'
	
	export default {
		data() {
			return {				
            itemId: "",
            dropId: null,
         }
		},
	  	computed: {
         ...mapGetters('item', ['itemsExist', 'getItem', 'getItemInDrop']),			
			...mapGetters('color', Colors),
			displayTypeFull() { return ItemDisplayType.FULL },
         item() { 
            return this.dropId ? 
               this.getItemInDrop(this.itemId, this.dropId) : 
               this.getItem(this.itemId) 
         },
         displayedItems() { 
            const itemsCollection = SessionMgr.getDisplayItemsDesc()
            if (SessionMgr.isCategory(itemsCollection)) {
               const tagId = SessionMgr.getCategoryTag()
               return SessionMgr.getTagDisplayItems(tagId)
            }
            else { return SessionMgr.getDisplayItems() }
         },
         prevItem() { 
            let prev = null
            for (var item of this.displayedItems) { 
               if (item.id == this.item.id) { return prev } 
               else { prev = item }
            }
            return null
         },
         nextItem() { 
            let itemIsNext = false
            for (var item of this.displayedItems) { 
               if (item.id == this.item.id) { itemIsNext = true } 
               else if (itemIsNext) { return item }
            }
            return null
         },
      },
		methods: {
         prev() { if (this.prevItem) { this.$router.push("/item/" + this.prevItem.id + this.dropUrlParam(this.prevItem)) } },
         next() { if (this.nextItem) { this.$router.push("/item/" + this.nextItem.id + this.dropUrlParam(this.nextItem)) } },
         dropUrlParam(item) { return item.dropId ? "/" + item.dropId : "" },
         handleSwipe({ evt, ...info }) {
            if (isSwipeLeft(info)) { this.next() }
            else if (isSwipeRight(info)) { this.prev() }
         }
      },
		components: {
	  		'item' : require('components/Item/Item.vue').default,
      },
      directives: {
         TouchSwipe
      },
      created() {
         this.itemId = this.$route.params.itemId
         this.dropId = this.$route.params.dropId ? this.$route.params.dropId : null
      },
      watch: {
         $route() { 
            this.itemId = this.$route.params.itemId 
            this.dropId = this.$route.params.dropId ? this.$route.params.dropId : null
         }
      },
	}

</script>

<style>
   a {
      text-decoration: none;
   }
</style>