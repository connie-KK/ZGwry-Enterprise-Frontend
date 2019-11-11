import Vue from 'vue'
import Vuex from 'vuex'
// import moment from 'moment'
// import store from 'store'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    siteList: [],
    factorList: [],
    siteId:"",
    factorData:{},
    airList:[],
    ariLoaction:[]
  },
  mutations: {
    set_siteList: (state, data) => {
      state.siteList = data
    },
    set_factorList: (state, data) => {
      state.factorList = data
    },
    set_siteId: (state, data) => {
      state.siteId = data
    },
    set_factorData: (state, data) => {
      state.factorData = data
    },
    set_airList: (state, data) => {
      state.airList = data
    },
    set_ariLoaction: (state, data) => {
      state.ariLoaction = data
    }
  },
  actions: {

  }

})
