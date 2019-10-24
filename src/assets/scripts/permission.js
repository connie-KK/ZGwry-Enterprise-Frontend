import router from '../../router'
import cache from 'store'
import api from './api'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (cache.get('token')) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      api.logout()
    }
  }
})

router.afterEach(() => {
})
