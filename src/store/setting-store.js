import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'

const SETTINGS_ID =  "0"

const state = {
	settings: {},
}

const actions = {
   bindSettings: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('settings', collection().doc(SETTINGS_ID))
   }),
   setSettings: firestoreAction((context, setting) => {
      if (!setting.id) { setting.id = SETTINGS_ID }
      collection().doc(setting.id).set(setting)
   }),
}

const getters = {
   getSettings: state => { return state.settings ? state.settings : {} }
}

function collection() { return firestore.collection('settings') }

export default {
	namespaced: true,
	state,
	actions,
	getters
}