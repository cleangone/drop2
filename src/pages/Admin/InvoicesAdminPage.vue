<template>
  <q-page >
    <div class="text-h5 q-mt-sm q-ml-md q-mb-none">Invoices</div>
		<div class="q-pa-none q-mt-none absolute full-width full-height">
			<q-table :data="invoices" row-key="id" :filter="tableDataFilter" 
				   :columns="columns" :visible-columns="visibleColumns" :pagination.sync="pagination"
               no-data-label="No invoices" flat :dense="$q.screen.lt.md" class="q-mb-sm" :class="orange">
            <template v-slot:top>
               <q-checkbox v-model="showShipped" label="Shipped" class="text-grey-10" color="grey-10" dense/>
               <q-space />
               <q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search" :class="green">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
            </template>
            <template v-slot:header="props">
               <q-tr :props="props">
                  <q-th auto-width /> <!-- expand col -->
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                  <q-th auto-width /> <!-- actions col -->
               </q-tr>
            </template>
            <template v-slot:body="props">
               <q-tr :props="props">
                  <q-td auto-width>
                     <q-btn v-if="hasTracking(props.row)" size="xs" color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                     <invoice-td :invoice="props.row" :col="col" />
                  </q-td>
                  <q-td auto-width>                  
                     <q-btn v-if="needToSend(props.row)"        @click="send(props.row.id)" label="Send"   :disabled="!acceptsEmail(props.row.userId)" size="xs" color="primary" dense/>   
                     <q-btn v-else-if="needToResend(props.row)" @click="send(props.row.id)" label="Resend" :disabled="!acceptsEmail(props.row.userId)" size="xs" color="primary" dense/>
                     <q-btn icon="edit" @click="editInvoice(props.row.id)" size="sm" color="primary" flat dense/>                 
                  </q-td>
               </q-tr>   
               <template v-if="props.expand">
                  <q-tr>
                     <q-td colspan="2"/>
                     <q-td class="text-left bg-grey-2" colspan="2">
                        <a v-if="hasTrackingLink(props.row)" :href="trackingLink(props.row)" target=”_blank”>
                           {{ props.row.carrier }} - {{ props.row.tracking }}
                        </a>
                        <span v-else>Tracking: {{ props.row.carrier }} - {{ props.row.tracking }}</span> 
                     </q-td>
                  </q-tr>
               </template>
            </template>
         </q-table>
         <div style="height: 75px"/>
		</div>
		<q-dialog v-model="showEditModal">
			<invoice-add-edit :type="edit" :invoice="invoiceToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr'   
   import { InvoiceMgr } from 'src/managers/InvoiceMgr'
   import { dollars } from 'src/utils/Utils'
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'
   import { UI, Colors } from 'src/utils/Constants'
   
	export default {
		data() {
	  	   return {
            showShipped: true,
			   showEditModal: false,
				tableDataFilter: '',
            visibleColumns: ['userName', 'name', 'createdDate', 'total', 'status', 'sentDate'],
 				columns: [
               { name: 'userName',    label: 'User',   align: 'left',   field: 'tempFullName', sortable: true },
					{ name: 'name',        label: 'Name',   align: 'left',   field: 'name',         sortable: true },
					{ name: 'createdDate', label: 'Created ' + localTimezone(), 
                                                       align: 'center', field: 'createdDate',  sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'total',       label: 'Total',  align: 'right',  field: 'total',        sortable: true, format: val => dollars(val) },
					{ name: 'status',      label: 'Status', align: 'center', field: 'status',       sortable: true },
               { name: 'sentDate',    label: 'Sent ' + localTimezone(), 
                                                       align: 'center', field: 'sentDate',     sortable: true, format: val => formatDateTimeOptYear(val) },
            ],
            pagination: { rowsPerPage: 30 },
            invoiceIdToEdit: '',
			}
		},
		computed: {
         ...mapGetters('invoice', ['getInvoices', 'getInvoice']),
         ...mapGetters('user', ['getUserLookup']),
         ...mapGetters('color', Colors),
         invoiceToEdit() { return this.getInvoice(this.invoiceIdToEdit) },
         invoices() { 
            const displayInvoices = []
            for (var invoice of this.getInvoices ) {
               const tempInvoice = Object.assign({}, invoice)
               tempInvoice.tempFullName =  invoice.user.fullName
               
               if (this.showShipped || !InvoiceMgr.isShipped(tempInvoice)) {
                  displayInvoices.push(tempInvoice) 
               }
            }
            return displayInvoices
         },
         userLookup() { return this.getUserLookup },
         edit() { return UI.EDIT },
      },
		methods: {
         ...mapActions('invoice', ['sendInvoice', 'deleteInvoice']),
         acceptsEmail(userId) { return UserMgr.lookupAcceptsEmail(this.userLookup, userId) },
         needToSend(invoice) { return !invoice.sentDate },
         needToResend(invoice) { return InvoiceMgr.needToResend(invoice) },
         send(invoiceId) { this.sendInvoice(invoiceId) },
         getInvoiceDetails(invoiceId) { return InvoiceMgr.getDetails(this.getInvoice(invoiceId)) },
         editInvoice(invoiceId) {
            this.invoiceIdToEdit = invoiceId
				this.showEditModal = true
         },
         hasTracking(invoice) { return InvoiceMgr.hasTracking(invoice) },
		   hasTrackingLink(invoice) { return InvoiceMgr.hasTrackingLink(invoice) },
		   trackingLink(invoice) { return InvoiceMgr.getTrackingLink(invoice) }
		},
		components: {
			'invoice-add-edit' : require('components/Invoice/InvoiceAddEdit.vue').default,
      	'invoice-td' : require('components/Invoice/InvoiceTd.vue').default
      }
   }
   
</script>