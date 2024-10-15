
// initial state
const state = () => ({

})

// getters
const getters = {}

// mutations
const mutations = {
  updateUser (state, data) {
    state.data = { ...data }
  },
  logout (state) {
    state.data = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
