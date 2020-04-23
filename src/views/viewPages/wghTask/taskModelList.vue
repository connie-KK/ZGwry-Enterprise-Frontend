<template>
  <div id="taskModelList">
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
      <ul class="ul-box">
        <li
          v-for="item in list"
          :key="item.id"
          @click="clickItem(item)"
        >
          <p>{{ item.title }}</p>
          <!-- <span @click="userItem(item)">使用此模板</span> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'taskModelList',
  components: {
  },
  data () {
    return {
      moduleName: '任务模板类型',
      searchKey: '',
      isShowSearchIcon: true,
      isShowSearchBox: false,
      isShowBorder: false,
      list: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.getTemplateByKey({
        pageIndex: -1,
        pageSize: 10,
        searchKey: this.searchKey
      }).then(res => {
        if (res && Array.isArray(res))
          this.list = res
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
      this.$router.push(`/taskModelDetail/${item.id}`)
    },
    userItem (item) {
      this.$store.state.taskParams.template = item.id
      this.$store.state.taskParams.templateName = item.title
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
#taskModelList {
  .main-content {
    background: #fff;
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
    li {
      height: 1.12rem;
      line-height: 1.12rem;
      padding: 0 0.32rem;
      background: #fff url("../../../assets/images/right.png") no-repeat
        calc(100% - 0.5rem) center;
      background-size: auto 0.32rem;
      font-size: 0.34rem;
      border-bottom: 1px solid #e0e0e0;
      position: relative;
      span {
        position: absolute;
        right: 0.96rem;
        background: #3296fa;
        color: #fff;
        font-size: 0.3rem;
        height: 0.54rem;
        line-height: 0.54rem;
        width: 1.9rem;
        border-radius: 0.06rem;
        top: 0;
        bottom: 0;
        margin: auto;
        text-align: center;
      }
    }
  }
}
</style>
