import Vue from 'vue'
import Vuex from 'vuex'
// import moment from 'moment'
// import store from 'store'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    loading: false,
    enterId: '',
    enterid: '',
    infoToL: {},
    tabData: [{
        id: '1',
        label: '企业信息'
      },
      {
        id: '2',
        label: '许可证/相关文件'
      },
      {
        id: '3',
        label: '环境属性'
      },
      {
        id: '4',
        label: '排放信息',
        secondTab: [{
            id: '4-2',
            label: '废水'
          },
          {
            id: '4-1',
            label: '废气'
          },
          {
            id: '4-6',
            label: '噪声'
          },
          {
            id: '4-7',
            label: '固危废堆场点'
          },
          {
            id: '4-0',
            label: '监测数据'
          }
        ]
      },
      {
        id: '5',
        label: '污染治理设施',
        secondTab: [{
            id: '5-2',
            label: '废水治理设施'
          },
          {
            id: '5-1',
            label: '废气治理设施'
          },
          {
            id: '5-7',
            label: '固废治理设施'
          }
        ]
      },
      {
        id: '6',
        label: '业务信息'
      }
    ],
    pollSourceInfoHeader: [{
        key: 'name',
        label: '企业名称'
      },
      {
        key: 'description',
        label: '企业简介'
      },
      {
        key: 'creditcode',
        label: '统一信用代码'
      },
      {
        key: 'orgcode',
        label: '组织机构代码'
      },
      {
        key: 'buildTime',
        label: '建厂时间',
        type: 'time',
        picker: 'pickera'
      },
      {
        key: 'productionTime',
        label: '投产时间',
        type: 'time',
        picker: 'pickerb'
      },
      {
        key: 'productionState',
        label: '生产状态',
        type: 'select',
        options: [{
            name: '正常营业',
            code: 1
          },
          {
            name: '停业',
            code: 2
          },
          {
            name: '关闭',
            code: 3
          }
        ]
      },
      {
        key: 'isMonitoring',
        label: '是否在线监控',
        type: 'select',
        options: [{
            name: '是',
            code: true
          },
          {
            name: '否',
            code: false
          }
        ]
      },
      {
        key: 'area',
        label: '地区',
        class: 'interval',
        type: 'area'
      },
      // {province
      //   key: 'city',
      //   label: '',
      //   type: 'select',
      //   options: []
      // },
      // {
      //   key: 'district',
      //   label: '',
      //   type: 'select',
      //   options: []
      // },
      {
        key: 'town',
        label: '乡镇/街道'
      },
      {
        key: 'relatePark',
        label: '所属园区'
      },
      {
        key: 'address',
        label: '地址'
      },
      {
        key: 'zipcode',
        label: '邮政编码'
      },
      {
        key: 'telephone',
        label: '电话号码'
      },
      {
        key: 'regioncode',
        label: '行政区编码'
      },
      {
        key: 'fax',
        label: '传真号码'
      },
      {
        key: 'url',
        label: '网址'
      },
      {
        key: 'lnglat',
        label: '经纬度',
        class: 'interval',
        type: 'lnglat'
      },
      {
        key: 'legal',
        label: '法人',
        class: 'interval'
      },
      {
        key: 'contacts',
        label: '联系人'
      },
      {
        key: 'contactsmobile',
        label: '联系人电话'
      },
      {
        key: 'charge',
        label: '环保责任人'
      },
      {
        key: 'chargeMoblie',
        label: '环保责任人电话'
      },
      {
        key: 'contact',
        label: '应急物品联系人'
      },
      {
        key: 'contactstelephone',
        label: '联系人手机号'
      },
      {
        key: 'contactsemail',
        label: '联系人邮箱'
      },
      {
        key: 'envdept',
        label: '企业环保部门'
      },
      {
        key: 'number',
        label: '专职环保人数'
      },
      {
        key: 'Industrialcode',
        label: '行业类别',
        class: 'interval',
        type: 'select',
        options: []
      },
      {
        key: 'scale',
        label: '企业规模',
        type: 'select',
        options: [{
            //企业规模下拉
            name: '1~100人',
            code: 0
          },
          {
            name: '100~500人',
            code: 1
          },
          {
            name: '500~1000人',
            code: 2
          },
          {
            name: '1000人以上',
            code: 3
          }
        ]
      },
      {
        key: 'level',
        label: '控制级别',
        type: 'select',
        options: [{
            //控制级别下拉
            name: '重点',
            code: 3
          },
          {
            name: '一般源',
            code: 4
          }
        ]
      }
    ],
    outputRes: {
      id: '',
      enterpriseid: '',
      name: '',
      isonlinemonitoring: '',
      address: '',
      lng: '',
      lat: '',
      category: '',
      destinationcategory: '',
      inriverlng: '',
      inriverlat: '',
      wastedischargelaw: '',
      height: '',
      fueltypes: '',
      processingmode: '',
      isidentificationmark: '',
      isstored: '',
      isdangerorwaste: '',
      protectionmeasures: '',
      standardid: '',
      remark: ''
    },
    treatRes: {
      id: '',
      enterpriseid: '',
      outputid: '',
      treatmentprocess: '',
      wastewatercategory: '',
      iselectricitymeter: '',
      isreusewatermeter: '',
      category: '',
      number: '',
      remark: ''
    },
    wasteWaterHeader: [{
        key: 'name',
        label: '排放口名称'
      },
      {
        key: 'address',
        label: '排放口位置'
      },
      {
        key: 'isonlinemonitoring',
        label: '是否安装在线监控设备',
        type: 'boolean'
      },
      {
        key: 'standardid',
        label: '废水排放标准',
        icon: 'select'
      },
      {
        key: 'destinationcategory',
        label: '废水排放去向',
        icon: 'select'
      },
      {
        key: 'lat-lng',
        label: '排放口经纬度',
        icon: 'map'
      },
      {
        key: 'inriverlat-inriverlng',
        label: '入河口经纬度',
        icon: 'map'
      },
      {
        key: 'wastedischargelaw',
        label: '废水排放规律',
        icon: 'select'
      },
      {
        key: 'remark',
        label: '备注'
      }
    ],
    exhaustGasHeader: [{
        key: 'name',
        label: '排放口名称'
      },
      {
        key: 'address',
        label: '排放口位置'
      },
      {
        key: 'isonlinemonitoring',
        label: '是否安装在线监控设备',
        type: 'boolean'
      },
      {
        key: 'standardid',
        label: '废气排放标准',
        icon: 'select'
      },
      {
        key: 'height',
        label: '排放口高度（米）'
      },
      {
        key: '',
        label: '排放口经纬度',
        icon: 'map'
      },
      {
        key: 'fueltypes',
        label: '燃料种类',
        icon: 'select'
      },
      {
        key: 'wastedischargelaw',
        label: '废气排放规律',
        icon: 'select'
      },
      {
        key: 'remark',
        label: '备注'
      }
    ],
    noiseHeader: [{
        key: 'name',
        label: '噪声源名称'
      },
      {
        key: 'standardid',
        label: '排放标准',
        icon: 'select'
      },
      {
        key: 'address',
        label: '噪声源位置'
      },
      {
        key: 'remark',
        label: '备注'
      }
    ],
    solidDangerHeader: [{
        key: 'name',
        label: '固危废堆场名称'
      },
      {
        key: 'address',
        label: '堆放地点'
      },
      {
        key: 'processingmode',
        label: '处理方式',
        icon: 'select'
      },
      {
        key: 'isidentificationmark',
        label: '是否涉及危险废物识别标志',
        type: 'boolean'
      },
      {
        key: 'isstored',
        label: '是否贮存危险物',
        type: 'boolean'
      },
      {
        key: 'isdangerorwaste',
        label: '是否危废',
        type: 'boolean'
      },
      {
        key: 'protectionmeasures',
        label: '污染防护措施',
        icon: 'select'
      },
      {
        key: 'remark',
        label: '备注'
      }
    ],
    monitorHeader: [{
        key: 'monitordate',
        label: '监测日期',
        icon: 'date'
      },
      {
        key: 'factorname',
        label: '监测指标'
      },
      {
        key: 'value',
        label: '监测结果'
      }
    ],
    controWaterHeader: [{
        key: 'facilityname',
        label: '设施名称'
      },
      {
        key: 'output',
        label: '排放口'
      },
      {
        key: 'treatmentprocess',
        label: '废水净化方法'
      },
      {
        key: 'wastewatercategory',
        label: '废水类别'
      },
      {
        key: 'iselectricitymeter',
        label: '是否安装专用电表',
        type: 'boolean'
      },
      {
        key: 'isreusewatermeter',
        label: '是否安装回用电水表',
        type: 'boolean'
      },
      {
        key: 'remark',
        label: '备注'
      }
    ],
    controExhaustGasHeader: [{
        key: 'facilityname',
        label: '设施名称'
      },
      {
        key: 'output',
        label: '排放口'
      },
      {
        key: 'treatmentprocess',
        label: '净化方法'
      },
      {
        key: 'iselectricitymeter',
        label: '是否安装专用电表',
        type: 'boolean'
      },
      {
        key: 'remark',
        label: '备注'
      }
    ],
    controSolidDangerHeader: [{
        key: 'facilityname',
        label: '设施名称'
      },
      {
        key: 'treatmentprocess',
        label: '处理工艺'
      },
      {
        key: 'remark',
        label: '备注'
      }
    ],
    latLngArr: [],
    addItem: {},
    tempData: {},
    reRequest: true,
    waterFactor: [{
        key: 'factorname',
        label: '污染物'
      },
      {
        key: 'standardlimit',
        label: '排放标准限值'
      },
      {
        key: 'unitname',
        label: '排放标准单位'
      }
    ],
    enterid: '',
    siteList: [],
    factorList: [],
    siteId: '',
    factorData: {},
    airList: [],
    ariLoaction: [],
    loading: false,
    // 给事件选择任务
    toEventInfo: null,
    // 给发布任务时的事件信息
    toTaskEvent: '',
    followupType: "",
    followupTask: {},
    toTaskEventTitle: '',
    isAddTaskState: 0,
    // 任务
    allDep: [],
    gridCell: null,
    checkGridCell: [],
    userAssInfoList: [],
    taskEnter: [],
    isNewTaskHandelChange: 0,
    taskParams: {
      template: null,
      templateName: '',
      staff: '',
      staffName: '',
      date: '',
      deadline: '',
      type: 0,
      state: 0,
      taskenterprises: [],
      taskcoords: [],
      depType: 1,
      dep: '',
      depStaff: '',
      period: '',
      isManyCell: false,
      incident: '',
      incidentTitle: ''
    },
    eventLatLng: [], //登记事件时，事件的位置
    newDatalist: [], //登记事件时，事件数据
    selectedEnterprise: {
      //当前选中相关企业
      value: '',
      valueKey: ''
    },
    followup: [],
    gridLevel: '', //当前登录人员对应网格等级
    moduleId360: '',
    eventTypeList: [], //事件类型列表
    userInfo: null,
    eventListPageType: 1, //控制事件列表页是否显示代办
    recordCircule: [],
    waitState: false //是否待办
  },
  mutations: {
    set_loading: (state, data) => {
      state.loading = data
    },
    set_latLng: (state, data) => {
      state.latLngArr = data
    },
    set_addItem: (state, data) => {
      state.addItem = data
    },
    set_wasteWaterHeader: (state, data) => {
      state.wasteWaterHeader = data
    },
    set_exhaustGasHeader: (state, data) => {
      state.exhaustGasHeader = data
    },
    set_tempData: (state, data) => {
      state.tempData = data
    },
    set_reRequest: (state, data) => {
      state.reRequest = data
    },
    set_waterFactors: (state, data) => {
      state.waterFactors = data
    },
    set_enterpriseid: (state, data) => {
      state.enterid = data
    },
    set_siteList: (state, data) => {
      state.siteList = data
    },
    set_factorList: (state, data) => {
      state.factorList = data
    },
    set_siteId: (state, data) => {
      state.siteId = data
    },
    set_factorData: (state, data) => {
      state.factorData = data
    },
    set_airList: (state, data) => {
      state.airList = data
    },
    set_ariLoaction: (state, data) => {
      state.ariLoaction = data
    },
    set_loading: (state, data) => {
      state.loading = data
    },
    set_eventLatLng: (state, data) => {
      state.eventLatLng = data
    },
    set_newDatalist: (state, data) => {
      state.newDatalist = data
    },
    set_selectedEnterprise: (state, data) => {
      state.selectedEnterprise = data
    },
    set_followup: (state, data) => {
      state.followup = data
    },
    set_gridLevel: (state, data) => {
      state.gridLevel = data
    },
    set_moduleId360: (state, data) => {
      state.moduleId360 = data
    },
    set_eventTypeList: (state, data) => {
      state.eventTypeList = data
    },
    set_toTaskEvent: (state, data) => {
      state.toTaskEvent = data
    },
    set_followupType: (state, data) => {
      state.followupType = data
    },
    set_followupTask: (state, data) => {
      state.followupTask = data
    },
    set_toTaskEventTitle: (state, data) => {
      state.toTaskEventTitle = data
    },
    set_eventListPageType: (state, data) => {
      state.eventListPageType = data
    },
    set_recordCircule: (state, data) => {
      state.recordCircule = data
    },
    set_waitState: (state, data) => {
      state.waitState = data
    }
  },
  actions: {}
})