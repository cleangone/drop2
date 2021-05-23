<template>
	<div>
      <div>  
         <q-checkbox v-model="showInProcess" label="In-process" class="text-grey-10"         color="grey-10" dense/>
         <q-checkbox v-model="showWon"       label="Won"        class="q-ml-sm text-grey-10" color="grey-10" dense/>
         <q-checkbox v-model="showLost"      label="Lost"       class="q-ml-sm text-grey-10" color="grey-10" dense/>
         <toggle :toggleContainer="sortItemsToggleContainer" class="q-ml-md"/>
      </div>
      <div class="row q-mt-sm q-gutter-sm">
         <item v-for="(item, key) in sortedItems" :key="key" :item="item" />
      </div>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { ToggleContainerMgr } from 'src/managers/ui/ToggleContainerMgr'
   
	export default {
      props: ['beginDate', 'route' ],       
      data() {
	  		return {
            showInProcess: true,
            showWon: true,
            showLost: false,
            sortItemsToggleContainer: ToggleContainerMgr.getSortItemsContainer()
         }
      },
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['getUserActions']),
			...mapGetters('item', ['getItems']),
	      items() { 
            const itemIds = []
            for (var action of this.getUserActions(this.userId)) {
               if (!itemIds.includes(action.itemId) && (!this.beginDate || this.beginDate < action.createdDate)) { 
                  itemIds.push(action.itemId) 
               }  
            }
            return this.getItems(itemIds)
         }, 
         displayItems() { 
            const inProcessItems = []
            const wonItems = []
            const lostItems = []
            this.items.forEach(item => { 
               if (this.showInProcess && !ItemMgr.isGone(item)) { inProcessItems.push(item) }
               else if (this.showWon && ItemMgr.isGone(item) && ItemMgr.isBuyerId(item, this.userId))  { wonItems.push(item) }
               else if (this.showLost && ItemMgr.isGone(item) && !ItemMgr.isBuyerId(item, this.userId)) { lostItems.push(item) }
            })
            
            const displayItems = inProcessItems.concat(wonItems).concat(lostItems)
            displayItems.sort((a,b) => a.sortName.localeCompare(b.sortName))
            return displayItems
         },
         sortedItems() { 
            if (ToggleContainerMgr.isSortItemsByName(this.sortItemsToggleContainer)) { 
               return SessionMgr.setDisplayItems(this.displayItems) 
            }

            const sortedItems = [...this.displayItems]
            sortedItems.sort((a, b) => (a.userUpdatedDate > b.userUpdatedDate) ? -1 : 1)
            return SessionMgr.setDisplayItems(sortedItems)
         },
      },
      mounted() {
         SessionMgr.setRouteItemsDesc(this.route)
      },
		components: {
      	'item' : require('components/Item/Item.vue').default,
         'toggle' : require('components/General/Toggle.vue').default,
	  	},
	}

</script>
