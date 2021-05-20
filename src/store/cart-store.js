import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify } from 'quasar'
 
/*
   cart:
      id (userId)
      userId (hack - duplicated for search)
      itemIds [ id ]
      createdDate    
*/

const state = {
   userId: {},
   userCarts: [], // one per user
}

const mutations = {
   setUserId(state, userId) { state.userId = userId } 
}

const actions = {
   bindUserCarts: firestoreAction(({ bindFirestoreRef, commit }, userId) => {
      // console.log("bindUserCarts", userId)
      bindFirestoreRef('userCarts', collection().where('userId', '==', userId)) 
      commit('setUserId', userId) 
   }),
   unbindUserCarts: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('userCarts')
   }),
   addItemIdToCart({ state }, itemId) { 
      console.log("addItemIdToCart", itemId)
      // console.log("addItemIdToCart: " + state.userCarts.length + " carts")
      const cart = state.userCarts[0]
      if (cart) {
         if (!cart.itemIds.includes(itemId)) { 
            // console.log("addItemIdToCart: updating itemIds in cart " + cart.id)
            let updatedItemIds = [...cart.itemIds]
            updatedItemIds.push(itemId)
            collection().doc(cart.id).update({ itemIds: updatedItemIds })
         }
      } 
      else {
         // console.log("addItemIdToCart: new cart " + state.userId)
         collection().doc(state.userId).set({ userId: state.userId, itemIds: [itemId], createdDate: new Date() })
      }
      showPositiveNotify("Item added to cart")
   },
   addItemIdsToCart({ state }, itemIds) { 
      // console.log("addItemIdsToCart", itemIds)
      // console.log("addItemIdsToCart: " + state.userCarts.length + " carts")
      if (!itemIds || !itemIds.length) { return }
      
      const cart = state.userCarts[0]
      if (cart) {
         let updatedItemIds = [...cart.itemIds]
         for (var itemId of itemIds) {
            if (!updatedItemIds.includes(itemId)) { updatedItemIds.push(itemId) }
         }
         if (cart.itemIds.length != updatedItemIds.length) { 
            collection().doc(cart.id).update({ itemIds: updatedItemIds })
         }
      } 
      else {
         // console.log("addItemIdsToCart: new cart " + state.userId)
         collection().doc(state.userId).set({ userId: state.userId, itemIds: itemIds, createdDate: new Date() })
      }
   },
   removeItemFromCart({ state }, itemId) { 
      console.log("removeItemFromCart", itemId)
      const cart = state.userCarts[0]
      const index = cart ? cart.itemIds.indexOf(itemId) : -1
      if (index > -1) { 
         let updatedItemIds = [...cart.itemIds]
         updatedItemIds.splice(index, 1) 
         collection().doc(cart.id).update({ itemIds: updatedItemIds })
      }
   },
   clearCart({ state }) { 
      console.log("clearCart")
      const cart = state.userCarts[0]
      if (cart && cart.itemIds.length) { 
         collection().doc(cart.id).update({ itemIds: [] })
      }
   },
}

const getters = {
   getCart: state => {
      return state.userCarts[0] ? state.userCarts[0] : null
   },
   cartSize: state => { 
      return state.userCarts[0] && state.userCarts[0].itemIds ? state.userCarts[0].itemIds.length : 0 
   },
   getCartItemIds: state => { 
      return state.userCarts[0] && state.userCarts[0].itemIds ? state.userCarts[0].itemIds : [] 
   },
}

function collection() { return firestore.collection('carts') }
function showPositiveNotify(msg) { Notify.create( {type: "positive", timeout: 1000, message: msg} )}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

