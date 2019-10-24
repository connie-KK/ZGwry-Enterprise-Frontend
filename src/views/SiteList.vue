<template>
  <div class="content">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearch="isShowSearch"
      :showBorder="isShowBorder"
    >
      {{moduleName}}
      <div slot="right" v-if="this.routeId==1">
        <svg-icon icon-class="location"></svg-icon>
      </div>
    </header-bar>
    <div class="main-content">
      <div class="filter" v-if="this.routeId==1">
        <span @click="changeFilter" :class="span1">PM2.5排序</span>
        <span @click="changeFilter" :class="span2">AQI排序</span>
      </div>
      <div class="list-header" v-if="this.routeId==1">
        <span>站点</span>
        <span>主要污染物</span>
        <span>{{unit}}</span>
      </div>
      <div class="air" v-if="this.routeId==1">
        <div
          v-for="(item, index) in list"
          class="list-content"
          :key="index"
          @click="toDetail(item)"
        >
          <span>{{`${index+1}、${item}`}}</span>
          <span>PM2.5</span>
          <span class="icon">
            <span>88</span>
            <svg-icon icon-class="right"></svg-icon>
          </span>
        </div>
      </div>
      <div class="other" v-if="this.routeId!=1">
        <div
          v-for="(item, index) in list"
          class="list-content"
          :key="index"
          @click="toDetail(item)"
        >
          <span>{{item}}</span>
          <span class="icon">
            <svg-icon icon-class="right"></svg-icon>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "assets/scripts/config";
export default {
  name: "SiteList",
  data() {
    return {
      moduleName: "环境空气常规",
      isShowSearch: true,
      list: ["金海岸", "红旗"],
      moduleList: config.list,
      routeId: 0,
      type: "PM2.5",
      isShowBorder: true
    };
  },
  computed: {
    unit() {
      if (this.type === "PM2.5") {
        return "PM2.5(μg/m³)";
      } else if (this.type === "AQI") {
        return "AQI";
      }
    },
    span1() {
      if (this.type === "PM2.5") {
        return "selected";
      }
      return "";
    },
    span2() {
      if (this.type === "AQI") {
        return "selected";
      }
      return "";
    }
  },
  created() {
    this.routeChange();
  },
  methods: {
    routeChange() {
      this.routeId = this.$route.params.id;
      this.moduleName = this.moduleList[this.routeId];
    },
    changeFilter() {
      if (this.type === "PM2.5") {
        this.type = "AQI";
      } else if (this.type === "AQI") {
        this.type = "PM2.5";
      }
    },
    toDetail(item) {
      this.$router.push(`/siteDetail/${this.routeId}`);
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../assets/scss/_flex.scss";
@import "../assets/scss/variables.scss";
.main-content{
    top: $header-withSearch-height;
}
.filter {
  @include flexbox;
  @include align-items(center);
  background:rgba(255,255,255,1);
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
    width: 1.7rem;
    display: inline-block;
  }
  > span:first-child {
    margin: 0 1.1rem 0 0.32rem;
  }
  > span:last-child {
    width: 2.27rem;
    margin-left: 0.4rem;
  }
}
.list-content {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  background:rgba(255,255,255,1);
  height: 1.12rem;
  font-size: 0.34rem;
  color: rgba(48, 48, 48, 1);
  line-height: 0.48rem;
  border-bottom: solid 1px #e0e0e0;
  > span:first-child {
    margin: 0 1rem 0 0.32rem;
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
    width: 1.7rem;
    display: inline-block;
  }
  > span:last-child {
    width: 2.27rem;
    margin-left: 0.4rem;
  }
}
.other .list-content {
  > span:last-child {
    margin-right: 0.32rem;
  }
}
</style>