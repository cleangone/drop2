<template>
   <q-expansion-item :label="'Email: ' + emailSetting.label" switch-toggle-side >
      <div class="row q-mb-sm q-gutter-md">  
         <span class="col-1" />
         <div  class="col-10 q-gutter-md" >
            <q-input v-model="emailSetting.subject" label="Email Subject" filled/>
            <div class="text-grey-9 text-caption bg-grey-2 q-pa-sm">
               Email Body
               <div class="q-mt-xs bg-white">
                  <q-editor v-model="emailSetting.body" min-height="5rem" />
               </div>
            </div>
         </div>
      </div>
   </q-expansion-item>
  
</template>

<script>
	export default {
		props: ['emailSetting'],
	}
</script>
