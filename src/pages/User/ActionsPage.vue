<template>
  <q-page>  
      <div class="q-pt-md q-pl-md text-h5">History</div>
      <div class="q-pl-md q-mt-none">
         <q-checkbox v-model="showOnlyWins" label="Show only Wins/Purchases"  class="text-grey-10" color="grey-10" dense/>
      </div>
	   <div class="q-px-sm q-mt-none absolute full-width full-height">
			<q-table :data="displayActions" :columns="columns" :visible-columns="visibleColumns" 
            row-key="id" :filter="tableDataFilter" :pagination.sync="pagination"
				no-data-label="No Bids or Purchases" 
            no-results-label="No Bids or Purchases matching Search criteria"
				:dense="$q.screen.lt.md" class="q-mb-sm" flat>
				<template v-slot:top-right>
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
            </template>
            <q-td slot="body-cell-name" slot-scope="props" :props="props"> 
               <a :href="'#/item/' + props.row.itemId">{{ props.value }}</a>
	         </q-td> 
            <q-td slot="body-cell-amount" slot-scope="props" :props="props"> 
               {{ props.value }} {{ maxAmount(props.row) }}
	         </q-td> 
            <q-td slot="body-cell-bids" slot-scope="props" :props="props"> 
               <a v-if="bids(props.row.itemId)" :href="'#/bids/' + props.row.itemId">{{ bids(props.row.itemId) }}</a>
	         </q-td>
			</q-table>
		</div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ActionMgr } from 'src/managers/ActionMgr.js'
   import { dollars } from 'src/utils/Utils'
   import { format_MMM_DD_optYYYY_h_mm_ss } from 'src/utils/DateUtils'

	export default {
		data() {
	  		return {
            showOnlyWins: false,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'amount', 'result', 'bids', 'date'],
 				columns: [
               { name: 'name',   label: 'Item',   align: 'left',   field: 'itemName',     sortable: true },
				 	{ name: 'amount', label: 'Amount', align: 'center',  field: 'amount',       sortable: true, format: val => dollars(val) },
					{ name: 'result', label: 'Result', align: 'center', field: 'actionResult', sortable: true },
				 	{ name: 'bids',   label: 'Bids',   align: 'center' },
				 	{ name: 'date',   label: 'Date',   align: 'center', field: 'createdDate',  sortable: true, format: val => format_MMM_DD_optYYYY_h_mm_ss(val) }
            ],
            pagination: { rowsPerPage: 20 },
         }
      },
		computed: {
			...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['actionsExist', 'getUserActions']),
         ...mapGetters('item', ['getItems']),			
         userActions() { return this.getUserActions(this.userId) },
         itemIds() { 
            let itemIds = new Set()
            this.userActions.forEach(action => { itemIds.add(action.itemId) })
            return Array.from(itemIds)
         },
         items() { return this.getItems(this.itemIds) },
         itemActions() { 
            let itemIds = new Set()
            let actions = []
            this.userActions.forEach(action => { 
               if (!itemIds.has(action.itemId)) {
                  itemIds.add(action.itemId)
                  actions.push(action)
               }
            })
            return actions
         },
         displayActions() { 
            let displayActions = []
            this.itemActions.forEach(action => { 
               if (!this.showOnlyWins || ActionMgr.isWinningBid(action) || ActionMgr.isPurchased(action)) { 
                  displayActions.push(Object.assign({}, action)) }
            })
            return displayActions
         },
      },
      methods: {
         ...mapActions('action', ['bindActions']),
         bids(itemId) {
            for (var item of this.items) {
               if (item.id == itemId) { return item.numberOfBids ? item.numberOfBids : 0 }
            }
            return 0
         },
         log(val) { 
            console.log(val) 
         },
         maxAmount(action) { 
            return (ActionMgr.isWinningBid(action) && (action.maxAmount != action.amount) ?  "(" + dollars(action.maxAmount)  + " max)": "") 
         }
      },
      created() {
         if (!this.actionsExist) { this.bindActions() }
      }
	}
</script>