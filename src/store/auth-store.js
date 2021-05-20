// import { LocalStorage, Loading } from 'quasar'
import { firebaseAuth } from 'boot/firebase'
import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'

// export const LocalStorageConst = Object.freeze({
//     LOGGED_IN: "loggedIn"
// })

const state = {
   // vuex goes crazy if the entire user is stored 
   userId: null,
   isAnon: false,
   // errorMessage: ''
}

const mutations = {
   setUserId(state, id) { state.userId = id },
   setIsAnon(state, isAnon) { state.isAnon = isAnon },
}

const actions = {
   async reload({}) { return firebaseAuth.currentUser.reload() },
   async registerUser({}, payload) { return firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password) },
   async loginUser({}, payload) { 
      return firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password) 
   },
   async sendPasswordResetEmail({}, email) { return firebaseAuth.sendPasswordResetEmail(email) },
   async updateEmail({}, email) { return firebaseAuth.currentUser.updateEmail(email) },
   loginAnonUser() { return firebaseAuth.signInAnonymously() },
   logoutUser() { firebaseAuth.signOut() },

   handleAuthStateChange({commit, dispatch}) { 
      // console.log('handleAuthStateChange')
      firebaseAuth.onAuthStateChanged(user => {
         if (user) { 
            // console.log('handleAuthStateChange: logged in', user)
            commit ('setUserId', user.uid)  
            commit ('setIsAnon', user.isAnonymous)
            if (!user.isAnonymous) {
               usersCollection().doc(user.uid).update({ authEmailCopy: firebaseAuth.currentUser.email })
            }
         }
         else { 
            // console.log('handleAuthStateChange: logged out')
            commit ('setUserId', null) 
            this.$router.push("/")
         }
      })
   },
}

function usersCollection() { return firestore.collection('users') }

const getters = {
   loggedIn: (state) =>     { return state.userId != null && !state.isAnon },
   anonLoggedIn: (state) => { return state.userId != null && state.isAnon},
   userId: (state) => { return state.userId },
   currentUser: (state) => { 
      console.log("auth-store.currentUser")
      return state.userId ? firebaseAuth.currentUser : null 
   },
   userEmail() { return this.currentUser ? this.currentUser.email : null },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
