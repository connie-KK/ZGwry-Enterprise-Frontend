<template>
  <div
    class="x-content"
    id="home"
  >
    <header-bar>{{ moduleName }}</header-bar>
    <img
      src="@/assets/images/loginout.png"
      class="loginout"
      @click="mylogout"
    />
    <p class="user-name">{{ userName }}</p>
    <p class="company-name">{{ company }} V{{ Version }}</p>
    <div
      id="enterinfo"
      v-cloak
    >
      <mt-popup
        v-model="popup"
        position="middle"
        class="pick-box"
      >
        <div class="isdev">
          <img
            class="close"
            @click="popup = false"
            src="@/assets/images/close.png"
          />
          <img
            class="dev"
            src="@/assets/images/isdev.png"
          />
          <p>该模块正在开发中</p>
        </div>
      </mt-popup>
      <div class="content">
        <div
          :class="['list', item.extraClass]"
          v-for="(item, index) in listData"
          :key="index"
        >
          <div class="module">
            <span
              class="tips"
              v-if="item.name"
            ></span>
            <span
              class="category"
              v-if="item.name"
            >{{ item.name }}</span>
          </div>
          <div
            v-for="(it, idx) in item.lists"
            :key="idx"
          >
            <div
              class="name"
              v-if="it.categoryName"
            >{{ it.categoryName }}</div>
            <div class="items">
              <div
                class="item"
                v-for="(imgItem, imgIndex) in it.items"
                :key="imgIndex"
                v-on:click="toDetail(imgItem)"
              >
                <img
                  class="img"
                  v-if="imgItem.imgUrl"
                  :src="imgItem.imgUrl"
                  :alt="imgItem.name"
                />
                <div class="note">{{ imgItem.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="hidden-dev"
          @click="outputMobile"
        >
          .
          <p v-if="mobileState">{{ mobileNumber || 'not number' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'store'
import cookie from 'js-cookie'
import { Popup } from 'mint-ui'
export default {
  name: 'Home',
  components: {
    'mt-popup': Popup
  },
  data() {
    return {
      popup: false,
      mobileNumber: window.mymobile,
      mobileState: false,
      moduleName: '首页',
      company: '浙江中环瑞蓝科技发展有限公司',
      isHasUserData: false,
      Version: '0.1',
      userName: ''
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    },
    isHBGJ() {
      return !this.userInfo || this.userInfo.isHBGJ
    },
    gridLevel() {
      return this.$store.state.userInfo
        ? this.$store.state.userInfo.gridLevel
        : 0
    },
    listData() {
      let hxdata = [
        {
          name: '基础信息库',
          extraClass: '',
          lists: [
            {
              items: [
                {
                  name: '污染源库',
                  imgUrl: require('@/assets/images/a1.png'),
                  url: '/entlist/0'
                },
                {
                  name: '知识库',
                  imgUrl: require('@/assets/images/a2.png'),
                  url: '/documents'
                }
              ]
            }
          ]
        },
        {
          name: '网格化平台',
          extraClass: 'space-box',
          lists: [
            {
              categoryName: '',
              items: [
                {
                  name: '待办任务',
                  imgUrl: require('@/assets/images/b1.png'),
                  url: '/taskList/3',
                  params: 'WGH'
                },
                {
                  name: '任务列表',
                  imgUrl: require('@/assets/images/b2.png'),
                  url: '/taskList/0',
                  params: 'WGH'
                },
                {
                  name: '发布任务',
                  imgUrl: require('@/assets/images/b3.png'),
                  url: '/putTask/0',
                  params: 'WGH'
                },
                {
                  name: '',
                  imgUrl: '',
                  url: ''
                },
                {
                  name: '待办事件',
                  imgUrl: require('@/assets/images/b4.png'),
                  url: '/eventList/-1',
                  params: 'WGH'
                },
                {
                  name: '事件列表',
                  imgUrl: require('@/assets/images/b5.png'),
                  url: '/eventList/1',
                  params: 'WGH'
                },
                {
                  name: '事件上报',
                  imgUrl: require('@/assets/images/b6.png'),
                  url: '/eventContent/-1',
                  params: 'WGH'
                }
              ]
            }
          ]
        },
        {
          name: '环保管家平台',
          extraClass: 'space-box',
          lists: [
            {
              categoryName: '',
              items: [
                {
                  name: '待办任务',
                  imgUrl: require('@/assets/images/c1.png'),
                  url: '/taskList/3',
                  params: 'HBGJ'
                },
                {
                  name: '任务列表',
                  imgUrl: require('@/assets/images/c2.png'),
                  url: '/taskList/0',
                  params: 'HBGJ'
                },
                {
                  name: '发布任务',
                  imgUrl: require('@/assets/images/c3.png'),
                  url: '/putTask/0',
                  params: 'HBGJ'
                }
              ]
            }
          ]
        }
      ]
      if (!this.isHasUserData || !this.gridLevel) {
        return [hxdata[0]]
      }
      if (this.isHBGJ) {
        return [hxdata[0], hxdata[2]]
      } else {
        return [hxdata[0], hxdata[1]]
      }
    }
  },
  watch: {
    userInfo() {
      if (this.userInfo) {
        this.isHasUserData = true
      }
    }
  },
  created() {
    this.getUser()
    this.Version = cookie.get('Version')
  },
  methods: {
    toDetail(item) {
      if (!item.url && !item.redirectUrl && item.name) {
        this.popup = true
        return
      }
      if (item.url) {
        this.$router.push(item.url)
      } else if (item.redirectUrl) {
        window.location.href = item.redirectUrl
      }
      if (item.params) {
        this.$store.state.initType = item.params
      }
    },
    outputMobile() {
      this.mobileState = true
    },
    mylogout() {
      this.$api.logout()
    },
    getUser() {
      this.$api.getUser().then(res => {
        if (res && res.id) {
          this.userName = res.username
          this.getStaffInfo(res.id)
        }
      })
    },
    getStaffInfo(id) {
      this.$api.getStaffInfo({
        id
      }).then(res => {
        if (res && res.id) {
          this.$store.state.userInfo = res
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_flex.scss";
#home {
  height: 100%;
  body {
    margin: 0 !important;
  }
  * {
    margin: 0;
    padding: 0;
  }
  [v-cloak] {
    display: none;
  }
  #enterinfo {
    width: 100%;
    height: 100%;
    background: rgba(248, 248, 248, 1);
    overflow: hidden;
  }
  .x-content {
    height: 100%;
  }
  .content {
    height: calc(100% - 1.29rem);
    overflow-x: hidden;
    overflow-y: auto;
    top: 1.29rem;
    border-top: 0.02rem solid #e3e3e3;
  }
  .list {
    background: rgba(255, 255, 255, 1);
    padding-left: 0.32rem;
  }
  .space-box {
    margin-top: 0.4rem;
  }
  .module {
    padding-top: 0.32rem;
    span:last-child {
      display: inline-block;
      margin-left: 0.1rem;
    }
  }
  .tips {
    display: inline-block;
    width: 0.1rem;
    height: 0.24rem;
    background: rgba(50, 150, 250, 1);
  }
  .category {
    font-size: 0.32rem;
    color: rgba(48, 48, 48, 1);
    display: inline-block;
    line-height: 0.45rem;
    font-weight: 500;
  }
  .name {
    padding: 0.2rem 0 0 0.28rem;
    font-size: 0.28rem;
  }
  .items {
    padding: 0.2rem 0.1rem 0 0.28rem;
    @include flexbox;
    @include flex-direction(row);
    @include flex-wrap(wrap);
  }
  .item {
    margin-right: 0.5rem;
  }
  .img {
    width: 1.2rem;
    height: 1.2rem;
    object-fit: fill;
  }
  .note {
    text-align: center;
    font-size: 0.24rem;
    color: rgba(25, 31, 37, 1);
    margin-bottom: 0.3rem;
    width: 1.2rem;
  }

  .pick-box {
    border-radius: 0.06rem;
    border: 0.01rem solid #979797;
    overflow: hidden;
  }
  .isdev {
    width: 4.6rem;
    height: 5rem;
    background: #fff;
    position: relative;
    .close {
      position: absolute;
      right: 0.33rem;
      top: 0.33rem;
      width: 0.28rem;
      height: 0.28rem;
    }
    .dev {
      position: absolute;
      left: 0.86rem;
      top: 0.84rem;
      width: 2.88rem;
      height: 2.64rem;
    }
    p {
      position: absolute;
      color: #303030;
      line-height: 0.42rem;
      font-size: 0.3rem;
      text-align: center;
      width: 100%;
      bottom: 0.72rem;
    }
  }
  .hidden-dev {
    height: 0.5rem;
    margin-top: 1rem;
    color: #ddd;
    p {
      color: 000;
    }
  }
  .loginout {
    position: fixed;
    height: 0.4rem;
    width: 0.4rem;
    right: 0.25rem;
    top: 0.43rem;
    z-index: 999;
  }
  .company-name {
    position: fixed;
    line-height: 0.3rem;
    font-size: 0.22rem;
    color: #aab1b9;
    width: 100%;
    text-align: center;
    bottom: 0.1rem;
    left: 0;
    z-index: 999;
  }
  .user-name {
    position: fixed;
    top: 0.46rem;
    z-index: 999;
    right: 0.8rem;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.36rem;
    text-align: right;
    color: #3296fa;
  }
}
</style>
