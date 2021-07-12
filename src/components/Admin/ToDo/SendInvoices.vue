<template>
   <div>
      <div class="row q-mt-md q-ml-sm">
         <span class="text-h6 col-9">Invoices to be Sent</span>
      </div>
      <q-table :data="createdInvoices" row-key="id" :columns="columns" :visible-columns="visibleColumns" 
         selection="multiple" :selected.sync="selectedRows" @row-click="rowClicked"
         :pagination.sync="pagination" :dense="$q.screen.lt.md" flat >
      </q-table>
      <q-btn v-if="showSendButton" label="Send Invoices" @click="sendInvoices()" unelevated color="primary" class="q-mr-xs"/>
   </div>     
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'   
   import { UserMgr } from 'src/managers/UserMgr' 
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'
   import { dollars, getIds, syncRows } from 'src/utils/Utils'
   
   export default {
      data() {
	  		return {
            visibleColumns: [ 'user', 'name', 'createdDate', 'total'],
 				columns: [
        			{ name: 'id',                                     field: 'id' },
               { name: 'user',  label: 'User',  align: 'left',   field: 'tempFullName', sortable: true },
				   { name: 'name',  label: 'Name',  align: 'left',   field: 'name',         sortable: true },
					{ name: 'createdDate', label: 'Created ' + localTimezone(), 
                                                align: 'center', field: 'createdDate',  sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'total', label: 'Total', align: 'right',  field: 'total',        sortable: true, format: val => dollars(val) },
            ],
            selectedRows: [],
            pagination: { rowsPerPage: 20 },
         }
		},
		computed: {
         ...mapGetters('invoice', ['getCreatedInvoices']),
         ...mapGetters('user', ['getUserLookup']),
         userLookup() { return this.getUserLookup },
         
         createdInvoices() {
            const invoices = []
            for (var invoice of this.getCreatedInvoices) {
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
          ...mapActions('invoice', ['sendInvoice']),
         acceptsEmail(userId) { return UserMgr.lookupAcceptsEmail(this.userLookup, userId) },
         rowClicked (evt, row) { syncRows(row, this.selectedRows) },
		   sendInvoices() { 
            const invoiceIds = getIds(this.selectedRows) 
            console.log("sendInvoices", invoiceIds)
            for (let id of invoiceIds) { 
               this.sendInvoice(id)
            }
         },
		},
   }
</script>