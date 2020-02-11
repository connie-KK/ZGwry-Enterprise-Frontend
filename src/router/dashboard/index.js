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
  base: `${process.env.BASE_URL}/dashboard`,
  routes: [{
      path: '/home/:id',
      name: 'home',
      component: () => import('@/views/dashboard/home/index.vue')
    },
    {
      path: '/emissions',
      name: 'emissions',
      component: () => import('@/views/dashboard/emissions/index.vue')
    },
    {
      path: '/emissionsDetail/:id',
      name: 'emissionsDetail',
      component: () => import('@/views/dashboard/emissions/detail.vue')
    },
    {
      path: '/emissionsMap/:id',
      name: 'emissionsMap',
      component: () => import('@/views/dashboard/emissions/map.vue')
    },
    {
      path: '/pollution',
      name: 'pollution',
      component: () => import('@/views/dashboard/pollution/index.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('@/views/dashboard/detail.vue')
    },
    {
      path: '/example',
      name: 'example',
      component: () => import('@/views/dashboard/example/index.vue')
    },
    {
      path: '/business',
      name: 'business',
      component: () => import('@/views/dashboard/business/index.vue')
    },
    {
      path: '/license',
      name: 'license',
      component: () => import('@/views/dashboard/license/index.vue')
    },
    {
      path: '/envParams',
      name: 'envParams',
      component: () => import('@/views/dashboard/envParams/index.vue')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})