<template>
	<q-page class="q-pa-md b-pink">
		<div class="q-mt-sm text-h5">Search Results</div>
      <div class="row q-mt-md">
         <q-input label="Search" v-model="searchString" @keydown.enter.prevent="search()" autofocus autogrow dense filled /> 
         <q-btn label="Search" @click="search()" color="primary" class="q-ml-xs"/>
      </div>
      <div class="row q-mt-sm">
         <toggle :toggleContainer="showItemsToggleContainer" />   
         <toggle :toggleContainer="sortItemsToggleContainer" class="q-ml-md"/>
      </div> 
      <div v-if="isSearching">Searching</div>
      <div v-else>
         <div v-if="searchResultsExist" class="row q-mt-sm q-gutter-sm">
            <item v-for="(item, key) in sortedItems" :key="key" :item="item" />
         </div>
         <div v-else class="q-mt-sm text-h6">No items found</div>
         <!-- <div class="q-mt-sm">Search: {{ getSearchString }}</div> -->
      </div>
	</q-page>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import algoliasearch from 'algoliasearch/lite'
   import { AlgoliaConfig } from 'boot/algoliaConfig.js'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { ToggleContainerMgr } from 'src/managers/ui/ToggleContainerMgr'
   
	export default {
      data() {
			return {		
            searchIndex: null,		
				searchString: "",
            showItemsToggleContainer: ToggleContainerMgr.getShowItemsContainer(),
            sortItemsToggleContainer: ToggleContainerMgr.getSortItemsFullContainer()
        }
		},
	  	computed: {
         ...mapGetters('item', ['getItems']),
			...mapGetters('search', ['getSearchString', 'isSearching', 'searchResultsExist', 'getSearchResultItems']),
         displayItems() { 
            this.searchString = this.getSearchString
            SessionMgr.setSearchDesc() 

            return ToggleContainerMgr.isShowItemsAll(this.showItemsToggleContainer) ? 
               this.getSearchResultItems : ItemMgr.getAvailable(this.getSearchResultItems)
         },
         sortedItems() { 
            // console.log("sortedItems", this.sortItemsToggleContainer)
            const sortedItems = [...this.displayItems]
            if (ToggleContainerMgr.isSortItemsByDate(this.sortItemsToggleContainer)) { 
               sortedItems.sort((a, b) => (a.sortedCreatedDate > b.sortedCreatedDate) ? -1 : 1)
            }
            else if (ToggleContainerMgr.isSortItemsByPriceHighest(this.sortItemsToggleContainer)) { 
               sortedItems.sort((a, b) => (a.startPrice > b.startPrice) ? -1 : 1)
            }
            else if (ToggleContainerMgr.isSortItemsByPriceLowest(this.sortItemsToggleContainer)) { 
               sortedItems.sort((a, b) => (a.startPrice < b.startPrice) ? -1 : 1)
            }
            
            return SessionMgr.setDisplayItems(sortedItems)
         },
		},
      methods: {
         ...mapActions('search',  ['setSearchStart', 'setSearchResults']),         
         search() {
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
         }
      },
      created() {
         const searchClient = algoliasearch(AlgoliaConfig.appId, AlgoliaConfig.searchKey)
         this.searchIndex = searchClient.initIndex(AlgoliaConfig.index)
      },
		components: {
	  		'item' : require('components/Item/Item.vue').default,
         'toggle' : require('components/General/Toggle.vue').default,
      },
	}
</script>

<style>
	.q-img { max-height: 400px; 
	max-width: 500px;
	}
</style>