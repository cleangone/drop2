<template>
   <q-page>
      <div class="text-h5 q-mt-md q-ml-sm">ToDo</div>
      <div v-if="todosExist">
         <accept-purchase-reqs v-if="requestedItemsExist" class="q-pa-sm" />
         <invoice-held-items v-if="holdItemsExist" class="q-pa-sm" />
         <close-item-bidding v-if="activeBidItemsExist" class="q-pa-sm" />
         <send-invoices v-if="createdInvoicesExist" class="q-pa-sm" />
         <mark-invoices-shipped v-if="paidInvoicesExist" class="q-pa-sm" />
         <created-shipments class="q-pa-sm" />
         <todo-email-error v-if="visibleEmailErrorsExist" class="q-pa-sm" />
      </div>
      <div v-else class="q-mt-md q-ml-sm">No ToDo items</div>
   </q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   
	export default {
		computed: {
         ...mapGetters('item', ['requestedItemsExist', 'holdItemsExist', 'activeBidItemsExist']),
         ...mapGetters('invoice', ['createdInvoicesExist', 'paidInvoicesExist']),
         ...mapGetters('error', ['visibleEmailErrorsExist']),
         todosExist() { 
            return this.requestedItemsExist || this.holdItemsExist || this.activeBidItemsExist || 
               this.createdInvoicesExist || this.paidInvoicesExist || this.visibleEmailErrorsExist
         },
      },
		components: {
         'accept-purchase-reqs' : require('components/Admin/ToDo/AcceptPurchaseReqs.vue').default,
         'invoice-held-items'   : require('components/Admin/ToDo/InvoiceHeldItems.vue').default,
         'close-item-bidding'   : require('components/Admin/ToDo/CloseItemBidding.vue').default,
         'send-invoices'        : require('components/Admin/ToDo/SendInvoices.vue').default,
         'mark-invoices-shipped': require('components/Admin/ToDo/MarkInvoicesShipped.vue').default,
         'created-shipments'    : require('components/Admin/ToDo/CreatedShipments.vue').default,
         'todo-email-error'     : require('components/Admin/ToDo/ToDoEmailError.vue').default,
      },
   }

</script>