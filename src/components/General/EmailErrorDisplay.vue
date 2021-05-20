<template>
	<q-card class="form-card"  @click="close()">
      <q-card-section class="q-pa-sm">
         <q-input label="To" v-model="error.emailTo" disabled filled />
         <q-input label="Subject" v-model="error.emailSubject" disabled filled />         
         <q-input label="Error" v-model="error.deliveryError" type="textarea" disabled filled />
         <q-input label="Delivery Attempts" v-model="error.deliveryAttempts" disabled filled />
         <div style="height:40px" class="q-mt-sm" >
            <q-btn @click="hideError()" label="Hide Error" class="float-right" color="primary" dense />
         </div>
		</q-card-section>
  </q-card>
</template>

<script>
   import { mapActions } from 'vuex'
	
	export default {
		props: ['error'],
      methods: {
         ...mapActions('error', ['hideEmailError']),
			hideError() {
            this.hideEmailError(this.error.id)
            this.$emit('close')
         },
			close() { this.$emit('close') }
      }   
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>