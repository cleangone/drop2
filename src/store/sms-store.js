import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify } from 'quasar'
  
const state = {
}

const actions = {
   createOutboundSms: firestoreAction((context, outboundSms) => {
      collection().doc(outboundSms.id).set(outboundSms)
      showPositiveNotify("Text sent")
   }),
}

function collection() { return firestore.collection('smsOutbound') }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}

const getters = {
}

export default {
	namespaced: true,
   state,
   getters,
   actions
}