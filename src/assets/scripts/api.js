import service from "./customAxios"
let api = {}

//请求接口集合
const interfaces = [
  //获取企业基本信息详情
  {
    fun: "getZGEnterpriseByid",
    interface: "/ZGEntExtend/GetZGEnterpriseByid",
    type: "post",
    serviceName: "serviceApi"
  },
  //获取企业扩展基本信息详情
  {
    fun: "getZGEnterpriseExtendByid",
    interface: "/ZGEntExtend/GetZGEnterpriseExtendByid",
    type: "post",
    serviceName: "serviceApi"
  },
  //获取企业扩展基本信息详情
  {
    fun: "getZGEnvironmentalProps",
    interface: "/ZGEntExtend/GetZGEnvironmentalProps",
    type: "post",
    serviceName: "serviceApi"
  },
  //根据企业Id和类型获取排放口信息列表
  {
    fun: "getZGOutputList",
    interface: "/ZGEntExtend/GetZGOutputList",
    type: "post",
    serviceName: "serviceApi"
  },
  //根据id获取排放口信息
  {
    fun: "getZGOutputDetail",
    interface: "/ZGEntExtend/GetZGOutputDetail",
    type: "post",
    serviceName: "serviceApi"
  },
  //获取监测数据列表
  {
    fun: "getZGDataList",
    interface: "/ZGEntExtend/GetZGDataList",
    type: "post",
    serviceName: "serviceApi"
  },
  // 根据id获取监测数据详情
  {
    fun: "getZGDataDetail",
    interface: "/ZGEntExtend/GetZGDataDetail",
    type: "post",
    serviceName: "serviceApi"
  },
  // 根据企业id和分类获取企业污染治理设施列表
  {
    fun: "getZGTreatFacilityList",
    interface: "/ZGEntExtend/GetZGTreatFacilityList",
    type: "post",
    serviceName: "serviceApi"
  },
  // 根据id获取企业污染治理设施详情
  {
    fun: "getZGTreatFacilityDetail",
    interface: "/ZGEntExtend/GetZGTreatFacilityDetail",
    type: "post",
    serviceName: "serviceApi"
  },
  // 根据id下载附件
  {
    fun: "downAttachmentFiles",
    interface: "/ZGEntExtend/DownAttachmentFiles",
    type: "get",
    serviceName: "serviceApi"
  },
  // 上传附件
  {
    fun: "uploadAttachment",
    interface: "/ZGEntExtend/UploadEntExtendAttachment",
    type: "post",
    serviceName: "serviceApi"
  },
  // 新增更新自贡企业环境属性
  {
    fun: "updateZGEnviromentalProps",
    interface: "/ZGEntExtend/UpdateZGEnviromentalProps",
    type: "post",
    serviceName: "serviceApi"
  },
  // 根据类别获取自贡企业排放标准列表（不分页）
  {
    fun: "getZGStandardList",
    interface: "/ZGEntExtend/GetZGStandardList",
    type: "post",
    serviceName: "serviceApi"
  },
  // 新增更新自贡企业排放口信息
  {
    fun: "updateZGOutput",
    interface: "/ZGEntExtend/UpdateZGOutput",
    type: "post",
    serviceName: "serviceApi"
  },
  // 新增更新企业污染治理设施
  {
    fun: "updateZGTreatFacility",
    interface: "/ZGEntExtend/UpdateZGTreatFacility",
    type: "post",
    serviceName: "serviceApi"
  }
]


interfaces.forEach(method => {
  api[method.fun] = payload => {
    return service[method.serviceName][method.type](method.interface, payload)
  }
})


export default api