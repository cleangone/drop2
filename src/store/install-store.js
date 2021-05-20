 
const state = {
   deferredPrompt: null,
   installStatus: null,
}

const mutations = {
   setDeferredPromptState(state, deferredPrompt) { state.deferredPrompt = deferredPrompt }, 
   setInstallStatusState(state, installStatus) { state.installStatus = installStatus } 
}

const actions = {
   setDeferredPrompt({ commit }, deferredPrompt) { commit ('setDeferredPromptState', deferredPrompt) },
   setInstallStatus({ commit }, installStatus) { commit ('setInstallStatusState', installStatus) },
}

const getters = {
   canInstallApp: state => { return state.deferredPrompt && (!state.installStatus || (state.installStatus.length == 0)) },
   installStatusExists: state => { return state.installStatus && state.installStatus.length > 0 },
   getDeferredPrompt: state => { return state.deferredPrompt },
   getInstallStatus: state => { return state.installStatus },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

