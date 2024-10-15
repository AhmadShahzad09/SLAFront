
// initial state
const state = () => ({

})

// getters
const getters = {}

// mutations
const mutations = {
  updateUserRoles (state, data) {
    state.data = { ...data }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
