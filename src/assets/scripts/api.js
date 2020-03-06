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
    fun: 'uploadAttachment',
    interface: '/api/ZGEntExtend/UploadEntExtendAttachment',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 新增更新自贡企业环境属性
  {
    fun: 'updateZGEnviromentalProps',
    interface: '/api/ZGEntExtend/UpdateZGEnviromentalProps',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 根据类别获取自贡企业排放标准列表（不分页）
  {
    fun: 'getZGStandardList',
    interface: '/api/ZGEntExtend/GetZGStandardList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 新增更新自贡企业排放口信息
  {
    fun: 'updateZGOutput',
    interface: '/api/ZGEntExtend/UpdateZGOutput',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 新增更新企业污染治理设施
  {
    fun: 'updateZGTreatFacility',
    interface: '/api/ZGEntExtend/UpdateZGTreatFacility',
    type: 'post',
    serviceName: 'serviceEnt'
  },

  //ent
  //获取站点列表
  {
    fun: 'getSiteList',
    interface: '/api/mod/GetAllEnterprise',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  //获取超标企业信息
  {
    fun: 'getAlarmList',
    interface: '/api/appEnterprise/GetEnterpriseList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 获取排口厂界超标统计
  {
    fun: 'getEnterpriseReport',
    interface: '/api/appEnterprise/GetEnterpriseReport',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 获取历史报警预警记录
  {
    fun: 'getAllAlarmList',
    interface: '/api/PDO/GetAlarmList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 获取站点历史报警预警记录
  {
    fun: 'getSiteAlarmList',
    interface: '/api/appEnterprise/GetAlarmList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    fun: 'getAlarmCount',
    interface: '/api/appEnterprise/GetAlarmCount',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 获取站点所有排口及排口下的因子
  {
    fun: 'getPortOnlinelast',
    interface: '/api/AppEnterprise/GetPortOnlinelast',
    type: 'get',
    serviceName: 'serviceEnt'
  },
  // 获取24小时或者30天数据
  {
    fun: 'getPortFactorList',
    interface: '/api/AppEnterprise/GetPortFactorList',
    type: 'get',
    serviceName: 'serviceEnt'
  },
  // 获取企业信息
  {
    fun: 'getEnterpriseByid',
    interface: '/api/Modmanage/GetEnterpriseByid',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  // 获取token
  {
    fun: 'getToken',
    interface: 'token',
    type: 'post',
    serviceName: 'serviceStoken'
  },
  // 获取企业在线个数
  {
    fun: 'getEnterOnlineData',
    interface: '/api/PDO/GetEnterOnlineData',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 获取排口在线个数
  {
    fun: 'getDataCount',
    interface: '/api/PDO/GetDataCount',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 区域在线个数
  {
    fun: 'getPollpermitDetail',
    interface: '/api/DHC/GetPollpermitDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 超标实时推送
  {
    fun: 'getBoundaryPush',
    interface: '/api/pdo/GetBoundaryPush',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 企业个数
  {
    fun: 'getEnterCount',
    interface: '/api/modmanage/GetEnterCount',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  // 污染源列表
  {
    fun: 'getAllLocationLatLng',
    interface: '/api/PDO/GetAllLocationLatLng',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 年度计划
  {
    fun: 'getAchProject',
    interface: 'ach/Api/AchProject/PagedList',
    type: 'post',
    serviceName: 'serviceZsEnv'
  },
  // 年度计划列表
  {
    fun: 'getTasksDetailByProject',
    interface: 'ach/Api/AchProject/GetTasksDetailByProject',
    type: 'get',
    serviceName: 'serviceZsEnv'
  },
  // 获取方案的子计划/行动
  {
    fun: 'getTasksByProject',
    interface: 'ach/Api/AchProject/GetTasksByProject',
    type: 'get',
    serviceName: 'serviceZsEnv'
  },
  // 获取部门
  {
    fun: 'getDepartmentByKey',
    interface: '/api/Modmanage/GetDepartmentByKey',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  // 获取部门下用户
  {
    fun: 'getDepartmentByid',
    interface: '/api/Modmanage/GetDepartmentByid',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  // 获取部门下用户信息
  {
    fun: 'getUserByArrUserID',
    interface: '/api/Fw/GetUserByArrUserID',
    type: 'post',
    serviceName: 'serviceStoken'
  },
  // 获取部门及其信息
  {
    fun: 'getDepartmentAll',
    interface: '/api/Modmanage/GetDepartmentAll',
    type: 'get',
    serviceName: 'serviceMyserv'
  },


  //env
  //获取空气站列表最新质量及PM2.5
  {
    fun: 'getLastAQIVals',
    interface: '/Api/FactorData/GetLastAQIValsForPhone',
    type: 'get',
    serviceName: 'serviceEnv'
  },
  //获取站点相关联因子
  {
    fun: 'getFactorList',
    interface: '/Api/location/GetFactorListSortedPost',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取站点各关联因子最新数值
    fun: 'getFacVals',
    interface: '/Api/FactorData/GetLastFacValsPost',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  // {
  //   //获取站点列表
  //   fun: 'getSiteList',
  //   interface: '/Api/location/PagedList',
  //   type: 'post',
  //   serviceName: 'serviceEnv'
  // },
  {
    //获取单个站点时间段内单因子的数值
    fun: 'getFactVal',
    interface: '/Api/FactorData/GetFactValPost',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取所有空气站点的6因子最新平均值Iaqi等
    fun: 'getAirFactVals',
    interface: '/Api/FactorData/LastValIaqiInList',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取空气站点当前最新空气质量评价
    fun: 'getAriEvaluate',
    interface: '/Api/FactorData/GetLastAQIValPost',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取地表水断面列表（含最新等级）
    fun: 'getPagedListWithLastGrade',
    interface: '/Api/Section/PagedListWithLastGrade',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取多个水站点时间范围内的水质评价详情
    fun: 'getWaterRefsGradeAndVals',
    interface: '/api/FactorData/GetWaterRefsGradeAndVals',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //蓝天保卫战
    fun: 'getLastValIaqiForAllPoint',
    interface: '/api/FactorData/LastValIaqiForAllPoint',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //脱机数据？
    fun: 'getCheckAllStationConn',
    interface: '/api/FactorData/CheckAllStationConn',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //时间段内空气优良比率
    fun: 'getAirRateCalculateForMultiple',
    interface: '/api/FactorData/AirRateCalculateForMultiple',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //时间段内空气预测
    fun: 'getAirRateCalculateForecastForMultiple',
    interface: '/api/FactorData/AirRateCalculateForecastForMultiple',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //时间段内因子平均值？
    fun: 'getFactAvgValForMultiple',
    interface: '/api/FactorData/FactAvgValForMultiple',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //时间段内因子预测
    fun: 'getFactAvgValForecastForMultiple',
    interface: '/api/FactorData/FactAvgValForecastForMultiple',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //空气首要污染物占比
    fun: 'getAirPollFactPercentForMultiple',
    interface: '/api/FactorData/AirPollFactPercentForMultiple',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //空气首要污染物占比预测
    fun: 'getAirPollFactPercentForecastForMultiple',
    interface: '/api/FactorData/AirPollFactPercentForecastForMultiple',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //空气站点列表
    fun: 'getAirPagedList',
    interface: '/api/Airpoint/PagedList',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  //获取站点经纬度
  {
    fun: 'getLocationLatLng',
    interface: '/api/pdo/GetLocationLatLng',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 权限
  {
    fun: 'getToken',
    interface: '/token',
    type: 'post',
    serviceName: 'serviceStoken'
  },
  //大气环境质量排行榜  （东营特有）
  {
    fun: 'getDyzhzs',
    interface: '/env/api/mod/dyzhzs',
    type: 'post',
    serviceName: 'serviceDyenv'
  },
  {
    //MESSAGE报预警消息接口获取列表
    fun: 'getMsgList',
    interface: '/Api/Message/PagedList',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取地表水全部因子修约清单
    fun: 'getWaterFactorList',
    interface: '/api/FactorSort/PagedList',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取地表水单因子多点位最新值列表
    fun: 'getLastRefFacVals',
    interface: '/api/FactorData/GetLastRefFacVals',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取空气站时间段内AQI数据
    fun: 'getAQIVals',
    interface: '/Api/FactorData/GetAQIValsPost',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取不达标因子以及cwqi值
    fun: 'getWaterRefsGradeAndValsAvg',
    interface: '/api/FactorData/GetWaterRefsGradeAndValsAvg',
    type: 'post',
    serviceName: 'serviceEnv'
  },
  {
    //获取userid
    fun: 'getUser',
    interface: '/api/Fw/GetUser',
    type: 'get',
    serviceName: 'serviceStoken'
  },
  {
    //获取登录人员所在网格信息
    fun: 'getStaffInfo',
    interface: '/api/GBM/GetStaffInfo',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //获取事件列表
    fun: 'getIncidentsByKey',
    interface: '/api/gbm/GetIncidentsByKey',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //获取模块id
    fun: 'getmodsList',
    interface: '/api/fw/getmodsList',
    type: 'get',
    serviceName: 'serviceStoken'
  },
  {
    //获取type数据
    fun: 'getRolePermission',
    interface: '/api/FW/GetRolePermission',
    type: 'post',
    serviceName: 'serviceStoken'
  },
  {
    //事件详情
    fun: 'getIncidentDetail',
    interface: '/api/GBM/GetIncidentDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //任务模板
    fun: 'getTemplateByKey',
    interface: '/api/GBM/GetTemplateByKey',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //添加和更新事件
    fun: 'updateincident',
    interface: '/api/gbm/updateincident',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //企业列表
    fun: 'getEnterpriseList',
    interface: '/api/mod/GetEnterpriseList',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //企业信息
    fun: 'getEnterpriseByid',
    interface: '/api/Modmanage/getEnterpriseByid',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //部门
    fun: 'getDepartmentAll',
    interface: '/api/Modmanage/GetDepartmentAll',
    type: 'get',
    serviceName: 'serviceMyserv'
  },
  {
    //部门
    fun: 'getUserByArrUserID',
    interface: '/api/Fw/GetUserByArrUserID',
    type: 'post',
    serviceName: 'serviceStoken'
  },
  {
    //任务人员信息
    fun: 'getStaffInfo',
    interface: '/api/GBM/GetStaffInfo',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //网格地区
    fun: 'getGridCellTree',
    interface: '/api/GBM/GetGridCellTree',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //发布任务
    fun: 'updatetask',
    interface: '/api/GBM/updatetask',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //任务列表
    fun: 'getTasksByKey',
    interface: '/api/GBM/GetTasksByKey',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //上传图片
    fun: 'upload',
    interface: '/api/GBM/UploadAttachment',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //任务详情
    fun: 'getTaskDetail',
    interface: '/api/GBM/GetTaskDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //任务执行记录
    fun: 'getTaskHandleList',
    interface: '/api/GBM/GetTaskHandleList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //事件列表
    fun: 'getIncidentsByKey',
    interface: '/api/GBM/GetIncidentsByKey',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //任务执行详情
    fun: 'getTaskHandleDetail',
    interface: '/api/GBM/GetTaskHandleDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //获取污染源企业列表
    fun: 'getEnterpriseList',
    interface: '/api/mod/GetEnterpriseList',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //获取下发消息列表
    fun: 'getMsgList',
    interface: '/api/GBM/GetDisseminateByKeyNew',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //任务考核
    fun: 'getGridTaskAssessment',
    interface: '/api/GBM/GetGridTaskAssessment',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //获取下发消息详情
    fun: 'getMsgDetail',
    interface: '/api/GBM/GetDisseminateDetailNew',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //底层任务考核
    fun: 'getGridAssessmentDetail',
    interface: '/api/GBM/GetGridAssessmentDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //鱼山石化企业总数统计
    fun: 'GetLocationOnlineData',
    interface: '/api/pdo/GetLocationOnlineData',
    type: 'post',
    serviceName: 'serviceStoken'
  },
  {
    //获取下发人详情
    fun: 'getUserRole',
    interface: '/api/Fw/GetUserByArrUserid',
    type: 'post',
    serviceName: 'serviceStoken'
  },
  {
    //更新事件状态为完成
    fun: 'complateEvent',
    interface: '/api/gbm/UpdateIncidentStateToComplete',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //鱼山石化分布统计
    fun: 'GetDataCount',
    interface: '/api/pdo/GetDataCount',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //获取当前登录用户所在部门下已完成的事件列表
    fun: 'getHandleEventLists',
    interface: '/api/gbm/GetHandledIncidentsByKey',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //鱼山石化分布统计
    fun: 'GetAllLocationLatLng',
    interface: '/api/pdo/GetAllLocationLatLng',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //添加和更新事件跟进记录
    fun: 'updateincidentfollowup',
    interface: '/api/gbm/updateincidentfollowup',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //鱼山石化排口统计
    fun: 'GetEnterOnlineData',
    interface: '/api/pdo/GetEnterOnlineData',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //事件跟进记录详情
    fun: 'getIncidentFollowupDetail',
    interface: '/api/gbm/GetIncidentFollowupDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //根据企业id获取企业名字
    fun: 'GetAllEnterpriseByarrid',
    interface: '/api/mod/GetAllEnterpriseByarrid',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //超标实时推送
    fun: 'GetBoundaryPush',
    interface: '/api/pdo/GetBoundaryPush',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //行政处罚
    fun: 'GetPunishmentDetail',
    interface: '/api/DHC/GetPunishmentDetail',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //事件跟进记录详情
    fun: 'getUserByid',
    interface: '/api/fw/GetUserByid',
    type: 'get',
    serviceName: 'serviceStoken'
  },
  {
    //附件上传
    fun: 'uploadAttachment',
    interface: '/api/GBM/UploadAttachment',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //添加任务记录
    fun: 'updatetaskhandle',
    interface: '/api/GBM/updatetaskhandle',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //工业分类
    fun: 'getIndustrialType',
    interface: '/api/mod/GetIndustrialType',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //更新企业信息
    fun: 'updateEnterprise',
    interface: '/api/Modmanage/UpdateEnterprise',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //更新企业附加信息
    fun: 'updateZGEnterpriseExtend',
    interface: '/api/ZG/UpdateZGEnterpriseExtend',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  {
    //添加产品
    fun: 'addProduct',
    interface: '/api/Modmanage/AddProduct',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //删除产品
    fun: 'deleteProductid',
    interface: '/api/Modmanage/DeleteProductid',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //添加材料
    fun: 'addMaterial',
    interface: '/api/Modmanage/AddMaterial',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //删除材料
    fun: 'deleteRawMaterialByid',
    interface: '/api/Modmanage/DeleteRawMaterialByid',
    type: 'post',
    serviceName: 'serviceMyserv'
  },
  {
    //环境标准\检测方法\ 环境知识 相关接口
    fun: 'getDocumentList',
    interface: 'api/modmanage/GetDocumentList',
    type: 'post',
    serviceName: 'serviceMyserv'
  }
]

import {
  Toast
} from 'mint-ui'

api.logout = () => {
  if (window.logOut) {
    window.logOut()
  }
  let userAgent = window.navigator.userAgent
  let state = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (state) {
    if (window.webkit && window.webkit.messageHandlers) {
      window.webkit.messageHandlers.logOut.postMessage(null)
    }
  }
}

api.backHome = () => {
  if (window.backHome) {
    window.backHome()
  }
  let userAgent = window.navigator.userAgent
  let state = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (state) {
    if (window.webkit && window.webkit.messageHandlers) {
      window.webkit.messageHandlers.backHome.postMessage(null)
    }
  }
}

interfaces.forEach(method => {
  api[method.fun] = payload => {
    return new Promise(resolve => {
      service[method.serviceName][method.type](method.interface, payload).then(res => {
        if (res === 'ERROR401') {
          // 获取数据失败,正在重试...
          api[method.fun](payload).then(sonres => {
            if (sonres === 'ERROR401') {
              Toast('获取数据失败, 请重新登录')
              api.logout()
            } else {
              resolve(sonres)
            }
          })
        } else {
          resolve(res)
        }
      })
    })
  }
})

export default api