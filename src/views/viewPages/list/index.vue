<template>
  <div class="content">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearch="isShowSearch"
      :showBorder="isShowBorder"
      :serachFun="toSearchList"
      :customBack="backFun"
    >
      {{ moduleName }}{{ count ? `(${count})` : '' }}
      <!-- <div slot="right" v-if="this.pageType == PollutionPage" @click="toMap">
        <icon name="location" scale="1"></icon>
      </div> -->
    </header-bar>
    <div class="main-content">
      <div class="other" ref="scrollbox">
        <div
          v-for="(item, index) in list"
          class="list-content"
          :key="index"
          @click="toDetail(item)"
        >
          <span>{{ item.name }}</span>
          <span class="icon warning" v-if="item.isWarning"> </span>
        </div>
      </div>
      <div v-if="list.length == 0 && !firstState">
        <div class="list-content list-tips">暂无数据</div>
      </div>
      <p class="down-tip" v-if="downState">已经到底了</p>
    </div>
  </div>
</template>

<script>
import store from 'store'
import moment from 'moment'
import cookie from 'js-cookie'
export default {
  name: 'SiteList',
  data() {
    return {
      PollutionPage: '0',
      PollutionSubType: 9,
      AlarmPage: '1',
      AlarmSubType: 0,
      moduleName: '污染源',
      isShowSearch: true,
      alarmEnters: [],
      list: [],
      count: 0,
      moduleList: ['污染源', '报警预警统计'],
      isShowBorder: true,
      filter: '',
      firstState: true,
      pageSize: 30,
      pageIndex: 0,
      dataState: true,
      pageType: '',
      downState: false
    }
  },
  computed: {
    subType() {
      if (this.pageIndex === this.WATERPage) {
        return this.WATERSubType
      } else if (this.pageIndex === this.VOCPage) {
        return this.VOCSubType
      }
    }
  },
  created() {
    this.routeChange()
    this.getAlarmCount()
  },
  mounted() {
    window.onscroll = () => {
      const boxH = this.$refs.scrollbox ? this.$refs.scrollbox.clientHeight : 0
      const scrollH = window.scrollY
      const windowH = window.innerHeight
      if (scrollH + windowH + 50 >= boxH && this.dataState) {
        this.pageIndex++
        this.dataState = false
        if ((this.pageIndex + 1) * this.pageSize >= this.count) {
          this.downState = true
          this.pageIndex--
          return
        }
        this.getList()
      }
    }
  },
  methods: {
    backFun() {
      const isHBGJ = cookie.get('ISHBGJ')
      if (isHBGJ == 1) {
        this.$router.go(-1)
      } else {
        this.$api.backHome()
      }
    },
    routeChange() {
      this.pageType = this.$route.params.id
      this.moduleName = this.moduleList[this.pageType]
    },
    toMap() {
      this.$router.push('/map')
    },
    getList() {
      if (this.pageType === '0') {
        this.getEnterList()
      } else if (this.pageType === '1') {
        this.getAlarmList()
      }
    },
    getEnterList() {
      const payload = {
        keys: this.filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      if (this.pageIndex > 0) {
        payload.loading = true
      }
      this.$api.getSiteList(payload).then(res => {
        this.dataState = true
        this.firstState = false
        if (res) {
          if (res.items && Array.isArray(res.items)) {
            res.items.forEach(ii => {
              this.alarmEnters.forEach(aa => {
                if (ii.id === aa) {
                  ii.isWarning = true
                }
              })
            })
            this.list = [...this.list, ...res.items]
            this.count = res.count
          } else if (Array.isArray(res)) {
            this.list = res
            this.count = res.length
          }
        }
      })
    },
    getAlarmList() {
      const payload = {
        keyword: this.filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        hurl: ''
      }
      if (this.pageIndex > 0) {
        payload.loading = true
      }
      this.$api.getAlarmList(payload).then(res => {
        this.dataState = true
        this.firstState = false
        if (res) {
          if (res.items && Array.isArray(res.items)) {
            res.items.forEach(ii => {
              this.alarmEnters.forEach(aa => {
                if (ii.id === aa) {
                  ii.isWarning = true
                }
              })
            })
            this.list = [...this.list, ...res.items]
            this.count = res.count
          } else if (Array.isArray(res)) {
            this.list = res
            this.count = res.length
          }
        }
      })
    },
    getAlarmCount() {
      this.$api.getAlarmCount({}).then(res => {
        if (res.items && Array.isArray(res.items)) {
          this.alarmEnters = res.items
        }
        this.getList()
      })
    },
    toSearchList(e) {
      this.firstState = true
      this.filter = e
      this.list = []
      window.scrollTo(0, 0)
      this.pageIndex = 0
      this.downState = false
      this.getList()
    },
    toDetail(item) {
      // this.$store.state.clickItem = JSON.parse(JSON.stringify(item))
      // if (this.pageType === this.PollutionPage) {
      //   this.$router.push(`/enterFactor/${item.id}`)
      // } else if (this.pageType === this.AlarmPage) {
      //   this.$router.push(`/statistics/${item.id}`)
      // }
      this.$router.push('/homePage/' + item.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_flex.scss';
@import '@/assets/scss/variables.scss';
.main-content {
  top: $header-withSearch-height;
}
.sort_box {
  @include flexbox;
  @include align-items(center);
  background: rgba(255, 255, 255, 1);
  height: 0.8rem;
  font-size: 0.28rem;
  > span:first-child {
    margin-left: 0.32rem;
  }
  > span:nth-child(2) {
    margin-left: 0.6rem;
  }
  > span:last-child {
    margin-left: 1.5rem;
  }
  .selected {
    color: rgba(50, 150, 250, 1);
  }
}
.list-content {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  background: rgba(255, 255, 255, 1);
  height: 1.12rem;
  font-size: 0.34rem;
  color: rgba(48, 48, 48, 1);
  line-height: 0.48rem;
  border-bottom: solid 1px #e0e0e0;
  > span:first-child {
    margin: 0 0.5rem 0 0.32rem;
  }
  .icon svg {
    width: 0.18rem;
    height: 0.32rem;
  }
}
.list-content:last-child {
  border: 0;
}

.other .list-content {
  > span:last-child {
    margin-right: 0.32rem;
  }
}
.list-tips {
  @include justify-content(center);
  font-size: 0.3rem;
}
.down-tip {
  line-height: 0.4rem;
  font-size: 0.24rem;
  color: #999;
  text-align: center;
  margin: 0;
  padding: 0.2rem;
}
.warning {
  display: inline-block;
  width: 0.36rem;
  height: 0.36rem;
  background: url('../../../assets/images/warning.png') no-repeat center;
  background-size: 100% 100%;
}
</style>
