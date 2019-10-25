import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/*
meta决定转场效果，转场效果在APP.vue中判断实现
*/
export default new Router({
  routes: [{
    path: '/home',
    component: require('views/Home.vue')
  }, {
    path: '/login',
    component: require('views/Login.vue')
  }, {
    path: '*',
    redirect: '/home'
  }]
})
