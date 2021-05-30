<template>
   <q-card class="form-card">
      <q-card-section>
         <div class="text-h6">Image {{ image.baseName }}</div>
      </q-card-section>
      <q-card-section>
         <div class="row q-mb-sm q-gutter-sm">
           <q-input v-model="imageToUpdate.sortName" label="Sort Name" ref="sort" filled class="col" />
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
   import { ItemMgr } from 'src/managers/ItemMgr.js'
   import { Colors, UI } from 'src/utils/Constants.js'
   
	export default {
      props: ['itemId', 'image', 'currImages'],
		data() {
			return {
            imageToUpdate: {},
         }
      },
      computed: { 
      },
		methods: {
			...mapActions('item', ['updateItemImages']),
			save() {
				if (this.imageToUpdate.sortName != this.image.sortName) {
               const updatedImages = []
               this.currImages.forEach(currImage => {
                  if (currImage.filePath == this.imageToUpdate.filePath) { updatedImages.push(this.imageToUpdate) }
                  else { updatedImages.push(currImage) }
               })
               this.updateItemImages({ id: this.itemId, images: updatedImages })
            }

            this.$emit(UI.CLOSE)
			},
         cancel(emit) { this.$emit(UI.CLOSE) }
		},
		mounted() {
         // slight delay because param update propagating as modal being popped up
         setTimeout(() => { this.imageToUpdate = Object.assign({}, this.image) }, 100)  
		}
	}
</script>

<style>
	.form-card { min-width: 400px; }
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