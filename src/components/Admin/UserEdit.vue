<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">Edit User</div>
    </q-card-section>

    <q-card-section>
    	<div class="row q-mb-sm">
	      <q-input v-model="userToUpdate.firstName" label="First Name" filled class="col"/>
    	</div>
		<div class="row q-mb-sm">
	      <q-input v-model="userToUpdate.lastName" label="Last Name" filled class="col"/>
    	</div>
		<div class="row q-mb-sm">
	      <q-input v-model="userToUpdate.nickname" label="Bidding Nickname" filled class="col"/>
    	</div>
		<div class="row q-mb-sm">
	      <q-checkbox v-model="userToUpdate.email" label="Get Emails" class="col"/>
         <q-checkbox v-model="userToUpdate.isAdmin" label="Admin" class="col"/>
         <q-checkbox v-if="userToUpdate.isAdmin" v-model="userToUpdate.errorEmail" label="Get Error Emails" dense/> 
    	</div>
	</q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancel" color="grey" v-close-popup />
      <q-btn @click="submitUpdate" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	
	export default {
		props: ['user'],
		data() {
			return {
            userToUpdate: {}
			}
		},
		methods: {
			...mapActions('user', ['setUser']),
			submitUpdate() {
            console.log("submitForm")
            if (!this.userToUpdate.isAdmin) { this.userToUpdate.errorEmail = false } 
            this.setUser(this.userToUpdate)
            this.$emit('close')
			}
		},
		mounted() {
         console.log("UserEdit mounted", this.user)
			setTimeout(() => { // user param update propagating as modal being popped up
            this.userToUpdate = Object.assign({}, this.user) 
         }, 100)  
		}
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
	}
	.form-card .q-img {
		height: 56px;
		width: 56px;
		border-radius: 10px;
	}
	.form-card .q-img__image { background-size: cover !important; }
	.form-card .q-rating__icon { opacity: 0.2; }
	.form-card .q-rating__icon--active { opacity: 1; }
</style>