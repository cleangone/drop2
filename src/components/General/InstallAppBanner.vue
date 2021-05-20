<template>
   <q-banner v-if="canInstallApp" inline-actions class="bg-blue text-white" dense>
      Install Dropzone?
      <template v-slot:action>
         <q-btn label="Install" @click="installApp()" flat />
         <q-btn label="Later"   @click="installLater()" flat/>
         <q-btn label="Never"   @click="neverInstall()" flat />
      </template>
   </q-banner>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { LocalStorageMgr, InstallStatus } from 'src/managers/storage/LocalStorageMgr'
   
   export default {
      props: ['toggleContainer'],
      computed: {
         ...mapGetters('install', ['canInstallApp', 'getDeferredPrompt']),
         deferredPrompt() { return this.getDeferredPrompt },
      },
      methods: {
         ...mapActions('install', ['setInstallStatus']),
         installApp() {
            console.log("Installing app")
            this.deferredPrompt.prompt()
            this.deferredPrompt.userChoice.then((choiceResult) => {
               if (choiceResult.outcome == "accepted") {
                  console.log("App installed")
                  this.setInstallStatus(LocalStorageMgr.setAppInstall(InstallStatus.INSTALLED)) 
               }
            })
         },
         // todo - later should include a date
         installLater() { this.setInstallStatus(LocalStorageMgr.setAppInstall(InstallStatus.LATER)) },
         neverInstall() { this.setInstallStatus(LocalStorageMgr.setAppInstall(InstallStatus.NEVER)) }
      },
   }
</script>
