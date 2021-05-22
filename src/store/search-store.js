
const state = {
	searchString: "",
   searching: false,
	resultItems: [],
}

const mutations = {
   setSearchString(state, searchString) { state.searchString = searchString }, 
   setSearching(state, searching) { state.searching = searching }, 
   setResultItems(state, resultItems) { state.resultItems = resultItems }, 
}

const actions = {
   setSearchStart({ commit }, searchString) { 
      commit('setSearchString', searchString) 
      commit('setSearching', true) 
      commit('setResultItems', []) 
   },
   setSearchResults({ commit }, resultItems) { 
      commit('setSearching', false) 
      commit('setResultItems', resultItems) 
   },
}

const getters = {
   getSearchString: state => { return state.searchString },
   isSearching: state => { return state.searching },
   searchResultsExist: state => { return state.resultItems && state.resultItems.length },
   getSearchResultItems: state => { return [...state.resultItems] },
}

export default {
	namespaced: true,
   state,
	actions,
   mutations,
   getters
}