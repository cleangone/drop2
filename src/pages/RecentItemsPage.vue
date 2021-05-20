<template>
	<q-page class="q-pa-md">
		<div class="q-mt-sm text-h5">Recent Updates</div>
      <toggle :toggleContainer="showItemsToggleContainer" class="q-mt-sm"/>      
      <div v-if="itemsExist">
         <div class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in displayItems" :key="key" :item="item" />
			</div>
		</div>
		<div v-else>Loading</div>
	</q-page>
</template>

<script>
   import { mapGetters  } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { getShowItemsToggleContainer, isShowItemsAll } from 'src/utils/Utils'
   
	export default {
		data() {
			return {				
				showItemsToggleContainer: {},
        }
		},
	  	computed: {
			...mapGetters('item', ['itemsExist', 'getRecentItems']),
			displayItems() { 
            SessionMgr.setRecentItemsDesc() 
            const displayItems = isShowItemsAll(this.showItemsToggleContainer) ? this.getRecentItems : ItemMgr.getAvailable(this.getRecentItems)
            return SessionMgr.setDisplayItems(displayItems)
			},
      },
		methods: {
		},
      created() {
         this.showItemsToggleContainer = getShowItemsToggleContainer()
		},
		components: {
         'item' : require('components/Item/Item.vue').default,
         'toggle' : require('components/General/Toggle.vue').default,
	  	}
	}

</script>

<style>
	.q-img { max-height: 400px; max-width: 500px; }
</style>