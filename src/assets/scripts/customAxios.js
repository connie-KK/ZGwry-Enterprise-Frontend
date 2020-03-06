import axios from 'axios'
import Cookies from 'js-cookie'
import store from '@/store'

const customAxios = (prefix = '') => {
  let service = null
  service = axios.create({})

  let requestInstance = null
  let responseInstance = null
  if (!!requestInstance || requestInstance === 0) {
    axios.interceptors.request.eject(requestInstance)
  }
  if (!!responseInstance || responseInstance === 0) {
    axios.interceptors.response.eject(requestInstance)
  }

  // request拦截器
  requestInstance = service.interceptors.request.use(
    config => {
      if (process.env.NODE_ENV === 'development') {
        config.url = prefix + config.url
      } else {
        if (prefix === "/stoken") {
          config.url = 'http://183.220.144.57:30000' + config.url
        }
        if (prefix === "/ent") {
          config.url = 'http://183.220.144.57:30002' + config.url
        }
        if (prefix === "/env") {
          config.url = 'http://183.220.144.57:30003' + config.url
        }
        if (prefix === "/myserv") {
          config.url = 'http://183.220.144.57:30001' + config.url
        }
      }
      if (!config.data || !config.data.loading) {
        store.commit("set_loading", true)
      }
      if (Cookies.get('AzuraCookie')) {
        config.headers['Authorization'] = 'Bearer ' + Cookies.get('AzuraCookie') // 让每个请求携带自定义token 请根据实际情况自行修改
      }
      return config
    },
    error => {
      console.log('%c Error', 'color:white;background-color:#D33F49', error) // for debug
      return Promise.reject(err)
    }
  )
  // response 拦截器
  responseInstance = service.interceptors.response.use(
    response => {
      store.commit("set_loading", false)
      return response.data
    },
    error => {
      store.commit("set_loading", false)
      if (error.response.status === 401) {
        return 'ERROR401'
      }
      return Promise.reject(error)
    })
  return service
}

const serviceEnt = customAxios('/ent')
const serviceEnv = customAxios('/env')
const serviceStoken = customAxios('/stoken')
const serviceMyserv = customAxios('/myserv')

export default {
  serviceEnt,
  serviceEnv,
  serviceStoken,
  serviceMyserv
}