import { firestoreAction } from 'vuexfire'
import { firestore, firebaseStorage } from 'boot/firebase'
import { ItemMgr, ItemStatus, ItemSaleType } from 'src/managers/ItemMgr'   
import { dateUid, getIds } from 'src/utils/Utils'

const MAX_DAYS_AGO = 31
const MILLIS_PER_DAY = 1000*60*60*24

const state = { 
   items: [], 
   activeBidItems: [],
   requestedItems: [],
   holdItems: [],
   recentItems: [],

   // vuex binds to a key, and will generate the following state vars during binding      
   // dropItems0-n
   // categoryItems0-n
}

const actions = {
   bindItems: firestoreAction(({ bindFirestoreRef }) => { 
      bindFirestoreRef('items', collection())      
      bindFirestoreRef('activeBidItems', collection()
         .where('saleType', '==', ItemSaleType.BID)
         .where('status', 'in', [ItemStatus.AVAILABLE, ItemStatus.LIVE]))
      bindFirestoreRef('requestedItems', collection().where('status', '==', ItemStatus.REQUESTED))
      bindFirestoreRef('holdItems', collection().where('status', '==', ItemStatus.HOLD))
   }),
   bindRecentItems: firestoreAction(({ bindFirestoreRef }) => {
      const daysAgo = Date.now() - MILLIS_PER_DAY * MAX_DAYS_AGO
      bindFirestoreRef('recentItems', collection().where('sortedCreateDate', '>', daysAgo))
   }),
   bindDropItems: firestoreAction(({ bindFirestoreRef, state }, dropIds) => { 
      for (let i=0; i<dropIds.length; i++) {
         const stateVarName = 'dropItems' + i
         const stateVar = state[stateVarName]
         if (!stateVar || !stateVar.length || stateVar[0].dropId != dropIds[i]) {
            // console.log("bindDropItems: binding " + stateVarName, dropIds[i])
            console.log("bindDropItems: " + stateVarName)
            bindFirestoreRef(stateVarName, collection().where('dropId', '==', dropIds[i]))
            BindingMgr.setVarName(dropIds[i], stateVarName)
         }
      }
   }),
   bindCategoryItems: firestoreAction(({ bindFirestoreRef, state }, categoryIds) => { 
      for (let i=0; i<categoryIds.length; i++) {
         const stateVarName = 'categoryItems' + i
         const stateVar = state[stateVarName]
         if (!stateVar || !stateVar.length || stateVar[0].category.id != categoryIds[i]) {
            // console.log("bindCategoryItems: binding " + stateVarName, categoryIds[i])
            console.log("bindCategoryItems: " + stateVarName)
            bindFirestoreRef(stateVarName, collection().where('category.id', '==', categoryIds[i]))
            BindingMgr.setVarName(categoryIds[i], stateVarName)
         }
      }
   }),
   setItem: firestoreAction((context, item) => { 
      if (!item.id) {
         item.id = dateUid()
         item.createdDate = Date.now()
         item.sortedCreateDate = item.createdDate
      }
      collection().doc(item.id).set(item) 
      setThumbUrls(item)
   }),
   updateItems: firestoreAction((context, itemUpdates) => { 
      // todo - research vuexfire batching - no big deal right now - will only be 5-25 items
      // https://mesqueeb.github.io/vuex-easy-firestore/setup.html#installation
      itemUpdates.forEach(update => {
         collection().doc(update.id).update(update)
      })
   }),
   updateItem: firestoreAction((context, item) => { 
      collection().doc(item.id).update(item) 
   }),
   updateItemImages: firestoreAction((context, item) => { 
      collection().doc(item.id).update(item) 
      setThumbUrls(item)
   }),
   deleteItem: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

const getters = {
   itemsExist: state => { return state.items && state.items.length > 0 },
   activeBidItemsExist: state => { return state.activeBidItems.length > 0 },
   recentItemsExist: state =>    { return state.recentItems.length > 0 },
   requestedItemsExist: state => { return state.requestedItems.length > 0 },
   holdItemsExist: state =>      { return state.holdItems.length > 0 },
   getItems: state => itemIds => {   
      console.log("getItems(itemIds) iterating through all items")
      let items = []
      state.items.forEach(item => {
         if (itemIds.includes(item.id) ) { items.push(item) }
      })
      return items
   },
   getActiveBidItems: state => { return [...state.activeBidItems] },
   getRequestedItems: state => { return [...state.requestedItems] },
   getHoldItems: state =>      { return [...state.holdItems] },
   getRecentItems: state => {   
      let items = []
      state.recentItems.forEach(item => {
         if (ItemMgr.isActive(item)) { items.push(item) }
      })
      
      // fallback if no recent
      if (items.length == 0) {
         console.log("getRecentItems iterating through all items")
         state.items.forEach(item => {
            if (ItemMgr.isActive(item)) { items.push(item) }
         })
      }

      items.sort((a, b) => (a.sortedCreateDate > b.sortedCreateDate) ? -1 : 1)
      return items
   },
   getItemsInDrop: state => dropId => { 
      let dropItems = getBoundDropItems(state, dropId) 
      if (dropItems) { return dropItems }
            
      dropItems = []
      console.log("getItemsInDrop iterating through all items")
      state.items.forEach(item => {
         if (item.dropId == dropId) { dropItems.push(item) }
      })

      return dropItems
   },
   getItemsInDrops: state => itemSkeletons => {  // itemSkeleton: { id, dropId }
      if (!itemSkeletons || !itemSkeletons.length) { return [] }
      
      // address common cart case of one item from bound drop
      if (itemSkeletons.length == 1 && BindingMgr.getVarName(itemSkeletons[0].dropId)) {
         console.log("getItemsInDrops - finding single item in bound drop")
         let dropItems = getBoundDropItems(state, itemSkeletons[0].dropId) 
         // console.log("getItemsInDrops - dropItems", dropItems)
         if (dropItems) {  // check if drop binding complete
            for (var item of dropItems) {
               if (item.id == itemSkeletons[0].id) { return [item] }
            }
         }
         console.log("getItemsInDrops - could not find single item in bound drop")
      }

      let allItemsInBoundDrops = true
      itemSkeletons.forEach(itemSkeleton => {
         if (!itemSkeleton.dropId || !BindingMgr.getVarName(itemSkeleton.dropId)) {
            allItemsInBoundDrops = false
         }
      })

      let items = []  
      if (allItemsInBoundDrops) {
         console.log("getItemsInDrops - all items in bound drops")
         const dropIdToItemIds = new Map()
         itemSkeletons.forEach(itemSkeleton => {
            let itemIds = dropIdToItemIds.get(itemSkeleton.dropId)
            if (!itemIds) {
               itemIds = []
               dropIdToItemIds.set(itemSkeleton.dropId, itemIds)
            }
            itemIds.push(itemSkeleton.id)
         })
         
         for (var dropId of dropIdToItemIds.keys()) {
            const itemIds = dropIdToItemIds.get(dropId)
            let dropItems = getBoundDropItems(state, dropId) 
            // console.log("getItemsInDrops - dropItems", dropItems)
            if (dropItems) {
               dropItems.forEach(item => {
                  if (itemIds.includes(item.id) ) { items.push(item) }
               })
            }
         }
      }

      if (items.length == itemSkeletons.length) { return items }

      // have to iterate through all items becasue one isn't in a drop or a bound drop 
      // or the bound drops did not complete bindings 
      console.log("getItemsInDrops iterating through all items")
      items = [] 
      const itemIds = getIds(itemSkeletons)
      state.items.forEach(item => {
         if (itemIds.includes(item.id) ) { items.push(item) }
      })
      
      if (items.length != itemSkeletons.length) {
         console.log("getItemsInDrops - expected to find " + itemSkeletons.length + 
            " items, but found " + items.length)
      }
      return items
   },
   // getActiveItemsWithTag: state => tag => { 
   //    // console.log("getItemsWithTag", tag)
   //    let items = []
   //    state.items.forEach(item => {
   //       if (ItemMgr.isActive(item) && TagMgr.hasTag(item, tag.id)) { items.push(item) }
   //    })

   //    items.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1)
   //    return items
   // },
   getItemsWithCategory: state => categoryId => { 
      return getCategoryItems(state, categoryId)
   },
   getActiveItemsWithCategory: state => categoryId => { 
      const items = getCategoryItems(state, categoryId)
      
      let activeItems = []
      items.forEach(item => {
         if (ItemMgr.isActive(item)) { activeItems.push(item) }
      })
      return activeItems
   },
   getItemInDrop: state => (itemId, dropId) => { 
      // console.log("item-store.getItemInDrop")
      let dropItems = getBoundDropItems(state, dropId) 
      
      if (!dropItems) { console.log("getItemInDrop iterating through all items") }
      const items = dropItems ? dropItems : state.items
      for (var item of items) {
         if (item.id == itemId) { return item }
      }
      return null
   },
   getItem: state => itemId => { 
      console.log("getItem(itemId) iterating through all items")
      for (var item of state.items) {
         if (item.id == itemId) { return item }
      }
      return null
   },
}

class BindingMgr {   
   static idToVarName = new Map()
   static setVarName(id, stateVarName) { this.idToVarName.set(id, stateVarName) }
   static getVarName(id) { return this.idToVarName.get(id) }
}

function collection() { return firestore.collection('items') }

function getBoundDropItems(state, dropId) { 
   const stateVarName = BindingMgr.getVarName(dropId)
   if (stateVarName) {
      const stateVar = state[stateVarName]
      if (stateVar && stateVar.length && stateVar[0].dropId == dropId) { 
         return [...stateVar]
      }
   }

   return null
}

function getCategoryItems(state, categoryId) { 
   const stateVarName = BindingMgr.getVarName(categoryId)
   if (stateVarName) {
      const stateVar = state[stateVarName]
      if (stateVar && stateVar.length && stateVar[0].category.id == categoryId) { 
         return [...stateVar]
      }
   }
      
   const categoryItems = []
   console.log("getCategoryItems iterating through all items", categoryId)
   state.items.forEach(item => {
      if (item.category && item.category.id == categoryId) { categoryItems.push(item) }
   })
   return categoryItems
}

// not done by backend functions because they do not have access to downloadURL
function setThumbUrls(item) { setTimeout(() => { setThumbUrl(item, 0) }, 5000) }
function setThumbUrl(item, retry) { 
   const itemDesc = "item[id: " + item.id + "]"   
   const retryDesc =  retry ? ", "  + retry + " retries" : ""
   // console.log("setThumbUrl: " + itemDesc + retryDesc)
      
   if (retry > 5) { 
      console.log("setThumbUrl:" + itemDesc + " retries exceeded")
      return
   }

   let imageToUpdate = null
   let isPrimaryImage = false
   if (item.primaryImage && !item.primaryImage.thumbUrl) { 
      imageToUpdate = item.primaryImage 
      isPrimaryImage = true
   } 

   if (!imageToUpdate && item.images) {
      for (var image of item.images) {
         if (!image.thumbUrl) { imageToUpdate = image }
      }
   }

   if (imageToUpdate) { 
      const imageDesc = "image " + imageToUpdate.baseName + " of " + itemDesc
      console.log("setThumbUrl: updating " + imageDesc)
      var storageRef = firebaseStorage.ref()
      storageRef.child(imageToUpdate.thumbFilePath).getDownloadURL().then(function(url) {
         imageToUpdate.thumbUrl = url
         const itemUpdate = isPrimaryImage ? { primaryImage: item.primaryImage } : { images: item.images }
         collection().doc(item.id).update(itemUpdate) 
         
         // recursive call to set next thumb that needs it
         setThumbUrl(item, retry)
      })
      .catch(function(error) {
         console.log("setThumbUrl: error updating " + imageDesc, error)
         // recursive call to try check for thumb again after a delay
         // todo - if one in particular is having a problem, put it on a bypass list
         setTimeout(() => { setThumbUrl(item, ++retry) }, 1000)
      })
   }
}

export default {
	namespaced: true,
	state,
	actions,
   getters
}