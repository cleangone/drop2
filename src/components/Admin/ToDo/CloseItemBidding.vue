<template>
   <div>
      <div class="row q-mt-md q-ml-sm">
         <span class="text-h6 col-9">Close Bidding on Items</span>
      </div>
      <q-table :data="getActiveBidItems" row-key="id" :columns="columns" :visible-columns="visibleColumns" 
            selection="multiple" :selected.sync="selectedRows" @row-click="rowClicked"
            :pagination.sync="pagination" :dense="$q.screen.lt.md" flat >
         <q-td slot="body-cell-drop" slot-scope="props" :props="props"> 
            {{ getDropIdToNameDropMap.get(props.row.dropId) }}
         </q-td>
         <q-td slot="body-cell-price" slot-scope="props" :props="props"> 
            {{ priceText(props.row) }}
         </q-td>
         <q-td slot="body-cell-bids" slot-scope="props" :props="props"> 
            <a v-if="props.row.numberOfBids == 1"     :href="'#/bids/' + props.row.id">{{ props.row.numberOfBids }} Bid</a>
            <a v-else-if="props.row.numberOfBids > 0" :href="'#/bids/' + props.row.id">{{ props.row.numberOfBids }} Bids</a>
         </q-td>
      </q-table>
      <q-btn v-if="showCloseButton" label="Close Items" @click="closeItems()" unelevated color="primary" class="q-mr-xs"/>
  </div>     
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'    
   import { ItemStatus } from 'src/managers/ItemMgr'
	import { dollars, syncRows } from 'src/utils/Utils'
   
   export default {
      data() {
	  		return {
            visibleColumns: [ 'name', 'drop', 'price', 'bids'],
 				columns: [
        			{ name: 'id',                                     field: 'id' },
				 	{ name: 'name',  label: 'Name',  align: 'left',   field: 'name', sortable: true },
				 	{ name: 'drop',  label: 'Drop',  align: 'center',                sortable: true },
				 	{ name: 'price', label: 'Start/Final Price', align: 'right',     sortable: true },
					{ name: 'bids',  label: 'Bids',  align: 'center',                sortable: true },
            ],
            selectedRows: [],
            pagination: { rowsPerPage: 20 },
         }
		},
		computed: {
         ...mapGetters('drop', ['getDropIdToNameDropMap']), // only called once even though in table row iteration
         ...mapGetters('item', ['getActiveBidItems']),
         showCloseButton() { return this.selectedRows.length > 0 },
      },
		methods: {
         ...mapActions('item', ['updateItems']),
         priceText(row) { 
            let text = dollars(row.startPrice) 
            if (row.buyPrice && (row.buyPrice != row.startPrice)) { text += ("/" + dollars(row.buyPrice))}
            return text 
         },
         rowClicked (evt, row) { syncRows(row, this.selectedRows) },
		   closeItems() { 
            console.log("closeItems", this.selectedRows)
            const itemUpdates = []
            for (let row of this.selectedRows) { 
              itemUpdates.push({ id: row.id, status: ItemStatus.CLOSED })
            }
            this.updateItems(itemUpdates) 
         },
		},
   }
</script>