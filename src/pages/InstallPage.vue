<template>
   <q-page class="q-pa-md">
		<div class="text-h5">Install</div>
      <div class="q-pt-md">Install Status: {{ getInstallStatus }}</div>
      <div v-if="installStatusExists"><q-btn label="Reset" @click="resetInstallStatus()" color="primary" /></div>
      <div style="height: 25px"/>
      <div style="width: 400px">
         <install-app-banner/>
      </div>
   </q-page>
</template> 

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { LocalStorageMgr } from 'src/managers/storage/LocalStorageMgr'

	export default {
      computed: {
         ...mapGetters('install', ['installStatusExists', 'getInstallStatus', 'getDeferredPrompt']),
      },
      methods: {
         ...mapActions('install', ['setInstallStatus']),
         resetInstallStatus() { this.setInstallStatus(LocalStorageMgr.setAppInstall("")) },
      },
      mounted() {
         console.log("InstallPage: deferredPrompt", this.getDeferredPrompt)
         console.log("InstallPage: installStatus", this.getInstallStatus)         
      },
      components: {
         'install-app-banner' : require('components/General/InstallAppBanner.vue').default
      },
	}
</script>

