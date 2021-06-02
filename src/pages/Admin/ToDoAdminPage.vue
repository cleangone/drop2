<template>
   <q-page>
      <div class="text-h5 q-mt-md q-ml-sm">ToDo</div>
      <div v-if="todosExist">
         <todo-purchase-req v-if="requestedItemsExist" class="q-pa-sm" />
         <todo-hold v-if="holdItemsExist" class="q-pa-sm" />
         <todo-close-items v-if="activeBidItemsExist" class="q-pa-sm" />
         <todo-send-invoices v-if="createdInvoicesExist" class="q-pa-sm" />
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
         ...mapGetters('invoice', ['createdInvoicesExist']),
         ...mapGetters('error', ['visibleEmailErrorsExist']),
         todosExist() { 
            return this.requestedItemsExist || this.holdItemsExist || this.activeBidItemsExist || 
               this.createdInvoicesExist || this.visibleEmailErrorsExist
         },
      },
		components: {
         'todo-purchase-req' : require('components/Admin/ToDo/ToDoPurchaseReq.vue').default,
         'todo-hold'         : require('components/Admin/ToDo/ToDoHold.vue').default,
         'todo-close-items'  : require('components/Admin/ToDo/ToDoCloseItems.vue').default,
         'todo-send-invoices': require('components/Admin/ToDo/ToDoSendInvoices.vue').default,
         'todo-email-error'  : require('components/Admin/ToDo/ToDoEmailError.vue').default,
      },
   }

</script>