export const state = () => ({
  filter: null,
  type: null
})

export const getters = {
  getFilter: (state) => state.filter,
  getType: (state) => state.type
}

export const mutations = {
  setFilter (state, filter) {
    state.filter = filter
  },
  setType (state, type) {
    state.type = type
  }
}

export const actions = {
  clearFilter ({state, commit}) {
    commit('setFilter', null)
    commit('setType', null)
  },
  setFilter ({state, commit, dispatch}, {filter, type}) {
    if (state.type === type && state.filter === filter) {
      dispatch('clearFilter')
    } else {
      commit('setFilter', filter)
      commit('setType', type)
    }
  }
}
