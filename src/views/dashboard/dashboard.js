// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/views/dashboard/dashboard.vue'

import router from '@/router/dashboard'
import store from '@/store'
import Navigation from 'vue-navigation'
Vue.use(Navigation, { router, store })

//leaflet地图
import 'leaflet'
import 'leaflet.chinatmsproviders'
import 'leaflet/dist/leaflet.css'

import map from '@/assets/scripts/map';
Vue.prototype.$map = map

//移动端自适应
import '@/assets/scss/base.scss';

import 'mint-ui/lib/style.css'

//icon
import icon from "@/components/aepIcon.vue";
Vue.component('icon', icon)
import '@/assets/icons/back'
import '@/assets/icons/right'
import '@/assets/icons/location'
import '@/assets/icons/attachment'

import HeaderBar from '@/components/HeaderBar.vue'
Vue.component('HeaderBar', HeaderBar)

// api接口
import api from '@/assets/scripts/api'
Vue.prototype.$api = api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
})
