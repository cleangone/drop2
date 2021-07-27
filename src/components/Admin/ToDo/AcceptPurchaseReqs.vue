<template>
   <div>
      <div class="row q-mt-md q-ml-sm">
         <span class="text-h6 col-9">Purchase Requests to be Accepted</span>
      </div>
      <span class="col text-grey-10" color="grey-10" :class="red">
         <q-checkbox v-model="showCols.drop"     label="Drop"    @input="showColsChecked()" size="xs" dense class="q-ml-sm" />
         <q-checkbox v-model="showCols.category" label="Artist"  @input="showColsChecked()" size="xs" dense class="q-ml-sm" />
         <q-checkbox v-model="showCols.price"    label="Price"   @input="showColsChecked()" size="xs" dense class="q-ml-sm" />
      </span>
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
   import { SessionStorage } from 'quasar'
   import { Route, Colors } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'
   import { formatDateTimeOptYear, localTimezone } from 'src/utils/DateUtils'

   const SHOW_COLS  = 'AcceptReqsShowColumns'
   
   export default {
      data() {
	  		return {
            returnRoute: Route.TODO,
            showCols: {},
            defaultVisibleColumns: [ 'name', 'reqDate', 'status', 'bidreq'],
 				columns: [
        			{ name: 'id', field: 'id' },
				 	{ name: 'name',     label: 'Name',        align: 'left',   field: 'name',       sortable: true },
				 	{ name: 'reqDate',  label: 'Req Date ' + localTimezone(), 
                                                         align: 'center', field: 'lastBidReqDate', sortable: true, format: val => formatDateTimeOptYear(val) },
					{ name: 'drop',     label: 'Drop',        align: 'center',                      sortable: true },
				 	{ name: 'category', label: 'Artist',      align: 'center', field: 'category',   sortable: true, format: val => val ? val.name : "" },
				 	{ name: 'price',    label: 'Price',       align: 'right',  field: 'startPrice', sortable: true, format: val => dollars(val) }, 
				 	{ name: 'status',   label: 'Status',      align: 'center', field: 'status',     sortable: true, }, 
					{ name: 'bidreq',   label: 'Bid/Req',     align: 'center' },
				],
            pagination: { rowsPerPage: 50 },
			}
		},
		computed: {
         ...mapGetters('drop', ['getDropIdToNameDropMap']), // only called once even though in table row iteration
         ...mapGetters('item', ['getRequestedItems', 'getHoldItems']),
         ...mapGetters('color', Colors),
         visibleColumns() { 
            const columns = [...this.defaultVisibleColumns]
            if (this.showCols.drop)     { columns.push('drop') } 
            if (this.showCols.category) { columns.push('category') } 
            if (this.showCols.price)    { columns.push('price') }
            return columns
         },
         itemsToAccept() {
            const items = [...this.getRequestedItems]
            for (var item of this.getHoldItems) {
               if (item.purchaseReqs && item.purchaseReqs.length && !item.buyerId) { items.push(item) }
            }

            return items
         }
      },
		methods: {
         showColsChecked() { SessionStorage.set(SHOW_COLS, this.showCols) },
			requestText(row) { return row.numberOfPurchaseReqs + (row.numberOfPurchaseReqs == 1 ? " Request" : " Requests") },
      	rowClicked (evt, row) { this.$router.push("/admin/reqs/" + row.id + "/" + this.returnRoute) },
      },
      created() {
         this.showCols = SessionStorage.getItem(SHOW_COLS)    
         if (!this.showCols) { 
            this.showCols = { drop: true, category: true, price: true }
         }
      },
   }
</script>