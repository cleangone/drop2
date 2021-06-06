<template>
  <q-page>
      <div class="q-pt-md q-pl-md text-h5">Invoice</div>
      <div v-if="invoiceExists" :style="width">
         <q-card class="form-card q-ma-md">
            <q-card-section>
               <div v-html="invoiceHtml" />
               <span v-if="isProcessingOrPaid" class="text-h2 absolute-center text-red text-weight-bolder">
                  {{ processingOrPaidText }}
               </span>
            </q-card-section>
         </q-card>
         <div v-if="!isProcessingOrPaid" ref="paypal" class="q-ma-lg"></div>
         <div style="height: 75px"/>
      </div>
      <div v-else class="q-mt-md">
         Cannot find Invoice
      </div>
	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { InvoiceMgr } from 'src/managers/InvoiceMgr'
   import { PayPalConfig } from 'boot/Config'
   
	export default {
		data() {
	  	   return {
            invoiceId: "",
            loaded: false,
            isProcessing: false,
			}
		},
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('invoice', ['getUserInvoice']),
         ...mapGetters('user', ['getUser']),
         ...mapGetters('setting', ['getSettings']),
         user() { return this.getUser(this.userId)},
         width() { return "width:" + (this.$q.screen.width > 500 ? 500 : this.$q.screen.width-25) + "px" },
         invoice() { return this.getUserInvoice(this.userId, this.invoiceId) },
         invoiceHtml() { return this.invoice ? InvoiceMgr.getHtml(this.invoice, this.getSettings) : "" },
         invoiceExists() { return this.invoice != null },
         isProcessingOrPaid() { return this.invoice.paidDate || this.isProcessing },
         processingOrPaidText() { return this.invoice.paidDate ? "PAID" : "PROCESSING" },
      },
      methods: {
         ...mapActions('action', ['submitInvoicePayment']),
         setLoaded: function() {
            this.loaded = true
            window.paypal.Buttons({
               createOrder: (data, actions) => {
                  return actions.order.create({
                     purchase_units: [ {
                        description: this.invoice.name,
                        amount: {
                           currency_code: "USD",
                           value: this.invoice.total
                        }
                     } ]
                  })
               },
               onApprove: async (data, actions) => {
                  const order = await actions.order.capture()
                  this.paid(order)
               },
               onError: err => {
                  console.log("Paypal error", err)
               },
            })
            .render(this.$refs.paypal);
         },
         paid(paypalOrder) { 
            console.log("Paypal approved order", paypalOrder)
            if (paypalOrder.status != "COMPLETED") {
               const msg = "Paypal error: expected Order status to be COMPLETED, instead got " + paypalOrder.status
               console.log(msg)
               alert(msg)
               return
            }

            const paypalPurchase = paypalOrder.purchase_units[0]
            const paypalAmount = parseInt(paypalPurchase.amount.value) 
            if (paypalAmount != this.invoice.total || paypalPurchase.amount.currency_code != "USD") {
               const msg = "Paypal error: expected Order amount to match " + this.invoice.total + ", instead was " + 
                  paypalOrder.purchase_units.amount.value + " " + paypalPurchase.amount.currency_code
               console.log(msg)
               alert(msg)
               return
            }

            this.isProcessing = true
            this.submitInvoicePayment( {
               invoiceId: this.invoice.id, 
               invoiceName: this.invoice.name, 
               amount: paypalAmount,
               userId: this.userId, 
               paypal: { amount: paypalPurchase.amount, shipping: paypalPurchase.shipping }
            }) 
         }
      },
      mounted: function() {
         const script = document.createElement("script")
         script.src = "https://www.paypal.com/sdk/js?client-id=" + PayPalConfig.clientId
         script.addEventListener("load", this.setLoaded);
         document.body.appendChild(script);
      },
      created() {
         this.invoiceId = this.$route.params.id   
      },
	}
</script>