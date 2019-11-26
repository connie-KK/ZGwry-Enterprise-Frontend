import Vue from 'vue'
import Vuex from 'vuex'
// import moment from 'moment'
// import store from 'store'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    loading: false
  },
  mutations: {
    set_loading: (state, data) => {
      state.loading = data
    }
  },
  actions: {

  }

})
