import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: null
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    setUser (state, u) {
      state.user = u
    },
    clearUser (state) {
      state.token = ''
      state.user = null
      localStorage.removeItem('token')
    }
  }
})
