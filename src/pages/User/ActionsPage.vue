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
               <a v-if="props.row.itemId" :href="'#/item/' + props.row.itemId">{{ props.value }}</a>
	            <a v-else-if="props.row.invoiceId" :href="'#/invoice/' + props.row.invoiceId">{{ props.value }}</a>
	            <span v-else>{{ props.value }}</span>
	         </q-td> 
            <q-td slot="body-cell-amount" slot-scope="props" :props="props"> 
               {{ props.value }} {{ maxAmount(props.row) }}
	         </q-td> 
			</q-table>
		</div>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { ActionMgr } from 'src/managers/ActionMgr'
   import { dollars } from 'src/utils/Utils'
   import { format_MMM_DD_optYYYY_h_mm_ss } from 'src/utils/DateUtils'

	export default {
		data() {
	  		return {
            showOnlyWins: false,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'amount', 'result', 'date'],
 				columns: [
               { name: 'name',   label: 'Name',   align: 'left',   field: 'tempName',     sortable: true },
				 	{ name: 'amount', label: 'Amount', align: 'center', field: 'amount',       sortable: true, format: val => dollars(val) },
					{ name: 'result', label: 'Result', align: 'center', field: 'actionResult', sortable: true },
				 	{ name: 'date',   label: 'Date',   align: 'center', field: 'createdDate',  sortable: true, format: val => format_MMM_DD_optYYYY_h_mm_ss(val) }
            ],
            pagination: { rowsPerPage: 20 },
         }
      },
		computed: {
			...mapGetters('auth', ['userId']),
         ...mapGetters('action', ['getUserActions']),
         userActions() { 
            const actions = this.getUserActions(this.userId) 
            actions.sort((a, b) => (a.createdDate > b.createdDate) ? -1 : 1)
         
            let ids = new Set()
            let tempActions = []
            actions.forEach(action => { 
               const refId = action.itemId ? action.itemId : action.invoiceId 
               if (!ids.has(refId)) {
                  ids.add(refId)
                  const tempAction = Object.assign({}, action) 
                  tempAction.tempName = tempAction.itemName ? tempAction.itemName : tempAction.invoiceName 
                  tempActions.push(tempAction)
               }
            })
            return tempActions
         },
         displayActions() { 
            let displayActions = []
            this.userActions.forEach(action => { 
               if (!this.showOnlyWins || ActionMgr.isWinningBid(action) || ActionMgr.isPurchased(action)) { 
                  displayActions.push(Object.assign({}, action)) }
            })
            return displayActions
         },
      },
      methods: {
         maxAmount(action) { 
            return (ActionMgr.isWinningBid(action) && (action.maxAmount != action.amount) ?  "(" + dollars(action.maxAmount)  + " max)": "") 
         }
      },
	}
</script>