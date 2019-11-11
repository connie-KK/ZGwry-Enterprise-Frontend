// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/views/dashboard/dashboard.vue'

import router from '@/router/dashboard'
import store from '@/store'
import Navigation from 'vue-navigation'

import '@/assets/scss/base.scss';
import '@/assets/icons/back'
import '@/assets/icons/right'
import '@/assets/icons/location'
import '@/assets/icons/search'

import 'mint-ui/lib/style.css'
import map from "@/assets/scripts/map";
Vue.prototype.$map = map;

import HeaderBar from '@/components/HeaderBar.vue'
import icon from "@/components/aepIcon.vue";
Vue.component('HeaderBar', HeaderBar)
Vue.component('icon', icon)

Vue.use(Navigation, {router, store})
// 导入api接口
import api from '@/assets/scripts/customAxios'
Vue.prototype.$api = api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
})
