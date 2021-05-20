// todo - move to session

const state = {
   activity: false, // true if there is current activity
}

const mutations = {
   setActivity(state, value) { state.activity = value },
}

const actions = {
   setCurrentActivity({ commit }, value) { commit ('setActivity', value) },
}

const getters = {
   currentActivityExists: state => { return state.activity },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
