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
        key: 'province',
        label: '地区',
        class: 'interval',
        type: 'select',
        options: []
      },
      {
        key: 'city',
        label: '',
        type: 'select',
        options: []
      },
      {
        key: 'district',
        label: '',
        type: 'select',
        options: []
      },
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
        key: 'lng',
        label: '经纬度',
        class: 'interval bke'
      },
      {
        key: 'lat',
        label: '',
        class: 'bkn'
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
        key: 'inriverlng-inriverlat',
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
        label: '是否安装在线监控设备'
      },
      {
        key: 'standardid',
        label: '废气排放标准'
      },
      {
        key: 'height',
        label: '排放口高度（米）'
      },
      {
        key: '',
        label: '排放口经纬度'
      },
      {
        key: 'lat-lng',
        label: '燃料种类'
      },
      {
        key: 'wastedischargelaw',
        label: '废气排放规律'
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
        label: '排放标准'
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
        label: '处理方式'
      },
      {
        key: 'isidentificationmark',
        label: '是否涉及危险废物识别标志'
      },
      {
        key: 'isstored',
        label: '是否贮存危险物'
      },
      {
        key: 'isdangerorwaste',
        label: '是否危废'
      },
      {
        key: 'protectionmeasures',
        label: '污染防护措施'
      },
      {
        key: 'remark',
        label: '备注'
      }
    ],
    monitorHeader: [{
        key: 'monitordate',
        label: '监测日期'
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
    standardLists: [{
        id: '12c183f9-d9ab-4af9-b73c-0653cc6a9f16',
        name: '水温（°C）',
        alarmValue: '25',
        earlyAlarmValue: '22.5'
      },
      {
        id: 'cdfc3c0a-838f-4467-9817-b4d7a17a093d',
        name: 'PH（无量纲）',
        alarmValue: '14',
        earlyAlarmValue: '12.6'
      },
      {
        id: '145c7c84-e14b-40e1-91f1-9762c4a986aa',
        name: '溶解氧（mg/L）',
        alarmValue: '6',
        earlyAlarmValue: '5.4'
      },
      {
        id: 'a39c1438-03a3-4f27-849f-a62b70548dd2',
        name: '高锰酸盐指数（mg/L）',
        alarmValue: '6',
        earlyAlarmValue: '5.4'
      },
      {
        id: '0271198a-ca6e-4b2d-ba84-8872fc9ee9d9',
        name: '氨氮（mg/L）',
        alarmValue: '1',
        earlyAlarmValue: '0.9'
      },
      {
        id: '6207934d-3a8c-4e0c-acdf-779510a4f1b5',
        name: '总磷（mg/L）',
        alarmValue: '0.2',
        earlyAlarmValue: '0.18'
      },
      {
        id: '8a3cb141-ec13-4dec-9d98-704e8e738fdc',
        name: '总氮（mg/L）',
        alarmValue: '1',
        earlyAlarmValue: '0.9'
      },
      {
        id: '14462309-55b7-451c-8d4a-a8bd0e16c982',
        name: '总汞（mg/L）',
        alarmValue: '0.0001',
        earlyAlarmValue: '0.00009'
      },
      {
        id: '60836fa6-bfae-44b3-a8f8-6d0ea52ec38e',
        name: '挥发酚（mg/L）',
        alarmValue: '0.005',
        earlyAlarmValue: '0.0045'
      },
      {
        id: 'c1effa5a-38fb-406a-89da-401693dbd264',
        name: '总铅（mg/L）',
        alarmValue: '0.05',
        earlyAlarmValue: '0.045'
      },
      {
        id: 'e501fed3-a28e-4b16-82d9-df747ba40418',
        name: '电导率（ms/m）',
        alarmValue: '15',
        earlyAlarmValue: '13.5'
      },
      {
        id: 'b77e6cc2-3a1c-4457-b4d8-1ca6b7a6d880',
        name: '叶绿素a（mg/L）',
        alarmValue: '',
        earlyAlarmValue: ''
      },
      {
        id: '2eb67d22-55b4-4187-9959-60a95ffad9e2',
        name: '浊度（null）',
        alarmValue: '',
        earlyAlarmValue: ''
      },
      {
        id: 'E809661B-A83C-484D-8C82-0783548EC559',
        name: '阴离子表面活性剂',
        alarmValue: '0.2',
        earlyAlarmValue: '0.18'
      },
      {
        id: 'FA02F0AB-47A8-4C71-A587-1D6AE6E5509A',
        name: '铜',
        alarmValue: '1',
        earlyAlarmValue: '0.9'
      },
      {
        id: '140CE880-6D70-4892-AA77-218B75E96E7B',
        name: '粪大肠菌群',
        alarmValue: '10000',
        earlyAlarmValue: '9000'
      },
      {
        id: 'C9CCDB96-EED8-4D52-A197-2BDB00BDE868',
        name: '镉',
        alarmValue: '0.005',
        earlyAlarmValue: '0.0045'
      },
      {
        id: 'ABFFF4A7-19A5-4049-B7E5-2D82ACE48FAC',
        name: '氟化物',
        alarmValue: '0.2',
        earlyAlarmValue: '0.18'
      },
      {
        id: '17B87BED-8064-453F-9716-3D4476EF38B2',
        name: '硒',
        alarmValue: '0.01',
        earlyAlarmValue: '0.009'
      },
      {
        id: 'B11F20D2-6937-4029-9C24-560E933C53DD',
        name: 'BOD5',
        alarmValue: '4',
        earlyAlarmValue: '3.6'
      },
      {
        id: '850BA8BF-7D25-4FA6-988E-5FEB229D8C9F',
        name: '石油类',
        alarmValue: '0.05',
        earlyAlarmValue: '0.045'
      },
      {
        id: 'B4AB920A-2297-4F23-BD1B-84D04E75B6EE',
        name: '锌',
        alarmValue: '1',
        earlyAlarmValue: '0.9'
      },
      {
        id: 'CCC034C4-F78A-4094-85CD-A74E8F35108C',
        name: 'COD',
        alarmValue: '20',
        earlyAlarmValue: '18'
      },
      {
        id: '1E5C2CF3-C949-4908-958F-CF9E8C2AFFD6',
        name: '六价铬',
        alarmValue: '0.05',
        earlyAlarmValue: '0.045'
      },
      {
        id: 'C78CFD3A-0327-4268-83C7-E11849C1CDF9',
        name: '砷',
        alarmValue: '0.05',
        earlyAlarmValue: '0.045'
      },
      {
        id: '47311F80-D965-43ED-8DA2-E29A99E256E3',
        name: '生化需氧量',
        alarmValue: '20',
        earlyAlarmValue: '18'
      },
      {
        id: 'BA8C019F-0228-47C1-8E65-E2ABDAF97C0E',
        name: '硫化物',
        alarmValue: '0.2',
        earlyAlarmValue: '0.18'
      },
      {
        id: '8D4A4D36-FD95-4D18-B49D-EA745BD461F8',
        name: '氰化物',
        alarmValue: '0.2',
        earlyAlarmValue: '0.18'
      }
    ],
    // 给事件选择任务
    toEventInfo: null,
    // 给发布任务时的事件信息
    toTaskEvent: '',
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
      type: 1,
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
    gridLevel: '' //当前登录人员对应网格等级
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
    set_toTaskEvent: (state, data) => {
      state.toTaskEvent = data
    },
    set_toTaskEventTitle: (state, data) => {
      state.toTaskEventTitle = data
    }
  },
  actions: {}
})