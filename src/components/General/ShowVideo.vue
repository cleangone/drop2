<template>
	<q-card class="form-card">
    <q-card-section>
      <q-btn icon="close" v-close-popup class="float-right" color="primary" size="sm" flat dense />
      <div class="text-h6 heading">{{ name }}</div>
    </q-card-section>
    <q-card-section>
      <div style="width:475px">
         <q-video :ratio="16/9" :src="video" />
      </div>
	</q-card-section>
  </q-card>
</template>

<script>
	export default {
		props: ['container'],
		data() {
         return {
			   name: "",
            video: "",
			}
		},
      mounted() {
         setTimeout(() => { 
            this.name = this.container.name
            this.video = this.container.video 
         }, 100)  
		}
   }
</script>

<style>
	.form-card { min-width: 500px; }
	.form-card .q-card-section { width: 100%; }
</style>