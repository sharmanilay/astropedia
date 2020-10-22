import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userData: {},
    savedAsteroids: []
  },
  mutations: {
    SET_USER_DATA: (state, data) => {
      state.userData = data
    },
    RESET_USER_DATA: (state) => {
      state.userData = {}
    },
    SAVE_ASTEROID: (state, data) => {
      state.savedAsteroids.push(data)
    },
    UNSAVE_ASTEROID: (state, data) => {
      state.savedAsteroids = state.savedAsteroids.filter(item => item != data)
    },
    SET_SAVED_ASTEROIDS: (state, data) => {
      state.savedAsteroids = data
    }
  },
  actions: {
    setUserData ({ commit }, data) {
      commit('SET_USER_DATA', data)
    },
    resetUserData ({ commit }) {
      commit('RESET_USER_DATA') 
    },
    saveAsteroid ({ commit }, data) {
      commit('SAVE_ASTEROID', data)
    },
    unsaveAsteroid ({ commit }, data) {
      commit('UNSAVE_ASTEROID', data)
    },
    setSavedAsteroids ({ commit }, data) {
      commit('SET_SAVED_ASTEROIDS', data)
    }
  },
  plugins: [createPersistedState()]
})