<template>
  <q-page class="q-pa-md">  
     <div class="text-h5 q-mb-lg">Verify Email</div>
        <div v-if="isVerified">Email has been Verified</div>
  	     <div v-else>Cannot verify email</div>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { ActionMgr, ActionType } from 'src/managers/ActionMgr'
   import { UserMgr } from 'src/managers/UserMgr'
   
	export default {
		data() {
	  		return {
            userId: "",
            token: "",
         }
		},
		computed: {
			...mapGetters('user', ['getUserEmailSkeleton']),
         user() { return this.getUserEmailSkeleton(this.userId)},
         isVerified() {
            console.log("isVerified")
            if (!this.user) { return false }
            const email = UserMgr.getEmail(this.user)
            if (this.user.verifiedEmail == email) { return true }
            
            if (this.user.emailVerificationTokens) {
               for (var verificationToken of this.user.emailVerificationTokens) {
                  if (verificationToken.verifyToken == this.token && verificationToken.email == email) { 
                     const action = ActionMgr.init(
                        { userId: this.user.id, token: verificationToken.confirmToken }, 
                        ActionType.CONFIRM_EMAIL)
                     this.createAction(action)
                     return true
                  }
               }
            }
            return false
         }  
		},
		methods: {
			...mapActions('action', ['createAction']),
      },
      created() {
         this.userId = this.$route.params.userId   
         this.token = this.$route.params.token   
      },
	}
</script>