import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  base: `${process.env.BASE_URL}/viewPages`,
  routes: [
    // {
    //   path: '/home/:id',
    //   name: 'home',
    //   component: () => import('@/views/viewPages/home/index.vue')
    // },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/viewPages/home/index.vue')
    },
    {
      path: '/emissions',
      name: 'emissions',
      component: () => import('@/views/viewPages/emissions/index.vue')
    },
    {
      path: '/emissionsDetail/:id',
      name: 'emissionsDetail',
      component: () => import('@/views/viewPages/emissions/detail.vue')
    },
    {
      path: '/pollutionDetail/:id',
      name: 'pollutionDetail',
      component: () => import('@/views/viewPages/pollution/detail.vue')
    },
    {
      path: '/emissionsMap/:id',
      name: 'emissionsMap',
      component: () => import('@/views/viewPages/emissions/map.vue')
    },
    {
      path: '/pollution',
      name: 'pollution',
      component: () => import('@/views/viewPages/pollution/index.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('@/views/viewPages/detail.vue')
    },
    {
      path: '/example',
      name: 'example',
      component: () => import('@/views/viewPages/example/index.vue')
    },
    {
      path: '/business',
      name: 'business',
      component: () => import('@/views/viewPages/business/index.vue')
    },
    {
      path: '/license',
      name: 'license',
      component: () => import('@/views/viewPages/license/index.vue')
    },
    {
      path: '/envParams',
      name: 'envParams',
      component: () => import('@/views/viewPages/envParams/index.vue')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
