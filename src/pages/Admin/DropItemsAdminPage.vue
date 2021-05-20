<template>
  <q-page>
      <div class="q-pt-sm q-px-sm text-h6 heading" :class="blue">
         Drop: {{ drop.name }}  
         <q-btn icon="edit" @click="showEditDropModal=true" size="sm" flat dense color="primary" />
      </div>
		<items-admin :dropId="dropId" :items="items" :heading="heading" class="full-width full-height" :class="orange"/>
      <q-dialog v-model="showEditDropModal">
         <drop-add-edit :type="edit" :drop="drop" @close="showEditDropModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { mapGetters } from 'vuex'
   import { DropMgr } from 'src/managers/DropMgr'
   import { UI, Colors } from 'src/utils/Constants'
   import { formatDateTimeOptYear } from 'src/utils/DateUtils'

	export default {
		data() {
	  		return {
            dropId: '',	
            showEditDropModal: false,
			}
		},
		computed: {
         ...mapGetters('drop', ['getDrop']),
         ...mapGetters('item', ['getItemsInDrop']),
         ...mapGetters('color', Colors),
 			drop() { return this.getDrop(this.dropId) },
         heading() { 
            return this.drop.status + 
               (DropMgr.isSetup(this.drop) || DropMgr.isScheduled(this.drop) ? ", " + formatDateTimeOptYear(this.drop.startDate) : "") + 
               ", Default Sale Type: " + this.drop.defaultSaleType 
         },         
         items() { return this.getItemsInDrop(this.dropId) },
         edit() { return UI.EDIT }
		},
		components: {
         'drop-add-edit' : require('components/Drop/DropAddEdit.vue').default,
         'items-admin' : require('components/Admin/ItemsAdmin.vue').default,
      },
      created() {
			this.dropId = this.$route.params.id
      },
   }

</script>