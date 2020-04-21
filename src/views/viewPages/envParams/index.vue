<template>
  <div id="envParams">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :customBack="backFun"
    >{{ moduleName }}</header-bar>
    <div class="main-content">
      <nav-bar :selected="3"></nav-bar>
      <mt-popup
        v-model="popupVisible1"
        position="bottom"
      >
        <mt-picker
          :slots="slots1"
          @change="onValuesChange1"
          valueKey="name"
          :defaultIndex="defaultIndex1"
        ></mt-picker>
      </mt-popup>
      <mt-popup
        v-model="popupVisible2"
        position="bottom"
      >
        <mt-picker
          :slots="slots2"
          @change="onValuesChange2"
          valueKey="name"
          :defaultIndex="defaultIndex2"
        ></mt-picker>
      </mt-popup>
      <mt-popup
        v-model="popupVisible3"
        position="bottom"
      >
        <mt-picker
          :slots="slots3"
          @change="onValuesChange3"
          valueKey="name"
          :defaultIndex="defaultIndex3"
        ></mt-picker>
      </mt-popup>
      <mt-popup
        v-model="popupVisible4"
        position="bottom"
      >
        <mt-picker
          :slots="slots4"
          @change="onValuesChange4"
          valueKey="name"
          :defaultIndex="defaultIndex4"
        ></mt-picker>
      </mt-popup>
      <mt-popup
        v-model="popupVisible5"
        position="bottom"
      >
        <mt-picker
          :slots="slots5"
          @change="onValuesChange5"
          valueKey="name"
          :defaultIndex="defaultIndex5"
        ></mt-picker>
      </mt-popup>
      <div class="main-content-box">
        <p class="params-title">环境属性</p>
        <div
          class="item-box"
          @click="popupVisible1 = true"
        >
          <span>水源保护级别</span>
          <input
            type="text"
            disabled="disabled"
            :value="defaultName1"
            placeholder="请选择级别"
          />
        </div>
        <div
          class="item-box"
          @click="popupVisible2 = true"
        >
          <span>水域功能区级别</span>
          <input
            type="text"
            disabled="disabled"
            :value="defaultName2"
            placeholder="请选择级别"
          />
        </div>
        <div
          class="item-box"
          @click="popupVisible3 = true"
        >
          <span>噪声功能区级别</span>
          <input
            type="text"
            disabled="disabled"
            :value="defaultName3"
            placeholder="请选择级别"
          />
        </div>
        <div
          class="item-box"
          @click="popupVisible4 = true"
        >
          <span>空气功能区级别</span>
          <input
            type="text"
            disabled="disabled"
            :value="defaultName4"
            placeholder="请选择级别"
          />
        </div>
        <div class="item-box">
          <span>是否水源区</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.iswaterprotectionarea"
          ></mt-switch>
        </div>
        <p class="gang"></p>
        <p class="params-title">管理属性</p>
        <div class="item-box">
          <span>是否废水产生单位</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.iswatergeneratingunit"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有废水监测仪</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.iswatermonitor"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有废水治理设施</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.iswatertreatmentfacilities"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否废水重点污染源</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.iswaterkeypollutionsources"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否废气产生单位</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isgasgeneratingunit"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有废气监测仪</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isgasmonitor"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有废气治理设施</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isgastreatmentfacilities"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否废气重点污染源</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isgaskeypollutionsources"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否固废生产单位</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.issolidgeneratingunit"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有固废治理设施</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.issolidtreatmentfacilities"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否固废重点污染源</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.issolidkeypollutionsources"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否噪声产生单位</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isnoisegeneratingunit"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有噪声治理措施</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isnoisetreatmentfacilities"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否危废生产单位</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.ishazardousgeneratingunit"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否危废经营单位</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.ishazardousbusinessunit"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有监督性检测</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.issupervisionmonitoring"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否生产产品</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isproduceproducts"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有排污许可证</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isdischargepermit"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否办理环评</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isenvironmentalassessment"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有流量计</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isflowmeter"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有数据采集仪</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isdataacquisitioninstrument"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否城市污水处理厂</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isurbansewagetreatmentplant"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否集中式工业污水处理厂</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.iscentralizedtreatmentplant"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否在三年内发生较大以上突发环境事件或者因环境污染问题造成较大社会影响</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.issocialinfluence"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否重复投诉单位</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isrepeatcomplaintunit"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否风险源</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isrisksource"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否涉源单位</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.issourceunitinvolved"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否有排污口规范化</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isnormalization"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>是否重污染天气减产限排企业</span>
          <mt-switch
            class="my-switch"
            v-model="autoParams.isemissionrestriction"
          ></mt-switch>
        </div>
        <div
          class="item-box"
          @click="popupVisible5 = true"
        >
          <span>环保诚信等级</span>
          <input
            type="text"
            disabled="disabled"
            :value="defaultName5"
            placeholder="请选择级别"
          />
        </div>
        <p class="gang"></p>
        <p class="params-title">环评报告</p>
        <div class="item-box">
          <span>生产工艺</span>
          <input
            type="text"
            v-model="autoParams.productionprocess"
            placeholder="生产工艺"
          />
        </div>
        <div class="item-box">
          <span>污染治理工艺</span>
          <input
            type="text"
            v-model="autoParams.pollutioncontrolprocess"
            placeholder="污染治理工艺"
          />
        </div>
        <div class="file-box">
          <p class="file-box-title">
            附件信息({{ autoParams.attachments.length }})
          </p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span @click="$refs.filebox.click()">添加文件</span>
          </button>
          <ul class="file-list">
            <li
              v-for="(item, index) in autoParams.attachments"
              :key="item.id"
            >
              <p @click="ifDownLoad(item)">{{ item.title }}</p>
              <i @click="deleteFile(index)"></i>
            </li>
          </ul>
        </div>
        <div style="height: 1.28rem;"></div>
        <input
          type="file"
          @change="filesSelected"
          ref="filebox"
          class="file-upload-box"
        />
        <div class="ok-btn">
          <button @click="upDate">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar.vue'
import { Switch, Popup, Picker, MessageBox, Toast } from 'mint-ui'
export default {
  name: 'envParams',
  components: {
    'nav-bar': navBar,
    'mt-switch': Switch,
    'mt-popup': Popup,
    'mt-picker': Picker
  },
  data() {
    return {
      moduleName: '企业信息',
      value: false,
      pros: [
        {
          name: '一级保护区',
          code: 1
        },
        {
          name: '二级保护区',
          code: 2
        },
        {
          name: '准保护区',
          code: 3
        },
        {
          name: '准保护区以外',
          code: 4
        }
      ],
      funs: [
        {
          name: '1-源头水、国家自然保护区',
          code: 1
        },
        {
          name:
            '2-集中式生活饮用水水源地一级保护区、珍贵鱼类保护区、鱼虾产卵场等',
          code: 2
        },
        {
          name: '3-集中式生活饮用水水源地二级保护区、一般鱼类保护区及游泳区',
          code: 3
        },
        {
          name: '4-一般工业用水区及人体非直接接触的娱乐用水区',
          code: 4
        },
        {
          name: '5-农业用水区及一般景观要求水域',
          code: 5
        }
      ],
      noises: [
        {
          name: '0-疗养区、高级别墅区和高级宾馆区',
          code: 0
        },
        {
          name: '1-居住、文教机关为主区',
          code: 1
        },
        {
          name: '2-居住、商业、工业混杂区',
          code: 2
        },
        {
          name: '3-工业区',
          code: 3
        },
        {
          name: '4-城市中的道路交通干线俩侧区，穿越城区的铁路主、干线区域',
          code: 4
        },
        {
          name: '9-尚未划分噪声功能区',
          code: 9
        }
      ],
      airs: [
        {
          name: '1-自然保护区、风景名胜区和其他需要特殊保护的地区',
          code: 1
        },
        {
          name: '2-居住区、商业交通居民混合区、文化区、工业区和农村地区',
          code: 2
        }
      ],
      intLevels: [
        {
          name: '高级',
          code: 1
        },
        {
          name: '中级',
          code: 2
        },
        {
          name: '低级',
          code: 3
        }
      ],
      autoParams: {
        id: '',
        enterpriseid: '',
        waterprotectionlevel: '',
        waterfunctionlevel: '',
        noisefunctionlevel: '',
        airfunctionlevel: '',
        iswaterprotectionarea: false,
        iswatergeneratingunit: false,
        iswatermonitor: false,
        iswatertreatmentfacilities: false,
        iswaterkeypollutionsources: false,
        isgasgeneratingunit: false,
        isgasmonitor: false,
        isgastreatmentfacilities: false,
        isgaskeypollutionsources: false,
        issolidgeneratingunit: false,
        issolidtreatmentfacilities: false,
        issolidkeypollutionsources: false,
        isnoisegeneratingunit: false,
        isnoisetreatmentfacilities: false,
        ishazardousgeneratingunit: false,
        ishazardousbusinessunit: false,
        issupervisionmonitoring: false,
        isproduceproducts: false,
        isdischargepermit: false,
        isenvironmentalassessment: false,
        isflowmeter: false,
        isdataacquisitioninstrument: false,
        isurbansewagetreatmentplant: false,
        iscentralizedtreatmentplant: false,
        issocialinfluence: false,
        isrepeatcomplaintunit: false,
        integritylevel: '',
        isrisksource: false,
        issourceunitinvolved: false,
        isnormalization: false,
        isemissionrestriction: false,
        productionprocess: '',
        pollutioncontrolprocess: '',
        remark: '',
        attachments: []
      },
      popupVisible1: false,
      popupVisible2: false,
      popupVisible3: false,
      popupVisible4: false,
      popupVisible5: false
    }
  },
  computed: {
    slots1() {
      return [
        {
          flex: 1,
          values: this.pros,
          textAlign: 'center'
        }
      ]
    },
    slots2() {
      return [
        {
          flex: 1,
          values: this.funs,
          textAlign: 'center'
        }
      ]
    },
    slots3() {
      return [
        {
          flex: 1,
          values: this.noises,
          textAlign: 'center'
        }
      ]
    },
    slots4() {
      return [
        {
          flex: 1,
          values: this.airs,
          textAlign: 'center'
        }
      ]
    },
    slots5() {
      return [
        {
          flex: 1,
          values: this.intLevels,
          textAlign: 'center'
        }
      ]
    },
    defaultIndex1() {
      let index = 0
      this.pros.forEach((item, i) => {
        if (item.code === this.autoParams.waterprotectionlevel) {
          index = i
        }
      })
      return index
    },
    defaultIndex2() {
      let index = 0
      this.funs.forEach((item, i) => {
        if (item.code === this.autoParams.waterfunctionlevel) {
          index = i
        }
      })
      return index
    },
    defaultIndex3() {
      let index = 0
      this.noises.forEach((item, i) => {
        if (item.code === this.autoParams.noisefunctionlevel) {
          index = i
        }
      })
      return index
    },
    defaultIndex4() {
      let index = 0
      this.airs.forEach((item, i) => {
        if (item.code === this.autoParams.airfunctionlevel) {
          index = i
        }
      })
      return index
    },
    defaultIndex5() {
      let index = 0
      this.intLevels.forEach((item, i) => {
        if (item.code === this.autoParams.integritylevel) {
          index = i
        }
      })
      return index
    },
    defaultName1() {
      let name = ''
      this.pros.forEach(item => {
        if (item.code === this.autoParams.waterprotectionlevel) {
          name = item.name
        }
      })
      return name
    },
    defaultName2() {
      let name = ''
      this.funs.forEach(item => {
        if (item.code === this.autoParams.waterfunctionlevel) {
          name = item.name
        }
      })
      return name
    },
    defaultName3() {
      let name = ''
      this.noises.forEach(item => {
        if (item.code === this.autoParams.noisefunctionlevel) {
          name = item.name
        }
      })
      return name
    },
    defaultName4() {
      let name = ''
      this.airs.forEach(item => {
        if (item.code === this.autoParams.airfunctionlevel) {
          name = item.name
        }
      })
      return name
    },
    defaultName5() {
      let name = ''
      this.intLevels.forEach(item => {
        if (item.code === this.autoParams.integritylevel) {
          name = item.name
        }
      })
      return name
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    filesSelected(e) {
      let files = e.target.files
      let formData = new FormData()
      for (let i = 0; i < files.length; i++) {
        let file = files[i]
        formData.append('file', file)
      }
      this.uploadEntExtendAttachment(formData)
    },
    uploadEntExtendAttachment(files) {
      this.$api.uploadEntExtendAttachment(files).then(res => {
        res.forEach(item => {
          item.rowState = 'add'
        })
        this.autoParams.attachments.push(...res)
      })
    },
    getData() {
      this.$api
        .getZGEnvironmentalProps({
          enterid: this.$store.state.enterId
        })
        .then(res => {
          if (!res) {
            return false
          }
          let data = res
          for (let key in data) {
            if (data[key] === 0) {
              data[key] = false
            }
            if (data[key] === 1 && !key.includes('level')) {
              data[key] = true
            }
          }
          this.autoParams = JSON.parse(JSON.stringify(data))
        })
    },
    upDate() {
      let params = JSON.parse(JSON.stringify(this.autoParams))
      for (let key in params) {
        if (params[key] === true) {
          params[key] = 1
        }
        if (params[key] === false) {
          params[key] = 0
        }
      }
      console.log(params)
      params.id = params.id || this.$uuid()
      params.enterpriseid = this.$store.state.enterId
      this.$api.updateZGEnviromentalProps(params).then(res => {
        if(res === true){
          Toast('保存成功')
          this.getData()
        }else{
          Toast(res)
        }
      })
    },
    deleteFile(index) {
      this.autoParams.attachments.splice(index, 1)
    },
    ifDownLoad(item) {
      MessageBox.confirm('确认下载此文件?').then(action => {
        if (action === 'confirm') {
          this.download(item.id, item.title)
        }
      })
    },
    download(id, name) {
      const url = '/ent/api/ZGEntExtend/DownAttachmentFiles?id=' + id
      const a = document.createElement('a')
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
    },
    onValuesChange1(e) {
      this.autoParams.waterprotectionlevel = e.values[0].code
    },
    onValuesChange2(e) {
      this.autoParams.waterfunctionlevel = e.values[0].code
    },
    onValuesChange3(e) {
      this.autoParams.noisefunctionlevel = e.values[0].code
    },
    onValuesChange4(e) {
      this.autoParams.airfunctionlevel = e.values[0].code
    },
    onValuesChange5(e) {
      this.autoParams.integritylevel = e.values[0].code
    },
    backFun(){
      this.$router.push("/entlist/0")
    }
  }
}
</script>

<style lang="scss" >
#envParams{
.main-content {
  height: calc(100% - 1.29rem);
  .main-content-box {
    border-top: 0.02rem solid #e0e0e0;
  }
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #666;
}
input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #666;
}
input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #666;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #666;
}
.item-box {
  min-height: 1.12rem;
  padding: 0 0.32rem;
  position: relative;
  background: #fff;
  border-bottom: 0.01rem solid #e0e0e0;
  overflow: hidden;
  > * {
    position: absolute;
  }
  span:nth-child(1) {
    line-height: 0.62rem;
    font-size: 0.34rem;
    left: 0.32rem;
    padding: 0.25rem 0;
    position: initial;
    display: block;
    width: 80%;
  }
  input {
    height: 1.1rem;
    font-size: 0.34rem;
    border: 0;
    right: 0.32rem;
    top: 0;
    padding: 0 0.1rem;
    text-align: right;
    color: #333;
    width: 4rem;
    &:disabled {
      padding-right: 0.52rem;
      background: #fff url("../../../assets/images/right.png") no-repeat right
        center;
      background-size: 0.2rem;
      color: #333;
    }
  }
  .my-switch {
    right: 0.32rem;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}
.file-box {
  background: #fff;
  position: relative;
  padding-bottom: 0.16rem;
  .file-box-title {
    color: #333;
    line-height: 0.74rem;
    font-size: 0.34rem;
    padding: 0.19rem 0.32rem;
  }
  .file-box-add-btn {
    width: 2.4rem;
    height: 0.74rem;
    position: absolute;
    right: 0.32rem;
    top: 0.19rem;
    border: 0.01rem solid #3296fa;
    color: #3296fa;
    border-radius: 0;
    &:active {
      background: #fff;
    }
    i {
      font-style: initial;
      width: 0.3rem;
      height: 0.3rem;
      line-height: 0.3rem;
      text-align: center;
      display: inline-block;
      font-size: 0.4rem;
      vertical-align: middle;
    }
    span {
      margin-left: 0.25rem;
      vertical-align: middle;
    }
  }
  .file-list {
    margin-left: 0.48rem;
    margin-right: 0.32rem;
    li {
      background: #f8f8f8;
      min-height: 0.7rem;
      padding: 0 0.2rem;
      margin-bottom: 0.16rem;
      overflow: hidden;
      p {
        float: left;
        background: url("../../../assets/images/file.png") no-repeat left center;
        background-size: 0.3rem;
        line-height: 0.7rem;
        font-size: 0.34rem;
        color: #3296fa;
        padding-left: 0.47rem;
        width: 5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        width: 0.4rem;
        height: 0.4rem;
        float: right;
        background: url("../../../assets/images/close_bg.png") no-repeat left
          center;
        background-size: 0.4rem;
        margin-top: 0.15rem;
      }
      .pic-close {
        margin-top: 0.45rem;
      }
      .pic-box {
        float: left;
        width: 1.2rem;
        height: 1.2rem;
        background: #3296fa;
      }
      .pic-title {
        background: transparent;
        line-height: 1.2rem;
        width: 4.5rem;
        padding-left: 0.1rem;
      }
    }
  }
}
.ok-btn {
  height: 1.28rem;
  margin-top: 0.41rem;
  border-top: 0.01rem solid #e0e0e0;
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  button {
    display: block;
    background: #3296fa;
    border-radius: 0.03rem;
    color: #fff;
    font-size: 0.34rem;
    width: 6.86rem;
    height: 0.96rem;
    margin: 0.16rem auto;
    border: 0;
    &:active {
      background: #3296fa;
    }
  }
}
.params-title {
  height: 0.7rem;
  line-height: 0.7rem;
  padding-left: 0.32rem;
  background: #e5f1f4;
  font-size: 0.34rem;
}
.gang {
  height: 0.4rem;
  background: #f8f8f8;
}
.mint-popup-bottom {
  width: 100%;
}
.file-upload-box {
  float: left;
  display: none;
}
}
</style>
