<template>
   <span>
      <span v-if="col.name == 'name'">
         {{ col.value }} 
         <q-btn @click="showInvoice()" icon="pageview" size="sm" color="primary" flat dense> 
            <q-tooltip content-class="bg-black" :offset="[5, 5]">Show invoice</q-tooltip>
         </q-btn>      
      </span>
      <span v-else-if="col.name == 'tracking'"> 
         {{ invoice.carrier }}
         <a v-if="hasTrackingLink" :href="trackingLink" target=”_blank”>{{ invoice.tracking }}</a>
         <span v-else>{{ invoice.tracking }}</span>
      </span>
      <span v-else-if="col.name == 'date' || col.name == 'sentDate'">{{ sentDate }}</span>
      <span v-else>{{ col.value }}</span>

      <q-dialog v-model="showModal">
			<invoice-display :invoice="invoice" @close="showModal=false" />
		</q-dialog>
   </span>
</template>

<script>
   import { InvoiceMgr } from 'src/managers/InvoiceMgr.js'
   import { formatDateOptYear } from 'src/utils/DateUtils'

	export default {
      props: ['invoice', 'col'],
      data() {
	  	   return {
			   showModal: false,
			}
		},
      computed: {
         sentDate() { 
            return InvoiceMgr.isSending(this.invoice) || InvoiceMgr.isSendError(this.invoice) ? 
               this.invoice.sendStatus : formatDateOptYear(this.invoice.sentDate) 
         },         
         hasTrackingLink() { return InvoiceMgr.hasTrackingLink(this.invoice) },  
         trackingLink() { return InvoiceMgr.getTrackingLink(this.invoice) }, 
      },
		methods: {
         showInvoice() { this.showModal = true },
      },
      components: {
			'invoice-display' : require('components/Invoice/InvoiceDisplay.vue').default,
      }
   }

</script>