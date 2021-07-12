<template>
   <div>
      <div class="row q-mt-md q-ml-sm">
         <span class="text-h6">Shipments not Attached to an Invoice</span>
         <q-btn @click="showModal=true" label="Add" unelevated color="primary" dense class="q-ml-xs"/>
      </div>
      <div>
         <q-table :data="shipments" :columns="columns" :visible-columns="visibleColumns" row-key="id"
            no-data-label="No shipments" :pagination.sync="pagination" :dense="$q.screen.lt.md" flat class="q-mb-sm" />
      </div>
       <q-dialog v-model="showModal">	
			<barcodes-add @close="modalClosed()" />
		</q-dialog>
   </div>     
</template>

<script>
   import { mapGetters } from 'vuex'
   import { formatDateOptYear } from 'src/utils/DateUtils'
   
   export default {
      data() {
	  		return {
            visibleColumns: [ 'date', 'carrier', 'tracking' ],
 				columns: [
               { name: 'date',     label: 'Date',     align: 'center', field: 'createdDate', sortable: true, format: val => formatDateOptYear(val) },
					{ name: 'carrier',  label: 'Carrier',  align: 'left',   field: 'carrier',     sortable: true },
					{ name: 'tracking', label: 'Tracking', align: 'left',   field: 'tracking',    sortable: true },
               { name: 'actions' }
            ],
            tableDataFilter: '',
            pagination: { rowsPerPage: 5 },
            showModal: false,
         }
		},
		computed: {
         ...mapGetters('shipment', ['getCreatedShipments']),
         shipments() { 
            let shipments = []
            for (var shipment of this.getCreatedShipments ) {
               shipments.push(Object.assign({}, shipment) ) 
            }
            return shipments
         },
		},
		methods: {
         modalClosed() { 
            this.showModal = false 
         },
		},
      components: {
         'barcodes-add' : require('components/Shipment/BarcodesAdd.vue').default,
      },
   }
</script>