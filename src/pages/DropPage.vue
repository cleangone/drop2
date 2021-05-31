<template>
	<q-page class="q-pa-md b-pink">
		<div v-if="drop">
			<div class="row q-mt-sm text-h5">
            {{ drop.name }}
            <q-btn v-if="isAdmin" icon="edit" @click="showEditDropModal=true" size="sm" flat dense color="primary" />
            <div v-if="isAdmin">
               <q-btn label="Items" :to="'/admin/dropitems/' + dropId" color="primary" size="xs" dense no-caps/>
            </div>
         </div>
         <div v-if="adminViewingPreDrop" class="row q-mt-none">
            <q-checkbox v-model="adminView" label="Admin Item View" class="text-grey-7" color="grey-10" dense />
         </div>
         <multiple-toggle v-else-if="showItems" 
            :toggleContainer1="showItemsToggleContainer" :toggleContainer2="sortItemsToggleContainer" />   
         <div v-if="showItems" class="row q-mt-sm q-gutter-sm">
				<item v-for="(item, key) in sortedItems" :key="key" :item="item" />
			</div>
         <div v-else class="q-mt-sm" style="max-width:500px">
				<q-img :src="drop.imageUrl ? drop.imageUrl : 'image-placeholder.png'"  basic contain>
               <drop-timer v-if="isCountdown" :drop="drop"/>
               <div v-else class="absolute-bottom text-h6">Drops: {{ startDateText }}</div>
				</q-img>
            <div v-html="drop.description" class="q-pa-sm" />
			</div>
		</div>
		<div v-else>Loading</div>
      <q-dialog v-model="showEditDropModal">
         <drop-add-edit :type="edit" :drop="drop" @close="showEditDropModal=false" />
		</q-dialog>
	</q-page>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { DropMgr } from 'src/managers/DropMgr'
	import { ItemMgr } from 'src/managers/ItemMgr'
   import { SessionMgr } from 'src/managers/SessionMgr'
   import { ToggleContainerMgr } from 'src/managers/ui/ToggleContainerMgr'
   import { UI } from 'src/utils/Constants'
   import { formatTodayOr_ddd_MMM_D_h_mm } from 'src/utils/DateUtils'
   
	export default {
		data() {
			return {				
				dropId: 0,
            adminView: false,
            showItemsToggleContainer: ToggleContainerMgr.getShowItemsContainer(),
            sortItemsToggleContainer: ToggleContainerMgr.getSortItemsFullContainer(),
            showEditDropModal: false,
         }
		},
	  	computed: {
			...mapGetters('auth', ['loggedIn', 'userId']),
         ...mapGetters('user', ['getUser']),
			...mapGetters('drop', ['getDrop']),
			...mapGetters('item', ['getItemsInDrop']),
         
			adminViewingPreDrop() { return this.isAdmin && DropMgr.isPreDrop(this.drop) },
         drop() { return this.getDrop(this.dropId) },
         isCountdown() { return DropMgr.isCountdown(this.drop) },
         user() { return this.getUser(this.userId) },
         isAdmin() { return this.user && this.user.isAdmin },
         visibleItems() { // sep fm displayItems because item state more stable than ui viewing
            const visibleItems = []
            const items = this.getItemsInDrop(this.drop.id) 
            items.forEach(item => { 
               if (ItemMgr.isActive(item) || (this.adminView && ItemMgr.isSetup(item))) { visibleItems.push(item) }
		      })
            return visibleItems
         },
         displayItems() { 
            return ToggleContainerMgr.isShowItemsAll(this.showItemsToggleContainer) ? 
               this.visibleItems : ItemMgr.getAvailable(this.visibleItems)
         },
         sortedItems() { 
            const sortedItems = [...this.displayItems]
            if (ToggleContainerMgr.isSortItemsByDate(this.sortItemsToggleContainer)) { 
               sortedItems.sort((a, b) => (a.userUpdatedDate > b.userUpdatedDate) ? -1 : 1)
            }
            else if (ToggleContainerMgr.isSortItemsByPriceHighest(this.sortItemsToggleContainer)) { 
               sortedItems.sort((a, b) => (a.startPrice > b.startPrice) ? -1 : 1)
            }
            else if (ToggleContainerMgr.isSortItemsByPriceLowest(this.sortItemsToggleContainer)) { 
               sortedItems.sort((a, b) => (a.startPrice < b.startPrice) ? -1 : 1)
            }
            else {
               sortedItems.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1)  
            }
            
            SessionMgr.setDropItemsDesc("Drop", this.dropId) 
            return SessionMgr.setDisplayItems(sortedItems)
         },
         
         showItems() { return DropMgr.isActive(this.drop) || (this.adminView && DropMgr.isPreDrop(this.drop)) },
         startDateText() { return this.drop.startDate ? formatTodayOr_ddd_MMM_D_h_mm(this.drop.startDate) : "Date not set" },
         edit() { return UI.EDIT }
		},
		methods: {
		},
      created() {
         this.dropId = this.$route.params.id   
      },
		components: {
	  	   'drop-timer' : require('components/Drop/DropTimer.vue').default,
         'item' : require('components/Item/Item.vue').default,
	  	   'multiple-toggle' : require('components/General/MultipleToggle.vue').default,
         'drop-add-edit' : require('components/Drop/DropAddEdit.vue').default,
      }
	}

</script>

<style>
	.q-img { max-height: 400px; max-width: 500px; }
</style>