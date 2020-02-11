import service from './customAxios'
let api = {}

//请求接口集合
const interfaces = [
  //获取企业基本信息详情
  {
    fun: 'getZGEnterpriseByid',
    interface: '/api/ZGEntExtend/GetZGEnterpriseByid',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  //获取企业扩展基本信息详情
  {
    fun: 'getZGEnterpriseExtendByid',
    interface: '/api/ZGEntExtend/GetZGEnterpriseExtendByid',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  //获取企业扩展基本信息详情
  {
    fun: 'getZGEnvironmentalProps',
    interface: '/api/ZGEntExtend/GetZGEnvironmentalProps',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  //根据企业Id和类型获取排放口信息列表
  {
    fun: 'getZGOutputList',
    interface: '/api/ZGEntExtend/GetZGOutputList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  //根据id获取排放口信息
  {
    fun: 'getZGOutputDetail',
    interface: '/api/ZGEntExtend/GetZGOutputDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  //获取监测数据列表
  {
    fun: 'getZGDataList',
    interface: '/api/ZGEntExtend/GetZGDataList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 根据id获取监测数据详情
  {
    fun: 'getZGDataDetail',
    interface: '/api/ZGEntExtend/GetZGDataDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 根据企业id和分类获取企业污染治理设施列表
  {
    fun: 'getZGTreatFacilityList',
    interface: '/api/ZGEntExtend/GetZGTreatFacilityList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 根据id获取企业污染治理设施详情
  {
    fun: 'getZGTreatFacilityDetail',
    interface: '/api/ZGEntExtend/GetZGTreatFacilityDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 根据id下载附件
  {
    fun: 'downAttachmentFiles',
    interface: '/api/ZGEntExtend/DownAttachmentFiles',
    type: 'get',
    serviceName: 'serviceEnt'
  },
  // 获取许可证 相关文件
  {
    fun: 'getPollpermitsByid',
    interface: '/api/Enterprise/GetPollpermitsByid',
    type: 'get',
    serviceName: 'serviceEnt'
  },
  // 上传文件
  {
    fun: 'uploadEntExtendAttachment',
    interface: '/api/ZGEntExtend/UploadEntExtendAttachment',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 环境属性
  {
    fun: 'updateZGEnviromentalProps',
    interface: '/api/ZGEntExtend/UpdateZGEnviromentalProps',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 环境属性
  {
    fun: 'getZGEnvironmentalProps',
    interface: '/api/ZGEntExtend/GetZGEnvironmentalProps',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 环境属性
  {
    fun: 'getZGTaskList',
    interface: '/api/GBM/GetZGTaskList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 上传文件  许可证
  {
    fun: 'uploadPollFiles',
    interface: '/api/enterprise/UploadPollFiles',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 上传文件  应急计划
  {
    fun: 'uploadEmergplanFiles',
    interface: '/api/enterprise/UploadEmergplanFiles',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 上传文件  其它有关附件
  {
    fun: 'uploadAttachmentFiles',
    interface: '/api/enterprise/UploadAttachmentFiles',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 上传文件  平面及工艺
  {
    fun: 'uploadEntdrawingFiles',
    interface: '/api/enterprise/UploadEntdrawingFiles',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 更新 许可证
  {
    fun: 'updatePollpermits',
    interface: '/api/Enterprise/UpdatePollpermits',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 获取用户信息
  {
    fun: 'getUserByArrUserID',
    interface: '/api/Fw/GetUserByArrUserID',
    type: 'post',
    serviceName: 'serviceStoken'
  },
  // 上传附件
  {
    fun: "uploadAttachment",
    interface: "/api/ZGEntExtend/UploadEntExtendAttachment",
    type: "post",
    serviceName: "serviceEnt"
  },
  // 新增更新自贡企业环境属性
  {
    fun: "updateZGEnviromentalProps",
    interface: "/api/ZGEntExtend/UpdateZGEnviromentalProps",
    type: "post",
    serviceName: "serviceEnt"
  },
  // 根据类别获取自贡企业排放标准列表（不分页）
  {
    fun: "getZGStandardList",
    interface: "/api/ZGEntExtend/GetZGStandardList",
    type: "post",
    serviceName: "serviceEnt"
  },
  // 新增更新自贡企业排放口信息
  {
    fun: "updateZGOutput",
    interface: "/api/ZGEntExtend/UpdateZGOutput",
    type: "post",
    serviceName: "serviceEnt"
  },
  // 新增更新企业污染治理设施
  {
    fun: "updateZGTreatFacility",
    interface: "/api/ZGEntExtend/UpdateZGTreatFacility",
    type: "post",
    serviceName: "serviceEnt"
  }
]

interfaces.forEach(method => {
  api[method.fun] = payload => {
    return service[method.serviceName][method.type](method.interface, payload)
  }
})

export default api