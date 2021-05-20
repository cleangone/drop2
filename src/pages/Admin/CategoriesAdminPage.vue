<template>
   <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Artists" :data="categories" :columns="columns" :visible-columns="visibleColumns" row-key="name" @row-click="onRowClick"
            no-data-label="No Catagories" :filter="tableDataFilter" :pagination.sync="pagination" :dense="$q.screen.lt.md" class="q-mb-sm" flat>
				<template v-slot:top-right>
				   <q-space />
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
            <q-td slot="body-cell-name" slot-scope="props" :props="props"> 
               <a :href="'#/category/' + props.row.id">{{ props.row.name }}</a> {{ sortNameText(props.row.sortName )}}
            </q-td>
            <q-td slot="body-cell-video" slot-scope="props" :props="props"> 
	            <q-btn v-if="props.row.video" icon="videocam" @click="showVideo(props.row)" @click.stop size="sm" flat dense color="primary" />
            </q-td>
            <q-td slot="body-cell-items" slot-scope="props" :props="props"> 
                <a :href="'#/admin/catitems/' + props.row.id">{{ itemText(props.row.id) }}</a>
            </q-td>
            <q-td slot="body-cell-actions" slot-scope="props" :props="props">
	            <q-btn icon="edit"   @click="editCategory(props.row)"           @click.stop size="sm" flat dense color="primary" />
    				<q-btn icon="delete" @click="promptToDeleteCategory(props.row)" @click.stop size="sm" flat dense color="red" />
  				</q-td> 
			</q-table>
		 	<q-btn @click="showAddModal=true" icon="add" unelevated color="primary"/>
		</div>

		<q-dialog v-model="showAddModal">	
			<category-add-edit @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<category-add-edit :category="categoryToEdit" @close="showEditModal=false" />
		</q-dialog>
      <q-dialog v-model="showVideoModal">	
			<show-video :container="videoContainer" @close="showVideoModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { date } from 'quasar'
   import { mapGetters, mapActions } from 'vuex'
   import { ItemMgr } from 'src/managers/ItemMgr'
   import { UI } from 'src/utils/Constants'
   
	export default {
		data() {
	  		return {
				showAddModal: false,
            showEditModal: false,
            showVideoModal: false,
            videoContainer: null,
				categoryToEdit: null,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'shortname', 'status', 'video', 'items', 'actions'],
 				columns: [
               { name: 'name', label: 'Name (Sort Name)', align: 'left',   field: 'tempName', sortable: true },
               { name: 'shortname', label: 'Short Name',  align: 'left',   field: 'shortName' },
               { name: 'status',    label: 'Status',      align: 'center', field: 'status', sortable: true },
					{ name: 'video',     label: 'Video',       align: 'center', field: 'video' },
					{ name: 'items',     label: 'Items',       align: 'center' },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
			...mapGetters('category', ['categoriesExist', 'getCategories']),
         ...mapGetters('item', ['getItemsWithCategory']),
         categories() { 
            let copies = []
            this.getCategories.forEach(category => { 
               const copy = Object.assign({}, category)
               copy.tempName = copy.sortName + " " + copy.name // sort by sortName and be able to filter by name
               copies.push(category) 
            })
            return copies
         },
         editMode() { return UI.EDIT },
      },
		methods: {
         ...mapActions('category', ['deleteCategory']),
         onRowClick(evt, row) { this.$router.push("/admin/catitems/" + row.id) },
         sortNameText(sortName) { return sortName && sortName.length ?" (" + sortName + ")" : "" },
         itemText(categoryId) { return ItemMgr.itemText(this.getItemsWithCategory(categoryId)) },
         showVideo(category) {
            this.videoContainer = category
				this.showVideoModal = true
         },
         editCategory(category) {
				this.categoryToEdit = category
				this.showEditModal = true
         },
			promptToDeleteCategory(category) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + category.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
					this.deleteCategory(category.id)
				})
			}
		},
		components: {
         'category-add-edit' : require('components/Category/CategoryAddEdit.vue').default,
         'show-video' : require('components/General/ShowVideo.vue').default
      },
   }

</script>