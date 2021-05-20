import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'

const state = {
	settings: [],
}

const actions = {
   bindSettings: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('settings', collection())
   }),
   setSetting: firestoreAction((context, setting) => {
      if (!setting.id) { setting.id = "0" }
      console.log("setSetting", setting)
      collection().doc(setting.id).set(setting)
   }),
}

function collection() { return firestore.collection('settings') }

const getters = {
   getSetting: state => { return (state.settings && state.settings.length > 0) ? state.settings[0] : {} }
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}