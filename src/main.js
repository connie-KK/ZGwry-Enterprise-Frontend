// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Navigation from 'vue-navigation'
import '@/assets/scripts/permission' // permission control
import './icons'
// import * as dd from 'dingtalk-jsapi'
import './assets/scss/style.scss'
import './assets/scss/animate.scss'

import HeaderBar from './components/HeaderBar.vue'
Vue.component('HeaderBar', HeaderBar)

Vue.use(Navigation, {router, store})
// 导入api接口
import api from './assets/scripts/api'
Vue.$api = Vue.prototype.$api = api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
})
