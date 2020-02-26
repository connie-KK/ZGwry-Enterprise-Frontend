<template>
  <div class="content" id="msgList">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :showBorder="isShowBorder"
      :isShowSearch="isShowSearch"
      :serachFun="toSearchList"
    >{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="list" v-for="(item,index) in dataList" :key="index" @click="toDetail(item)">
        <div>
          <p>{{item.title}}</p>
          <p>{{item.date}}</p>
        </div>
        <div>
          <icon name="right" scale="1"></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "MsgList",
  data() {
    return {
      isShowBorder: false,
      isShowSearch: true,
      moduleName: "上级下发信息",
      filter: "",
      dataList: [
        {
          id: 1,
          title: "adcvfs",
          date: "2019-07-01"
        },
        {
          id: 2,
          title: "gadrg",
          date: "2019-07-01"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const payload = {
        pageIndex: -1,
        pageSize: 10,
        searchKey: this.filter
      };
      this.$api.getMsgList(payload).then(res => {
        if (res && Array.isArray(res.list)) {
          res.list.forEach(item => {
            item.date = moment(item.date).format("YYYY-MM-DD");
          });
          this.dataList = res.list;
        }
      });
    },
    toSearchList(e) {
      this.filter = e;
      this.getList();
    },
    toDetail(item) {
      this.$router.push(`/msgDetail/${item.id}`);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
#msgList {
  .main-content {
    top: calc(2.33rem - 0.13rem);
  }
  .searchBox {
    margin-bottom: 0.17rem;
  }
  .list {
    height: 1.44rem;
    background: rgba(255, 255, 255, 1);
    border-top: solid 1px #e0e0e0;
    padding: 0.25rem 0.32rem;
    @include flexbox;
    @include flex-direction(row);
    @include align-items(center);
    > div > p {
      padding: 0;
      margin: 0;
      vertical-align: middle;
    }
    > div:nth-child(1) {
      @include flex(5);
      > p:nth-child(1) {
        line-height: 0.48rem;
        margin-bottom: 8px;
        color: rgba(48, 48, 48, 1);
        font-size: 0.34rem;
      }
      > p:nth-child(2) {
        line-height: 0.37rem;
        color: rgb(157, 157, 157);
      }
    }
    > div:nth-child(2) {
      text-align: right;
    }
  }
}
</style>