<template>
	<q-card class="form-card">
   <q-card-section>
      <div class="text-h6 heading">Sort Create Dates</div>
   </q-card-section>
   <q-card-actions align="right">
      <q-btn @click="cancel" label="Cancel" color="grey" />
      <q-btn @click="save"   label="Save"   color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
   import { mapActions } from 'vuex'
   import { UI } from 'src/utils/Constants'
	
	export default {
      props: ['items'],
		data() {
			return {
         }
      },
      computed: {
      },
      methods: {
         ...mapActions('item', ['updateItems']),
			save() {
            let lastCreatedDate = 0
            this.items.forEach(item => {
               if (item.createdDate > lastCreatedDate) { lastCreatedDate = item.createdDate }
            })

            // set so sortedCreateDate descending same as sortName ascending
            const itemUpdates = []
            this.items.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1)
            this.items.forEach(item => {
               itemUpdates.push({ id: item.id, sortedCreateDate: lastCreatedDate-- })
            })

            this.updateItems(itemUpdates)
            this.$emit(UI.CLOSE)
         },
         cancel() { this.$emit(UI.CLOSE) }
		},
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>