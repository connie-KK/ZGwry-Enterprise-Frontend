import router from '@/router/dashboard/index'
import cookie from 'js-cookie'

router.beforeEach((to, from, next) => {
    if(cookie.get('linkData') === '/noticeList'){
        router.push("/noticeList")
    }else{
        router.push("/home")
    }
    next()
})