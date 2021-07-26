<template>
  <q-page>
      <div class="q-pt-md q-pl-md text-h6">
         Purchase Requests - {{ item.name }}
         <q-btn v-if="canHoldItem" @click="holdItem()" label="Hold" size="sm" color="primary" dense/>   
      </div>
		<div class="row">
         <div class="q-pa-sm" :class="'width: ' + itemDivWidth">
            <item :item="item" :displayType="displayType" class="q-pa-sm col-2"/>
         </div>        
         <div class="q-pa-sm col">
            <q-table :data="reqs" :columns="columns" :visible-columns="visibleColumns" row-key="name" 
               :filter="tableDataFilter" :pagination.sync="pagination" :hide-pagination="hidePagination"
               :dense="$q.screen.lt.md" class="q-mb-sm" flat>
               <q-td slot="body-cell-name" slot-scope="props" :props="props">
    				   {{ userFullName(props.row.userId) }}
  				   </q-td>
               <q-td slot="body-cell-email" slot-scope="props" :props="props">
    				   {{ userEmail(props.row.userId) }}
  				   </q-td>
               <q-td slot="body-cell-status" slot-scope="props" :props="props"> 
                  <q-btn v-if="canAcceptRequest" @click="acceptReq(props.row)" label="Accept" size="sm" color="primary" dense/>   
                  <span v-else-if="requestedIsAccepted(props.row.actionId)">Accepted</span>   
                  <span v-else-if="acceptedRequestId == props.row.actionId">Accepting</span>   
               </q-td>
            </q-table>
            <div style="height: 75px"/>
         </div>
      </div>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr'
   import { ItemDisplayType } from 'src/utils/Constants.js'
   
	export default {
		data() {
	  		return {
				itemId: '',
            returnRoute: null,
            acceptedRequestId: null,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'email', 'date', 'status'],
 				columns: [ 
    				{ name: 'name',  label: 'Requester', align: 'left',                  sortable: true },
				 	{ name: 'email', label: 'Email',     align: 'left',                  sortable: true },
				 	{ name: 'date',  label: 'Date',      align: 'center', field: 'date', sortable: true, format: val => date.formatDate(val, 'MMM D, h:mm:ss.SSS a') },
               { name: 'status' }
				],
            pagination: { rowsPerPage: 25 },
            hidePagination: true,
         }
		},
		computed: {
			...mapGetters('item', ['getItem']),
         ...mapGetters('user', ['getUsers']),
         item() { return this.getItem(this.itemId) },
         canHoldItem() { return ItemMgr.isAvailable(this.item) || ItemMgr.isRequested(this.item) },
         canAcceptRequest() {        
            const requested = ItemMgr.isRequested(this.item)
            
            // return to calling page if an accept was submitted, and an item is no longer requested
            if (!requested && this.returnRoute && this.acceptedRequestId) { 
               this.$router.push({ name: this.returnRoute })
            }

            // can accept req if item is requested or on hold w/o an accepted request, and a req not already accepted
            const onHoldWithNoAcceptedReq = ItemMgr.isHold(this.item) && !this.item.acceptedPurchaseReqId
            return (requested || onHoldWithNoAcceptedReq) && (this.acceptedRequestId == null) 
         },
         imageW() { return "width: " + (this.item.isHorizontal ? this.hImageWidth : this.vImageWidth) },	
         itemDivWidth() { return this.item.isHorizontal ? 200 : 350 },
         displayType() { return ItemDisplayType.MINI },
         reqs() { 
            this.hidePagination = (this.item.numberOfPurchaseReqs < 25)
            return this.item.purchaseReqs
			},
         userIdToInfo() { return UserMgr.getUserIdToInfo(this.getUsers) },
      },
      methods: {
         ...mapActions('action', ['acceptPurchaseRequest']),
         ...mapActions('item', ['updateItem']),
         requestedIsAccepted(actionId) { 
            if (this.item.acceptedPurchaseReqId != actionId ) { return false }
            this.acceptedRequestId = null
            return true
         },
         userFullName(userId) { return this.userIdToInfo.get(userId).fullName },
         userEmail(userId) { 
            const user = this.userIdToInfo.get(userId)
            return user ? user.email : ""
         },
         holdItem() { this.updateItem({ id: this.itemId, status: ItemStatus.HOLD }) }, 
         acceptReq(purchaseReq) { 
            this.acceptedRequestId = purchaseReq.actionId
            this.acceptPurchaseRequest( {
               itemId: this.item.id, itemName: this.item.name, amount: purchaseReq.amount, refActionId: purchaseReq.actionId, 
               userId: purchaseReq.userId, userNickname: purchaseReq.userNickname 
            }) 
         },
      },
      components: {
	  	   'item' : require('components/Item/Item.vue').default,
	  	},
      created() { 
         this.itemId = this.$route.params.itemId 
         if (this.$route.params.route) { this.returnRoute = this.$route.params.route }
      }
   }
</script>