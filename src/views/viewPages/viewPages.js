// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/views/viewPages/viewPages.vue'

import router from '@/router/viewPages'
import store from '@/store'
import cookie from 'js-cookie'
import Navigation from 'vue-navigation'
Vue.use(Navigation, {
  router,
  store
})

//leaflet地图
import 'leaflet'
import 'leaflet.chinatmsproviders'
import 'leaflet/dist/leaflet.css'

import map from '@/assets/scripts/map'
Vue.prototype.$map = map

//移动端自适应
import '@/assets/scss/base.scss'

import 'mint-ui/lib/style.css'

//icon
import icon from '@/components/aepIcon.vue'
Vue.component('icon', icon)
import '@/assets/icons/back'
import '@/assets/icons/right'
import '@/assets/icons/location'
import '@/assets/icons/attachment'
import '@/assets/icons/search'

import HeaderBar from '@/components/HeaderBar.vue'
Vue.component('HeaderBar', HeaderBar)

// api接口
import api from '@/assets/scripts/api'
Vue.prototype.$api = api

Vue.prototype.$uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    App
  },
  router,
  store
})

// 模拟登录
import axios from 'axios'
if (process.env.NODE_ENV === 'development') {
  axios.post('http://183.220.144.57:30000//token', {
    userid: 'admin',
    password: '123456',
    'grant_type': 'password'
  }).then(res => {
    if (res.data && res.data.access_token) {
      cookie.set('AzuraCookie', res.data.access_token)
    }
  })
}