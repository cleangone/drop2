import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { Notify } from 'quasar'
 
/*
   cart:
      id (userId)
      itemIds [ id ] // kept in addition to items for quick lookup of whether item in cart
      items [ {id, dropId} ]
      createdDate    
*/

const state = {
   userCart: {}, 
   userId: {}, // not persisted - used for initial cart creation
}

const mutations = {
   setUserId(state, userId) { state.userId = userId } 
}

const actions = {
   bindUserCart: firestoreAction(({ bindFirestoreRef, commit }, userId) => {
      bindFirestoreRef('userCart', collection().doc(userId))
      commit('setUserId', userId) 
   }),
   unbindUserCart: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef('userCart')
   }),
   addItemToCart({ state }, item) { 
      // console.log("addItemToCart", item)
      if (state.userCart) {
         if (!state.userCart.itemIds.includes(item.id)) { 
            const updatedItemIds = [...state.userCart.itemIds]
            updatedItemIds.push(item.id)

            const updatedItems = [...state.userCart.items]
            updatedItems.push({ id: item.id, dropId: item.dropId })

            collection().doc(state.userCart.id).update({ itemIds: updatedItemIds, items: updatedItems })
         }
      } 
      else {
         const items = [{ id: item.id, dropId: item.dropId }]
         collection().doc(state.userId).set({ itemIds: [item.id], items: items, createdDate: new Date() })
      }
      showPositiveNotify("Item added to cart")
   },
   addItemsToCart({ state }, items) { 
      // console.log("addItemsToCart", items)
      if (!items || !items.length) { return }

      if (state.userCart) {
         let updatedItemIds = [...state.userCart.itemIds]
         let updatedItems   = [...state.userCart.items]
         for (var item of items) {
            if (!updatedItemIds.includes(item.id)) { 
               updatedItemIds.push(item.id) 
               updatedItems.push({ id: item.id, dropId: item.dropId }) 
            }
         }

         if (state.userCart.itemIds.length != updatedItemIds.length) { 
            collection().doc(state.userCart.id).update({ itemIds: updatedItemIds, items: updatedItems })
         }
      } 
      else {
         const cartItemIds = []
         const cartItems = []
         for (var item of items) {
            cartItemIds.push(item.id) 
            cartItems.push({ id: item.id, dropId: item.dropId })
         }
         collection().doc(state.userId).set({ itemIds: cartItemIds, items: cartItems, createdDate: new Date() })
      }
   },
   removeItemFromCart({ state }, itemId) { 
      // console.log("removeItemFromCart", itemId)
      if (state.userCart) {
         const index = state.userCart.itemIds.indexOf(itemId)
         if (index > -1) { 
            let updatedItemIds = [...state.userCart.itemIds]
            updatedItemIds.splice(index, 1) 

            const updatedItems = []
            for (var item of state.userCart.items) {
               if (item.id != itemId) { updatedItems.push(item) }
            }
            collection().doc(state.userCart.id).update({ itemIds: updatedItemIds, items: updatedItems })
         }
      }
   },
   clearCart({ state }) { 
      // console.log("clearCart")
      if (state.userCart && state.userCart.itemIds.length) { 
         collection().doc(state.userCart.id).update({ itemIds: [], items: [] })
      }
   },
}

const getters = {
   getCart: state => { return state.userCart },
   cartSize: state => { 
      return state.userCart && state.userCart.itemIds ? state.userCart.itemIds.length : 0 
   },
   getCartItemIds: state => { 
      return state.userCart && state.userCart.itemIds ? state.userCart.itemIds : [] 
   },
   getCartItems: state => { 
      return state.userCart && state.userCart.items ? state.userCart.items : [] 
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

