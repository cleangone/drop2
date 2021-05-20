import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'
import { format_MM_DD_YY } from 'src/utils/DateUtils.js'

/*
   error:
      id 
      errorType: Severe
      message

   emailError:
      id 
      emailId
      userId
      emailTo
      emailSubject
      deliveryError
      deliveryAttempts
      referenceIds { invoiceId, itemId }
      isHidden
      createdDate
*/

const state = {
	emailErrors: [],
}

export const ErrorType = {
   SEVERE: 'Severe',
}

const actions = {
   bindEmailErrors: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('emailErrors', emailCollection())
   }),
   createError: firestoreAction((context, error) => {
      error.createdDate = new Date(),
      error.id = format_MM_DD_YY(error.createdDate) + "-" + uid(),
      error.errorType = ErrorType.SEVERE
      
      collection().doc(error.id).set(error)
   }),
   hideEmailError: firestoreAction((context, errorId) => {
      emailCollection().doc(errorId).update({ isHidden: true })
   })
}

const getters = {
   visibleEmailErrorsExist: state => { 
      for (var emailError of state.emailErrors) {
         if (!emailError.isHidden) { return true }
      }
      return false
   },
   getEmailErrors: state => { return [...state.emailErrors] },
   getVisibleEmailErrors: state => { 
      let visible = []
      for (var emailError of state.emailErrors) {
         if (!emailError.isHidden) { visible.push(emailError) }
      }
      return visible
   },
}

function collection() { return firestore.collection('errors') }
function emailCollection() { return firestore.collection('emailErrors') }

export default {
	namespaced: true,
   state,
	actions,
   getters
}