<template>
   <q-btn-toggle v-model="toggleContainer.model" :options="toggleContainer.options" style="height: 25px" size="sm"
      toggle-color="blue-8" color="grey-2" text-color="blue-9" unelevated no-caps @input="toggled()"/>
</template>

<script>
   import { SessionMgr } from 'src/managers/SessionMgr'
   
   export default {
      props: ['toggleContainer'],
      methods: {
         toggled() { 
            if (this.toggleContainer.sessionKey) { SessionMgr.set(this.toggleContainer.sessionKey, this.toggleContainer.model) }
         }
		},
   }
</script>
