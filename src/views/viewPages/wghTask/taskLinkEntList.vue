<template>
  <div id="taskLinkEntList">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
      :serachFun="toSearchList"
      :toggleSearchBox="toToggleSearchBox"
    >
      {{ moduleName }}
    </header-bar>
    <div :class="[isShowSearchBox?'main-content-with-search':'','main-content']">
      <ul
        class="ul-box"
        ref="srollbox"
      >
        <li
          v-for="item in list"
          :key="item.id"
          @click="clickItem(item)"
        >
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  name: 'taskLinkEntList',
  components: {
  },
  data () {
    return {
      moduleName: '企业列表',
      searchKey: '',
      isShowSearchIcon: true,
      isShowSearchBox: false,
      isShowBorder: false,
      list: [],
      pageIndex: 0,
      pageSize: 20,
      count: 0,
      load: true
    }
  },
  mounted () {
    this.getList()
    this.$refs.srollbox.onscroll = e => {
      const t = e.target.scrollTop
      const h = e.target.clientHeight
      const allh = e.target.scrollHeight
      if (t + h + 100 >= allh && this.load && this.pageIndex < parseInt((this.count / this.pageSize))) {
        this.load = false
        this.pageIndex++
        this.getList()
      }
    }
  },
  methods: {
    getList () {
      this.$api.getEnterpriseList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.searchKey
      }).then(res => {
        if (res && res.items && Array.isArray(res.items)) {
          this.list = [...this.list, ...res.items]
          this.count = res.count
          this.load = true
        }
      })
    },
    toSearchList (e) {
      this.searchKey = e
      this.pageIndex = 0
      this.list = []
      this.getList()
    },
    toToggleSearchBox(e) {
      this.isShowSearchBox = e;
    },
    clickItem (item) {
      if (this.$store.state.taskParams.taskenterprises.includes(item.id)) {
        Toast('该企业已存在！')
        return
      }
      this.$store.state.taskParams.taskenterprises.push(item.id)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
#taskLinkEntList {
  .main-content {
    background: #fff;
    height: 100%;
    p {
      padding: 0;
      margin: 0;
    }
    .mint-tab-item-label {
      font-size: 0.3rem;
    }
  }
  .ul-box {
    border-top: 1px solid #e0e0e0;
    height: 100%;
    overflow-y: auto;
    li {
      height: 1.12rem;
      line-height: 1.12rem;
      padding: 0 0.32rem;
      background: #fff;
      background-size: auto 0.32rem;
      font-size: 0.34rem;
      border-bottom: 1px solid #e0e0e0;
      p {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
