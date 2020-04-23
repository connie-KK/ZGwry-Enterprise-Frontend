<template>
  <div>
    <header-bar leftIcon="back"
                :customBack="backFun"
                leftText="返回">{{ moduleName }}</header-bar>
    <div class="main-content">
      <mt-popup v-model="popupVisible1"
                position="bottom">
        <mt-picker :slots="slots1"
                   @change="onValuesChange1"
                   valueKey="name"
                   :defaultIndex="defaultIndex1"></mt-picker>
      </mt-popup>
      <mt-popup v-model="popupVisible2"
                position="bottom">
        <mt-picker :slots="slots2"
                   @change="onValuesChange2"
                   valueKey="name"
                   :defaultIndex="defaultIndex2"></mt-picker>
      </mt-popup>
      <div class="main-content-box">
        <div class="item-box-f">
          <div class="item-box"
               v-if="isT([1, 2, 7])">
            <p class="item-title">设施名称</p>
            <input v-model="autoParams.facilityname" />
          </div>
          <div class="item-box select-box"
               v-if="isT([1, 2, 7])"
               @click="popupVisible1 = true">
            <p class="item-title">排放口</p>
            <input disabled="disabled"
                   :value="outName" />
          </div>
          <div class="item-box"
               v-if="isT([1, 2, 7])">
            <p class="item-title">净化方法/处理工艺</p>
            <input v-model="autoParams.treatmentprocess" />
          </div>
          <div class="item-box select-box"
               v-if="isT([2])"
               @click="popupVisible2 = true">
            <p class="item-title">废水类别</p>
            <input disabled="disabled"
                   :value="waterTypeName" />
          </div>
          <div class="item-box"
               v-if="isT([1, 2])">
            <span class="switch-label">是否安装专用电表</span>
            <mt-switch class="my-switch"
                       v-model="autoParams.iselectricitymeter"></mt-switch>
          </div>
          <div class="item-box"
               v-if="isT([2])">
            <span class="switch-label">是否安装回用电水表</span>
            <mt-switch class="my-switch"
                       v-model="autoParams.isreusewatermeter"></mt-switch>
          </div>
          <div class="item-box"
               v-if="isT([1, 2, 7])">
            <p class="item-title">备注</p>
            <input v-model="autoParams.remark" />
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="submitBtn"
             @click="updateData">
          <span></span>
          <span>确定</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Switch, Popup, Picker, Toast } from 'mint-ui'
import store from 'store'
export default {
  name: 'pollution',
  components: {
    'mt-switch': Switch,
    'mt-popup': Popup,
    'mt-picker': Picker
  },
  watch: {},
  data () {
    return {
      moduleName: '',
      selectTab: 2,
      id: '',
      tabList: [
        { id: 2, name: '废水治理设施' },
        { id: 1, name: '废气治理设施' },
        { id: 7, name: '固废治理设施' }
      ],
      outList: [],
      popupVisible1: false,
      popupVisible2: false,
      autoParams: {
        id: '',
        enterpriseid: '',
        outputid: '',
        facilityname: '',
        treatmentprocess: '',
        wastewatercategory: 1,
        iselectricitymeter: false,
        isreusewatermeter: false,
        category: 2,
        number: 1,
        remark: ''
      },
      waterTypes: [
        { id: 1, name: '工业废水' },
        { id: 2, name: '养殖废水' },
        { id: 3, name: '生活废水' },
        { id: 4, name: '其他' }
      ]
    }
  },
  computed: {
    outName () {
      if (this.outList.length && this.autoParams.outputid && this.autoParams.outputid) {
        return this.outList.filter(item => {
          return this.autoParams.outputid === item.id
        })[0].name
      } else {
        return ''
      }
    },
    waterTypeName () {
      let waterSelected = this.waterTypes.filter(item => {
        return this.autoParams.wastewatercategory === item.id
      })
      if(Array.isArray(waterSelected) && waterSelected.length == 1){
        return waterSelected[0].name
      }else{
        return ""
      }
    },
    slots1 () {
      return [
        {
          flex: 1,
          values: [
            {
              name: '请选择',
              id: ''
            },
            ...this.outList
          ],
          textAlign: 'center'
        }
      ]
    },
    slots2 () {
      return [
        {
          flex: 1,
          values: this.waterTypes,
          textAlign: 'center'
        }
      ]
    },
    defaultIndex1 () {
      let index = 0
      this.outList.forEach((item, i) => {
        if (item.id === this.autoParams.outputid) {
          index = i + 1
        }
      })
      return index
    },
    defaultIndex2 () {
      let index = 0
      this.waterTypes.forEach((item, i) => {
        if (item.id === this.autoParams.wastewatercategory) {
          index = i
        }
      })
      return index
    }
  },
  created () {
    this.id = this.$route.params.id
    this.selectTab = Number(store.get("pageType").split("-")[1])
    if (this.id.includes('add')) {
      this.autoParams.category = this.selectTab
      this.getZGOutputList()
    }else{
      this.getZGTreatFacilityDetail();
    }
    this.moduleName = this.tabList.filter(item => {
      return this.selectTab === item.id
    })[0].name
  },
  methods: {
    isT (arr) {
      return !!arr.filter(item => {
        return this.selectTab === item
      }).length
    },
    getZGOutputList () {
      this.$api
        .getZGOutputList({
          enterid: this.$store.state.enterId,
          category: this.selectTab,
          pageIndex: 0,
          pageSize: 100
        })
        .then(res => {
          if (res.items) {
            this.outList = res.items
          }
        })
    },
    onValuesChange1 (e) {
      this.autoParams.outputid = e.values[0].id
    },
    onValuesChange2 (e) {
      this.autoParams.wastewatercategory = e.values[0].id
    },
    getZGTreatFacilityDetail () {
      this.$api
        .getZGTreatFacilityDetail({
          id: this.id
        })
        .then(res => {
          res.state = res.state ? true : false
          this.autoParams = res
          this.autoParams.outputid = res.output.id
          this.selectTab = this.autoParams.category
          this.autoParams.iselectricitymeter = !!this.autoParams
            .iselectricitymeter
          this.autoParams.isreusewatermeter = !!this.autoParams
            .isreusewatermeter
          this.getZGOutputList()
        })
    },
    updateData () {
      let data = JSON.parse(JSON.stringify(this.autoParams))
      const text = this.$submitBefore(data,"facilityname","设施名称");
      if (text) {
        Toast(text);
        return false;
      }
      data.state = data.state ? 1 : 0;
      data.enterpriseid = this.$store.state.enterId
      data.rowState = data.id ? 'upd' : 'add'
      data.id = data.id || this.$uuid()
      data.iselectricitymeter = data.iselectricitymeter ? 1 : 0
      data.isreusewatermeter = data.isreusewatermeter ? 1 : 0
      this.$api.updateZGTreatFacility(data).then(res => {
        if (res === true) {
          Toast('保存成功')
          this.$router.replace(`/pollutionDetail/${data.id}`)
        }else{
          Toast(res)
        }
      })
    },
    backFun(){
      this.$router.push("/pollution");
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_flex.scss";
.main-content {
  height: calc(100% - 1.29rem);
  .main-content-box {
    height: calc(100% - 50px - 46px - 1.28rem);
    overflow-y: auto;
  }
}
p {
  margin: 0;
}

.footer {
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1.28rem;
  background: rgba(255, 255, 255, 1);
  .submitBtn {
    @include flexbox;
    @include align-items(center);
    @include justify-content(center);
    width: 6.86rem;
    height: 0.96rem;
    background: rgba(50, 150, 250, 1);
    border-radius: 3px;
    font-size: 0.34rem;
    color: rgba(255, 255, 255, 1);
  }
}

.item-box-f {
  background: #fff;
  border-top: 0.01rem solid #e0e0e0;
  .item-box {
    height: 1.12rem;
    border-bottom: 0.01rem solid #e0e0e0;
    padding-left: 0.32rem;
    padding-right: 0.32rem;
    overflow: hidden;
    &.select-box {
      background: #fff url("../../../assets/images/right.png") no-repeat
        calc(100% - 0.32rem) center;
      background-size: 0.2rem;
    }
    .item-title {
      font-size: 0.24rem;
      line-height: 0.33rem;
      color: #777;
      margin-top: 0.15rem;
    }
    input {
      border: 0;
      font-size: 0.34rem;
      height: 0.48rem;
      margin-top: 0.02rem;
      width: 80%;
      &:disabled {
        color: #333;
        background: #fff;
      }
    }
    span {
      line-height: 1.12rem;
      vertical-align: middle;
    }
    .my-switch {
      float: right;
      top: 0.2rem;
    }
  }
  .switch-label{
    font-size: 0.34rem;
  }
}
.mint-popup-bottom {
  width: 100%;
}
</style>
