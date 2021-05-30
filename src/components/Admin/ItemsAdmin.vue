<template>
  <div>     
      <div class="row q-pl-sm q-pr-sm" :class="purple">
         <span class="col text-grey-10" color="grey-10" :class="red">
			   <q-checkbox v-if="dropId"     v-model="showCols.category" label="Artist"  @input="showColsChecked()" size="xs" dense />
            <q-checkbox v-if="categoryId" v-model="showCols.drop"     label="Drop"    @input="showColsChecked()" size="xs" dense class="q-ml-sm" />
            <q-checkbox v-model="showCols.tags"       label="Tags"      @input="showColsChecked()" size="xs" dense class="q-ml-sm" />
            <q-checkbox v-model="showCols.saleType"   label="Sale Type" @input="showColsChecked()" size="xs" dense class="q-ml-sm" />
            <q-checkbox v-model="showCols.buyer"      label="Buyer"     @input="showColsChecked()" size="xs" dense class="q-ml-sm" />
            <q-checkbox v-model="showCols.bidreq"     label="Bid/Req"   @input="showColsChecked()" size="xs" dense class="q-ml-sm" />
         </span>
         <span class="col text-grey-10 text-right" color="grey-10" :class="red">
			   <q-checkbox v-model="showItems.available" label="Available" @input="showItemsChecked()" size="xs" dense />
            <q-checkbox v-model="showItems.live"      label="Live"      @input="showItemsChecked()" size="xs" dense class="q-ml-sm" />
            <q-checkbox v-model="showItems.hold"      label="On Hold"   @input="showItemsChecked()" size="xs" dense class="q-ml-sm" />
            <q-checkbox v-model="showItems.sold"      label="Sold"      @input="showItemsChecked()" size="xs" dense class="q-ml-sm" />
         </span>
		</div>
		<div class="q-mt-xs absolute full-width full-height" :class="green">
         <q-table title="Items" :data="displayItems" :columns="columns" :visible-columns="visibleColumns" row-key="name" 
            :filter="tableDataFilter" no-data-label="No Items"
            selection="multiple" :selected.sync="selectedRowItems" 
            :pagination.sync="pagination" :dense="$q.screen.lt.md" flat class="q-mb-sm q-ml-sm">
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template> 
            <q-td slot="body-cell-name" slot-scope="props" :props="props"> 
               {{ props.row.name + sortNameText(props.row.sortName) }}
            </q-td>
            <q-td slot="body-cell-price" slot-scope="props" :props="props"> 
               {{ priceText(props.row) }}
            </q-td>
            <q-td slot="body-cell-bidreq" slot-scope="props" :props="props"> 
               <a v-if="props.row.numberOfBids == 1"     :href="'#/bids/' + props.row.id">{{ props.row.numberOfBids }} Bid</a>
	            <a v-else-if="props.row.numberOfBids > 0" :href="'#/bids/' + props.row.id">{{ props.row.numberOfBids }} Bids</a>
	            <a v-else-if="props.row.numberOfPurchaseReqs == 1" :href="'#/admin/reqs/' + props.row.id">{{ props.row.numberOfPurchaseReqs }} Req</a>
	            <a v-else-if="props.row.numberOfPurchaseReqs > 0"  :href="'#/admin/reqs/' + props.row.id">{{ props.row.numberOfPurchaseReqs }} Reqs</a>
	         </q-td>
            <q-td slot="body-cell-actions" slot-scope="props" :props="props" auto-width>
               <q-btn icon="edit"   @click="editItem(props.row.id)"   @click.stop size="sm" flat dense color="primary" />
               <q-btn icon="photo"  @click="editImages(props.row.id)" @click.stop size="sm" flat dense color="primary" />
               <q-btn icon="delete" @click="promptToDeleteItem(props.row.id, props.row.name)" @click.stop size="sm" flat dense color="red" />
            </q-td> 
			</q-table>

         <div class="q-mt-md"> 
			   <q-btn v-if="!rowsSelected"       @click="showAddModal=true"       icon="add"                unelevated color="primary" class="q-ml-sm"/>
            <q-btn v-if="!rowsSelected"       @click="showBulkAddModal=true"   label="Bulk Add"          unelevated color="primary" class="q-ml-xs"/>
            <q-btn v-if="showSortDatesButton" @click="showSortDatesModal=true" label="Sort Create Dates" unelevated color="primary" class="q-ml-sm"/>
            <q-btn v-if="showInvoiceButton"   @click="showInvoiceModal=true"   label="Create Invoice"    unelevated color="primary" class="q-ml-sm"/>
            <q-btn v-if="showBulkEditButton"  @click="showBulkEditModal=true"  label="Bulk Edit"         unelevated color="primary" class="q-ml-sm"/>
            <q-btn v-if="showQuickEditButton" @click="showQuickEditModal=true" label="Quick Edit"        unelevated color="primary" class="q-ml-xs"/>
         </div> 
         <div style="height: 75px"/>
		</div>
 
      <q-dialog v-model="showAddModal">	
			<item-add-edit :dropId="dropId" :categoryId="categoryId" @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<item-add-edit :type="edit" :item="itemToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showBulkAddModal">	
			<item-bulk-add :dropId="dropId" :categoryId="categoryId" @close="showBulkAddModal=false" />
		</q-dialog>
      <q-dialog v-model="showBulkEditModal">	
			<item-bulk-edit :items="selectedRowItems" @close="bulkEditDone" />
		</q-dialog>
      <q-dialog v-model="showQuickEditModal">	
			<item-quick-edit :items="selectedRowItems" @close="quickEditDone" />
		</q-dialog>
      <q-dialog v-model="showSortDatesModal">	
			<item-sort-dates :items="selectedRowItems" @close="showSortDatesModal=false" />
		</q-dialog>
      <q-dialog v-model="showInvoiceModal">	
			<invoice-add-edit :items="selectedRowItems" @close="showInvoiceModal=false" />
		</q-dialog>
  	</div>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { SessionStorage } from 'quasar'
   import { UserMgr } from 'src/managers/UserMgr'   
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { UI, Colors } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   
   const SHOW_COLS  = 'ItemsAdminShowColumns'
   const SHOW_ITEMS = 'ItemsAdminShowItemStatus'
         
	export default {
      props: ['items', 'dropId', 'categoryId'], // one of dropId/categoryId will be set
		data() {
	  		return {
            showCols: {},
            showItems: {},
            showSortDatesModal: false,
				showAddModal: false,
            showEditModal: false,
            showBulkAddModal: false,
            showBulkEditModal: false,
            showQuickEditModal: false,
            showInvoiceModal: false,
				itemIdToEdit: '',
            tableDataFilter: '',
            selectedRowItems: [],
				displayColumns: [ 'name', 'price', 'status', 'actions'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',     label: 'Name (Sort Name)', align: 'left',                       sortable: true },
				 	{ name: 'category', label: 'Artist',           align: 'center', field: 'category',  sortable: true, format: val => val ? val.name : "" },
				 	{ name: 'drop',     label: 'Drop',             align: 'center', field: 'tempDrop',  sortable: true },
				 	{ name: 'tags',     label: 'Tags',             align: 'center', field: 'tempTags',  sortable: true },
				 	{ name: 'saleType', label: 'Sale Type',        align: 'center', field: 'saleType',  sortable: true },
					{ name: 'buyerId',  label: 'Buyer',            align: 'left',   field: 'buyerId',   sortable: true, format: val => this.userFullName(val) },
					{ name: 'price',    label:'Start/Final Price', align: 'right',                      sortable: true },
					{ name: 'bidreq',   label: 'Bid/Req',          align: 'center',                     sortable: true },
					{ name: 'status',   label: 'Status',           align: 'center', field: 'status',    sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 50 },
			}
		},
		computed: {
         ...mapGetters('category', ['getCategory']),
         ...mapGetters('drop', ['getDropIdToNameDropMap']),
         ...mapGetters('item', ['itemsExist', 'getItemsWithCategory']),
         ...mapGetters('user', ['getUserLookup']),
         ...mapGetters('color', Colors),
			visibleColumns() { 
            const columns = [...this.displayColumns]
            if (this.categoryId && this.showCols.drop)     { columns.push('drop') } 
            if (this.dropId     && this.showCols.category) { columns.push('category') } 
            if (this.showCols.tags)     { columns.push('tags') }
            if (this.showCols.saleType) { columns.push('saleType') }
            if (this.showCols.buyer)    { columns.push('buyerId') }
            if (this.showCols.bidreq)   { columns.push('bidreq') }
            return columns 
         },
         tableItems() { 
            let copies = []
            this.items.forEach(item => { 
               const copy = Object.assign({}, item)
               copy.tempName = copy.sortName + " " + copy.name // sort by sortName and be able to filter by name
               copy.tempDrop = copy.dropId ? this.getDropIdToNameDropMap.get(copy.dropId) : ""

               const tagNames = []
               if (item.tags) {
                  for (var tag of item.tags) {
                     tagNames.push(tag.name) 
                  }
               }
               copy.tempTags = tagNames.join(', ')

               copies.push(copy) 
            })
            return copies
         },
         displayItems() { 
            if (this.showItems.available && this.showItems.hold && this.showItems.sold) { return this.tableItems }
            let displayItems = []
            for (var item of this.tableItems) {
               let dispItem = true
               if (ItemMgr.isAvailable(item)) { dispItem = this.showItems.available }
               else if (ItemMgr.isHold(item)) { dispItem = this.showItems.hold }
               else if (ItemMgr.isSold(item)) { dispItem = this.showItems.sold }
            
               if (dispItem) { displayItems.push(item) }         
            }

            return displayItems
         },
         itemToEdit() { return this.itemIdToEdit ? getItem(this.items, this.itemIdToEdit) : null },
         itemsExist() { return this.items.length > 0 },
         rowsSelected() { return this.selectedRowItems.length > 0 },
         userLookup() { return this.getUserLookup },
			showInvoiceButton() { 
            if (this.selectedRowItems.length == 0) { return false } 
            
            // selected rows have same buyer and are not Sold
            let buyerId = null
            for (var rowItem of this.selectedRowItems) {
               if (ItemMgr.isSold(rowItem)) { return false }
               if (!rowItem.buyerId) { return false }
               if (buyerId == null) { buyerId = rowItem.buyerId }
               if (rowItem.buyerId != buyerId) { return false }
            }

            return true
         },
         showSortDatesButton() { 
            if (this.selectedRowItems.length < 2) { return false } 
            for (var rowItem of this.selectedRowItems) {
               if (!(ItemMgr.isPrivate(rowItem) || ItemMgr.isSetup(rowItem)) ) { return false }
            }
            return true
         },
         showBulkEditButton() { return (this.selectedRowItems.length > 1) },
         showQuickEditButton() { return (this.selectedRowItems.length > 1) },
		   edit() { return UI.EDIT },
		},
		methods: {
			...mapActions('item', ['deleteItem']),
			editDrop() { },
         editItem(itemId) {
				this.itemIdToEdit = itemId
				this.showEditModal = true
         },
         sortNameText(sortName) { return sortName && sortName.length ?" (" + sortName + ")" : "" },
         priceText(row) { 
            let text = dollars(row.startPrice) 
            if (row.buyPrice && (row.buyPrice != row.startPrice)) { text += ("/" + dollars(row.buyPrice))}
            return text 
         },
         userFullName(userId) { return UserMgr.lookupFullName(this.userLookup, userId) },
			promptToDeleteItem(itemId, name) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteItem(itemId) })
         },
         bulkEditDone() {
            this.selectedRowItems = []
            this.showBulkEditModal = false
         },
         quickEditDone() {
            this.selectedRowItems = []
            this.showQuickEditModal = false
         },
         editImages(itemId) { this.$router.push("/admin/images/" + itemId) },
         showColsChecked() { SessionStorage.set(SHOW_COLS, this.showCols) },
         showItemsChecked() { SessionStorage.set(SHOW_ITEMS, this.showItems) },
      },
      created() {
         this.showCols = SessionStorage.getItem(SHOW_COLS)    
         if (!this.showCols) { 
            this.showCols = { 
               category: true, drop: true, tags: true, saleType: true, buyer: true, bidreq: true 
            } 
         }
      
         this.showItems = SessionStorage.getItem(SHOW_ITEMS)    
         if (!this.showItems) { this.showItems = { 
            available: true, hold: true, sold: true } }      
      },
		components: {
         'drop-add-edit'    : require('components/Drop/DropAddEdit.vue').default,
         'item-add-edit'    : require('components/Item/ItemAddEdit.vue').default,
      	'item-bulk-add'    : require('components/Item/ItemBulkAdd.vue').default,
      	'item-bulk-edit'   : require('components/Item/ItemBulkEdit.vue').default,
         'item-quick-edit'  : require('components/Item/ItemQuickEdit.vue').default,
         'item-sort-dates'  : require('components/Item/ItemSortDates.vue').default,
         'invoice-add-edit' : require('components/Invoice/InvoiceAddEdit.vue').default,
      },
   }

   function getItem(items, itemId) { 
      for (var item of items) {
         if (item.id == itemId) { return item }
      }

      return null
   }
</script>