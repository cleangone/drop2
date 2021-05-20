<template>
	<q-card class="form-card">
    <q-card-section class="q-py-xs" :class="yellow">
      <div class="text-h6 heading" :class="blue">Quick Edit</div>
    </q-card-section>
    <q-card-section class="q-pl-none q-pr-sm q-py-sm q-gutter-sm" :class="red">
      <div class="row q-mb-xs q-gutter-sm" :class="green">
         <div class="col q-gutter-sm" :class="orange">
            <q-input v-model="item.name"              label="Name"                         filled class="col" />  
            <q-input v-model="item.sortName"          label="Sort Name"                    filled class="col" />
            <q-input v-model.number="item.startPrice" label="Price" type=number prefix="$" filled class="col" />
         </div>
         <q-img :src="item.primaryImage.thumbUrl ? item.primaryImage.thumbUrl : 'statics/image-placeholder.png'" 
            style="height: 200px; width: 200px" class="col q-ml-lg" :class="purple" contain />
      </div> 
   </q-card-section>
   <q-card-actions align="right">
      <q-btn @click="close"    label="Cancel"    color="grey" />
      <q-btn @click="nextItem" label="Skip Item" color="grey" />
      <q-btn @click="saveItem" label="Save Item" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr'
   import { UI, Colors } from 'src/utils/Constants'
   
   export default {
      props: ['items'],
		data() {
			return {
            test: { description: "testing" },
            itemsToUpdate: [{ name: "", startPrice: 0, primaryImage: {} }], 
            currItemIndex: 0,
			}
      },
      computed: {
         ...mapGetters('color', Colors),
         item() { return this.itemsToUpdate[this.currItemIndex] },
      },
      methods: {
			...mapActions('item', ['updateItem']),
			saveItem() {
            this.updateItem(this.item)
            this.nextItem()
         },
         nextItem() {    
            if (this.currItemIndex == this.items.length - 1) { this.close() }
            else { this.currItemIndex++ }
         },
		   close() { this.$emit(UI.CLOSE) },
      },
      mounted() {
         setTimeout(() => { this.itemsToUpdate = Object.assign({}, this.items) }, 100) 
      } 
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>