<template>
  <q-page>
      <div class="q-pt-sm q-px-sm text-h6 heading">
         {{ item.name }} - Additional Images
      </div>
		<div class="row" :class="red">
         <div class="q-pa-sm full-height col" :class="green">
            <q-table :data="images" :columns="columns" :visible-columns="visibleColumns" row-key="filePath" 
               no-data-label="No additional images" hide-bottom :dense="$q.screen.lt.md" class="q-mb-sm">
               <q-td slot="body-cell-actions" slot-scope="props" :props="props" auto-width>
                  <q-btn icon="edit"   @click="edit(props.row)"       color="primary" size="sm" flat dense />
                  <q-btn icon="delete" @click="promptToDelete(props.row)" color="red" size="sm" flat dense />
               </q-td>  
            </q-table>
            <div class="q-mt-md"> 
               <q-btn @click="showAddModal=true" icon="add" unelevated color="primary"/>
            </div> 
            <div style="height: 75px"/>
         </div>
         <div class="col" :class="orange">
            <!-- todo - experimenting with carousel - a bit ugly - may want to just click on row and show thumb -->
            <q-carousel animated
               v-model="slide"
               arrows
               thumbnails
               infinite>
	            <q-carousel-slide v-for="slide in slides" :key="slide.name" :name="slide.name" :img-src="slide.src"/>
            </q-carousel>
         </div>
      </div>
 
		<q-dialog v-model="showAddModal">	
			<item-image-add :itemId="itemId" :currImages="images" @close="showAddModal=false" />
		</q-dialog>
      <q-dialog v-model="showEditModal">	
			<item-image-edit :itemId="itemId" :image="imageToEdit" :currImages="images" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { formatDateTimeOptYear } from 'src/utils/DateUtils'
   import { Colors } from 'src/utils/Constants'
   
	export default {
		data() {
	  		return {
            itemId: '',
            showAddModal: false,
            showEditModal: false,
				imageToEdit: {},
            visibleColumns: [ 'name', 'sort', 'actions'],
 				columns: [
        			{ name: 'name', label: 'Name', align: 'left', field: 'baseName', sortable: true },
				 	{ name: 'sort', label: 'Sort', align: 'left', field: 'sortName', sortable: true },
				 	{ name: 'actions' }
            ],
            slide: 1
			}
		},
		computed: {
         ...mapGetters('item', ['itemsExist', 'getItem']),
         ...mapGetters('color', Colors),
			item() { return this.getItem(this.itemId) },
         images() { 
            if (!this.item.images) { return [] }
            // make copies - table adds an index to objs
            let copies = []
            this.item.images.forEach(image => { copies.push(Object.assign({}, image)) })
            return copies
         },
         slides() {
            if (!this.item.images) { return [] }
            // make copies - table adds an index to objs
            let name = 1
            let slides = []
            this.item.images.forEach(image => { 
               slides.push({ name: name++, src: image.url }) 
            })
            return slides
         },
      },
		methods: {
			...mapActions('item', ['updateItem']),
         edit(image) {
            this.imageToEdit = image
            this.showEditModal = true
         },
         promptToDelete(image) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + image.baseName + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.delete(image) })
         },
         delete(image) {
            const remainingImages = []
            this.images.forEach(currImage => {
               if (currImage.filePath != image.filePath) { remainingImages.push(currImage) }
            })
            this.updateItem({ id: this.itemId, images: remainingImages })
         },
		},
		components: {
         'item-image-add'  : require('components/Item/ItemImageAdd.vue').default,
         'item-image-edit' : require('components/Item/ItemImageEdit.vue').default,
      },
      created() {
			this.itemId = this.$route.params.itemId
      },
   }
</script>