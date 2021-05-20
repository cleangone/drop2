<template>
	<q-card class="form-card">
      <q-card-section>
         <div class="text-h6 heading">Add Images</div>
         <li v-for="(image, key) in imagesToAdd" :key="key">{{image.baseName}}</li>			
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
	import { ImageMgr } from 'src/managers/ImageMgr'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { StorageMgr } from 'src/managers/StorageMgr'
	import { UI } from 'src/utils/Constants'
   
	export default {
      props: ['itemId', 'currImages'],
      data() {
         return {
			   imagesToAdd: []
         }
      },
		methods: {
			...mapActions('item', ['updateItem']),
			uploadCompleted(emit) {
            const sortName = emit.name.includes(".") ? emit.name.substring(0, emit.name.indexOf(".")) : emit.name
            const image = {
               baseName: emit.name, 
               sortName: sortName, 
               isHorizontal: false, 
               url: emit.url 
            }
            ImageMgr.setFilePaths(image)

            this.imagesToAdd.push(image)
            this.imagesToAdd.sort((a, b) => (a.baseName > b.baseName) ? 1 : -1) 
         },
         save() {
            if (this.imagesToAdd.length) {
               const images = this.currImages.concat(this.imagesToAdd)
               this.updateItem({ id: this.itemId, images: images }) 
            }
            this.$emit(UI.CLOSE)
         },
         cancel() {
            this.imagesToAdd.forEach(image => {
               StorageMgr.deleteImageFiles(image)
            })
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