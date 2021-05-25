<template>
   <q-card class="form-card">
      <q-card-section class="q-pb-none" :class="red">
         <div class="text-h6 heading" :class="indigo">{{ type }} Item</div>
      </q-card-section>
      <q-card-section :class="pink">
         <div class="row q-mb-sm" :class="orange">
            <div class="col q-mb-sm q-gutter-sm q-pr-sm" :class="blue">
               <q-input v-model="itemToSubmit.name" label="Name" filled />
               <q-select v-model="itemToSubmit.category" label="Artist" :options="artistOptions" option-value="id" option-label="name" filled />
               <q-input  v-if="!uploaderDisplayed" v-model.number="itemToSubmit.startPrice" label="Price" type=number prefix="$" filled />
               <q-select v-if="!uploaderDisplayed" label="Status" v-model="itemToSubmit.status" :options="statusOptions" filled/>
               <q-select v-if="!uploaderDisplayed" label="Sale Type" v-model="itemToSubmit.saleType" :options="saleTypeOptions" filled/>
               <q-select v-if="!uploaderDisplayed" label="Drop" v-model="itemToSubmit.dropId" 
                  :options="dropOptions" option-value="id" option-label="name" emit-value map-options filled/>
            </div>
            <div class="col q-mb-sm q-gutter-sm" :class="green">
               <q-input v-model="itemToSubmit.sortName" label="Sort Name" filled />
               <q-select v-model="uiTags" label="Tags" :options="uiTagOptions" multiple filled />
               <q-img v-if="!uploaderDisplayed" style="height: 200px; width: 200px;" class="q-ml-sm" :class="pink" contain
                  :src="itemToSubmit.primaryImage.url ? itemToSubmit.primaryImage.url : 'image-placeholder.png'" />
               <div v-if="!uploaderDisplayed">
                  <q-checkbox v-model="itemToSubmit.primaryImage.isHorizontal" label="Horizontal"  dense/>
                  <q-btn @click="uploaderDisplayed=true" label="Upload Image" class="float-right" color="primary" />
               </div>
            </div>
         </div>
         <div v-if="uploaderDisplayed" class="col q-gutter-xs q-pr-xs" :class="yellow" >
            <q-firebase-uploader path="drops/" @upload="uploadCompleted" style="width: 100%; min-height: 225px"/> 
            <q-btn @click="uploaderDisplayed=false" class="float-right" icon="clear" color="primary" size="sm" dense/>
         </div>
         <div class="col q-gutter-xs" :class="purple" >
            <div v-if="uploaderDisplayed" style="height: 30px" :class="green" />
            <description-edit :container="itemToSubmit" />
         </div>
	   </q-card-section>

      <q-card-actions align="right">
         <q-btn @click="cancel" label="Cancel" color="grey"/>
         <q-btn @click="save"   label="Save"   color="primary" />
      </q-card-actions>
   </q-card>
</template>

<script>
   import { mapGetters, mapActions } from 'vuex'
   import { CategoryMgr, CATEGORY_NONE } from 'src/managers/CategoryMgr'
   import { ImageMgr } from 'src/managers/ImageMgr'
   import { ItemMgr, ItemStatus } from 'src/managers/ItemMgr'
   import { TagMgr } from 'src/managers/TagMgr'
   import { StorageMgr } from 'src/managers/StorageMgr'
   import { SaleType, UI, Colors } from 'src/utils/Constants'
   
	export default {
      props: ['type', 'item', 'dropId', 'categoryId'], // one of dropId/categoryId will be specified for add
		data() {
			return {
            itemToSubmit: {
               name: '',
               dropId: '',
               status: ItemStatus.SETUP,
					startPrice: 0,
					buyPrice: 0,
					saleType: SaleType.DEFAULT,
               primaryImage: { isHorizontal: false },
            },
            uiTags: null,
            uploaderDisplayed: false,
				statusOptions: [ ItemStatus.PRIVATE, ItemStatus.SETUP, ItemStatus.AVAILABLE, ItemStatus.DROPPING, ItemStatus.HOLD, ItemStatus.SOLD ],
            saleTypeOptions: [ SaleType.DEFAULT, SaleType.BID, SaleType.BUY ],
         }
      },
      computed: {
         ...mapGetters('drop', ['getDrops']),
         ...mapGetters('category', ['getPublicCategories', 'getCategory']),
         ...mapGetters('tag', ['getTags']),
         ...mapGetters('color', Colors),
         isEdit() { return this.type == UI.EDIT },
         artistOptions() { return CategoryMgr.categoryOptions(this.getPublicCategories) },
         uiTagOptions() { return TagMgr.getUiTags(this.getTags) }, 
         dropOptions() { return this.getDrops },
      },
		methods: {
         ...mapActions('item', ['setItem']),
         save() {
				if (ItemMgr.isSetup(this.itemToSubmit) || ItemMgr.isAvailable(this.itemToSubmit)) {
               this.itemToSubmit.buyPrice = 0 
               this.itemToSubmit.buyDate = 0 
               this.itemToSubmit.buyerId = ''
               this.itemToSubmit.buyerName = ''
               this.itemToSubmit.numberOfPurchaseReqs = 0
               this.itemToSubmit.purchaseReqs = [],
               this.itemToSubmit.acceptedPurchaseReqId = null
               this.itemToSubmit.numberOfBids = 0
               this.itemToSubmit.bidderIds = []
               this.itemToSubmit.currBid = null,
               this.itemToSubmit.prevBids = null,
               this.itemToSubmit.dropDoneDate = 0 

               // old items do not have sortedCreateDate
               this.itemToSubmit.userUpdatedDate = this.itemToSubmit.sortedCreateDate ? 
                  this.itemToSubmit.sortedCreateDate : this.itemToSubmit.createdDate 
            }
            if (ItemMgr.isAvailable(this.itemToSubmit)) { this.itemToSubmit.availableDate = new Date().getTime() }   

            if (this.itemToSubmit.category && CategoryMgr.isNone(this.itemToSubmit.category)) { this.itemToSubmit.category = null }
            
            this.itemToSubmit.tags = []
            for (var uiTag of TagMgr.sortUiTags(this.uiTags)) {
               this.itemToSubmit.tags.push({ id: uiTag.value, name: uiTag.label, sortName: uiTag.sortName }) 
            }
            this.itemToSubmit.tags.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
            this.itemToSubmit.tagIds = TagMgr.getTagIdArray(this.itemToSubmit.tags)
            this.itemToSubmit.tagNames = TagMgr.getTagNameArray(this.itemToSubmit.tags)

            // delete prev primaryImage files if they have changed
            if (this.isEdit) {
               const prevFilePath = this.item.primaryImage ? this.item.primaryImage.filePath : null
               const currFilePath = this.itemToSubmit.primaryImage ? this.itemToSubmit.primaryImage.filePath : null
               if (currFilePath != prevFilePath) { StorageMgr.deleteImageFiles(this.item.primaryImage) }
            }
              
            this.setItem(this.itemToSubmit)
            this.$emit(UI.CLOSE)
			},
			uploadCompleted(emit) {
            const itemName = emit.name.includes(".") ? emit.name.substring(0, emit.name.indexOf(".")) : emit.name
         
            if (!this.itemToSubmit.name) { this.itemToSubmit.name = itemName }
            if (!this.itemToSubmit.sortName) { this.itemToSubmit.sortName = itemName }

            const image = this.itemToSubmit.primaryImage
            image.url = emit.url
            image.baseName = emit.name
            image.thumbUrl = ""
            ImageMgr.setFilePaths(image)
            
            this.uploaderDisplayed = false
         },
         cancel(emit) {
            // delete primaryImage files if they are new
            if (this.isEdit) {
               const prevFilePath = this.item.primaryImage ? this.item.primaryImage.filePath : null
               const currFilePath = this.itemToSubmit.primaryImage ? this.itemToSubmit.primaryImage.filePath : null
               if (currFilePath != prevFilePath) { StorageMgr.deleteImageFiles(this.itemToSubmit.primaryImage) }
            }
            else { StorageMgr.deleteImageFiles(this.itemToSubmit.primaryImage) }

            this.$emit(UI.CLOSE)
         }
		},
		components: {
         'q-firebase-uploader' : require('components/Imported/QFirebaseUploader.js').default,
         'description-edit' : require('components/Admin/DescriptionEdit.vue').default,
		},
		mounted() {
         // slight delay because param update propagating as modal being popped up
         setTimeout(() => {    
            if (this.isEdit) { 
               this.itemToSubmit = Object.assign({}, this.item) 
               this.itemToSubmit.primaryImage = Object.assign({}, this.item.primaryImage) // item copy not deep               
               this.itemToSubmit.category = this.item.category ? Object.assign({}, this.item.category) : CATEGORY_NONE
               this.uiTags = TagMgr.getUiTags(this.itemToSubmit.tags) 
            }
            else { 
               if (this.dropId) { this.itemToSubmit.dropId = this.dropId }
               if (this.categoryId) { this.itemToSubmit.category = CategoryMgr.slim(this.getCategory(this.categoryId)) }      
            }
         }, 100)  
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