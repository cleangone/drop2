import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { InvoiceSendStatus } from 'src/managers/InvoiceMgr'
import { dateUid } from 'src/utils/Utils'
   
const state = {   
   invoices: [],
   createdInvoices: [],
   userInvoices: []
}

const actions = {
   bindInvoices: firestoreAction(({ bindFirestoreRef }) => {
      bindFirestoreRef('invoices', collection())
      bindFirestoreRef('createdInvoices', collection().where('status', '==', "Created")) 
   }),
   bindUserInvoices: firestoreAction(({ bindFirestoreRef }, userId) => {
      // console.log("bindUserInvoices", userId)
      bindFirestoreRef('userInvoices', collection().where('userId', '==', userId)) 
   }),
   unbindUserInvoices: firestoreAction(({ unbindFirestoreRef }) => {
      // console.log("unbindUserInvoices")
      unbindFirestoreRef('userInvoices')
   }),
   createInvoice: firestoreAction((context, invoice) => {
      // console.log("createInvoice", invoice)
      invoice.id = dateUid()
      collection().doc(invoice.id).set(invoice)
   }),
   setInvoice: firestoreAction((context, invoice) => {
      // console.log("setInvoice", invoice)
      collection().doc(invoice.id).set(invoice)
   }),
   sendInvoice:   firestoreAction((context, id) => { collection().doc(id).update({ sendStatus: InvoiceSendStatus.SENDING }) }),
   updateInvoice: firestoreAction((context, invoice) => { collection().doc(invoice.id).update(invoice) }),
   deleteInvoice: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

function collection() { return firestore.collection('invoices') }

const getters = {
   invoicesExist: state => { return state.invoices && state.invoices.length > 0 },
   createdInvoicesExist: state => { return state.createdInvoices && state.createdInvoices.length > 0 },
   // userInvoicesExist: state => { return state.userInvoices && state.userInvoices.length > 0 },
   getInvoices: state => { 
      let invoices = []
      for (var invoice of state.invoices) {
         if (invoice.id != "0") { invoices.push((Object.assign({}, invoice))) }
      }

      return invoices
   },
   getCreatedInvoices: state => { return [...state.createdInvoices] },
   getUserInvoices: state => userId => {  // pass in userId as double-check
      const invoices = []
      for (var invoice of state.userInvoices) {
         if (invoice.userId != userId) { throw new Error(
            "Error in getUserInvoices.  Specified userId " + 
               userId + " different than invoice[id:" + invoice.id +  ", userId:" + invoice.userId + "]") 
         }
         else if (invoice.sendStatus == InvoiceSendStatus.SENT) { invoices.push(invoice) }
      }
      return invoices
   },
   getInvoice: state => invoiceId => {
      for (var invoice of state.invoices) {
         if (invoice.id == invoiceId) { return invoice }
      }

      return null
  },
  getUserInvoice: state => (userId, invoiceId) => {  
      for (var invoice of state.userInvoices) {
         if (invoice.id == invoiceId && invoice.userId == userId) { 
            return invoice
         }
      }
      return null
   }
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}