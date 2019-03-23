export const state = () => ({
  flipped: false,
})

export const getters = {
  getFlipped: (state) => state.flipped,
}

export const mutations = {
  setFlipped (state, value) {
    state.flipped = value
  },
}

export const actions = {
  toggleFlipped ({state, commit}) {
    commit('setFlipped', !state.flipped)
  },
}
