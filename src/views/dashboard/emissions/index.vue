<template>
  <div>
    <header-bar>{{ moduleName }}</header-bar>
    <div class="main-content">
      <nav-bar :selected="selectedTab" :list="tabList"></nav-bar>
      <div class="second-tab">
        <mt-navbar v-model="selectedSubTab">
          <mt-tab-item
            v-for="secondItem in tabList"
            :id="secondItem.id"
            :key="secondItem.id"
          >{{secondItem.name}}</mt-tab-item>
        </mt-navbar>
      </div>
      <div class="main-content-box">
        <div class="list" v-for="(item,index) in list" :key="index">
          <div class="first-line">
            <span>{{item.name}}</span>
            <span @click="toDetail(item)">详情</span>
          </div>
          <p
            v-if="selectedSubTab!==yGWF&& selectedSubTab!==yJC&&item.standard "
          >{{item.standard.name}}</p>
          <p v-if="selectedSubTab===yGWF">{{item.processingmode}}</p>
          <p v-if="selectedSubTab===yJC">{{item.value}}</p>
          <div v-if="selectedSubTab!==yJC" class="third-line">
            <span v-if="selectedSubTab!==yNoise&&selectedSubTab!==yGWF">{{item.isonlinemonitoring}}</span>
            <span v-if="selectedSubTab===yGWF">{{item.isdangerousorwaste}}</span>
            <span>{{item.filecount}}</span>
          </div>
          <div v-if="selectedSubTab===yJC" class="third-line">
            <span>{{item.factorname}}</span>
            <span>{{item.filecount}}</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="submitBtn" @click="addItem">
          <span></span>
          <span>新增</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import store from "store";
import navBar from "@/components/navBar.vue";
import { Navbar, TabItem } from "mint-ui";
export default {
  name: "emissions",
  components: {
    "nav-bar": navBar,
    "mt-navbar": Navbar,
    "mt-tab-item": TabItem
  },
  data() {
    return {
      moduleName: "企业信息",
      enterid: "",
      selectedTab: 4,
      selectedSubTab: 2,
      tabList: [
        { id: 2, name: "废水" },
        { id: 1, name: "废气" },
        { id: 6, name: "噪声" },
        { id: 7, name: "固危废堆场点" },
        { id: 0, name: "监测数据" }
      ],
      yJC: 0,
      yNoise: 6,
      yGWF: 7,
      list: []
    };
  },
  watch: {
    selectedSubTab() {
      if (this.selectedSubTab === 0) {
        this.getMonitorList();
      } else {
        this.getOutletList();
      }
    }
  },
  created() {
    this.enterid = this.$store.state.enterid;
    this.getOutletList();
  },
  methods: {
    getMonitorList() {
      const payload = {
        enterid: this.enterid,
        pageIndex: 0,
        pageSize: 0
      };
      this.$api.getZGDataList(payload).then(res => {
        if (res) {
          res.items.forEach(item => {
            item.name = moment(item.monitordate).format("YYYY-MM-DD");
            item.value = `监测结果：${item.value}`;
            item.factorname = `监测指标：${item.factorname}`;
            item.filecount = `附件数：${item.filecount}`;
          });
          this.list = res.items;
        }
      });
    },
    getOutletList() {
      const payload = {
        enterid: this.enterid,
        category: this.selectedSubTab,
        pageIndex: 0,
        pageSize: 0
      };
      this.$api.getZGOutputList(payload).then(res => {
        if (res) {
          res.items.forEach(item => {
            if (item.standard) {
              item.standard.name = `排放标准：${item.standard.name}`;
            }
            item.isonlinemonitoring = item.isonlinemonitoring
              ? item.isonlinemonitoring
              : "无";
            item.processingmode = `处理方式：${item.processingmode}`;
            item.isdangerousorwaste = item.isdangerousorwaste ? "是" : "否";
            item.isdangerousorwaste = `是否危废：${item.isdangerousorwaste}`;
            item.isonlinemonitoring = `在线监控：${item.isonlinemonitoring}`;
            item.filecount = `附件数：${item.filecount}`;
          });
          this.list = res.items;
        }
      });
    },
    toDetail(e) {
      const select = `${this.selectedTab}-${this.selectedSubTab}`;
      store.set("pageType", select);
      this.$router.push(`/emissionsDetail/${e.id}`);
    },
    addItem() {
      const select = `${this.selectedTab}-${this.selectedSubTab}`;
      store.set("pageType", select);
      this.$router.push(`/emissionsDetail/0`);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
.main-content {
  height: calc(100% - 1.29rem);
  .main-content-box {
    height: calc(100% - 50px - 46px - 1.28rem);
    overflow-y: auto;
  }
}
p {
  margin: 0;
}
.list {
  background: rgba(255, 255, 255, 1);
  padding: 0 0.32rem;
  border-bottom: solid 1px #e0e0e0;
  div {
    @include flexbox;
    @include align-items(center);
    @include justify-content(space-between);
    font-size: 0.34rem;
  }
  .first-line {
    padding-top: 0.32rem;
    span {
      display: inline-block;
      line-height: 0.48rem;
    }
    span:last-child {
      width: 1rem;
      height: 0.44rem;
      background: rgba(50, 150, 250, 1);
      border-radius: 0.03rem;
      color: rgba(255, 255, 255, 1);
      font-size: 0.3rem;
      @include flexbox;
      @include align-items(center);
      @include justify-content(center);
    }
  }
  p {
    line-height: 0.42rem;
    padding-top: 0.2rem;
    font-size: 0.3rem;
    color: #a5a5a5;
  }
  .third-line {
    padding: 0.2rem 0 0.36rem 0;
    font-size: 0.3rem;
    span {
      display: inline-block;
      line-height: 0.42rem;
      color: #a5a5a5;
    }
    span:first-child {
      flex: 1;
    }
    span:last-child {
      flex: 1;
    }
  }
}
.footer {
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1.28rem;
  background: rgba(255, 255, 255, 1);
  .submitBtn {
    @include flexbox;
    @include align-items(center);
    @include justify-content(center);
    width: 6.86rem;
    height: 0.96rem;
    background: rgba(50, 150, 250, 1);
    border-radius: 3px;
    font-size: 0.34rem;
    color: rgba(255, 255, 255, 1);
    span:first-child {
      display: inline-block;
      width: 0.36rem;
      height: 0.36rem;
      margin-right: 0.2rem;
      background: url(../../../assets/images/add.png) no-repeat;
    }
  }
}
</style>
