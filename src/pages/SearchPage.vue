<template>
	<q-page class="q-pa-md b-pink">
		<div class="q-mt-sm text-h5">Search Results</div>
      <div class="row q-mt-md">
         <q-input label="Search" v-model="searchString" @keydown.enter.prevent="search()" autofocus autogrow dense filled /> 
         <q-btn label="Search" @click="search()" color="primary" class="q-ml-xs"/>
      </div>
      <div class="q-mt-sm">
         <toggle :toggleContainer="showItemsToggleContainer" />   
      </div> 
      <div v-if="isSearching">Searching</div>
      <div v-else>
         <div v-if="searchResultsExist" class="row q-mt-sm q-gutter-sm">
            <item v-for="(item, key) in displayItems" :key="key" :item="item" />
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
   import { getShowItemsToggleContainer, isShowItemsAll } from 'src/utils/Utils'
	
	export default {
      data() {
			return {		
            searchIndex: null,		
				searchString: "",
            showItemsToggleContainer: {},
        }
		},
	  	computed: {
         ...mapGetters('item', ['getItems']),
			...mapGetters('search', ['getSearchString', 'isSearching', 'searchResultsExist', 'getSearchResultItems']),
         items() { 
            this.searchString = this.getSearchString
            SessionMgr.setSearchDesc()     
            return SessionMgr.setDisplayItems(this.getSearchResultItems)
         },
         displayItems() { 
            return (isShowItemsAll(this.showItemsToggleContainer) ? this.items : ItemMgr.getAvailable(this.items))
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
         
         this.showItemsToggleContainer = getShowItemsToggleContainer()
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