<template>
  <div class="content">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{routeName}}</header-bar>
    <div class="main-content">
      <div v-for="item in filterHeader" :key="item.key" class="filter-list">
        <span>{{item.factor}}</span>
        <span>
          {{item.value}}
          <span class="icon">
            <svg-icon icon-class="right"></svg-icon>
          </span>
        </span>
      </div>
      <div class="chart-container">
        <line-chart :id="chartId" :opation="opation"></line-chart>
      </div>
      <div class="list-header">
        <span>日期</span>
        <span>数值</span>
      </div>
      <div class="list-content" v-for="(item,index) in dataList" :key="index">
        <span>{{item.date}}</span>
        <span>{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import LChart from "@/components/Chart.vue";
import chartOpation from "@/assets/scripts/chartOpation";
export default {
  name: "Factor",
  components: {
    "line-chart": LChart
  },
  data() {
    return {
      filterHeader: [
        { factor: "选择类型", value: "小时均值", key: "factor1" },
        { factor: "开始时间", value: "2019-09-28", key: "factor2" },
        { factor: "结束时间", value: "2019-09-28", key: "factor3" }
      ],
      routeName: "",
      isShowBorder: true,
      opation: chartOpation.lineOpation,
      chartId: "chart",
      dataList: [
        { date: "2019-09-28 00", value: 32 },
        { date: "2019-09-28 01", value: 30 },
        { date: "2019-09-28 02", value: 27 },
        { date: "2019-09-28 03", value: 52 },
        { date: "2019-09-28 02", value: 27 },
        { date: "2019-09-28 03", value: 52 }
      ]
    };
  },
  created() {
    this.routeChange();
  },
  methods: {
    routeChange() {
      this.routeName = this.$route.params.id;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../assets/scss/_flex.scss";
.filter-list {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  background: rgba(255, 255, 255, 1);
  height: 1.12rem;
  border-bottom: solid 1px #e0e0e0;
  padding: 0 0.32rem;
  > span:first-child {
    color: rgba(48, 48, 48, 1);
    font-size: 0.34rem;
  }
  > span:last-child {
    color: #9a9a9a;
    font-size: 0.32rem;
    .icon {
      display: inline-block;
      margin-left: 0.16rem;
      svg {
        width: 0.36rem;
        height: 0.36rem;
      }
    }
  }
}
.filter-list:nth-child(3) {
  border: 0;
}
.chart-container {
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
  margin-top: 0.4rem;
  background: rgba(255, 255, 255, 1);
}
#chart {
  width: 6.6rem;
  height: 4rem;
}
.list-header,
.list-content {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  font-size: 0.34rem;
  color: rgba(48, 48, 48, 1);
  padding: 0 0.32rem;
}
.list-header {
  height: 0.8rem;
  background: rgba(241, 245, 247, 1);
}
.list-content {
  background: rgba(255, 255, 255, 1);
  border-bottom: solid 1px #e0e0e0;
  height: 1.12rem;
  > span:last-child {
    font-size: 0.3rem;
    color: rgba(0, 0, 0, 1);
  }
}
</style>