export const state = () => ({
  active: false,
  option: null
})

export const getters = {
  isActive: (state) => state.active,
  getOption: (state) => state.option
}

export const mutations = {
  setActive (state, value) {
    state.active = value
  },
  setOption (state, value) {
    state.option = value
  }
}

export const actions = {
  toggle({state, commit}, {active, option}) {
    if (state.active && option === state.option) {
      commit('setActive', false)
      commit('setOption', null)
      return
    }
    commit('setActive', active)
    commit('setOption', option)
  }
}
