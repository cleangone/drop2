<template>
	<q-card class="form-card">
      <q-card-section class="q-pb-none" :class="red">
      <div class="text-h6 heading">{{ isEdit ? "Edit" : "Add" }} Category</div>
      </q-card-section>
      <q-card-section :class="pink">
         <div class="row q-mb-sm q-gutter-sm" :class="indigo">
            <q-input v-model="categoryToSubmit.name" label="Name" class="col" filled />
         </div>
         <div class="row q-mb-sm q-gutter-sm" :class="orange">
            <q-input label="Video" v-model="categoryToSubmit.video" class="col" filled/>
         </div>
         <div class="row q-mb-sm" :class="green">
            <div v-if="!uploaderDisplayed" class="col q-gutter-sm">
               <q-input v-model="categoryToSubmit.shortName" label="Short Name" filled />
               <q-input v-model="categoryToSubmit.sortName"  label="Sort Name"  filled />
               <q-select label="Status" v-model="categoryToSubmit.status" :options="statusOptions" filled />
            </div>
            <div class="col q-gutter-sm" :class="orange">
               <q-img v-if="!uploaderDisplayed" :src="categoryToSubmit.primaryImage.url ? categoryToSubmit.primaryImage.url : 'statics/image-placeholder.png'"
                     style="height: 160px; width: 260px" class="q-ml-sm" contain />
               <q-btn v-if="!uploaderDisplayed" @click="uploaderDisplayed=true" label="Upload Image" class="float-right" color="primary" />
    	      </div>
         </div>
         <div class="row q-mb-sm items-center" :class="blue">
            <div class="col">
               <div v-if="uploaderDisplayed" class="col q-gutter-xs">
                  <q-firebase-uploader path="drops/" @upload="uploadCompleted" style="width: 100%; min-height: 190px"/> 
                  <q-btn @click="uploaderDisplayed=false" icon="clear" class="float-right" color="primary" size="sm" dense />
               </div>
	         </div>
         </div>
         <div class="row q-mb-sm q-gutter-sm" :class="orange">
            <q-input label="Avatar Top Line Name"    v-model="categoryToSubmit.topLineName"    class="col" filled/>
            <q-input label="Avatar Bottom Line Name" v-model="categoryToSubmit.bottomLineName" class="col" filled/>
         </div>
         <div class="row q-mb-sm q-gutter-sm" :class="purple" >
            <description-edit :container="categoryToSubmit" showExtended=true class="col" />
         </div>	
   </q-card-section>

    <q-card-actions align="right">
      <q-btn @click="cancel" label="Cancel" color="grey"/>   
      <q-btn @click="save" label="Save" color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { CategoryStatus } from 'src/managers/CategoryMgr'
   import { ImageMgr } from 'src/managers/ImageMgr'
   import { UI, Colors } from 'src/utils/Constants'
   
	export default {
		props: ['category'],
		data() {
			return {
				categoryToSubmit: {
					name: '',
               status: CategoryStatus.PRIVATE,
               shortName: '',
               sortName: '',
               primaryImage: { },
            },
            statusOptions: [ CategoryStatus.PRIVATE, CategoryStatus.PUBLIC ],   
            uploaderDisplayed: false,         
			}
		},
		computed: {
         ...mapGetters('color', Colors),
         isEdit() { return this.category != null },
      },
		methods: {
         ...mapActions('category', ['createCategory', 'updateCategory']),
         uploadCompleted(emit) {
				console.log("uploadCompleted", emit)
				this.categoryToSubmit.imageUrl = emit.url
				this.uploaderDisplayed = false
         },
         uploadCompleted(emit) {
            const image = this.categoryToSubmit.primaryImage
            image.url = emit.url
            image.baseName = emit.name
            image.thumbUrl = ""
            ImageMgr.setFilePaths(image)
            
            this.uploaderDisplayed = false
         },
			save() {
            if (this.isEdit) { this.updateCategory(this.categoryToSubmit) }
            else { this.createCategory(this.categoryToSubmit) }

            this.$emit(UI.CLOSE)
         },
         cancel(emit) {
            // delete primaryImage files if they are new
            if (this.isEdit) {
               const prevFilePath = this.category.primaryImage ? this.category.primaryImage.filePath : null
               const currFilePath = this.categoryToSubmit.primaryImage ? this.categoryToSubmit.primaryImage.filePath : null
               if (currFilePath != prevFilePath) { StorageMgr.deleteImageFiles(this.categoryToSubmit.primaryImage) }
            }
            else { StorageMgr.deleteImageFiles(this.categoryToSubmit.primaryImage) }

            this.$emit(UI.CLOSE)
         }
		},
		components: {
         'q-firebase-uploader' : require('components/Imported/QFirebaseUploader.js').default,
    		'description-edit' : require('components/Admin/DescriptionEdit.vue').default,
      },
		mounted() {
			if (this.isEdit) {
            // param update propagating as modal is being popped up
			   setTimeout(() => { 
               this.categoryToSubmit = Object.assign({}, this.category) 
               this.categoryToSubmit.primaryImage = Object.assign({}, this.category.primaryImage) // item copy not deep
               if (!this.categoryToSubmit.primaryImage) { this.categoryToSubmit.primaryImage = {} } // backward compatibility
            }, 100)  
         }
		}
   }
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>