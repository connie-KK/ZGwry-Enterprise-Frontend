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
          <p>{{ item.title }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Toast } from 'mint-ui'
export default {
  name: 'taskLinkEntList',
  components: {
  },
  data () {
    return {
      moduleName: '事件列表',
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
  },
  methods: {
    getList () {
      this.$api.getIncidentsByKey({
        pageIndex: -1,
        pageSize: this.pageSize,
        keyword: this.searchKey,
        startDate: moment().subtract(1, 'years').format('YYYY-01-01 00:00:00'),
        endDate: moment().format('YYYY-MM-DD 23:59:59')
      }).then(res => {
        if (res && Array.isArray(res)) {
          this.list = res
          this.load = true
        }
      })
    },
    toSearchList (e) {
      this.searchKey = e
      this.getList()
    },
    toToggleSearchBox(e) {
      this.isShowSearchBox = e;
    },
    clickItem (item) {
      this.$store.state.taskParams.incident = item.id
      this.$store.state.taskParams.incidentTitle = item.title
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
