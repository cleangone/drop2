<template>
	<q-card class="form-card">
         <q-card-section>
            <div class="text-h6 heading">Verify Email</div>
            <div class="row q-mt-md">
               Send an email
               <span class="text-weight-bold q-px-xs"> {{ this.currentUser.email }} </span>
               to to verify the address
            </div>
         </q-card-section>

         <q-card-actions align="right">
            <q-btn label="Cancel" color="grey" v-close-popup />
            <q-btn label="Send" @click="verifyEmail" color="primary" />
         </q-card-actions>
  </q-card>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { ActionMgr, ActionType } from 'src/managers/ActionMgr'
   
	export default {
		data() {
			return {
			}
		},
		computed: {		
         ...mapGetters('auth', ['currentUser']),
    	},
		methods: {
			...mapActions('action', ['createAction']),
         verifyEmail() { 
            const action = ActionMgr.init({ userId: this.currentUser.uid }, ActionType.VERIFY_EMAIL)
            this.createAction(action)
            this.$q.notify({ message: "Verification email sent", color: 'positive' })
            this.$emit('close')
         },
      },
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .q-card-section { width: 100%; }
</style>