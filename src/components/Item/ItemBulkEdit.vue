<template>
	<q-card class="form-card">
    <q-card-section>
      <div class="text-h6 heading">Item Bulk Edit</div>
    </q-card-section>
    <q-card-section>
       <div class="q-mb-sm">
         <q-input v-model="nameFind"    label="Name: Find Text" filled class="col" />
         <q-input v-model="nameReplace" label="Name: Replace Text With" filled class="col" />
      </div>
      <div class="q-mb-sm">
         <q-select v-model="status" label="Status" :options="statusOptions" filled/>
      </div>
      <div class="q-mb-sm">
         <q-select v-model="artist" label="Artist" :options="artistOptions" option-value="id" option-label="name" filled />
      </div>  
      <div class="q-mb-sm">
         <q-select v-model="uiTags" label="Tags" :options="uiTagOptions" multiple filled class="col"/>
      </div>  
      <div class="q-mb-sm">
         <q-select v-model="saleType" label="Sale Type" :options="saleTypeOptions" filled/>
      </div>
      <div class="q-mb-sm">
         <q-checkbox v-model="deleteItems" label="Delete Items" dense/>
		</div>
	</q-card-section>
   <q-card-actions align="right">
      <q-btn @click="cancel" label="Cancel" color="grey" />
      <q-btn @click="save"   label="Save"   color="primary" />
    </q-card-actions>
  </q-card>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import { CategoryMgr } from 'src/managers/CategoryMgr'
   import { ItemMgr, ItemStatus, ItemSaleType } from 'src/managers/ItemMgr'
   import { TagMgr } from 'src/managers/TagMgr'
   
	export default {
      props: ['items'],
		data() {
			return {
            nameFind: "",
            nameReplace: "",
            trimLeadingZero: false,
            status: "",
            artist: "",
            uiTags: null,
            origCommonTagIds: null,
            saleType: "",
            deleteItems: false,
				statusOptions: [ ItemStatus.PRIVATE, ItemStatus.SETUP, ItemStatus.AVAILABLE, ItemStatus.HOLD, ItemStatus.SOLD ],
				saleTypeOptions: [ ItemSaleType.BID, ItemSaleType.BUY, ItemSaleType.DROP ]
			}
      },
      computed: {
         ...mapGetters('category', ['getPublicCategories']),
         ...mapGetters('tag', ['getTags']),
         artistOptions() { return CategoryMgr.categoryOptions(this.getPublicCategories) },
         uiTagOptions() { return TagMgr.getUiTags(this.getTags) }, 
      },
      methods: {
         ...mapActions('item', ['updateItems', 'deleteItem']),
			save() {
            if (this.deleteItems) { 
               this.promptToDelete() 
               return
            }

            const selectedTags = TagMgr.getTags(this.uiTags)                    
            const itemUpdates = []
            for (let item of this.items) { 
               let update = { }
               if (this.nameFind.length && this.nameReplace.length && item.name.includes(this.nameFind)) { 
                  console.log("replace '" + this.nameFind + "' with '" + this.nameReplace + "'")
                  update.name = item.name.replace(this.nameFind, this.nameReplace)
               }

               if (this.status.length) { 
                  update.status = this.status 
                  if (ItemMgr.isSetup(update) || ItemMgr.isAvailable(update)) {
                     update.buyPrice = 0 
                     update.buyDate = 0 
                     update.buyerId = ''
                     update.buyerName = ''
                     update.numberOfPurchaseReqs = 0
                     update.purchaseReqs = [],
                     update.acceptedPurchaseReqId = null
                     update.numberOfBids = 0
                     update.bidderIds = []
                     update.currBid = null,
                     update.prevBids = null,
                     update.dropDoneDate = 0 
                     
                     // old items do not have sortedCreateDate
                     update.userUpdatedDate = item.sortedCreateDate ? 
                        item.sortedCreateDate : item.createdDate 
                  }
                  if (ItemMgr.isAvailable(update)) { update.availableDate = new Date().getTime() }
               }

               if (this.saleType.length) { update.saleType = this.saleType }
               if (this.artist) { update.category = CategoryMgr.isNone(this.artist) ? null : this.artist }

               if (selectedTags) { 
                  update.tags = []
                  if (item.tags) {
                     for (var tag of item.tags) {
                        if (!this.origCommonTagIds.has(tag.id)) { update.tags.push(tag) }
                     }
                  }
                  for (var tag of selectedTags) {
                     if (!TagMgr.hasTag(update, tag.id)) { update.tags.push(tag) }
                  }
                  update.tags.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
                  update.tagIds = TagMgr.getTagIdArray(update.tags)
                  update.tagNames = TagMgr.getTagNameArray(update.tags)
               }

               if (Object.keys(update).length) { 
                  update.id = item.id 
                  itemUpdates.push(update)
               }
            }

            if (itemUpdates.length) { this.updateItems(itemUpdates) }
            this.$emit('close')
         },
         promptToDelete() {
            this.$q.dialog({title: 'Confirm', message: 'Delete ' + this.items.length + ' Items?', persistent: true,			
	        		ok: { push: true }, cancel: { push: true, color: 'grey' }
				}).onOk(() => {
               this.items.forEach(item => { this.deleteItem(item.id) })
               this.$emit('close')
				})
         },
         cancel() { this.$emit('close') }
		},
      mounted() {
         // slight delay because param update propagating as modal being popped up
         setTimeout(() => {  
            let origCommonTags = null
            for (let item of this.items) {   
               if (origCommonTags == null) { 
                  origCommonTags = item.tags ? Array.from(item.tags) : []
               }
               else {
                  const prevTags = origCommonTags
                  origCommonTags = []
                  const currItemTagIds = TagMgr.getTagIds(item.tags)
                  for (let tag of prevTags) {   
                     if (currItemTagIds.has(tag.id)) { origCommonTags.push(tag) }
                  }
               }
            }
            this.uiTags = TagMgr.getUiTags(origCommonTags)
            this.origCommonTagIds =TagMgr.getTagIds(origCommonTags)
         }, 100)  
		}
	}
</script>

<style>
	.form-card { min-width: 400px; }
	.form-card .heading { text-transform: capitalize; }
	.form-card .q-card-section { width: 100%; }
</style>