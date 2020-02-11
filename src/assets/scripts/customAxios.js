import axios from 'axios'
import Cookies from 'js-cookie'
const TokenKey = 'aepToken'
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
      config.url = prefix + config.url
      if (!config.data || !config.data.loading) {
        store.commit("set_loading", true)
      }
      if (Cookies.get(TokenKey)) {
        config.headers['Authorization'] = 'Bearer ' + Cookies.get(TokenKey) // 让每个请求携带自定义token 请根据实际情况自行修改
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
      return Promise.reject(error)
    })
  return service
}

const serviceApi = customAxios('/api')
const serviceEnt = customAxios('/ent')
const serviceStoken = customAxios('/stoken')

export default {
  serviceApi,
  serviceEnt,
  serviceStoken
}