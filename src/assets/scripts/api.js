import service from "./customAxios"
let api = {}

//请求接口集合
const interfaces = [
  //获取空气站列表最新质量及PM2.5
  {
    fun: "getLastAQIVals",
    interface: "FactorData/GetLastAQIValsForPhone",
    type: "get"
  }
]


interfaces.forEach(method => {
  api[method.fun] = payload => {
    return service[method.type](method.interface, payload)
  }
})


export default api