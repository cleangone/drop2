import { firestoreAction } from 'vuexfire'
import { firestore, firebaseStorage } from 'boot/firebase'
import { CategoryMgr } from 'src/managers/CategoryMgr'
import { dateUid } from 'src/utils/Utils'

const state = {
	categories: [],
}

const actions = {
   bindCategories: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('categories', collection())
   }),
   createCategory: firestoreAction((context, category) => {
      category.id = dateUid()
      collection().doc(category.id).set(category)
      setThumbUrls(category)
   }),
   updateCategory: firestoreAction((context, category) => {
      collection().doc(category.id).update(category)
      setThumbUrls(category)
   }),
   deleteCategory: firestoreAction((context, id) => { 
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('categories') }

// largely copied from item-store - minor differences in final update
// not done by functions because they do not have access to downloadURL
function setThumbUrls(category) { setTimeout(() => { setThumbUrl(category, 0) }, 5000) }
function setThumbUrl(category, retry) { 
   const categoryDesc = "categories[id: " + category.id + "]"   
   const retryDesc =  retry ? ", "  + retry + " retries" : ""
   console.log("setThumbUrl: " + categoryDesc + retryDesc)
      
   if (retry > 5) { 
      // console.log("setThumbUrl:" + categoryDesc + " retries exceeded")
      return
   }

   let imageToUpdate = null
   if (category.primaryImage && !category.primaryImage.thumbUrl) { 
      imageToUpdate = category.primaryImage 
   } 

   if (imageToUpdate) { 
      const imageDesc = "image " + imageToUpdate.baseName + " of " + categoryDesc
      // console.log("setThumbUrl: updating " + imageDesc)
      var storageRef = firebaseStorage.ref()
      storageRef.child(imageToUpdate.thumbFilePath).getDownloadURL().then(function(url) {
         imageToUpdate.thumbUrl = url
         const categoryUpdate = { primaryImage: category.primaryImage }
         collection().doc(category.id).update(categoryUpdate) 
         
         // recursive call to set next thumb that needs it
         setThumbUrl(category, retry)
      })
      .catch(function(error) {
         console.log("setThumbUrl: error updating " + imageDesc, error)
         // recursive call to try check for thumb again after a delay
         // todo - if one in particular is having a problem, put it on a bypass list
         setTimeout(() => { setThumbUrl(category, ++retry) }, 1000)
      })
   }
}

const getters = {
   categoriesExist: state => { return state.categories && state.categories.length > 0 },
   getCategories: state => { 
      const categories = [...state.categories];
      categories.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
      return categories
   },
   getPublicCategories: state => { 
      const categories = []
      for (var category of state.categories) {
         if (CategoryMgr.isPublic(category)) { categories.push(category) }
      }

      categories.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
      return categories
   },
   getCategory: state => id => {
      for (var category of state.categories) {
         if (category.id == id) { return category }
      }
      return null
   },
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}