<template>
   <div>
      <div class="row q-mt-md q-ml-sm">
         <span class="text-h6 col-9">Held Items to be Invoiced</span>
         <q-select label="Select Buyer" v-model="selectedBuyer" :options="buyerOptions" class="col" dense/>
      </div>
      <q-table :data="displayItems" row-key="name" :columns="columns" :visible-columns="visibleColumns" 
            selection="multiple" :selected.sync="selectedRowItems" @row-click="rowClicked"
            :pagination.sync="pagination" :dense="$q.screen.lt.md" flat >
         <q-td slot="body-cell-drop" slot-scope="props" :props="props"> 
            {{ getDropIdToNameDropMap.get(props.row.dropId) }}
         </q-td>
      </q-table>
      <q-btn v-if="showInvoiceButton" @click="showInvoiceModal=true" label="Create Invoice" unelevated color="primary" class="q-mr-xs"/>
      <q-dialog v-model="showInvoiceModal">	
			<invoice-add-edit :items="selectedRowItems" @close="invoiceModalClosed()" />
		</q-dialog>
  </div>     
</template>

<script>
   import { mapGetters } from 'vuex'    
   import { UserMgr } from 'src/managers/UserMgr'   
   import { Route, Colors } from 'src/utils/Constants'
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'
   import { dollars, syncRows } from 'src/utils/Utils'
   
   export default {
      data() {
	  		return {
            returnRoute: Route.TODO,
            visibleColumns: [ 'name', 'date', 'buyer', 'drop', 'price'],
 				columns: [
        			{ name: 'name',  label: 'Name',  align: 'left',   field: 'name',     sortable: true },
				 	{ name: 'buyer', label: 'Buyer', align: 'left',   field: 'buyerId',  sortable: true, format: val => this.userFullName(val) },
					{ name: 'date',  label: 'Date ' + localTimezone(), 
                                                align: 'center', field: 'userUpdatedDate', sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'drop',  label: 'Drop',  align: 'center',                    sortable: true },
				 	{ name: 'price', label: 'Price', align: 'right',  field: 'buyPrice', sortable: true, format: val => dollars(val) }, 
				],
            selectedRowItems: [],
            pagination: { rowsPerPage: 20 },
            selectedBuyer: null,
            showInvoiceModal: false,
			}
		},
		computed: {
         ...mapGetters('user', ['getUserLookup']),
         ...mapGetters('drop', ['getDropIdToNameDropMap']), // only called once even though in table row iteration
         ...mapGetters('item', ['getHoldItems']),
         ...mapGetters('color', Colors),
         userLookup() { return this.getUserLookup },
         buyerOptions() {
            // list of buyers 
            const buyerIds = new Set()
            for (var item of this.getHoldItems) {
               buyerIds.add(item.buyerId) 
            }
            const buyers = []
            for (var buyerId of buyerIds) {
               buyers.push({ label: this.userFullName(buyerId), value: buyerId })
            }
            buyers.sort((a, b) => (a.label < b.label) ? -1 : 1)
            buyers.push({ label: "", value: null })
           
            return buyers
         },
         displayItems() {
            if (!this.selectedBuyer || !this.selectedBuyer.value) { return this.getHoldItems }
            const displayItems = []
            for (var item of this.getHoldItems) {
               if (this.selectedBuyer.value == item.buyerId) { displayItems.push(item) }
            }
            return displayItems
         },
         showInvoiceButton() { 
            if (this.selectedRowItems.length == 0) { return false } 
            
            // selected rows have same buyer
            let buyerId = null
            for (var rowItem of this.selectedRowItems) {
               if (buyerId == null) { buyerId = rowItem.buyerId }
               else if (!rowItem.buyerId) { return false }
               else if (rowItem.buyerId != buyerId) { return false }
            }

            return true
         },
      },
		methods: {
         userFullName(userId) { return UserMgr.lookupFullName(this.userLookup, userId) },
         rowClicked (evt, row) { syncRows(row, this.selectedRowItems) },
		   invoiceModalClosed() { 
            this.showInvoiceModal = false 
            this.selectedRowItems = []
            this.selectedBuyer = null
         },
		},
      components: {
         'invoice-add-edit' : require('components/Invoice/InvoiceAddEdit.vue').default,
      },
   }
</script>