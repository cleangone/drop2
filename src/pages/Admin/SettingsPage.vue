<template>
  <q-page>  
     <div class="text-h6 q-mt-sm q-ml-md">Settings</div>
	  <q-card flat>
			<q-card-section>
				<div class="row q-mb-sm q-gutter-sm">
               <q-input v-model="settingToUpdate.companyName" label="Company Name" filled class="col-4" />
				   <q-input v-model="settingToUpdate.fromEmail" label="From Email Address" filled class="col-4" />
               <q-input v-model="settingToUpdate.siteUrl" label="Site URL" filled class="col" />   
            </div>
            <div class="row q-mb-sm q-gutter-sm">
            	<q-input v-model="settingToUpdate.paypal" label="Paypal Address" filled class="col-4" />
               <q-input v-model="settingToUpdate.twitterId" label="Twitter ID" filled class="col-4" />
               <q-select v-model="settingToUpdate.purchaseReqProcessingType" label="Purchase Req Processing" :options="reqProcessingOptions" filled class="col"/>
            </div>
            <div class="row q-mb-sm q-gutter-sm">
				   <q-input v-model.number="settingToUpdate.bidPeriod" label="Bidding Period (mins)" type="number" filled class="col-3"/>
               <q-input v-model.number="settingToUpdate.bidAdditionalTime" label="Bid Timer (secs)" type="number" filled class="col-3"/>
               <q-input v-model.number="settingToUpdate.initialBidPeriod" label="Initial Bid Period (mins)" type="number" filled class="col-3"/>
               <q-input v-model.number="settingToUpdate.initialBidAdditionalTime" label="Initial Bid Timer (secs)" type="number" filled class="col"/>
            </div>
            <div class="row q-mb-sm q-gutter-sm">
				   <q-input v-model="settingToUpdate.invoiceNote" label="Invoice Note" filled class="col" />
            </div>
            <email-settings-edit :emailSetting="emailPurchaseSuccess" />
            <email-settings-edit :emailSetting="emailPurchaseFail" />
            <email-settings-edit :emailSetting="emailWinningBid" />
         </q-card-section>
			<q-card-actions class="q-ml-md">
				<q-btn @click="reset" label="Reset" color="grey" />
				<q-btn @click="submitUpdate" label="Save" color="primary" />
			</q-card-actions>
  		</q-card>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { SettingsMgr, PurchaseReqProcessingType } from 'src/managers/SettingsMgr'

	export default {
		data() {
	  		return {
            settingToUpdate: {},
            emailPurchaseSuccess: {},
            emailPurchaseFail: {},
            emailWinningBid: {},
            reqProcessingOptions: [ PurchaseReqProcessingType.AUTOMATIC, PurchaseReqProcessingType.MANUAL ], 
         }
		},
		computed: {
         ...mapGetters('setting', ['getSetting']),
		},
		methods: {
			...mapActions('setting', ['setSetting']),
         reset() { 
            this.settingToUpdate = Object.assign({}, this.getSetting) 
            this.emailPurchaseSuccess = SettingsMgr.getPurchaseSuccessEmailSetting(this.settingToUpdate, "Successful Purchase Request")
            this.emailPurchaseFail    = SettingsMgr.getPurchaseFailEmailSetting(this.settingToUpdate, "Failed Purchase Request")
            this.emailWinningBid      = SettingsMgr.getWinningBidEmailSetting(this.settingToUpdate, "Winning Bid")
         },
         submitUpdate() { 
            SettingsMgr.setEmailSettings(this.settingToUpdate, this.emailPurchaseSuccess)
            SettingsMgr.setEmailSettings(this.settingToUpdate, this.emailPurchaseFail)
            SettingsMgr.setEmailSettings(this.settingToUpdate, this.emailWinningBid)
            this.setSetting(this.settingToUpdate)
         },
      },
      components: {
			'email-settings-edit' : require('components/Admin/EmailSettingsEdit.vue').default,
      },
		created() { 
         this.reset() 
      }
   }

</script>