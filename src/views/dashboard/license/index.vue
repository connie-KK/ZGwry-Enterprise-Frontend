<template>
  <div>
    <header-bar>{{ moduleName }}</header-bar>
    <mt-datetime-picker type="date"
                        ref="datePicker1"
                        year-format="{value} 年"
                        month-format="{value} 月"
                        date-format="{value} 日"
                        @confirm="handleConfirm1">
    </mt-datetime-picker>
    <mt-datetime-picker type="date"
                        ref="datePicker2"
                        year-format="{value} 年"
                        month-format="{value} 月"
                        date-format="{value} 日"
                        @confirm="handleConfirm2">
    </mt-datetime-picker>
    <div class="main-content">
      <nav-bar :selected="2"></nav-bar>
      <div class="main-content-box">
        <div class="item-box">
          <span>单位名称</span>
          <input type="text"
                 placeholder="请输入单位名称" />
        </div>
        <div class="item-box">
          <span>是否办理许可证</span>
          <mt-switch class="my-switch"
                     v-model="value"></mt-switch>
        </div>
        <div class="item-box">
          <span>证书编码</span>
          <input type="text"
                 placeholder="请输入证书编码" />
        </div>
        <div class="item-box">
          <span>法人</span>
          <input type="text"
                 placeholder="请输入法人名称" />
        </div>
        <div class="item-box">
          <span>行业类型</span>
          <input type="text"
                 placeholder="请输入行业类型" />
        </div>
        <div class="item-box">
          <span>统一社会信用代码</span>
          <input type="text"
                 placeholder="请输入信用代码" />
        </div>
        <div class="item-box">
          <span>注册地址</span>
          <input type="text"
                 placeholder="请输入注册地址" />
        </div>
        <div class="item-box">
          <span>生产经营场所地址</span>
          <input type="text"
                 placeholder="请输入场所地址" />
        </div>
        <div class="item-box"
             @click="datePicker(1)">
          <span>发证日期</span>
          <input type="text"
                 disabled="disabled"
                 placeholder="请选择发证日期" />
        </div>
        <div class="item-box">
          <span>发证机关</span>
          <input type="text"
                 placeholder="请输发证机关" />
        </div>
        <div class="item-box"
             @click="datePicker(2)">
          <span>有效期</span>
          <input type="text"
                 disabled="disabled"
                 placeholder="请选择有效期" />
        </div>
        <div class="file-box">
          <p class="file-box-title">排污许可证文件(2)</p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span>添加文件</span>
          </button>
          <ul class="file-list">
            <li v-for="item in 3">
              <p>文件名称上述三大三大</p>
              <i></i>
            </li>
          </ul>
        </div>
        <div class="file-box">
          <p class="file-box-title">应急预案文件(2)</p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span>添加文件</span>
          </button>
          <ul class="file-list">
            <li v-for="item in 3">
              <p>文件名称上述三大三大</p>
              <i></i>
            </li>
          </ul>
        </div>
        <div class="file-box">
          <p class="file-box-title">其他有关文件(2)</p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span>添加文件</span>
          </button>
          <ul class="file-list">
            <li v-for="item in 3">
              <p>文件名称上述三大三大</p>
              <i></i>
            </li>
          </ul>
        </div>
        <div class="file-box">
          <p class="file-box-title">平面/工艺图(2)</p>
          <button class="file-box-add-btn">
            <i>+</i>
            <span>添加文件</span>
          </button>
          <ul class="file-list pic-list">
            <li v-for="item in 3">
              <div class="pic-box">
                <img src=""
                     alt="" />
              </div>
              <p class="pic-title">文件名称上述三大三大</p>
              <i class="pic-close"></i>
            </li>
          </ul>
        </div>
        <div class="ok-btn">
          <button>确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar.vue'
import { Switch, DatetimePicker } from 'mint-ui'
export default {
  name: 'license',
  components: {
    'nav-bar': navBar,
    'mt-switch': Switch,
    'mt-datetime-picker': DatetimePicker
  },
  data () {
    return {
      moduleName: '企业信息',
      value: false,
      date1State: false,
      date2State: false
    }
  },
  methods: {
    datePicker (state) {
      this.$refs[`datePicker${state}`].open()
    },
    handleConfirm1 (e) {
      console.log(e)
    },
    handleConfirm2 (e) {
      console.log(e)
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
      background-size: 0.36rem;
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
      border: 0.01rem solid #3296fa;
      border-radius: 50%;
    }
    span {
      margin-left: 0.25rem;
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
</style>
