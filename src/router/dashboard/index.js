import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  base: `${process.env.BASE_URL}/dashboard`,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/dashboard/home.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('@/views/dashboard/detail.vue')
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
