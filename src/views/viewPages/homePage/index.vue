<template>
  <div>
    <header-bar
      leftIcon="back"
      leftText="返回"
    >{{ moduleName }}</header-bar>
    <div
      class="main-content"
      id="homepage"
    >
      <nav-bar :selected="1"></nav-bar>
      <div class="main-content-box">
        <div v-if="datalist">
          <div
            :class="['list', item.class]"
            v-for="(item, index) in datalist"
            :key="index"
          >
            <p class="label">{{ item.label }}</p>
            <input
              type="text"
              v-model="item.value"
              class="info"
              v-if="!item.type"
            />
            <my-select
              :field-lable="item.label"
              :data="item.options"
              val-key="code"
              val-name="name"
              v-model="item.value"
              v-if="item.type === 'select'"
            ></my-select>
            <my-area
              v-if="item.type === 'area'"
              :value="item.value"
              @submit="getArea"
            ></my-area>
            <my-datetime-picker
              v-if="item.type === 'time'"
              v-model="item.value"
              type="date"
              field-lable="时间"
              format="YYYY-MM-DD"
            ></my-datetime-picker>
            <my-lng-lat
              v-if="item.type === 'lnglat'"
              :lng="item.value ? item.value[0] : 0"
              :lat="item.value ? item.value[1] : 0"
              @submit="submitLngLat"
            ></my-lng-lat>
          </div>
        </div>
        <div class="lists list-header">
          <span
            v-for="(item, index) in listHeader"
            :key="index"
          >
            {{ item }}
          </span>
        </div>
        <div
          v-for="(item, index) in productItems"
          :key="item.id"
          @click="selectItem(productItems, index)"
          :class="['lists', 'list-content', item.class]"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.value }}{{ item.unit }}</span>
        </div>
        <div
          class="add-item-box"
          v-if="productItemsState"
        >
          <input
            style="width:30%;"
            v-model="proItemData.name"
            placeholder="名称"
          />
          <input
            style="width:25%;"
            v-model="proItemData.value"
            placeholder="产量"
          />
          <input
            style="width:25%;"
            v-model="proItemData.unit"
            placeholder="单位"
          />
          <button @click="addProItem">确定</button>
        </div>
        <div class="listBtnGroup">
          <div
            class="addBtn listBtn"
            @click="productItemsState = true"
          >
            <span></span>
            <span>添加</span>
          </div>
          <div
            class="delBtn listBtn"
            @click="deleteItem('productItems', 'deleteProductid')"
          >
            <span></span>
            <span>删除</span>
          </div>
        </div>
        <div class="lists list-header second-header">
          <span
            v-for="(item, index) in listHeaderFactor"
            :key="index"
          >
            {{ item }}
          </span>
        </div>
        <div
          class="lists list-content"
          v-for="(item, index) in materialItmes"
          :key="item.id"
          @click="selectItem(materialItmes, index)"
          :class="item.class"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.value }}{{ item.unit }}</span>
        </div>
        <div
          class="add-item-box"
          v-if="materialItmesState"
        >
          <input
            style="width:30%;"
            v-model="matItemData.name"
            placeholder="名称"
          />
          <input
            style="width:25%;"
            v-model="matItemData.value"
            placeholder="使用量"
          />
          <input
            style="width:25%;"
            v-model="matItemData.unit"
            placeholder="单位"
          />
          <button @click="addMatItem">确定</button>
        </div>
        <div class="listBtnGroup">
          <div
            class="addBtn listBtn"
            @click="materialItmesState = true"
          >
            <span></span>
            <span>添加</span>
          </div>
          <div
            class="delBtn listBtn"
            @click="deleteItem('materialItmes', 'deleteRawMaterialByid')"
          >
            <span></span>
            <span>删除</span>
          </div>
        </div>
        <div style="height:1.28rem;"></div>
      </div>
      <div class="footer">
        <div
          class="submitBtn"
          @click="submitBtn"
        >确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar.vue'
import moment from 'moment'
import { Toast } from 'mint-ui'
import pca from '@/assets/scripts/pca.js'
export default {
  name: 'home',
  components: {
    'nav-bar': navBar
  },
  data() {
    return {
      moduleName: '企业信息',
      datalist: '',
      temp: '',
      moment: moment,
      pca: pca,
      enterid: '',
      listHeader: ['产品', '年产量'],
      listHeaderFactor: ['原辅材料', '材料年使用量'],
      levelArr: ['国控', '省控', '市控/重点', '区控/非重点'],
      productionStateArr: ['正常营业', '停业', '关闭'],
      productItems: [],
      materialItmes: [],
      proItemData: {
        name: '',
        value: '',
        unit: ''
      },
      matItemData: {
        name: '',
        value: '',
        unit: ''
      },
      productItemsState: false,
      materialItmesState: false
    }
  },
  computed: {
    list() {
      return this.$store.state.pollSourceInfoHeader
    },
    pd() {
      let temp = []
      this.pca.forEach(item => {
        item.code = item.name
        temp.push(item)
      })
      return temp
    },
    cd() {
      let temp = []
      let pdArr = this.datalist.filter(item => {
        return item.key === 'province'
      })
      if (!pdArr.length) {
        return []
      }
      let pdData = pdArr[0].value
      this.pd.forEach(item => {
        if (item.code === pdData) {
          item.children.forEach(ic => {
            ic.code = ic.name
            temp.push(ic)
          })
        }
      })
      return temp
    },
    dd() {
      let temp = []
      let pdArr = this.datalist.filter(item => {
        return item.key === 'city'
      })
      if (!pdArr.length) {
        return []
      }
      let pdData = pdArr[0].value
      this.cd.forEach(item => {
        if (item.code === pdData) {
          item.children.forEach(ic => {
            ic.code = ic.name
            temp.push(ic)
          })
        }
      })
      return temp
    }
  },
  created() {
    this.enterid = this.$route.params.id
    // // this.enterid = "75ae3c94-93f7-412a-8d03-5cf4554122c8";
    // this.enterid = '838135fd-6a22-4d60-8d4a-d36ff2c7e14c'

    this.$store.state.enterId = this.enterid
    this.$store.state.enterid = this.enterid
    this.$store.commit('set_enterpriseid', this.enterid)
    this.getPollSourceList()
  },
  methods: {
    getPollSourceList() {
      const payload = {
        id: this.enterid
      }
      this.temp = JSON.parse(JSON.stringify(this.list))
      for (let key in this.temp) {
        if (this.temp[key].key === 'area') {
          this.temp[key].value = ['', '', '']
          break
        }
        this.temp[key].value = null
      }
      this.datalist = JSON.parse(JSON.stringify(this.temp))
      this.$api.getZGEnterpriseByid(payload).then(res => {
        if (res) {
          this.datalist.forEach((item, index) => {
            if (res[item.key] === 0 || res[item.key]) {
              if (item.key.includes('date') || item.key.includes('Time')) {
                item.value = moment(res[item.key]).format('YYYY-MM-DD')
              } else {
                item.value = res[item.key]
              }
              this.$set(this.datalist, index, item)
            } else if (item.key === 'lng') {
              item.value = `${res['lng']}E，${res['lat']}N`
            }
            if (item.key === 'area') {
              item.value = [res.province, res.city, res.district]
            }
            if (item.key === 'lnglat') {
              item.value = [Number(res.lng), Number(res.lat)]
            }
            // if (item.key === 'city') {
            //   item.options = this.cd
            // }
            // if (item.key === 'district') {
            //   item.options = this.dd
            // }
            if (item.value && typeof item.value === 'string') {
              item.value = item.value.replace(null, '')
              item.value = item.value.replace(undefined, '')
            }
          })
          this.productItems = res.productItems
          this.materialItmes = res.materialItmes
          this.getIndustrialType()
          this.$store.state.infoToL = {
            name: res.name,
            legal: res.legal,
            creditcode: res.creditcode
          }
        }
      })
      this.$api.getZGEnterpriseExtendByid(payload).then(res => {
        if (res) {
          this.datalist.forEach((item, index) => {
            if (res[item.key] === 0 || res[item.key]) {
              item.value = res[item.key]
              this.$set(this.datalist, index, item)
            }
          })
        }
      })
    },
    getIndustrialType() {
      this.$api.getIndustrialType().then(res => {
        if (res && Array.isArray(res)) {
          let index = 0
          this.datalist.forEach((item, ind) => {
            if (item.key === 'Industrialcode') {
              index = ind
            }
          })
          this.datalist[index].options = res
        }
      })
    },
    submitBtn() {
      this.updateInfo()
      this.updateMoreInfo()
    },
    updateInfo() {
      let params = {
        id: this.enterid,
        name: '',
        creditcode: '',
        orgcode: '',
        province: '',
        city: '',
        district: '',
        town: '',
        address: '',
        zipcode: '',
        telephone: '',
        regioncode: '',
        fax: '',
        url: '',
        legal: '',
        legalmobile: '',
        contacts: '',
        contactsmobile: '',
        contactstelephone: '',
        contactsemail: '',
        lng: 0,
        lat: 0,
        showgis: 0,
        industrialcode: '',
        Industrialcode: '',
        industrialType: '',
        scale: 0,
        level: 0
      }
      this.datalist.forEach(item => {
        if (item.key === 'area') {
          params.province = item.value[0]
          params.city = item.value[1]
          params.district = item.value[2]
        }
        if (item.key === 'lnglat') {
          params.lng = Number(item.value[0])
          params.lat = Number(item.value[1])
        }
        if (params[item.key] === '' || params[item.key] === 0) {
          params[item.key] = item.value
          if (item.key === 'Industrialcode') {
            if (!item.value) {
              return
            }
            params.industrialType = item.options.filter(indType => {
              return indType.code === item.value
            })[0].name
          }
        }
      })
      params.industrialcode = params.Industrialcode
      // console.log(params)
      this.$api.updateEnterprise(params).then(res => {
        // console.log(res)
        if (res === true) {
          Toast('保存成功')
        }
      })
    },
    updateMoreInfo() {
      let params = {
        id: this.enterid,
        description: '',
        relatePark: '',
        buildTime: '',
        productionTime: '',
        isMonitoring: true,
        productionState: 0,
        contact: '',
        contactMobile: '',
        charge: '',
        chargeMoblie: '',
        envdept: '',
        number: 0
      }
      this.datalist.forEach(item => {
        if (item.key === 'buildTime') {
          item.value = item.value
            ? moment(item.value).format('YYYY-MM-DD')
            : null
        }
        if (item.key === 'productionTime') {
          item.value = item.value
            ? moment(item.value).format('YYYY-MM-DD')
            : null
        }
        if (item.key === 'contactsmobile') {
          params.contactMobile = item.value
        }
        if (params[item.key] === '' || params[item.key] === 0) {
          params[item.key] = item.value
        }
      })
      params.number = Number(params.number)
      console.log(params)
      this.$api.updateZGEnterpriseExtend(params).then(res => {
        if (res === true) {
          Toast('保存成功')
        }
      })
    },
    selectItem(arr, index) {
      let selecteItem = arr[index]
      arr.forEach(item => {
        item.class = ''
      })
      selecteItem.class = 'selected'
      this.$set(arr, index, selecteItem)
    },
    deleteItem(arr, method) {
      this[arr].forEach(item => {
        if (item.class === 'selected') {
          this.$api[method]({
            id: item.id
          }).then(res => {
            // console.log(res)
            if (res === true) {
              Toast('保存成功')
              this.getPollSourceList()
            }
          })
        }
      })
    },
    addProItem() {
      for (let key in this.proItemData) {
        if (!this.proItemData[key]) {
          Toast('不能为空！')
          return false
        }
      }
      let data = JSON.parse(JSON.stringify(this.proItemData))
      // data.id = this.$uuid()
      data.rowState = 'add'
      data.remark = '产品'
      data.enterid = this.enterid
      this.$api.addProduct(data).then(res => {
        // console.log(res)
        if (res && res.id) {
          Toast('添加成功')
          this.getPollSourceList()
        }
      })
      this.proItemData = {
        name: '',
        value: '',
        unit: ''
      }
      this.productItemsState = false
    },
    addMatItem() {
      for (let key in this.matItemData) {
        if (!this.matItemData[key]) {
          Toast('不能为空！')
          return false
        }
      }
      let data = JSON.parse(JSON.stringify(this.matItemData))
      // data.id = this.$uuid()
      data.rowState = 'add'
      data.remark = '原辅材料'
      data.enterid = this.enterid
      this.$api.addMaterial(data).then(res => {
        // console.log(res)
        if (res && res.id) {
          Toast('添加成功')
          this.getPollSourceList()
        }
      })
      this.matItemData = {
        name: '',
        value: '',
        unit: ''
      }
      this.materialItmesState = false
    },
    openPicker(picker) {
      this.$refs[picker][0].open()
    },
    getArea(e) {
      this.datalist.forEach(item => {
        if (item.key === 'area') {
          item.value = e
        }
      })
    },
    submitLngLat(e) {
      this.datalist.forEach(item => {
        if (item.key === 'lnglat') {
          item.value = [e.lng, e.lat]
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
#homepage {
  .picker-toolbar {
    display: none;
  }
  &.main-content {
    height: calc(100% - 1.29rem);
    .main-content-box {
      height: calc(100% - 55px);
      overflow-y: auto;
      border-top: 0.02rem solid #e0e0e0;
    }
  }
  p {
    margin: 0;
  }
  .list {
    background: rgba(255, 255, 255, 1);
    padding: 0 0.24rem 0 0.32rem;
    border-bottom: solid 1px #e0e0e0;
    .label {
      line-height: 0.33rem;
      font-size: 0.24rem;
      color: #bebebe;
      padding: 0.15rem 0 0.01rem 0;
    }
    .info {
      line-height: 0.48rem;
      min-height: 0.48rem;
      font-size: 0.34rem;
      color: #3d3d3d;
      padding: 0.01rem 0 0.14rem 0;
      border: 0;
      width: 100%;
    }
  }
  .list:last-child {
    border: 0;
  }
  .interval {
    margin-top: 0.41rem;
  }
  .attachment {
    background: rgba(255, 255, 255, 1);
    margin-top: 0.4rem;
    padding: 0 0.24rem 0 0.32rem;
    @include flexbox;
    @include flex-direction(column);
    p {
      font-size: 0.34rem;
      line-height: 0.48rem;
      color: rgba(48, 48, 48, 1);
      padding-top: 0.33rem;
    }
    div {
      width: 100%;
      padding: 0.32rem 0 0.2rem 0;
      background: rgba(255, 255, 255, 1);
      @include flexbox;
      span {
        display: inline-block;
        height: 0.42rem;
        font-size: 0.3rem;
      }
      span:first-child {
        flex: 9;
        svg {
          fill: #3296fa;
        }
      }
      span:last-child {
        color: rgba(50, 150, 250, 1);
        flex: 1;
      }
    }
    div:last-child {
      padding-bottom: 0.33rem;
    }
  }
  .lists {
    color: rgba(48, 48, 48, 1);
    padding: 0 0.24rem 0 0.32rem;
    border: 0;
    @include flexbox;
    @include align-items(center);
    span:first-child {
      flex: 1.5;
    }
    span:last-child {
      flex: 1;
    }
  }
  .list-header {
    height: 0.7rem;
    background: rgba(229, 241, 244, 1);
    color: rgba(48, 48, 48, 1);
    font-size: 0.26rem;
  }
  .second-header {
    margin-top: 0.4rem;
  }
  .list-content {
    height: 0.75rem;
    background: rgba(255, 255, 255, 1);
    color: rgba(48, 48, 48, 1);
    font-size: 0.35rem;
  }
  .list-content:last-child {
    margin-bottom: 0.6rem;
  }
  .selected {
    background: #edf0f4;
  }
  .listBtnGroup {
    @include flexbox;
    @include flex-direction(row);
    padding: 0.1rem 0 0 0.32rem;
    .listBtn {
      @include flexbox;
      @include align-items(center);
      @include justify-content(center);
      width: 1.36rem;
      height: 0.6rem;
      font-size: 0.3rem;
      background: rgba(255, 255, 255, 1);
      border-radius: 0.03rem;
      border: 2px solid rgba(50, 150, 250, 1);
    }
    .addBtn {
      color: rgba(255, 255, 255, 1);
      background: rgba(50, 150, 250, 1);
      span:first-child {
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        background: url(../../../assets/images/add.png) no-repeat;
        background-size: 100% 100%;
        margin-right: 0.13rem;
      }
    }
    .delBtn {
      margin-left: 0.32rem;
      color: #3296fa;
      span:first-child {
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        background: url(../../../assets/images/delete2.png) no-repeat;
        background-size: 100% 100%;
        margin-right: 0.13rem;
      }
    }
  }
  .footer {
    @include flexbox;
    @include align-items(center);
    @include justify-content(center);
    position: fixed;
    bottom: 0;
    height: 1.28rem;
    background: rgba(255, 255, 255, 1);
    width: 100%;
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
  .add-item-box {
    input {
      border: 0;
      background: #fff;
      height: 0.5rem;
      margin: 0.05rem 0;
      padding-left: 0.1rem;
      margin-right: 0.1rem;
    }
    button {
      height: 0.5rem;
      width: 15%;
      padding: 0;
      border: 0;
      margin: 0.05rem 0;
      background: #3296fa;
      color: #fff;
    }
  }

  select {
    line-height: 0.48rem;
    min-height: 0.48rem;
    font-size: 0.34rem;
    color: #3d3d3d;
    padding: 0.01rem 0 0.14rem 0;
    border: 0;
    width: 100%;
  }
}
.bke {
  position: relative;
  ::after {
    content: "E";
    position: absolute;
    right: 0.32rem;
    bottom: 0.14rem;
    line-height: 0.48rem;
    font-size: 0.34rem;
    color: #333;
  }
}
.bkn {
  position: relative;
  ::after {
    content: "N";
    position: absolute;
    right: 0.32rem;
    bottom: 0.14rem;
    line-height: 0.48rem;
    font-size: 0.34rem;
    color: #333;
  }
}
select,
.selectbox {
  background: #fff url("../../../assets/images/down-c.png") no-repeat right
    center !important;
  background-size: 0.4rem !important;
}
</style>
