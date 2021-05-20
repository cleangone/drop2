<template>
	<div class="column q-mt-md q-pa-sm rounded-borders bg-grey-4">
      <div class="self-center text-h6" :class="red"> 
         <router-link :to="{name: recentPageRoute}" :class="blue">
            Recent Updates <q-btn icon="add" size="xs" dense color="primary"/>
         </router-link> 
      </div>
		<div class="row q-mt-xs q-gutter-xs" :class="orange">
			<item v-for="(item, key) in visibleItems" :key="key" :item="item" :displayType="displayType"/>
		</div>
      <div v-if="this.activeItems.length > this.visibleItems.length" class="self-center text-h6 q-mt-lg" :class="green"> 
         <router-link :to="{name: recentPageRoute}" :class="blue">
            See All {{ this.activeItems.length }} Recent Updates
         </router-link> 
      </div>
  	</div> 
</template>

<script>
   import { mapGetters } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { ItemDisplayType, Route, Colors } from 'src/utils/Constants'
   
	export default {
      props: ['expandContainer'],
		computed: {
         ...mapGetters('item', ['recentItemsExist', 'getRecentItems']),
			...mapGetters('color', Colors),
         recentPageRoute() { return Route.RECENT },
         displayType() { return ItemDisplayType.MINI },
         activeItems() {
            const activeItems = []
            for (var item of this.getRecentItems) {
               if (ItemMgr.isActive(item)) { activeItems.push(item) }
            }

            return activeItems
         },
         visibleItems() {
            const visibleItems = []
            for (var item of this.activeItems) {
               if (visibleItems.length < 20) { visibleItems.push(item)  }
               else { break }
            }

            SessionMgr.setHomeItemsDesc() 
            return SessionMgr.setDisplayItems(visibleItems)
         }
      }, 
		components: {
			'item' : require('components/Item/Item.vue').default
		}
	}
</script>

<style>
   a {
      text-decoration: none;
   }
</style>