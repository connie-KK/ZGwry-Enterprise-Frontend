<template>
  <div class="content">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearch="isShowSearch"
      :showBorder="isShowBorder"
      :serachFun="toSearchList"
    >
      {{moduleName}}
      <div slot="right" v-if="this.pageType==AIRPage" @click="toMap">
        <svg-icon icon-class="location"></svg-icon>
      </div>
    </header-bar>
    <div class="main-content">
      <div class="sort_box" v-if="this.pageType==AIRPage">
        <span @click="changeFilter" :class="span1">PM2.5排序</span>
        <span @click="changeFilter" :class="span2">AQI排序</span>
      </div>
      <div class="list-header" v-if="this.pageType==AIRPage">
        <span>站点</span>
        <span>主要污染物</span>
        <span>{{unit}}</span>
      </div>
      <div class="air" v-if="this.pageType==AIRPage">
        <div
          v-for="(item, index) in airList"
          class="list-content"
          :key="index"
          @click="toDetail(item)"
        >
          <span>{{`${index+1}、${item.StationName}`}}</span>
          <span>{{item.mainEffect}}</span>
          <span class="icon">
            <span>{{item.mainEffectValue}}</span>
            <svg-icon icon-class="right"></svg-icon>
          </span>
        </div>
      </div>
      <div class="other" v-if="this.pageType!=AIRPage && list.length>0">
        <div
          v-for="(item, index) in list"
          class="list-content"
          :key="index"
          @click="toDetail(item)"
        >
          <span>{{item.name}}</span>
          <span class="icon">
            <svg-icon icon-class="right"></svg-icon>
          </span>
        </div>
      </div>
      <div v-if="this.pageType!=AIRPage && list.length==0">
        <div class="list-content list-tips">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "assets/scripts/config";
import store from "store";
export default {
  name: "SiteList",
  data() {
    return {
      WATERPage: 0,
      WATERSubType: 9,
      AIRPage: 1,
      VOCPage: 2,
      VOCSubType: 0,
      moduleName: "环境空气常规",
      isShowSearch: true,
      list: [],
      airList: [],
      moduleList: config.list,
      routeId: 0,
      type: "PM2.5",
      isShowBorder: true,
      filter: ""
    };
  },
  computed: {
    pageType() {
      //pageType为1代表是环境空气，否则是其他
      return store.get("pageType");
    },
    unit() {
      //空气站点列表页，排序方式
      if (this.type === "PM2.5") {
        return "PM2.5(μg/m³)";
      } else if (this.type === "AQI") {
        return "AQI";
      }
    },
    span1() {
      //空气站点列表页，是否选中PM2.5排序方式
      if (this.type === "PM2.5") {
        return "selected";
      }
      return "";
    },
    span2() {
      //空气站点列表页，是否选中AQI排序方式
      if (this.type === "AQI") {
        return "selected";
      }
      return "";
    },
    subType() {
      if (this.pageType === this.WATERPage) {
        return this.WATERSubType;
      } else if (this.pageType === this.VOCPage) {
        return this.VOCSubType;
      }
    }
  },
  created() {
    this.routeChange();
    this.getList();
  },
  methods: {
    routeChange() {
      this.moduleName = this.moduleList[this.pageType];
    },
    toMap() {
      this.$router.push("/map");
    },
    changeFilter() {
      if (this.type === "PM2.5") {
        this.type = "AQI";
      } else if (this.type === "AQI") {
        this.type = "PM2.5";
      }
      this.handleList();
    },
    getList() {
      if (this.pageType == this.AIRPage) {
        this.$api.getLastAQIVals().then(res => {
          if (res) {
            this.$store.commit("set_siteList", res);
            this.handleList(res);
          }
        });
      } else if (
        this.pageType == this.WATERPage ||
        this.pageType == this.VOCPage
      ) {
        const payload = {
          searchKey: this.filter,
          pageIndex: -1,
          pageSize: 10,
          type: 3,
          subType: this.subType
        };
        this.$api.getSiteList(payload).then(res => {
          if (res && res.Items) {
            res.Items.forEach(item => {
              item.StationId = item.id;
              item.StationName = item.name;
            });
            this.list = res.Items;
            this.$store.commit("set_siteList", res.Items);
          }
        });
      }
    },
    handleList(arr = this.airList) {
      let tempArr = [];
      arr.forEach(item => {
        if (this.type === "PM2.5") {
          item.mainEffect = "PM2.5";
          item.mainEffectValue = item.info.PM25;
        } else if (this.type === "AQI") {
          item.mainEffect = item.info.facName;
          item.mainEffectValue = item.info.AQI;
        }
        tempArr.push([item.StationLat, item.StationLng]);
      });
      arr.sort((a, b) => b.mainEffectValue - a.mainEffectValue);
      this.airList = arr;
      this.$store.commit("set_ariLoaction", tempArr)

    },
    toSearchList(e) {
      this.filter = e;
      this.getList();
    },
    toDetail(item) {
      this.$router.push(`/siteDetail/${item.StationId}`);
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../assets/scss/_flex.scss";
@import "../assets/scss/variables.scss";
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
  > span:last-child {
    margin-left: 0.6rem;
  }
  .selected {
    color: rgba(50, 150, 250, 1);
  }
}
.list-header {
  @include flexbox;
  @include align-items(center);
  height: 0.8rem;
  background: rgba(241, 245, 247, 1);
  color: rgba(48, 48, 48, 1);
  font-size: 0.34rem;
  span {
    width: 2rem;
    display: inline-block;
  }
  > span:first-child {
    margin: 0 1.1rem 0 0.32rem;
  }
  > span:last-child {
    width: 2.27rem;
    margin-left: 0.4rem;
    text-align: center;
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
.air .list-content {
  span {
    width: 1.3rem;
    display: inline-block;
  }
  > span:first-child {
    width: 3.5rem;
  }
  > span:nth-child(2) {
    width: 1.8rem;
    display: inline-block;
  }
  > span:last-child {
    width: 2.27rem;
    margin-left: 0.5rem;
    span {
      text-align: center;
    }
  }
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
</style>