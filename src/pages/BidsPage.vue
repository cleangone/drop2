<template>
  <q-page>
      <div class="q-pt-md q-pl-md text-h6">{{ item.name }}</div>
		<div class="row">
         <div class="q-pa-sm" :class="'width: ' + itemDivWidth">
            <item :item="item" :displayType="displayType" class="q-pa-sm col-2"/>
         </div>
         <div class="q-pa-sm col">
         <!-- todo - long table scrolls off bottom -->
            <q-table :data="bids"  :columns="columns" :visible-columns="visibleColumns" row-key="name" 
               :filter="tableDataFilter" :pagination.sync="pagination" :hide-pagination="hidePagination"
               :dense="$q.screen.lt.md" class="q-mb-sm" flat>
               <q-td slot="body-cell-fullName" slot-scope="props" :props="props">
    				   {{ userFullName(props.row.userId) }}
  				   </q-td>
               <q-td slot="body-cell-email" slot-scope="props" :props="props">
    				   {{ userEmail(props.row.userId) }}
  				   </q-td>
            </q-table>
         </div>
      </div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr'
   import { ItemDisplayType } from 'src/utils/Constants'
   import { dollars } from 'src/utils/Utils'

	export default {
		data() {
	  		return {
				itemId: '',
				tableDataFilter: '',
				columns: [ 
    				{ name: 'name',   label: 'Bidder', align: 'left',   field: 'userNickname', sortable: true },
               { name: 'fullName', label: 'Full Name', align: 'left',               sortable: true },
				 	{ name: 'email',  label: 'Email',  align: 'left',                    sortable: true },
				 	{ name: 'amount', label: 'Amount', align: 'right',  field: 'amount', sortable: true, format: val => dollars(val) },
					{ name: 'date',   label: 'Date',   align: 'center', field: 'date',   sortable: true, format: val => date.formatDate(val, 'MMM D, h:mm:ss a') }
				],
            pagination: { rowsPerPage: 25 },
            hidePagination: true
         }
		},
		computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('user', ['isAdmin', 'getUsers']),
			...mapGetters('item', ['getItem']),
         item() { return this.getItem(this.itemId) },
         userIdToInfo() { return UserMgr.getUserIdToInfo(this.getUsers) },
         visibleColumns() { return ['name'].concat(this.adminColumns).concat(['amount', 'result', 'date']) },
         adminColumns() { return this.isAdmin(this.userId) ? ['fullName', 'email'] : [] },
         imageW() { return "width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth) },	
         itemDivWidth() { return this.item.isHorizontal ? 200 : 350 },
         displayType() { return ItemDisplayType.BID },
         bids() { 
            const bids = []
            let currBidder = 1
            const userIdToNickname = new Map()
            if (this.item.prevBids) {
               this.item.prevBids.forEach(bid => { 
                  if (!userIdToNickname.has(bid.userId)) {
                     userIdToNickname.set(bid.userId,
                        (bid.userNickname && bid.userNickname.length ? bid.userNickname : "Bidder " + (currBidder++)))
                  }

                  const prevBid = Object.assign({}, bid)
                  prevBid.nickname = userIdToNickname.get(bid.userId)
                  bids.unshift(Object.assign({}, prevBid))
               })
            }

            const highBid = Object.assign({}, this.item.currBid)
            if (!userIdToNickname.has(highBid.userId)) {
               userIdToNickname.set(highBid.userId,
                  (highBid.userNickname && highBid.userNickname.length ? highBid.userNickname : "Bidder " + (currBidder++)))
            }

            highBid.nickname = userIdToNickname.get(highBid.userId)
            highBid.amount = this.item.buyPrice
            bids.unshift(highBid)

            this.hidePagination = (bids.length <25)
            return bids
			}
      },
      methods: {
         userFullName(userId) { return this.userIdToInfo.get(userId).fullName },
         userEmail(userId) { return this.userIdToInfo.get(userId).email },
      },
      components: {
	  	   'item' : require('components/Item/Item.vue').default,
	  	},
      created() { this.itemId = this.$route.params.itemId }
   }
</script>