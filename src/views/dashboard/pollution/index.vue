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
        <div class="list list2" v-for="(item,index) in list" :key="index">
          <div class="first-line">
            <span>{{item.facilityname}}</span>
            <span @click="toDetail(item)">详情</span>
          </div>
          <p>{{item.treatmentprocess}}</p>
          <p v-if="item.output&&selectedSubTab!==7">{{item.output.name}}</p>
          <p v-if="selectedSubTab===7">{{item.number}}</p>
          <p>{{item.remark}}</p>
        </div>
      </div>
      <div class="footer">
        <div class="submitBtn">
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
  name: "pollution",
  components: {
    "nav-bar": navBar,
    "mt-navbar": Navbar,
    "mt-tab-item": TabItem
  },
  watch: {
    selectedSubTab() {
      this.getPollControlList();
    }
  },
  data() {
    return {
      moduleName: "企业信息",
      enterid: "",
      selectedTab: 5,
      selectedSubTab: 2,
      tabList: [
        { id: 2, name: "废水治理设施" },
        { id: 1, name: "废气治理设施" },
        { id: 7, name: "固废治理设施" }
      ],
      yJC: 0,
      yNoise: 6,
      yGWF: 7,
      list: []
    };
  },
  created() {
    this.enterid = "82bd35e2-acd5-4a66-86fd-f1d435eb12fe";
    this.getPollControlList();
  },
  methods: {
    getPollControlList() {
      const payload = {
        enterid: this.enterid,
        category: this.selectedSubTab,
        pageIndex: 0,
        pageSize: 0
      };
      this.$api.getZGTreatFacilityList(payload).then(res => {
        if (res) {
          res.items.forEach(item => {
            if (this.selectedSubTab === 2) {
              //废水
              item.treatmentprocess = `废水净化方法：${item.treatmentprocess}`;
            } else if (this.selectedSubTab === 1) {
              //废气
              item.treatmentprocess = `废气净化方法：${item.treatmentprocess}`;
            } else if (this.selectedSubTab === 7) {
              //固危废
              item.treatmentprocess = `处理工艺：${item.treatmentprocess}`;
            }
            if (item.output) {
              item.output.name = `排放口：${item.output.name}`;
            }
            item.number = `数量：${item.number}`;
            item.remark = `备注：${item.remark}`;
          });
          this.list = res.items;
        }
      });
    },
    toDetail(e) {
      const select = `${this.selectedTab}-${this.selectedSubTab}`;
      store.set("pageType", select);
      this.$router.push(`/emissionsDetail/${e.id}`);
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
.list2 {
  p:last-child {
    padding-bottom: 0.32rem;
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
