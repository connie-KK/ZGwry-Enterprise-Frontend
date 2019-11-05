import router from '../../router'
import api from './api'
import Cookies from 'js-cookie'
const TokenKey = 'aepToken'


const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (Cookies.get(TokenKey)) {
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
