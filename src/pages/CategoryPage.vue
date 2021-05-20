<template>
	<q-page class="q-pa-md">
      <div class="q-mt-sm text-h5" :class="orange">
         {{ category.name }}
         <q-btn v-if="category.video" icon="videocam" @click="showVideo=true" @click.stop size="md" flat dense color="primary" />
      </div>
      <div class="row" :class="red">
         <div v-if="thumbExists" class="q-mr-xs" :class="blue">
            <q-img :src="category.primaryImage.thumbUrl" style="width: 150px" class="image-centered" basic contain />
         </div>
         <div v-if="category.description" class="col q-mt-none">
            <div v-html="category.description" />
            <div v-if="category.descriptionExtended && category.descriptionExtended.length > 0" class="q-mt-none" >
               <div v-if="showDescriptionExtended">
                  <div v-html="category.descriptionExtended" class="q-mt-sm"/>
                  <q-btn label="Less..." @click="showDescriptionExtended=false" color="blue" padding="0px 0px" no-caps flat dense />
               </div>
               <q-btn v-else label="More..." @click="showDescriptionExtended=true" color="blue" padding="0px 0px" no-caps flat dense />
            </div>
         </div>
      </div>
      <div class="row q-mt-sm" :class="yellow">
         <toggle :toggleContainer="showItemsToggleContainer" />   
      </div> 
      <tag-items v-if="recentItems.length" title="Recent" :tagId="recentItemsTagId" :items="recentItems" :expanded="recentItemsExpanded" />
      <tag-items v-for="(tag, key) in tags" :key="key" :title="tag.name" 
         :tagId="tag.id" :items="tagIdToItemsMap.get(tag.id)" :expanded="tagExpanded(tag.id)" />
      
      <q-dialog v-model="showVideo">	
			<show-video :container="category" @close="showVideo=false" />
		</q-dialog>
	</q-page>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { TagMgr } from 'src/managers/TagMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { Colors } from 'src/utils/Constants'
   import { getShowItemsToggleContainer, isShowItemsAll } from 'src/utils/Utils'
   
   // items grouped by their tags on the page, with Recent added to the Top, and General to the bottom
   const RECENT_ITEMS_TAG_ID = "0"
   const GENERAL_TAG_ID = "-1"
   
   export default {
		data() {
			return {				
            categoryId: "",
            initialExpandedTagId: RECENT_ITEMS_TAG_ID, 
            showVideo: false,
            showDescriptionExtended: false,
            showItemsToggleContainer: {},
        }
		},
	  	computed: {
			...mapGetters('category', ['getCategory']),
         ...mapGetters('item', ['getActiveItemsWithCategory']),
         ...mapGetters('color', Colors),
         category() { return this.getCategory(this.categoryId) },
         thumbExists() { return (this.category && this.category.primaryImage && this.category.primaryImage.thumbUrl) },
         items() { return this.getActiveItemsWithCategory(this.categoryId) },
         displayItems() { 
            SessionMgr.setCategoryItemsDesc(this.category.name, this.categoryId)             
            return (isShowItemsAll(this.showItemsToggleContainer) ? this.items : ItemMgr.getAvailable(this.items))
         },
         recentItems() { 
            let recentItems = ItemMgr.getRecent(this.displayItems)
            SessionMgr.setTagDisplayItems(RECENT_ITEMS_TAG_ID, recentItems)
				return recentItems
         },
         recentItemsTagId() { return RECENT_ITEMS_TAG_ID },
         tags() {  
            let tags = []
            let tagIds = []
            let hasGeneralTag = false

            this.displayItems.forEach(item => { 
               if (item.tags && item.tags.length) {
                  for (var tag of item.tags) {
                     if (!tagIds.includes(tag.id)) { 
                        tagIds.push(tag.id)
                        tags.push(tag) 
                     } 
                  }
               }
               else { hasGeneralTag = true }
            })
          
            tags.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
            if (hasGeneralTag) { tags.push( { id: GENERAL_TAG_ID, name: "General" }) } // general is last
            return tags
         },
         tagIdToItemsMap() { 
            let tagIdToItems = new Map() 
            this.displayItems.forEach(item => { 
               if (item.tags && item.tags.length) {
                  for (var tag of item.tags) {
                     if (!tagIdToItems.has(tag.id)) { tagIdToItems.set(tag.id, []) }
                     tagIdToItems.get(tag.id).push(item)
                  }
               }
               else {
                  if (!tagIdToItems.has(GENERAL_TAG_ID)) { tagIdToItems.set(GENERAL_TAG_ID, []) }
                  tagIdToItems.get(GENERAL_TAG_ID).push(item)
               }
            })
            
            tagIdToItems.forEach((items, tagId) => { // (value, key) iterator
               SessionMgr.setTagDisplayItems(tagId, items)
            }) 

            return tagIdToItems
         },
         recentItemsExpanded() { return this.initialExpandedTagId == RECENT_ITEMS_TAG_ID },
      },
		methods: {
         tagExpanded(tagId) { return tagId == this.initialExpandedTagId },
      },
      created() {
         this.categoryId = this.$route.params.id         
         if (this.$route.params.tagId) { this.initialExpandedTagId = this.$route.params.tagId }
         this.showItemsToggleContainer = getShowItemsToggleContainer()
      },
		components: {
	  	   'tag-items' : require('components/Tag/TagItems.vue').default,
         'show-video' : require('components/General/ShowVideo.vue').default,
         'toggle' : require('components/General/Toggle.vue').default,
      },
      watch: {
         $route() {
            // console.log("watch", this.$route.params.id)
            this.categoryId = this.$route.params.id
            this.initialExpandedTagId = RECENT_ITEMS_TAG_ID
         }
      },
	}

</script>

<style>
</style>