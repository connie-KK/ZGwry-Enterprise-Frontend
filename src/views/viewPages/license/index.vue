<template>
  <div>
    <header-bar
      leftIcon="back"
      leftText="返回"
    >{{ moduleName }}</header-bar>
    <mt-datetime-picker
      type="date"
      ref="datePicker1"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="pickerValue1"
      @confirm="handleConfirm1"
    >
    </mt-datetime-picker>
    <mt-datetime-picker
      type="date"
      ref="datePicker2"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="pickerValue2"
      @confirm="handleConfirm2"
    >
    </mt-datetime-picker>
    <div class="main-content">
      <nav-bar :selected="2"></nav-bar>
      <div class="main-content-box">
        <div class="item-box">
          <span>单位名称</span>
          <input
            type="text"
            placeholder="请输入单位名称"
            v-model="data.name"
          />
        </div>
        <div class="item-box">
          <span>是否办理许可证</span>
          <mt-switch
            class="my-switch"
            v-model="data.state"
          ></mt-switch>
        </div>
        <div class="item-box">
          <span>证书编码</span>
          <input
            type="text"
            placeholder="请输入证书编码"
            v-model="data.certificateNo"
          />
        </div>
        <div class="item-box">
          <span>法人</span>
          <input
            type="text"
            placeholder="请输入法人名称"
            v-model="data.legal_rep"
          />
        </div>
        <div class="item-box">
          <span>行业类型</span>
          <input
            type="text"
            placeholder="请输入行业类型"
            v-model="data.industrytype"
          />
        </div>
        <div class="item-box">
          <span>统一社会信用代码</span>
          <input
            type="text"
            placeholder="请输入信用代码"
            v-model="data.creditcode"
          />
        </div>
        <div class="item-box">
          <span>注册地址</span>
          <input
            type="text"
            placeholder="请输入注册地址"
            v-model="data.reg_addr"
          />
        </div>
        <div class="item-box">
          <span>生产经营场所地址</span>
          <input
            type="text"
            placeholder="请输入场所地址"
            v-model="data.buss_addr"
          />
        </div>
        <div
          class="item-box"
          @click="datePicker(1)"
        >
          <span>发证日期</span>
          <input
            type="text"
            disabled="disabled"
            placeholder="请选择发证日期"
            :value="
              data.issuedate ? moment(data.issuedate).format('YYYY-MM-DD') : ''
            "
          />
        </div>
        <div class="item-box">
          <span>发证机关</span>
          <input
            type="text"
            placeholder="请输发证机关"
            v-model="data.Issuingunit"
          />
        </div>
        <div
          class="item-box"
          @click="datePicker(2)"
        >
          <span>有效期</span>
          <input
            type="text"
            disabled="disabled"
            placeholder="请选择有效期"
            :value="
              data.enddate ? moment(data.enddate).format('YYYY-MM-DD') : ''
            "
          />
        </div>
        <div class="file-box">
          <p class="file-box-title">排污许可证文件({{ pdocItems.length }})</p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span @click="$refs.filebox1.click()">添加文件</span>
          </button>
          <ul class="file-list">
            <li
              v-for="(item, index) in pdocItems"
              :key="item.id"
            >
              <p @click="ifDownload(item.id, item.name, 'DownPollFiles')">
                {{ item.name }}
              </p>
              <i @click="deleteFiles(item.id, 'DeletePollpermitdocs')"></i>
            </li>
          </ul>
        </div>
        <div class="file-box">
          <p class="file-box-title">
            应急预案文件({{ emergplanItems.length }})
          </p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span @click="$refs.filebox2.click()">添加文件</span>
          </button>
          <ul class="file-list">
            <li
              v-for="(item, index) in emergplanItems"
              :key="item.id"
            >
              <p @click="ifDownload(item.id, item.name, 'DownEmergplanFiles')">
                {{ item.name }}
              </p>
              <i @click="deleteFiles(item.id, 'DeleteEmergplan')"></i>
            </li>
          </ul>
        </div>
        <div class="file-box">
          <p class="file-box-title">
            其他有关文件({{ attachmentItems.length }})
          </p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span @click="$refs.filebox3.click()">添加文件</span>
          </button>
          <ul class="file-list">
            <li
              v-for="(item, index) in attachmentItems"
              :key="item.id"
            >
              <p @click="ifDownload(item.id, item.name, 'DownAttachmentFiles')">
                {{ item.name }}
              </p>
              <i @click="deleteFiles(item.id, 'DeleteAttachment')"></i>
            </li>
          </ul>
        </div>
        <div class="file-box">
          <p class="file-box-title">平面/工艺图({{ drawingItems.length }})</p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span @click="$refs.filebox4.click()">添加文件</span>
          </button>
          <ul class="file-list pic-list">
            <li
              v-for="(item, index) in drawingItems"
              :key="item.id"
            >
              <div
                class="pic-box"
                @click="
                  openImg('/ent/Enterprise/GetEntDrawingImage/' + item.id)
                "
              >
                <img
                  :src="'/ent/Enterprise/GetEntDrawingImage/' + item.id"
                  alt=""
                />
              </div>
              <p class="pic-title">{{ item.name }}</p>
              <i
                class="pic-close"
                @click="deleteFiles(item.id, 'DeleteEntdrawing')"
              ></i>
            </li>
          </ul>
        </div>
        <div style="height:1.28rem;"></div>
        <input
          type="file"
          @change="filesSelected1"
          ref="filebox1"
          class="file-upload-box"
        />
        <input
          type="file"
          @change="filesSelected2"
          ref="filebox2"
          class="file-upload-box"
        />
        <input
          type="file"
          @change="filesSelected3"
          ref="filebox3"
          class="file-upload-box"
        />
        <input
          type="file"
          @change="filesSelected4"
          ref="filebox4"
          class="file-upload-box"
          accept="image/*"
        />
        <div class="ok-btn">
          <button @click="updatePollpermits">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar.vue'
import { Switch, DatetimePicker, MessageBox, Toast } from 'mint-ui'
import moment from 'moment'
import axios from 'axios'
import { ImagePreview } from 'vant'
import 'vant/lib/index.css'
export default {
  name: 'license',
  components: {
    'nav-bar': navBar,
    'mt-switch': Switch,
    'mt-datetime-picker': DatetimePicker
  },
  data() {
    return {
      moduleName: '企业信息',
      moment: moment,
      date1State: false,
      date2State: false,
      pickerValue1: '',
      pickerValue2: '',
      data: {
        id: '',
        name: '',
        buss_addr: '',
        certificateNo: '',
        code: '',
        creditcode: '',
        enddate: null,
        industrytype: '',
        issuedate: null,
        Issuingunit: '',
        legal_rep: '',
        reg_addr: '',
        startdate: '',
        state: null
      },
      pdocItems: [],
      emergplanItems: [],
      attachmentItems: [],
      drawingItems: []
    }
  },
  watch: {
    'data.issuedate'() {
      this.pickerValue1 = new Date(this.data.issuedate)
    },
    'data.enddate'() {
      this.pickerValue2 = new Date(this.data.enddate)
    }
  },
  mounted() {
    this.getPollpermitsByid()
  },
  methods: {
    datePicker(state) {
      this.$refs[`datePicker${state}`].open()
    },
    handleConfirm1(e) {
      this.data.issuedate = moment(e).format('YYYY-MM-DD')
    },
    handleConfirm2(e) {
      this.data.enddate = moment(e).format('YYYY-MM-DD')
    },
    getPollpermitsByid() {
      this.$api
        .getPollpermitsByid({
          params: {
            id: this.$store.state.enterId
          }
        })
        .then(res => {
          if (res.items === -1) {
            let tempData = JSON.parse(JSON.stringify(this.$store.state.infoToL))
            this.data.name = tempData.name
            this.data.legal_rep = tempData.legal
            this.data.creditcode = tempData.creditcode
            return false
          }
          this.data = res.items
          this.pdocItems = res.pdocItems
          this.emergplanItems = res.emergplanItems
          this.attachmentItems = res.attachmentItems
          this.drawingItems = res.drawingItems
        })
    },
    filesSelected1(e) {
      this.filesSelected(e, 'pdocItems', 'uploadPollFiles', 24)
    },
    filesSelected2(e) {
      this.filesSelected(e, 'emergplanItems', 'uploadEmergplanFiles', 0)
    },
    filesSelected3(e) {
      this.filesSelected(e, 'attachmentItems', 'uploadAttachmentFiles', 0)
    },
    filesSelected4(e) {
      this.filesSelected(e, 'drawingItems', 'uploadEntdrawingFiles', 1)
    },
    filesSelected(e, type, fun, etype) {
      let files = e.target.files
      let formData = new FormData()
      formData.append('file', files[0])
      this.uploadFiles(formData, type, fun, etype)
      e.target.value = ""
    },
    uploadFiles(formData, type, fun, etype) {
      formData.append('year', moment().format('YYYY'))
      formData.append('etype', etype)
      formData.append('pmitid', this.$store.state.enterId)
      this.$api[fun](formData).then(res => {
        this.getPollpermitsByid()
      })
    },
    deleteFiles(id, fun) {
      MessageBox.confirm('确认删除此文件?').then(action => {
        if (action === 'confirm') {
          axios.post(`/ent/api/enterprise/${fun}/${id}`).then(res => {
            if (res.data === true) {
              this.getPollpermitsByid()
            }
          })
        }
      })
    },
    ifDownload(id, name, fun) {
      MessageBox.confirm('确认下载此文件?').then(action => {
        if (action === 'confirm') {
          this.download(id, name, fun)
        }
      })
    },
    download(id, name, fun) {
      const url = `http://localhost:30016/api/enterprise/${fun}?id=${id}`
      const a = document.createElement('a')
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
    },
    openImg(src) {
      ImagePreview([src])
    },
    updatePollpermits() {
      let data = JSON.parse(JSON.stringify(this.data))
      data.enddate = data.enddate
        ? moment(data.enddate).format('YYYY-MM-DD HH:mm:ss')
        : null
      data.issuedate = data.issuedate
        ? moment(data.issuedate).format('YYYY-MM-DD HH:mm:ss')
        : null
      data.startdate = data.startdate
        ? moment(data.startdate).format('YYYY-MM-DD HH:mm:ss')
        : null
      data.id = this.$store.state.enterId
      this.$api.updatePollpermits(data).then(res => {
        if (res === true) {
          Toast('保存成功')
          this.getPollpermitsByid()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    line-height: 1.12rem;
    font-size: 0.34rem;
    left: 0.32rem;
    top: 0;
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
      background-size: 0.22rem;
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
  border-top: 0.4rem solid #f8f8f8;
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
        position: relative;
        img {
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
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
.file-upload-box {
  display: none;
}
</style>
