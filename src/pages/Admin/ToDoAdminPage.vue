<template>
   <q-page>
      <div class="text-h5 q-mt-md q-ml-sm">ToDo</div>
      <div v-if="requestedItemsExist || holdItemsExist || visibleEmailErrorsExist">
         <todo-purchase-req v-if="requestedItemsExist" class="q-pa-sm" :class="pink" />
         <todo-hold v-if="holdItemsExist" class="q-pa-sm" :class="orange"/>
         <todo-close-items v-if="activeBidItemsExist" class="q-pa-sm" :class="blue" />
         <todo-email-error v-if="visibleEmailErrorsExist" class="q-pa-sm" :class="orange"/>
      </div>
      <div v-else class="q-mt-md q-ml-sm">No ToDo items</div>
   </q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { Colors } from 'src/utils/Constants'
   
	export default {
		computed: {
         ...mapGetters('item', ['requestedItemsExist', 'holdItemsExist', 'activeBidItemsExist']),
         ...mapGetters('error', ['visibleEmailErrorsExist']),
         ...mapGetters('color', Colors),
      },
		components: {
         'todo-purchase-req' : require('components/Admin/ToDo/ToDoPurchaseReq.vue').default,
         'todo-hold'         : require('components/Admin/ToDo/ToDoHold.vue').default,
         'todo-close-items'  : require('components/Admin/ToDo/ToDoCloseItems.vue').default,
         'todo-email-error'  : require('components/Admin/ToDo/ToDoEmailError.vue').default,
      },
   }

</script>