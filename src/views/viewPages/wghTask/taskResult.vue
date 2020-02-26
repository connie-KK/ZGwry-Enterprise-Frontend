<template>
  <div id="taskResult">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearch="isShowSearch"
      :showBorder="isShowBorder"
    >
      {{ moduleName }}
    </header-bar>
    <div
      class="main-content"
      v-if="data"
    >
      <div class="box-item">
        <span class="item-title">时间</span>
        <p class="checkbox2">{{ data.date1 }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">网格/部门</span>
        <p class="checkbox2">{{ data.parentName }}<span v-if="data.parentName && data.gridName">-</span>{{ data.gridName }}</p>
      </div>
      <div
        class="box-item"
        @click="popupType = true"
      >
        <span class="item-title">相关企业</span>
        <p class="checkbox">{{ enterName }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">执行人</span>
        <p class="checkbox2">{{ staffName }}</p>
      </div>
      <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">详细描述</span>
        <textarea
          rows="5"
          placeholder="请输入详细情况"
          v-model="contentText"
          v-if="!id"
        ></textarea>
        <div
          class="remark-box"
          v-if="id"
          v-html="contentText"
        ></div>
      </div>
      <div class="box-item">
        <span class="item-title">图片</span>
        <img
          class="pic-box"
          src="@/assets/images/pic.png"
          @click="addPic"
          v-if="!id"
        />
        <upload-box
          ref="upload"
          :data="imgData"
          :autoShow="false"
          @upload="uploadData"
          @deleteItem="deleteItem"
          :showDelete="deleteState"
        ></upload-box>
      </div>
      <div class="add-btn">
        <button
          @click="submit"
          v-if="!id"
        >确定</button>
      </div>
    </div>
    <mt-popup
      v-if="!id"
      position="bottom"
      v-model="popupType"
      class="popup-box"
    >
      <mt-picker
        :slots="slots"
        valueKey="name"
        @change="onValuesChange"
      ></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import moment from 'moment'
import uploadBox from '@/components/uploadBox'
import {
  Popup,
  Picker
} from 'mint-ui'
export default {
  name: 'taskResult',
  components: {
    uploadBox,
    'mt-popup': Popup,
    'mt-picker': Picker
  },
  data () {
    return {
      moduleName: '任务执行结果',
      searchKey: '',
      isShowSearch: false,
      isShowBorder: true,
      id: '',
      contentText: '',
      imgData: [],
      popupType: false,
      data: {
        task: '',
        date1: moment().format('YYYY-MM-DD HH:00:00'),
        rowState: 'add',
        staff: '',
        enterprise: '',
        forassignment: '',
        parentName: '',
        gridName: ''
      },
      staffName: '',
      enterName: ''
    }
  },
  computed: {
    deleteState () {
      return !this.id
    },
    taskEnter () {
      return this.$store.state.taskEnter
    },
    userAssInfoList () {
      return this.$store.state.userAssInfoList
    },
    slots () {
      let temp = [
        {
          id: '',
          name: '《和企业/污染源无关》'
        },
        ...this.taskEnter
      ]
      return [
        {
          values: temp,
          className: 'slottypes',
          textAlign: 'center'
        }
      ]
    }
  },
  mounted () {
    this.id = this.$route.params.id
    if (this.id && !this.id.includes('X-')) {
      this.getData()
    } else {
      this.data.task = this.id.split('X-')[1]
      this.id = ''
      this.getUser()
    }
  },
  methods: {
    submit () {
      let params = JSON.parse(JSON.stringify(this.data))
      let atts = []
      this.imgData.forEach(img => {
        atts.push({
          id: img.id,
          rowState: 'add'
        })
      })
      params.id = this.$uuid()
      params.attachments = atts
      params.date = moment(params.date1).format('YYYY-MM-DD HH:mm:ss')
      this.$api.updatetaskhandle(params).then(res => {
        this.$store.state.isNewTaskHandelChange = Math.random()
        this.$router.go(-1)
      })
    },
    onValuesChange (e) {
      if (e.values.length) {
        this.data.enterprise = e.values[0].id
        this.enterName = e.values[0].name
      }
      if (!this.data.enterprise) {
        delete this.data.enterprise
        this.enterName = '《和企业/污染源无关》'
      }
    },
    getData () {
      this.$api.getTaskHandleDetail({
        id: this.id
      }).then(res => {
        if (res) {
          res.date1 = moment(res.date).format('YYYY-MM-DD')
          this.data = res
          res.attachments.forEach(item => {
            if (item.url.includes('Content') && !item.url.includes(this.$360url)) {
              item.url = this.$360url + item.url
              this.imgData.push(item)
            }
          })
          this.contentText = res.results
          this.getUserName(res.staff)
        }
      })
    },
    uploadData (e) {
      let data = new FormData()
      for (let i = 0; i < e.length; i++) {
        data.append('file' + i, e[i])
      }
      this.$api.uploadAttachment(data).then(res => {
        res.forEach(item => {
          if (item.url.includes('Content') && !item.url.includes(this.$360url)) {
            item.url = this.$360url + item.url
          }
        })
        this.imgData.push(...res)
      })
    },
    deleteItem (e) {
      this.imgData.forEach((item, index) => {
        if (item.url === e.url) {
          this.imgData.splice(index, 1)
        }
      })
    },
    addPic () {
      this.$refs.upload.addItem()
    },
    getUserName (id) {
      this.$api
        .getUserByArrUserID({
          items: [id]
        })
        .then(res => {
          this.staffName = res[0].username
        })
    },
    getUser () {
      this.$api.getUser().then(res => {
        if (res) {
          this.data.staff = res.id
          this.staffName = res.username
          this.getStaffInfo(res.id)
        }
      })
    },
    getStaffInfo (id) {
      this.$api
        .getStaffInfo({
          id
        })
        .then(res => {
          if (res) {
            this.data.parentName = res.parentGridName
            this.data.gridName = res.gridName
            this.userAssInfoList.forEach(item => {
              if (item.staff === res.id) {
                this.data.forassignment = item.id
              }
            })
          }
        })
    }
  }
}
</script>

<style lang="scss">
#taskResult {
  .popup-box {
    width: 100%;
    .slottypes {
      width: 100%;
    }
  }
  .add-btn {
    background: #fff;
    border-top: 1px solid #e0e0e0;
    bottom: 0;
    width: 100%;
    height: 1.32rem;
    position: fixed;
    bottom: 0;
    left: 0;
    button {
      border: 0;
      margin: 0.16rem auto;
      display: block;
      width: 6.86rem;
      height: 0.96rem;
      color: #fff;
      border-radius: 0.04rem;
      font-size: 0.34rem;
      background: #3296fa;
    }
  }
  .remark-box {
    font-size: 0.3rem;
    line-height: 0.44rem;
    margin-bottom: 0.5rem;
    color: #9e9e9e;
  }
  .main-content {
    top: 1.29rem;
    background: #fff;
    height: calc(100% - 2.62rem);
    .pic-box {
      height: 0.31rem;
      float: right;
      margin-top: 0.4rem;
    }
    p {
      padding: 0;
      margin: 0;
    }
    .gang {
      background: #f8f8f8;
      height: 0.4rem;
    }
    .mint-tab-item-label {
      font-size: 0.3rem;
    }
    .box-item {
      min-height: 1.12rem;
      font-size: 0.34rem;
      line-height: 1.12rem;
      padding: 0 0.32rem;
      border-bottom: 1px solid #e0e0e0;
      background: #fff;
      overflow: hidden;
      .item-title {
        color: #333;
      }
      input {
        width: 5rem;
        float: right;
        height: 1.12rem;
        border: 0;
        text-align: right;
        font-size: 0.3rem;
        color: #9e9e9e;
      }
      .input-unit {
        float: right;
        font-size: 0.3rem;
        color: #9e9e9e;
        margin-left: 0.1rem;
      }
      textarea {
        border: 0;
        display: block;
        margin-bottom: 0.3rem;
        color: #9e9e9e;
        font-size: 0.3rem;
        line-height: 0.4rem;
        width: 100%;
      }
      .checkbox {
        float: right;
        padding-right: 0.52rem;
        text-align: right;
        font-size: 0.3rem;
        color: #9e9e9e;
        background: url("../../../assets/images/right.png") no-repeat right
          center;
        background-size: auto 0.32rem;
      }
      .checkbox2 {
        float: right;
        text-align: right;
        font-size: 0.3rem;
        color: #9e9e9e;
      }
      .addbox {
        float: right;
        font-size: 0.3rem;
        line-height: 0.74rem;
        padding: 0 0.36rem 0 0.84rem;
        color: #3296fa;
        border: 0.02rem solid #3296fa;
        position: relative;
        margin-top: 0.2rem;
        &::before {
          content: "+";
          border: 0.02rem solid #3296fa;
          border-radius: 50%;
          line-height: 0.3rem;
          width: 0.3rem;
          text-align: center;
          font-size: 0.26rem;
          position: absolute;
          left: 0.37rem;
          height: 0.3rem;
          top: 0;
          bottom: 0;
          margin: auto;
          color: #3296fa;
        }
      }
      .item-ul {
        margin-bottom: 0.4rem;
        li {
          background: #f8f8f8;
          font-size: 0.3rem;
          line-height: 1rem;
          padding-left: 0.2rem;
          margin-bottom: 0.16rem;
          position: relative;
          i.delete {
            &::before {
              content: "-";
              border: 0.02rem solid #3296fa;
              border-radius: 50%;
              line-height: 0.3rem;
              width: 0.3rem;
              text-align: center;
              font-size: 0.26rem;
              position: absolute;
              right: 0.4rem;
              height: 0.3rem;
              top: 0;
              bottom: 0;
              margin: auto;
              color: #3296fa;
            }
          }
          i.jump {
            background: #f8f8f8 url("../../../assets/images/right.png")
              no-repeat right center;
            background-size: auto 0.32rem;
            right: 0.4rem;
            position: absolute;
            display: block;
            height: 0.32rem;
            width: 0.32rem;
            top: 0;
            bottom: 0;
            margin: auto;
          }
        }
      }
      .item-ul2 {
        li {
          line-height: 0.4rem;
          padding-left: 0.2rem;
          margin-bottom: 0.16rem;
          padding-top: 0.1rem;
          span {
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
          }
          p {
            color: #bdbdbd;
            font-size: 0.26rem;
            line-height: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
