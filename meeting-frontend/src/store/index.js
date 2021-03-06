import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    meeting: null
  },
  mutations: {
    login(state, data) {
      state.user = data
    },
    logout(state) {
      state.user = null
    },
    setMeeting(state, data) {
      state.meeting = data
    },
    clearMeeting(state){
      state.meeting=null
    }
  },
  actions: {
  },
  modules: {
  }
})
