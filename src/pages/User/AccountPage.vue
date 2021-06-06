<template>
  <q-page padding>  
	  <q-card :style="'width:' + infoWidth" class="form-card flat">
			<q-card-section>
            <div class="row" :class="blue">
               <div class="col q-gutter-sm" :class="green">
                  <div>
                     <span class="text-grey-9 text-caption">Email: </span>
                     <span> {{ email }} </span>
                     <!-- <span v-if="emailVerified" class="text-primary"> (Verified) </span>
                     <span v-if="(userEmail != null) && !emailVerified" class="text-primary"> 
                        <q-btn @click="verifyEmail" label="Verify" color="primary"  size="sm" dense/> 
                     </span> -->
                     <q-btn @click="showEditEmailModal=true" icon="edit" color="primary" size="xs" flat dense>
                        <q-tooltip content-class="bg-black" :offset="[5, 5]">Edit Email</q-tooltip>                        
                     </q-btn> 
                     <q-icon v-if="emailVerified" name="verified_user" color="blue">
                        <q-tooltip content-class="bg-black" :offset="[5, 5]">Email Verified</q-tooltip>                        
                     </q-icon>
                     <q-btn v-else @click="showVerifyEmailModal=true" icon="verified_user" color="primary" size="xs" flat dense>
                        <q-tooltip content-class="bg-black" :offset="[5, 5]">Verify Email</q-tooltip>                        
                     </q-btn> 
                  </div>
                  <div class="row">
                     <q-input v-model="userToUpdate.firstName" label="First Name" class="col-5" filled />
                     <q-input v-model="userToUpdate.lastName"  label="Last Name"  class="col q-ml-sm"  filled />
                  </div>
                  <div class="row">
                     <q-input v-model="userToUpdate.nickname" label="Bidding Nickname" class="col-5" filled />
                     <q-input v-model="updatedPhone" label="Phone" mask="(###) ### - ####" fill-mask class="col-4 q-ml-sm" filled/>
                     <q-checkbox v-model="userToUpdate.acceptTexts" label="Accept Texts" class="col q-ml-sm" color="grey-7" dense />
                  </div>  
                  <div class="row">
                     <q-checkbox v-model="userToUpdate.usePayPalAddress" label="Use PayPal Shipping Address" dense class="col" />
                  </div>                
                  <div v-if="!userToUpdate.usePayPalAddress" class="row">
                     <q-input v-model="userToUpdate.address" label="Address" class="col-5" filled/>
                     <q-input v-model="userToUpdate.city"    label="City"  class="col q-ml-sm" filled />
                  </div>                
                  <div v-if="!userToUpdate.usePayPalAddress" class="row">
                     <q-input v-model="userToUpdate.state" label="State" class="col-3" filled />
                     <q-input v-model="userToUpdate.zip"   label="Zip"   class="col-4 q-ml-sm" filled />
                     <q-input v-model="userToUpdate.country" label="Country (if not USA)" class="col q-ml-sm" filled />
                  </div>
               </div>
               <!-- <div class="col" :class="orange"/> -->
            </div>
			</q-card-section>
		
			<q-card-actions v-if="updatesMade">
				<q-btn @click="reset" label="Reset" color="grey" />
				<q-btn @click="submitUpdate" label="Save" color="primary" />
			</q-card-actions>
  		</q-card>
      <div class="row self-center q-mt-md q-gutter-sm" style="width: 30em">    
         <q-btn @click="updatePassword" label="Update Password" color="primary"/>
      </div>
      <q-dialog v-model="showEditEmailModal">
			<edit-email @emailUpdated="emailUpdated" />
		</q-dialog> 
      <q-dialog v-model="showVerifyEmailModal">
			<verify-email @close="showVerifyEmailModal=false"/>
		</q-dialog> 
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { UserMgr } from 'src/managers/UserMgr'
   import { Notify } from 'quasar'
   import { Colors } from 'src/utils/Constants'
   import { formatPhone, unformatPhone } from 'src/utils/Utils'

	export default {
		data() {
	  		return {
            userToUpdate: {},
            email: '',
            phone: '',
            updatedPhone: '',
            showEditEmailModal: false,
            showVerifyEmailModal: false,
            comparisonFields: [
               'firstName', 'lastName', 'nickname', 'acceptTexts', 'usePayPalAddress', 'address', 'city', 'state', 'zip', 'country']
			}
		},
		computed: {
			...mapGetters('auth', ['userId', 'currentUser']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         ...mapGetters('color', Colors),
			user() { return this.getUser(this.userId)},
         emailVerified() { return UserMgr.emailVerified(this.user) },
         infoWidth() { return this.$q.screen.width > 600 ? "600px" : "100%"},
         updatesMade() { 
            for (var field of this.comparisonFields) {
               if (this.user[field] != this.userToUpdate[field]) { return true}
            }

            return (this.phone != this.updatedPhone)
         },
		},
		methods: {
			...mapActions('auth', ['sendPasswordResetEmail', 'sendEmailVerification', 'reload']),
			...mapActions('user', ['setUser']),
         reset() { 
            console.log("AccountPage.reset")
            this.userToUpdate = Object.assign({}, this.user) 
            if (this.userToUpdate.usePayPalAddress == null) { this.userToUpdate.usePayPalAddress = false }
            this.email = this.currentUser.email
            this.phone = formatPhone(this.user.phone)
            this.updatedPhone = formatPhone(this.user.phone)
         },
         submitUpdate() {
            this.userToUpdate.phone = unformatPhone(this.updatedPhone)
            this.setUser(this.userToUpdate) 
            this.phone = this.updatedPhone
         },
         verifyEmail() {

         },
         async updatePassword() { 
            try {
               // todo - the user stays logged in even when the password changes - fix?
               await this.sendPasswordResetEmail(this.userEmail)
               notifyPositive('Password reset email was sent')
            } 
            catch (err) { notifyNegative(`There was an error: ${err}`) }
         },  
         emailUpdated() {
            this.reload()
            this.email = this.currentUser.email
            this.showEditEmailModal=false
         },
      },
      components: {
         'edit-email'   : require('components/User/EditEmail.vue').default,
         'verify-email' : require('components/User/VerifyEmail.vue').default,
      },
		mounted() { this.reset() }
	}

   function notifyPositive(msg) { Notify.create( {type: "positive", message: msg} )}
   function notifyNegative(msg) { Notify.create( {type: "negative", message: msg} )}

</script>