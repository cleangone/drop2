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
            categoryId: null
         }
		},
	  	computed: {
         ...mapGetters('item', ['itemsExist', 'getBoundItem']),			
			...mapGetters('color', Colors),
			displayTypeFull() { return ItemDisplayType.FULL },
         item() { return this.getBoundItem(this.itemId, this.dropId, this.categoryId) },
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
         setIds(itemId, dropId, catId) { 
            this.itemId = itemId
            this.dropId = dropId && dropId != "0" ? dropId : null
            this.categoryId = catId && catId != "0" && typeof catId != 'undefined' ? catId : null
         },
         prev() { if (this.prevItem) { this.$router.push(this.itemUrl(this.prevItem)) } },
         next() { if (this.nextItem) { this.$router.push(this.itemUrl(this.nextItem)) } },
         itemUrl(item) { 
            const dropId = item.dropId ? item.dropId : "0" 
            const categoryId = item.category && item.category.id ? item.category.id : "0" 
            return "/item/" + item.id + "/" + dropId + "/" + categoryId
         },
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
         this.setIds(this.$route.params.itemId, this.$route.params.dropId, this.$route.params.catId)
      },
      watch: {
         $route() { 
            this.setIds(this.$route.params.itemId, this.$route.params.dropId, this.$route.params.catId)
         }
      },
	}

</script>

<style>
   a {
      text-decoration: none;
   }
</style>