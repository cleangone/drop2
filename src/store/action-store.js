import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify } from 'quasar'
import { ActionMgr, ActionType } from 'src/managers/ActionMgr.js'
   
const state = {
	actions: [],
	userActions: [],
}

const actions = {
   bindActions: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('actions', collection())
   }),
   bindUserActions: firestoreAction(({ bindFirestoreRef }, userId) => {
      // console.log("bindUserActions", userId)
      bindFirestoreRef('userActions', collection().where('userId', '==', userId)) 
   }),
   unbindUserActions: firestoreAction(({ unbindFirestoreRef }) => {
      // console.log("unbindUserActions")
      unbindFirestoreRef('userActions')
   }),
   submitBid: firestoreAction((context, action) => {
      // console.log("submitBid", action)
      ActionMgr.init(action, ActionType.BID) 
      collection().doc(action.id).set(action)
      showPositiveNotify("Bid submitted")
   }),
   submitPurchaseRequest: firestoreAction((context, action) => {
      // console.log("submitPurchaseRequest", action)
      ActionMgr.initPurchaseReq(action)
      collection().doc(action.id).set(action)
      showPositiveNotify("Purchase Request submitted")
   }),
   submitPurchaseRequests: firestoreAction((context, actions) => {
      console.log("submitPurchaseRequests", actions)
      for (var action of actions) { 
         ActionMgr.initPurchaseReq(action)
         collection().doc(action.id).set(action)
      }
      showPositiveNotify("Purchase Request submitted")
   }),
   acceptPurchaseRequest: firestoreAction((context, action) => {
      // console.log("acceptPurchaseRequest", action)
      ActionMgr.initAcceptReq(action)
      collection().doc(action.id).set(action)
      showPositiveNotify("Acceptance of Purchase Request submitted")
   }),
   submitInvoicePayment: firestoreAction((context, action) => {
      ActionMgr.init(action, ActionType.INVOICE_PAY) 
      console.log("submitInvoicePayment", action)
      collection().doc(action.id).set(action)
   }),
   createAction: firestoreAction((context, action) => {
      console.log("createAction", action)
      collection().doc(action.id).set(action)
   }),
}

function collection() { return firestore.collection('actions') }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}

const getters = {
   actionsExist: state => { return state.actions && state.actions.length > 0 },
   getUserActions: state => userId => {
      let userActions = []
      for (var action of state.userActions) {
         if (action.userId != userId) { throw new Error("getUserActions - specified userId " + userId + 
            " different than action[id:" + action.id +  ", userId:" + action.userId + "]") 
         }
      
         userActions.push(action)
      }
      return userActions
   },
   getItemActions: state => itemId => {
      let itemActions = []
      for (var action of state.actions) {
         if (action.itemId == itemId) { itemActions.push(action) }
      }

      return itemActions
   },
}

export default {
	namespaced: true,
   state,
   getters,
   actions
}