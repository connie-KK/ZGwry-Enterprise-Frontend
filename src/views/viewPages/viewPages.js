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

// vant css
import 'vant/lib/index.css'

//icon
import icon from '@/components/aepIcon.vue'
Vue.component('icon', icon)
import '@/assets/icons/back'
import '@/assets/icons/right'
import '@/assets/icons/location'
import '@/assets/icons/attachment'
import '@/assets/icons/search'

import HeaderBar from '@/components/HeaderBar.vue'
import Select from '@/components/Select.vue'
import Area from '@/components/Area.vue'
import DatePicker from '@/components/DatePicker.vue'
import LngLat from '@/components/LngLat.vue'
Vue.component('HeaderBar', HeaderBar)
Vue.component('MySelect', Select)
Vue.component('MyArea', Area)
Vue.component('MyDatetimePicker', DatePicker)
Vue.component('MyLngLat', LngLat)

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

Vue.prototype.$360url = '/ent/'

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

{
  const url = 'https://webapi.amap.com/maps?v=1.4.15&key=84af24a85c0ce6dbaa1dfca048fda1ae'
  const jsapi = document.createElement('script')
  jsapi.charset = 'utf-8'
  jsapi.src = url
  document.head.appendChild(jsapi)
}

// 模拟登录
import axios from 'axios'
if (process.env.NODE_ENV === 'development') {
  cookie.set('ISHBGJ', 1)
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