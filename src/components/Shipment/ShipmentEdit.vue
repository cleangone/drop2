<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">Edit Shipment</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm">
	      <q-input v-model="shipmentToUpdate.barcode" label="Barcode" filled class="col"/>
    	</div>
		<div class="row q-mb-sm">
         <q-select v-model="shipmentToUpdate.carrier" label="Carrier" :options="carrierOptions" filled class="col-6"/>
      </div>
	</q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="save" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapActions } from 'vuex'
   import { ShipmentMgr, ShipmentCarrier } from 'src/managers/ShipmentMgr'
   
	export default {
		props: ['shipment'],
		data() {
			return {
            carrierOptions: [ ShipmentCarrier.USPS, ShipmentCarrier.FEDEX, ShipmentCarrier.OTHER ],
            shipmentToUpdate: {}
			}
		},
		methods: {
			...mapActions('shipment', ['setShipment']),
			save() {
            ShipmentMgr.setTracking(this.shipmentToUpdate) 
            this.setShipment(this.shipmentToUpdate)
            this.$emit('close')
			}
		},
		mounted() {
         setTimeout(() => { // user param update propagating as modal being popped up
            this.shipmentToUpdate = Object.assign({}, this.shipment) 
         }, 100)  
		}
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>