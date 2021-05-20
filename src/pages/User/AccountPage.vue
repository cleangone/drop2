<template>
  <q-page padding>  
	  <q-card class="form-card flat">
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
                     <q-btn @click="showEditEmailModal=true" icon="edit" color="primary" size="xs" flat dense/> 
                  </div>
                  <div class="row">
                     <q-input v-model="userToUpdate.firstName" label="First Name" class="col-5" filled />
                     <q-input v-model="userToUpdate.lastName"  label="Last Name"  class="col q-ml-sm"  filled />
                  </div>
                  <div class="row">
                     <q-input v-model="userToUpdate.nickname" label="Bidding Nickname"        class="col-5" filled />
                     <q-input v-model="phone" label="Phone" mask="(###) ### - ####" fill-mask class="col-4 q-ml-sm" filled/>
                     <q-checkbox v-model="userToUpdate.acceptTexts" label="Accept Texts"      class="col q-ml-sm" color="grey-7" dense />
                  </div>                  
                  <q-input v-model="userToUpdate.address" label="Address" filled/>
                  <q-input v-model="userToUpdate.city"    label="City" filled />
                  <div class="row">
                     <q-input v-model="userToUpdate.state" label="State" class="col-3" filled />
                     <q-input v-model="userToUpdate.zip"   label="Zip"   class="col-4 q-ml-sm" filled />
                     <q-input v-model="userToUpdate.country" label="Country (if not USA)" class="col q-ml-sm" filled />
                  </div>
                  
               </div>
               <div class="col" :class="orange"/>
            </div>
			</q-card-section>
		
			<q-card-actions>
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
  	</q-page>
</template>

<script>
	// import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { Notify } from 'quasar'
   import { firebaseAuth } from 'boot/firebase'
   import { Colors } from 'src/utils/Constants.js'
   import { formatPhone, unformatPhone } from 'src/utils/Utils'

	export default {
		data() {
	  		return {
            userToUpdate: {},
            email: '',
            phone: '',
            showEditEmailModal: false
			}
		},
		computed: {
			...mapGetters('auth', ['userId', 'currentUser']),
         ...mapGetters('user', ['getUser', 'isAdmin']),
         ...mapGetters('color', Colors),
			user() { return this.getUser(this.userId)},
		},
		methods: {
			...mapActions('auth', ['sendPasswordResetEmail', 'sendEmailVerification', 'reload']),
			...mapActions('user', ['setUser']),
         reset() { 
            console.log("AccountPage.reset")
            this.userToUpdate = Object.assign({}, this.user) 
            this.email = this.currentUser.email
            this.phone = formatPhone(this.currentUser.phone)
         },
         submitUpdate() {
            this.userToUpdate.phone = unformatPhone(this.phone)
            this.setUser(this.userToUpdate) 
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
         'edit-email' : require('components/User/EditEmail.vue').default,
      },
		mounted() { this.reset() }
	}

   function notifyPositive(msg) { Notify.create( {type: "positive", message: msg} )}
   function notifyNegative(msg) { Notify.create( {type: "negative", message: msg} )}

</script>