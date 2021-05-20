<template>
   <q-page>
		<div class="q-pa-sm absolute full-width full-height">
			<q-table title="Tags" :data="tags" 
				:columns="columns" :visible-columns="visibleColumns" row-key="id" :filter="tableDataFilter" 
            no-data-label="No tags" :pagination.sync="pagination"
				:dense="$q.screen.lt.md" flat class="q-mb-sm">
				<template v-slot:top-right>
				   <q-space />
					<q-input borderless dense debounce="300" v-model="tableDataFilter" placeholder="Search">
						<template v-slot:append><q-icon name="search"/></template>
					</q-input>
				</template>
            <q-td slot="body-cell-actions" slot-scope="props" :props="props"> 
	            <q-btn icon="edit"   @click="edit(props.row)"           @click.stop size="sm" flat dense color="primary" />
    				<q-btn icon="delete" @click="promptToDelete(props.row)" @click.stop size="sm" flat dense color="red" />
  				</q-td> 
			</q-table>
		 	<q-btn @click="add()" icon="add" unelevated color="primary"/>
	      <div style="height: 50px; width: 10px;"  :class="green"/>
		</div>
      <q-dialog v-model="showAddModal">	
			<tag-add-edit @close="showAddModal=false" />
		</q-dialog>
		<q-dialog v-model="showEditModal">
			<tag-add-edit :tag="tagToEdit" @close="showEditModal=false" />
		</q-dialog>
  	</q-page>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
   import { Colors } from 'src/utils/Constants'
   
	export default {
		data() {
	  		return {
				showAddModal: false,
				showEditModal: false,
				tagToEdit: null,
				tableDataFilter: '',
				visibleColumns: [ 'name', 'sort', 'actions'],
 				columns: [
               { name: 'name', label: 'Name',      align: 'left', field: 'name',     sortable: true },
				 	{ name: 'sort', label: 'Sort Name', align: 'left', field: 'sortName', sortable: true },
					{ name: 'actions' }
            ],
            pagination: { rowsPerPage: 30 },
			}
		},
		computed: {
         ...mapGetters('tag', ['getTags']),
         ...mapGetters('color', Colors),
         tags() { 
            let tags = []
            for (var tag of this.getTags ) {
               tags.push(Object.assign({}, tag) ) 
            }
            return tags
         },
		},
		methods: {
         ...mapActions('tag', ['deleteTag']),
      	add() {
            this.tagToEdit = null
				this.showEditModal = true
         },
         edit(tag) {
            this.tagToEdit = tag
				this.showEditModal = true
         },
			promptToDelete(tag) {
				this.$q.dialog({title: 'Confirm', message: 'Delete ' + tag.name + '?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => { this.deleteTag(tag.id) })
			}
		},
		components: {
			'tag-add-edit' : require('components/Tag/TagAddEdit.vue').default,
      }  
   }
</script>