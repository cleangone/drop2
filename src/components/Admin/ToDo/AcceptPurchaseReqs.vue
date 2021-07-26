<template>
   <div>
      <div class="row q-mt-md q-ml-sm">
         <span class="text-h6 col-9">Purchase Requests to be Accepted</span>
      </div>
      <q-table :data="itemsToAccept" row-key="name" :columns="columns" :visible-columns="visibleColumns" 
            @row-click="rowClicked" :pagination.sync="pagination" :dense="$q.screen.lt.md" flat >
         <q-td slot="body-cell-drop" slot-scope="props" :props="props"> 
            {{ getDropIdToNameDropMap.get(props.row.dropId) }}
         </q-td>
         <q-td slot="body-cell-bidreq" slot-scope="props" :props="props"> 
            {{ requestText(props.row) }}
         </q-td>
      </q-table>
   </div>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { Route, Colors } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'

   export default {
      data() {
	  		return {
            returnRoute: Route.TODO,
            visibleColumns: [ 'name', 'reqDate', 'drop', 'category', 'price', 'bidreq'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',     label: 'Name',        align: 'left',   field: 'name',       sortable: true },
				 	{ name: 'reqDate',  label: 'Req Date ' + localTimezone(), 
                                                         align: 'center', field: 'userUpdatedDate', sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'drop',     label: 'Drop',        align: 'center',                      sortable: true },
				 	{ name: 'category', label: 'Artist',      align: 'center', field: 'category',   sortable: true, format: val => val ? val.name : "" },
				 	{ name: 'price',    label: 'Price',       align: 'right',  field: 'startPrice', sortable: true, format: val => dollars(val) }, 
					{ name: 'bidreq',   label: 'Bid/Req',     align: 'center' },
				],
            pagination: { rowsPerPage: 50 },
			}
		},
		computed: {
         ...mapGetters('drop', ['getDropIdToNameDropMap']), // only called once even though in table row iteration
         ...mapGetters('item', ['getRequestedItems', 'getHoldItems']),
         ...mapGetters('color', Colors),
         itemsToAccept() {
            const items = [...this.getRequestedItems]
            for (var item of this.getHoldItems) {
               if (item.purchaseReqs && item.purchaseReqs.length && !item.buyerId) { items.push(item) }
            }

            return items
         }
      },
		methods: {
			requestText(row) { return row.numberOfPurchaseReqs + (row.numberOfPurchaseReqs == 1 ? " Request" : " Requests") },
      	rowClicked (evt, row) { this.$router.push("/admin/reqs/" + row.id + "/" + this.returnRoute) },
      },
   }
</script>