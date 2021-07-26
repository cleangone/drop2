<template>
   <span>
      <span v-if="col.name == 'name'">
         {{ col.value }} 
         <q-btn @click="showInvoice()" icon="pageview" size="sm" color="primary" flat dense> 
            <q-tooltip content-class="bg-black" :offset="[5, 5]">Show Invoice</q-tooltip>
         </q-btn>      
      </span>
      <span v-else-if="col.name == 'sentDate'">{{ sentDate(col.value) }}</span>
      <span v-else-if="col.name == 'status'">
         {{ col.value }}
         <q-btn v-if="hasTracking" @click="showTracking()" icon="local_shipping" size="sm" color="primary" flat dense> 
            <q-tooltip content-class="bg-black" :offset="[5, 5]">Show Tracking</q-tooltip>
         </q-btn>   
      </span>
      <span v-else>{{ col.value }}</span>

      <q-dialog v-model="showInvoiceModal">
			<invoice-display :invoice="invoice" @close="showInvoiceModal=false" />
		</q-dialog>
      <q-dialog v-model="showTrackingModal">
			<tracking-display :invoice="invoice" @close="showTrackingModal=false" />
		</q-dialog>
   </span>
</template>

<script>
   import { InvoiceMgr } from 'src/managers/InvoiceMgr'
   
	export default {
      props: ['invoice', 'col'],
      data() {
	  	   return {
			   showInvoiceModal: false,
			   showTrackingModal: false,
			}
		},
      computed: {
         hasTracking() { return InvoiceMgr.hasTracking(this.invoice) },  
      },
		methods: {
         sentDate(colValue) { 
            return InvoiceMgr.isSending(this.invoice) || InvoiceMgr.isSendError(this.invoice) ? 
               this.invoice.sendStatus : colValue
         },  
         showInvoice() { this.showInvoiceModal = true },
         showTracking() { this.showTrackingModal = true },
      },
      components: {
			'invoice-display' : require('components/Invoice/InvoiceDisplay.vue').default,
      	'tracking-display' : require('components/Invoice/TrackingDisplay.vue').default,
      }
   }

</script>