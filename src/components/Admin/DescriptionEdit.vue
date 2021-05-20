<template>
   <div class="text-grey-9 text-caption bg-grey-2 q-pa-sm">
      Description
      <div class="q-mt-xs bg-white">
         <html-edit :container="model" field="description"/>
      </div>

      <div v-if="showExtended" class="q-mt-md">
         Extended Description
         <div class="q-mt-xs bg-white">
            <html-edit :container="model" field="descriptionExtended"/>
         </div>
      </div>
   </div>
</template>

<script>
	export default {
      props: ['container', 'showExtended'],
      computed: {
			model() { 
            if (!this.container.description) { this.container.description = "" }            
            if (this.showExtended && !this.container.descriptionExtended) { this.container.descriptionExtended = "" }            
            return this.container
         }
      },
      components: {
      	'html-edit' : require('components/General/HtmlEdit.vue').default,
	  	},
   }
</script>
