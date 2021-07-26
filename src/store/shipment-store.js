import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { dateUid } from 'src/utils/Utils'
import { Notify } from 'quasar'

const state = { 
   shipments: [],
   createdShipments: [] 
}

const actions = {
   bindShipments: firestoreAction(({ bindFirestoreRef }) => { 
      bindFirestoreRef('shipments', collection()) 
      bindFirestoreRef('createdShipments', collection().where('status', '==', "Created")) 
   }),
   createShipments: firestoreAction((context, newShipments) => {
      for (var shipment of newShipments) {
         shipment.id = dateUid()
         shipment.createdDate = Date.now()
         
         console.log("createShipments", shipment)
         collection().doc(shipment.id).set(shipment)      
      }

      showPositiveNotify("Shipments added")   
   }),
   setShipment: firestoreAction((context, shipment) => { collection().doc(shipment.id).set(shipment) }),
   updateShipment: firestoreAction((context, shipment) => { collection().doc(shipment.id).update(shipment) }),
   deleteShipment: firestoreAction((context, id) => { collection().doc(id).delete() }),
}

function collection() { return firestore.collection('shipments') }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}

const getters = {
   getShipments: state => { return [...state.shipments] },
   getCreatedShipments: state => { return [...state.createdShipments] }
}

export default {
	namespaced: true,
	state,
   actions,
	getters
}