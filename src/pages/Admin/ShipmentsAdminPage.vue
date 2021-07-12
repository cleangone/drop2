<template>
   <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Shipments" :data="shipments" 
				:columns="columns" :visible-columns="visibleColumns" row-key="id" :filter="tableDataFilter" 
            no-data-label="No shipments" :pagination.sync="pagination"
				:dense="$q.screen.lt.md" flat class="q-mb-sm">
				<template v-slot:top-right>
				   <q-space />
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
            <q-td slot="body-cell-service" slot-scope="props" :props="props"> 
               {{ service(props.row) }}
            </q-td>
            <q-td slot="body-cell-tracking" slot-scope="props" :props="props"> 
               <a v-if="hasTrackingLink(props.row)" :href="trackingLink(props.row)" target=”_blank”>
                  {{ props.row.tracking }}
               </a>
               <span v-else>{{ props.row.tracking }}</span> 
            </q-td>
            <q-td slot="body-cell-actions" slot-scope="props" :props="props"> 
	            <q-btn icon="edit"   @click="edit(props.row)"           @click.stop size="sm" flat dense color="primary" />
    				<q-btn icon="delete" @click="promptToDelete(props.row)" @click.stop size="sm" flat dense color="red" />
  				</q-td> 
			</q-table>
		 	<q-btn @click="add()" icon="add" unelevated color="primary"/>
	      <div style="height: 50px; width: 10px;" />
		</div>
      <q-dialog v-model="showAddModal">	
			<barcodes-add />
		</q-dialog>
      <q-dialog v-model="showEditModal">	
			<shipment-edit :shipment="shipmentToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { formatDateOptYear } from 'src/utils/DateUtils'
   
	export default {
		data() {
	  		return {
				showAddModal: false,
				showEditModal: false,
				shipmentToEdit: null,
				tableDataFilter: '',
				visibleColumns: [ 'barcode', 'service', 'tracking', 'date', 'actions'],
 				columns: [
               { name: 'barcode',  label: 'Barcode',  align: 'left',   field: 'barcode',     sortable: true },
					{ name: 'service',  label: 'Service',  align: 'left',   field: 'service',     sortable: true },
               { name: 'tracking', label: 'Tracking', align: 'left',   field: 'tracking',    sortable: true },
               { name: 'date',     label: 'Date',     align: 'center', field: 'createdDate', sortable: true, format: val => formatDateOptYear(val) },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 20 },
			}
		},
		computed: {
         ...mapGetters('shipment', ['getShipments']),
         shipments() { 
            let shipments = []
            for (var shipment of this.getShipments ) {
               shipments.push(Object.assign({}, shipment) ) 
            }
            return shipments
         },
		},
		methods: {
         ...mapActions('shipment', ['deleteShipment']),
      	add() { this.showAddModal = true },
         service(shipment) { return shipment.service ? shipment.service : shipment.carrier },
         hasTrackingLink(shipment) { return shipment.trackingLink != null },
		   trackingLink(shipment) { return shipment.trackingLink },
         edit(shipment) {
            console.log("edit", shipment)
            this.shipmentToEdit = shipment
				this.showEditModal = true
         },
			promptToDelete(shipment) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + shipment.barcode + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteShipment(shipment.id) })
			}
		},
		components: {
			'barcodes-add' : require('components/Shipment/BarcodesAdd.vue').default,
      	'shipment-edit' : require('components/Shipment/ShipmentEdit.vue').default,
      }  
   }
</script>