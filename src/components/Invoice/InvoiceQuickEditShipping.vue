<template>
	<q-card class="form-card">
    <q-card-section v-if="invoicesExist" class="q-px-md q-py-sm q-gutter-sm" >
      <div>
         <div class="text-h6">{{ invoice.name }}</div>  
         <div class="text-subtitle1 q-gutter-none" style="line-height: 1.25em">
            <div>{{ invoice.tempFullName }}</div>  
            <div>{{ cityStateZip }}</div>
         </div>  
      </div>  
      <q-btn-toggle v-model="invoice.status" :options="[paidOption, shippedOption]" toggle-color="primary" />
      <q-select v-model="invoice.shipping.carrier" label="Carrier" :disable="!isShipped(invoice)" :options="carrierOptions" filled/>
      <q-input v-model="invoice.shipping.tracking" label="Tracking" :disable="!isShipped(invoice)" filled  />
   </q-card-section>
   <q-card-section>
      <div class="text-subtitle1">QR Reader</div>  
         <div class="row">
            <div class="col-6" style="width:150px; height:150px">
            <!-- note: decode does not fire if same receipt scanned twice -->
            <qrcode-stream @decode="onQrDecode"></qrcode-stream>
         </div>
         <div v-if="!qrRecognized" class="q-ml-md col">
            <div class="text-subtitle2 text-red">QR Not Recognized</div>
            <div class="text-caption">{{qrText1}} <br> {{qrText2}}</div>
         </div>
      </div>  
   </q-card-section>
   <q-card-actions v-if="invoicesExist" class="q-px-md" align="right">
      <q-btn @click="close"  label="Cancel"       color="grey" />
      <q-btn @click="next"   label="Skip Invoice" color="grey" />
      <q-btn @click="save"   label="Save Invoice" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapActions } from 'vuex'
   import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
   import { InvoiceMgr, InvoiceStatus, InvoiceCarrier } from 'src/managers/InvoiceMgr'
   import { UI } from 'src/utils/Constants'
   
   // usps qr: http://www.postalexperience.com/pos?mt=4&sc=840-5028-0150-002-00049-53575-02  
   const USPS_QR_PREXIX = "http://www.postalexperience.com/pos?mt=4&sc="

   export default {
      props: ['invoices'],
		data() {
			return {
            invoicesToUpdate: [],
            currInvoiceIndex: 0,
            paidOption: { label: InvoiceStatus.PAID, value: InvoiceStatus.PAID },
            shippedOption: { label: InvoiceStatus.SHIPPED, value: InvoiceStatus.SHIPPED },
            carrierOptions: InvoiceMgr.getCarriers(),
            qrRecognized: true,
            qrText1: "",
            qrText2: "",
         }
      },
      computed: {
         invoicesExist() { return this.invoicesToUpdate.length > 0 },
         invoice() { return this.invoicesToUpdate[this.currInvoiceIndex] },
         cityStateZip() { 
            console.log("this.invoice.user", this.invoice.user)
            if (this.invoice.user.address.usePayPalAddress && this.invoice.shipping.paypal) {
               console.log("this.invoice.shipping.paypal", this.invoice.shipping.paypal)
               return  "(PayPal) " + this.invoice.shipping.paypal.address.admin_area_2 + ", " +
                  this.invoice.shipping.paypal.address.admin_area_1 + " " + 
                  this.invoice.shipping.paypal.address.postal_code
            }
            else {
               return this.invoice.user.address.city + ", " +
                  this.invoice.user.address.state + " " + 
                  this.invoice.user.address.zip
            }
         }
      },
      methods: {
			...mapActions('invoice', ['updateInvoice']),
			isShipped(invoice) { return InvoiceMgr.isShipped(invoice) },
         onQrDecode(text) { 
            this.qrText1 = text
            this.qrRecognized = true
               
            if (text.startsWith(USPS_QR_PREXIX)) {
               this.invoice.status = InvoiceStatus.SHIPPED
               this.invoice.shipping.carrier = InvoiceCarrier.USPS_PRIORITY
               this.invoice.shipping.tracking = text.substring(USPS_QR_PREXIX.length)
            }
            else { 
               this.qrRecognized = false 
               const index = text.lastIndexOf("/")
               if (index != -1) {
                  this.qrText1 = text.substring(0, index)
                  this.qrText2 = text.substring(index)
               }
            }
         },
         save() {
            this.updateInvoice(this.invoice)
            this.next()
         },
         next() {    
            if (this.currInvoiceIndex == this.invoices.length - 1) { this.close() }
            else { this.currInvoiceIndex++ }
         },
		   close() { this.$emit(UI.CLOSE) },
      },
      mounted() {
         for (var invoice of this.invoices) {
            if (InvoiceMgr.isPaid(invoice)) { this.invoicesToUpdate.push((Object.assign({}, invoice))) }
         }
      },
      components: {
         QrcodeStream,
         QrcodeDropZone,
         QrcodeCapture
      },
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .q-card-section { width: 100%; }
</style>
