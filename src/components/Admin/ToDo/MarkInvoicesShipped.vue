<template>
   <div>
      <div class="row q-mt-md q-ml-sm">
         <span class="text-h6 col-9">Paid Invoices to be Marked Shipped</span>
      </div>
      <q-table :data="paidInvoices" row-key="id" :columns="columns" :visible-columns="visibleColumns" 
         selection="multiple" :selected.sync="selectedRows" @row-click="rowClicked" 
         :pagination.sync="pagination" :dense="$q.screen.lt.md" flat >
      </q-table>
      <q-btn v-if="showSendButton" label="Mark Invoices Shipped" @click="showInvoiceModal=true" unelevated color="primary" class="q-mr-xs"/>
   
      <q-dialog v-model="showInvoiceModal">	
         <invoice-quick-edit-shipping :invoices="selectedRows" @close="closeInvoiceModal" />
		</q-dialog>
   </div>     
</template>

<script>
   import { mapGetters } from 'vuex'   
   import { UserMgr } from 'src/managers/UserMgr' 
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'
   import { dollars, syncRows } from 'src/utils/Utils' 
   
   export default {
      data() {
	  		return {
            visibleColumns: [ 'name', 'user', 'createdDate', 'total'],
 				columns: [
        			{ name: 'id',                                     field: 'id' },
               { name: 'name',  label: 'Name',  align: 'left',   field: 'name',         sortable: true },
					{ name: 'user',  label: 'Buyer',  align: 'left',   field: 'tempFullName', sortable: true },
				   { name: 'createdDate', label: 'Created ' + localTimezone(), 
                                                align: 'center', field: 'createdDate',  sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'total', label: 'Total', align: 'right',  field: 'total',        sortable: true, format: val => dollars(val) },
            ],
            selectedRows: [],
            
            showInvoiceModal: false,
            invoiceToEdit: null,
            pagination: { rowsPerPage: 20 },
         }
		},
		computed: {
         ...mapGetters('invoice', ['getPaidInvoices']),
         ...mapGetters('user', ['getUserLookup']),
         userLookup() { return this.getUserLookup },
         paidInvoices() {
            const invoices = []
            for (var invoice of this.getPaidInvoices) {
               const tempInvoice = Object.assign({}, invoice)
               tempInvoice.tempFullName =  invoice.user.fullName
               // todo user.acceptsEmail may be obsolete
               if (this.acceptsEmail(tempInvoice.userId)) { invoices.push(tempInvoice) }
            }
            return invoices
         },
            showSendButton() { return this.selectedRows.length > 0 },
      
      },
		methods: {
         acceptsEmail(userId) { return UserMgr.lookupAcceptsEmail(this.userLookup, userId) },
         rowClicked (evt, row) { syncRows(row, this.selectedRows) },
         closeInvoiceModal() { this.showInvoiceModal = false },
		},
      components: {
         'invoice-quick-edit-shipping' : require('components/Invoice/InvoiceQuickEditShipping.vue').default,
      },
   }
</script>