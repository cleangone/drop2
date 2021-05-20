<template>
	<q-card class="form-card">
      <q-card-section>
         <div class="text-h6 heading">Add Multiple Items</div>
         <li v-for="(item, key) in itemsToAdd" :key="key">{{item.primaryImage.baseName}}</li>			
      </q-card-section>
      <q-card-section>
         <q-firebase-uploader path="drops/" multiple @upload="uploadCompleted" /> 
      </q-card-section>
      <q-card-actions align="right">
         <q-btn @click="cancel" label="Cancel" color="grey"/>
         <q-btn @click="save"   label="Save"   color="primary"/>
      </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { CategoryMgr } from 'src/managers/CategoryMgr'
   import { ImageMgr } from 'src/managers/ImageMgr'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr'
   import { StorageMgr } from 'src/managers/StorageMgr'
	import { SaleType, UI } from 'src/utils/Constants'
   
	export default {
      props: ['dropId', 'categoryId'],  // one of the two will be set
      data() {
         return {
			   itemsToAdd: []
         }
      },
      computed: {
         ...mapGetters('category', ['getCategory']),
         category() { return this.categoryId ? CategoryMgr.slim(this.getCategory(this.categoryId)) : null }      
      },
      methods: {
			...mapActions('item', ['setItem']),
			uploadCompleted(emit) {
            const itemName = emit.name.includes(".") ? emit.name.substring(0, emit.name.indexOf(".")) : emit.name
            const item = {
               name: itemName,
               sortName: itemName,
               status: ItemStatus.SETUP,
               saleType: SaleType.DEFAULT,
               primaryImage: { 
                  baseName: emit.name, 
                  isHorizontal: false, 
                  url: emit.url 
               }
            }

            if (this.dropId) {item.dropId = this.dropId}
            if (this.category) {item.category = this.category}
            ImageMgr.setFilePaths(item.primaryImage)

            this.itemsToAdd.push(item)
            this.itemsToAdd.sort((a, b) => (a.primaryImage.baseName > b.primaryImage.baseName) ? 1 : -1) 
         },
         save() {
            for (var item of this.itemsToAdd) { this.setItem(item) }
            this.$emit(UI.CLOSE)
         },
         cancel() {
            StorageMgr.deleteItemsFiles(this.itemsToAdd) 
            this.$emit(UI.CLOSE)
         }
      },
		components: {
         'q-firebase-uploader' : require('components/Imported/QFirebaseUploader.js').default,
		}
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
	.thumbnail {
		max-width: 100px;
		max-height: 100px;
	}
	.form-card .q-img {
		height: 56px;
		width: 56px;
		border-radius: 10px;
	}
	.form-card .q-img__image { background-size: cover !important; }
	.form-card .q-rating__icon { opacity: 0.2; }
	.form-card .q-rating__icon--active { opacity: 1; }
</style>