<template>
   <div class="q-mt-sm">
      <div v-if="this.$q.screen.width < 600">
         <div><toggle :toggleContainer="toggleContainer1" /></div>
         <div class="q-mt-sm"><toggle :toggleContainer="toggleContainer2" /></div>
      </div> 
      <div v-else class="row">
         <toggle :toggleContainer="toggleContainer1" />   
         <toggle :toggleContainer="toggleContainer2" class="q-ml-md"/>
      </div>   
   </div>
</template>

<script>
   export default {
      props: ['toggleContainer1', 'toggleContainer2'],
      components: {
	  		'toggle' : require('./Toggle.vue').default,
      },
   }
</script>
