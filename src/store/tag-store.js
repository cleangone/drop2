import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { dateUid } from 'src/utils/Utils'

const state = { 
   tags: [] 
}

// const mutations = {
//    createTagMutation: firestoreAction((context, tag) => {
//       console.log("createTagMutation")
//       tag.id = dateUid()
//       collection().doc(tag.id).set(tag)
//    }),
// }

const actions = {
   bindTags: firestoreAction(({ bindFirestoreRef }) => { return bindFirestoreRef('tags', collection()) }),
   createTag: firestoreAction((context, tag) => {
      tag.id = dateUid()
      collection().doc(tag.id).set(tag)
   }),
   // createTag({commit}, tag) { commit ('createTagMutation', tag) },
   setTag: firestoreAction((context, tag) => { collection().doc(tag.id).set(tag) }),
   deleteTag: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

function collection() { return firestore.collection('tags') }

const getters = {
   getTags: state => { 
      const tags = [...state.tags];
      tags.sort((a, b) => (a.sortName > b.sortName) ? 1 : -1)
      return tags
   },
   getTag: state => id => { 
      for (var tag of state.tags) {
         if (tag.id == id) { return tag }
      }
      return null
   },
}

export default {
	namespaced: true,
	state,
   // mutations,
	actions,
	getters
}