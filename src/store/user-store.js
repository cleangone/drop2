import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
	
const state = {
	users: [],
	adminUsers: [], // additional binding because there will only be a couple admins
}

const actions = {
   // todo - regular user should not bind all users
   bindUsers: firestoreAction(({ bindFirestoreRef }) => {
      bindFirestoreRef('users', collection())
      bindFirestoreRef('adminUsers', collection().where('isAdmin', '==', true)) 
   }),
   setUser: firestoreAction((context, user) => {
      collection().doc(user.id).set(user)
   }),
   updateUser: firestoreAction((context, user) => {
      collection().doc(user.id).update(user)
   }),
   setLikes: firestoreAction((context, user) => {
      collection().doc(user.id).update({ likedItemIds: user.likedItemIds })
   }),
}

function collection() { return firestore.collection('users') }

const getters = {
   getUsers: state => { return state.users },
   getUser: state => userId => {
      for (var user of state.users) {
          if (user.id == userId) { return user }
      }
      return { id: userId }
   }, 
   isAdmin: state => userId => { 
      for (var user of state.adminUsers) {
         if (user.id == userId) { return user.isAdmin }
      }
   },
   getUserLookup() {
      let userLookup = new Map()
      state.users.forEach(user => { 
         let userFullName = (user.firstName || user.lastName) ?
            (user.firstName ? user.firstName : "") + (user.firstName && user.lastName ? " " : "") + (user.lastName ? user.lastName : "") :
            user.authEmailCopy
         const email = user.authEmailCopy ? user.authEmailCopy : user.anonUserEmail
         const acceptsEmail = user.email ? user.email : false
         userLookup.set(user.id, { fullName: userFullName, email: email, acceptsEmail: acceptsEmail })
      })
      return userLookup
   },
}

// function getUserRef(userId)  { return firebaseDB.ref("users/" + userId) }
// function getLikeRef(userId, dropItemId) { return firebaseDB.ref("users/" + userId + "/likes/" + dropItemId) }
// function createPayload(snapshot) { return {id: snapshot.key, value: snapshot.val() } }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}
function showNegativeNotify(msg) { Notify.create( {type: "negative", timeout: 5000, message: msg} )}

export default {
	namespaced: true,
	state,
	actions,
	getters
}