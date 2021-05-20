<template>
	<q-card class="form-card">
      <q-card-section>    
         <div class="text-h6">Bid: {{ item.name }}</div>
      </q-card-section>
      <q-card-section>    	
            <q-btn @click="quickBid()" :label="'Quick Bid ' + quickBidDisp" class="full-width" color="primary"/>
            <div class="text-center q-my-md" :class="blue">or</div>
            <div class="row q-gutter-sm">
               <div class="col-2"/>
               <q-input v-model.number="bidAmount" label="Bid Amount" type=number prefix="$" filled class="q-ml-lg col-4" />
               <q-btn @click="promptToBid()" label="Bid" color="primary" class="q-mr-lg col-2"/>
               <div class="col-2"/>
            </div>
      </q-card-section>

      <q-card-actions align="right">
         <q-btn label="Cancel" @click="close()" color="grey" />
      </q-card-actions>
   </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr'
   import { dollars } from 'src/utils/Utils'
   import { Colors } from 'src/utils/Constants'
   
	export default {
      props: ['msg', 'item'],
		data() {
			return {
            bidAmount: 0
			}
      },
      computed: {
         ...mapGetters('auth', ['userId']),
         ...mapGetters('user', ['getUser']),
         ...mapGetters('color', Colors),
         actionTitle() { return this.title ? this.title : "Bid" },
         user() { return this.getUser(this.userId)},
         quickBidAmount() { return this.item.buyPrice ? this.item.buyPrice + 25 : this.item.startPrice },
         quickBidDisp() { return dollars(this.quickBidAmount) },
      },
		methods: {
         ...mapActions('action', ['submitBid']),
         ...mapActions('current', ['setCurrentActivity']),
         quickBid() { this.submitItemBid(this.quickBidAmount) },
         promptToBid() {
            // console.log("promptToBid")
            // todo - verify that bidAmount not less than quickBidAmount
				this.$q.dialog({title: 'Confirm', message: 'Bid ' + dollars(this.bidAmount) + ' on ' + this.item.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
            })
            .onOk(() => { this.submitItemBid(this.bidAmount) })
			},
			submitItemBid(itemBidAmount) {
            // console.log("submitItemBid", itemBidAmount)
            this.submitBid({ 
               itemId: this.item.id, itemName: this.item.name, amount: itemBidAmount, 
               userId: this.userId, userNickname: UserMgr.getNickname(this.user)  
            }) 
            this.setCurrentActivity(true) 
            this.close()
         },
         close() { this.$emit('close') }
		},
		mounted() {
         // slight delay because param update propagating as modal being popped up
         this.bidAmount = this.quickBidAmount
		}
	}
</script>

<style>
	.form-card { min-width: 250px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>