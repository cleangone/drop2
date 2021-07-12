<template>
	<q-card class="form-card">
      <q-card-section>
         <div>
            <q-btn class="float-right" icon="clear" color="primary" size="sm" v-close-popup dense/>
            <div class="text-h6 heading">Add Shipment Barcodes</div>
         </div>
         <div style="max-width: 390px" class="q-mb-sm">
            <q-input v-model="barcodesText" @paste.native.prevent="onPaste"  filled type="textarea" />
         </div>
         <div>
            <q-btn v-if="barcodesExist" @click="saveShipments" label="Save" color="primary" class="float-right" />
            <toggle :toggleContainer="carriersToggleContainer" />
         </div>
      </q-card-section>
  </q-card>
</template>

<script>
	import { mapActions } from 'vuex'
   import { ShipmentMgr, ShipmentCarrier } from 'src/managers/ShipmentMgr' 
   import { ToggleContainerMgr } from 'src/managers/ui/ToggleContainerMgr'   
   
	export default {
		data() {
			return {
            barcodesText: "",
            carriersToggleContainer: ToggleContainerMgr.getCarriersContainer(),
			}
		},
		computed: {	
         barcodesExist() { return this.barcodesText.length > 0 },	
      },
		methods: {
			...mapActions('shipment', ['createShipments']),
			onPaste(event) {
				const clipboardData = event.clipboardData || window.clipboardData
            const text = clipboardData.getData('Text')
            console.log("onPaste", text)
            if (this.barcodesExist) { this.barcodesText += "\n"}
            this.barcodesText += text
         },
         saveShipments() {
            let carrier = ""
            if (ToggleContainerMgr.isUSPS(this.carriersToggleContainer)) { carrier = ShipmentCarrier.USPS }
            else if (ToggleContainerMgr.isFedEx(this.carriersToggleContainer)) { carrier = ShipmentCarrier.FEDEX }
               
            const shipments = []
				const barcodes = this.barcodesText.split('\n').join(',').split(',')
            for (var barcode of barcodes) {
               const barcodeText = barcode.trim()
               if (barcodeText.length) { 
                  shipments.push(ShipmentMgr.createShipment(barcodeText, carrier)) 
               }
            }

            if (shipments.length) { this.createShipments(shipments) }
            this.barcodesText = ""
         },
      },
      components: {
      	'toggle' : require('components/General/Toggle.vue').default,
	  	},
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>