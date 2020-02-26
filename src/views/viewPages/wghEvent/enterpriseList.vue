<template>
  <div class="content" id="enterpriseList">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :showBorder="isShowBorder"
      :isShowSearch="isShowSearch"
      :serachFun="toSearchList"
    >{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="list-content" ref="scrollbox">
        <div v-for="(item,index) in dataLists" :key="index" @click="selectItem(item)">
          <p v-if="item.name">{{item.name}}</p>
          <p v-if="item.address">{{item.address}}</p>
        </div>
      </div>
      <p class="tips" v-if="!dataLists.length&&!firstState">暂无数据</p>
      <p class="tips" v-if="downState">已经到底了</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnterpriseList",
  data() {
    return {
      moduleName: "相关企业",
      isShowBorder: false,
      isShowSearch: true,
      filter: "",
      firstState: true,
      pageSize: 30,
      pageIndex: 0,
      downState: false,
      dataLists: [],
      count: 0,
      dataState: true
    };
  },
  created() {
    this.getEnterpriseList();
  },
  mounted() {
    window.onscroll = () => {
      const boxH = this.$refs.scrollbox ? this.$refs.scrollbox.clientHeight : 0;
      const scrollH = window.scrollY;
      const windowH = window.innerHeight;
      if (scrollH + windowH + 50 >= boxH && this.dataState) {
        if ((this.pageIndex + 1) * this.pageSize >= this.count) {
          this.downState = true;
          return;
        }
        this.pageIndex++;
        this.dataState = false;
        this.getEnterpriseList();
      }
    };
  },
  methods: {
    toSearchList(e) {
      this.filter = e;
      this.getEnterpriseList();
    },
    getEnterpriseList() {
      const payload = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.filter
      };
      this.$api.getEnterpriseList(payload).then(res => {
        if (res) {
          this.dataState = true;
          this.firstState = false;
          this.count = res.count;
          this.dataLists = [...this.dataLists, ...res.items];
        }
      });
    },
    selectItem(item) {
      const tempObj = {
        value: item.name,
        valueKey: item.id
      };
      this.$store.commit("set_selectedEnterprise", tempObj)
      this.$router.push("/eventContent/-1")
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
@import "@/assets/scss/variables.scss";
#enterpriseList {
  .main-content {
    top: $header-withSearch-height;
  }
  .list-content {
    div {
      width: 100%;
      background: white;
      padding: 0.26rem 0.32rem;
      border-top: solid 1px #e0e0e0;
      p {
        margin: 0;
        padding: 0;
      }
      p:nth-child(1) {
        font-size: 0.34rem;
        color: rgba(48, 48, 48, 1);
        line-height: 0.48rem;
      }
      p:nth-child(2) {
        font-size: 0.26rem;
        line-height: 0.37rem;
        color: #9e9e9e;
        margin-top: 0.09rem;
      }
    }
  }
  .tips {
    line-height: 0.4rem;
    font-size: 0.24rem;
    color: #999;
    text-align: center;
    margin: 0;
    padding: 0.2rem;
  }
}
</style>