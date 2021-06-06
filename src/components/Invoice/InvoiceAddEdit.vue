<template>
	<q-card class="form-card">
      <q-card-section>
      <div class="text-h6 heading">{{ type }} Invoice</div>
    </q-card-section>
    <q-card-section>
      <div v-if="invoiceError" class="text-red text-bold q-mt-sm">{{ invoiceError }}</div>
      <div v-else class="q-mt-sm">
         <div v-html="userHtml" />
         <div v-if="paypalUserHtml" v-html="paypalUserHtml" class="q-my-lg"/>
         <div class="q-mt-sm">
            <q-table :columns="columns" :data="invoiceToSubmit.items" :visible-columns="visibleColumns" row-key="name"
               :rows-per-page-options="[0]" pagination.sync="pagination" hide-header hide-bottom
               :dense="$q.screen.lt.md" class="q-mb-none">
                  
               <template v-slot:bottom-row>
                  <q-tr>
                     <q-td class="bg-grey-2">Sub-Total</q-td>
                     <q-td class="bg-grey-2" align=right>{{ subtotal }}</q-td>
                  </q-tr>
                  <q-tr>
                     <q-td>Shipping</q-td>
                     <q-td align=right>{{ shippingCharge }}</q-td>
                  </q-tr>
                  <q-tr v-if="invoiceToSubmit.priceAdjustment">
                     <q-td>Adjustment</q-td>
                     <q-td align=right>{{ priceAdjustment }}</q-td>
                  </q-tr>
                  <q-tr>
                     <q-td class="bg-grey-2"><span class="text-weight-bold">TOTAL</span></q-td>
                     <q-td class="bg-grey-2" align=right><span class="text-weight-bold">{{ total }}</span></q-td>
                  </q-tr>
               </template>
            </q-table>
         </div>
      </div>
    </q-card-section>

    <q-card-section>
    	<div v-if="canAdjustPrice" class="row q-mb-sm q-gutter-sm">
         <q-input v-model.number="invoiceToSubmit.shipping.shippingCharge" label="Shipping" type=number prefix="$" filled class="col" />
			<q-input v-model.number="invoiceToSubmit.priceAdjustment" label="(Price Adjustment)" type=number prefix="$" filled class="col" />
		</div>
      <div v-if="isEdit" class="row q-mb-none q-gutter-sm">
         <q-select  v-model="invoiceToSubmit.status" label="Status" :options="statusOptions" class="col" filled/>
         <div class="col"/>
		</div>
      <div v-if="isShipped" class="row q-mt-sm q-gutter-sm">
         <q-select v-model="invoiceToSubmit.shipping.carrier" label="Carrier" :options="carrierOptions" class="col" filled/>
         <q-input v-model="invoiceToSubmit.shipping.tracking" label="Tracking" filled class="col" />
		</div>
   </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn v-if="!invoiceError" @click="submitForm" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr'
   import { InvoiceMgr, InvoiceStatus } from 'src/managers/InvoiceMgr'
   import { UI } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   
	export default {
		props: ['type', 'items', 'invoice'],
		data() {
			return {
            user: null, 
            invoiceError: null,
            invoiceToSubmit: {
               name: '', 
               createdDate: new Date(),
               userId: null,
               items: [], // { id, name, buyDate, buyPrice }
               status: InvoiceStatus.CREATED,
               history: [], // { date, status }
               subTotal: 0,
               shipping: { shippingCharge: 25 },
               priceAdjustment: 0
            },
            statusOptions: [ InvoiceStatus.REVISED, InvoiceStatus.PAID, InvoiceStatus.SHIPPED ],
            adjustableStatus: [ InvoiceStatus.CREATED, InvoiceStatus.SENT, InvoiceStatus.REVISED, InvoiceStatus.RESENT ],
            carrierOptions: InvoiceMgr.getCarriers(),
            visibleColumns: [ 'name', 'price'],
 				columns: [
        			{ name: 'name',  label: 'Item',  align: 'left',  field: 'name' },
				 	{ name: 'price', label: 'Price', align: 'right', field: 'buyPrice', format: val => val ? dollars(val) : '' },
            ],
			}
		},
		computed: {	
         ...mapGetters('setting', ['getSettings']),
         ...mapGetters('user', ['getUser']),
         isEdit() { return this.type == UI.EDIT },	
         userHtml() { 
            return this.invoiceToSubmit.user ? InvoiceMgr.getUserHtml(this.invoiceToSubmit, this.user) : ""
         },
         paypalUserHtml() { 
            return this.invoiceToSubmit.user ? InvoiceMgr.getPaypalUserHtml(this.invoiceToSubmit) : ""
         },
         canAdjustPrice() { return this.adjustableStatus.includes(this.invoiceToSubmit.status) },
         isShipped() { return InvoiceMgr.isShipped(this.invoiceToSubmit) },	
         subtotal() { return dollars(this.invoiceToSubmit.subTotal) },
         shippingCharge() { return dollars(this.invoiceToSubmit.shipping.shippingCharge) },
         priceAdjustment() { return "(" + dollars(this.invoiceToSubmit.priceAdjustment) + ")" },
         total() { return dollars(
            this.invoiceToSubmit.subTotal + this.invoiceToSubmit.shipping.shippingCharge - this.invoiceToSubmit.priceAdjustment) }, 
    	},
		methods: {
			...mapActions('invoice', ['createInvoice', 'setInvoice']),
			...mapActions('item', ['updateItem']),
			submitForm() {
				this.persistInvoice()
            this.$emit('close')
			},
			persistInvoice() {
            // console.log("persistInvoice", this.invoiceToSubmit)
            if (this.isEdit) { 
               if (this.invoiceToSubmit.status != this.invoice.status ||
                   this.invoiceToSubmit.shipping.shippingCharge != this.invoice.shipping.shippingCharge ||
                   this.invoiceToSubmit.priceAdjustment != this.invoice.priceAdjustment ||
                   this.invoiceToSubmit.carrier != this.invoice.carrier ||
                   this.invoiceToSubmit.tracking != this.invoice.tracking ) 
               {
                  const processedDate = new Date()
                  if ((this.invoiceToSubmit.shipping.shippingCharge != this.invoice.shipping.shippingCharge) ||
                      (this.invoiceToSubmit.priceAdjustment != this.invoice.priceAdjustment)) {
                     this.invoiceToSubmit.status = InvoiceStatus.REVISED
                     this.invoiceToSubmit.revisedDate = processedDate
                     this.addHistory(this.invoiceToSubmit, processedDate, InvoiceStatus.REVISED)
                  }

                  if (InvoiceMgr.isPaid(this.invoiceToSubmit) && !InvoiceMgr.isPaid(this.invoice)) {
                     this.invoiceToSubmit.paidDate = processedDate
                     this.invoiceToSubmit.amountPaid = this.invoiceToSubmit.total
                     this.addHistory(this.invoiceToSubmit, processedDate, InvoiceStatus.PAID)
                  }
                   
                  if (InvoiceMgr.isShipped(this.invoiceToSubmit) && !InvoiceMgr.isShipped(this.invoice)) {
                     this.invoiceToSubmit.shippedDate = processedDate
                     this.addHistory(this.invoiceToSubmit, processedDate, InvoiceStatus.SHIPPED)
                  }

                  InvoiceMgr.finalize(this.invoiceToSubmit, this.user, this.getSettings)
                  this.setInvoice(this.invoiceToSubmit)
               }
            }
            else { 
               InvoiceMgr.finalize(this.invoiceToSubmit, this.user, this.getSettings)
               this.createInvoice(this.invoiceToSubmit)
               for (var item of this.items) {
                  this.updateItem({ id: item.id, status: ItemStatus.INVOICED })
               }
            }
			},
         addHistory(invoice, date, status) { invoice.history.push({ date: date, status: status }) },
      },
		created() {
         // slight delay because param update propagating as modal being popped up
         setTimeout(() => { 
            // console.log("created: isEdit", this.isEdit)

            if (this.isEdit) {
               
               console.log("invoice", this.invoice)
               this.invoiceToSubmit = Object.assign({}, this.invoice) 
               console.log("invoiceToSubmit", this.invoiceToSubmit)
               

            }
            else {
               this.addHistory(this.invoiceToSubmit, this.invoiceToSubmit.createdDate, InvoiceStatus.CREATED)

               for (var item of this.items) {
                  if (!item.buyerId) { 
                     this.invoiceError = "Not all items have a buyer" 
                     return 
                  }

                  if (this.invoiceToSubmit.userId == null) { this.invoiceToSubmit.userId = item.buyerId }
                  if (item.buyerId != this.invoiceToSubmit.userId) { 
                     this.invoiceError = "Not all items have the same buyer"
                     return 
                  }
                  if (!ItemMgr.isHold(item) && !ItemMgr.isInvoice(item)) { 
                     this.invoiceError = "All item must be status Hold or Invoiced" 
                     return
                  }

                  this.invoiceToSubmit.items.push(
                     { id: item.id, name: item.name, buyDate: item.buyDate, buyPrice: item.buyPrice }) 
                  this.invoiceToSubmit.subTotal += item.buyPrice
               }            
            }

            this.user = this.getUser(this.invoiceToSubmit.userId)
            // console.log("created", this.user)
            if (!this.isEdit) { 
               InvoiceMgr.finalize(this.invoiceToSubmit, this.user, this.getSettings)
            }
        }, 100)  
		}
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>