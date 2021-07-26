<template>
  <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Invoices" :data="invoices" 
				:columns="columns" :visible-columns="visibleColumns" 
				row-key="id" :filter="tableDataFilter" :pagination.sync="pagination"
            no-data-label="No invoices" :dense="$q.screen.lt.md" class="q-mb-sm" flat>
				<template v-slot:top-right>
					<q-space />					
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>     
            <template v-slot:header="props">
               <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
                  <q-th auto-width /> <!-- actions col -->
               </q-tr>
            </template>    
            <template v-slot:body="props">
               <q-tr :props="props">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                     <invoice-td :invoice="props.row" :col="col"/>
                  </q-td>
                  <q-td auto-width>                  
                     <q-btn v-if="needToPay(props.row)" @click="pay(props.row)" label="Pay" size="xs" color="primary" dense/>   
                  </q-td>
               </q-tr>
            </template>
         </q-table>
         <div style="height: 75px"/>
		</div>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { InvoiceMgr } from 'src/managers/InvoiceMgr'
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'
   import { dollars } from 'src/utils/Utils'
   
	export default {
		data() {
	  	   return {
			   tableDataFilter: '',
            visibleColumns: ['name', 'sentDate', 'total', 'status'],
 				columns: [
               { name: 'name',     label: 'Name',      align: 'left',   field: 'name',     sortable: true },
               { name: 'sentDate', label: 'Received ' + localTimezone(), 
                                                       align: 'center', field: 'sentDate', sortable: true, format: val => formatDateTimeOptYear(val) },
               { name: 'total',    label: 'Total',     align: 'right',  field: 'total',    sortable: true, format: val => dollars(val) },
					{ name: 'status',   label: 'Status',    align: 'center', field: 'status',   sortable: true },
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('invoice', ['getUserInvoices']),
         invoices() { 
            try { 
               let invoices = this.getUserInvoices(this.userId) 
               invoices.sort((a, b) => (a.sentDate > b.sentDate) ? -1 : 1)
               return invoices
            } 
            catch (error)
            {
               console.log("Invoices ERROR", error)
               this.createError({ 
                  title: "InvoicesPage.invoices() > getUserInvoices", 
                  description: error.message })
               return []
            }
         }
      },
      methods: {
         ...mapActions('error', ['createError']),
         needToPay(invoice) { return !InvoiceMgr.isPaid(invoice) &&  !InvoiceMgr.isShipped(invoice) },
         pay(invoice) { this.$router.push("/invoice/" + invoice.id ) },
      },
		components: {
         'invoice-td' : require('components/Invoice/InvoiceTd.vue').default,
      }
	}
</script>