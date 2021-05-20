import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { DropMgr } from 'src/managers/DropMgr'
import { dateUid } from 'src/utils/Utils'

const state = {
	drops: [],
}

const actions = {
   bindDrops: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('drops', collection())
   }),
   createDrop: firestoreAction((context, drop) => {
      console.log("createDrop", drop)
      drop.id = dateUid()
      collection().doc(drop.id).set(drop)
   }),
   setDrop: firestoreAction((context, drop) => {
      // console.log("setDrop", drop)
      collection().doc(drop.id).set(drop)
   }),
   updateDrop: firestoreAction((context, drop) => {
      // console.log("updateDrop", drop)
      collection().doc(drop.id).update(drop)
   }),
   deleteDrop: firestoreAction((context, id) => { 
      // console.log("deleteDrop", id)
      collection().doc(id).delete()
   }),
}

function collection() { return firestore.collection('drops') }

const getters = {
   dropsExist: state => { return state.drops && state.drops.length > 0 },
   activeDropsExist: state => { 
      if (!state.drops) { return false } 
      for (var drop of state.drops) { if (DropMgr.isActive(drop)) { return true } }
      return false
   },
   visibleDropsExist: state => { 
      if (!state.drops) { return false } 
      for (var drop of state.drops) { if (DropMgr.isActive(drop) || DropMgr.isInCountdown(drop)  || DropMgr.isScheduled(drop)) { return true } }
      return false
   },
   getDrops: state => { 
      const drops = [...state.drops];
      drops.sort((a, b) => (a.startDate < b.startDate) ? -1 : 1)
      return drops
   },
   getDrop: state => dropId => {
      for (var drop of state.drops) {
         if (drop.id == dropId) { return drop }
      }
      return null
   },
   getDropIds: state => status => { 
      if (!state.drops) { return [] } 
   
      let dropIds = []
      for (var drop of state.drops) {
         if (DropMgr.isStatus(drop, status)) { dropIds.push(drop.id) }
      }
      return dropIds
   },
   // getDropIdMap: state => { 
   //    const map = new Map()
   //    for (var drop of state.drops) {
   //       map.set(drop.id, drop) 
   //    }
   //    return map
   // },
   getDropIdToNameDropMap: state => { 
      const map = new Map()
      for (var drop of state.drops) {
         map.set(drop.id, drop.name) 
      }
      return map
   },
}

export default {
	namespaced: true,
	state,
	actions,
	getters
}