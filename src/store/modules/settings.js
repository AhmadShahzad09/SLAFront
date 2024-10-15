
// initial state
const state = () => ({
  alert: null
})

// getters
const getters = {}

// mutations
const mutations = {
  toggleAlert (state, msg) {
    state.alert = { msg, type: 'error' }
  },
  toggleSuccessAlert (state, msg) {
    state.alert = { msg, type: 'success' }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
