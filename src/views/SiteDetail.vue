<template>
  <div class="content">
    <header-bar leftIcon="back" leftText="返回">{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="air-note" v-if="this.routeId==1">
        <div class="level">{{airLevel}}</div>
        <p class="tips">{{airTips}}</p>
      </div>
      <div class="list-header" v-if="this.routeId!=1">
        <span>因子名</span>
        <span>最新值</span>
      </div>
      <div v-for="(item, index) in list" class="list-content" :key="index" @click="toFactor(item)">
        <span>{{item.factor}}</span>
        <span>{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SiteDetail",
  data() {
    return {
      moduleName: "金海岸",
      list: [
        { factor: "AQI", value: 58 },
        { factor: "PM2.5", value: "65.0 μg/m³" },
        { factor: "臭氧", value: "65.0 μg/m³" },
        { factor: "臭氧8", value: "65.0 μg/m³" },
        { factor: "二氧化硫", value: "65.0 μg/m³" },
        { factor: "二氧化氮", value: "65.0 μg/m³" },
        { factor: "一氧化碳", value: "65.0 μg/m³" },
        { factor: "风速", value: "65.0 μg/m³" },
        { factor: "二氧化硫", value: "65.0 μg/m³" },
        { factor: "二氧化氮", value: "65.0 μg/m³" },
        { factor: "一氧化碳", value: "65.0 μg/m³" },
        { factor: "风速", value: "65.0 μg/m³" }
      ],
      routeId: 0,
      airLevel: "二级",
      airTips: `当前空气AQI为88，环境质量为良。 
      空气质量可接受，单某些污染物可能对极少数异常敏感人群健康有较弱影响。 
      建议：极少数异常敏感人群应减少户外活动`
    };
  },
  created() {
    this.routeChange();
  },
  methods: {
    routeChange() {
      this.routeId = this.$route.params.id;
    },
    toFactor(item){
        this.$router.push(`/factor/${item.factor}`)
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../assets/scss/_flex.scss";
.air-note {
  padding: 0.25rem 0.32rem;
  background: rgba(248, 248, 248, 1);
  .level {
    @include flexbox;
    @include justify-content(center);
    width: 1rem;
    height: 0.4rem;
    background: rgba(255, 164, 0, 1);
    border-radius: 2px;
    border: 2px solid rgba(255, 164, 0, 1);
    font-size: 0.26rem;
  }
  .tips {
    font-size: 0.24rem;
    color: rgba(48, 48, 48, 1);
    margin: 0.13rem 0 0 0;
  }
}
.list-header,.list-content {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  color: rgba(48, 48, 48, 1);
  font-size: 0.34rem;
  > span:first-child {
    margin: 0 1rem 0 0.32rem;
  }
  > span:last-child {
    margin-right: 0.32rem;
  }
}
.list-header {
  height: 0.8rem;
  background: rgba(241, 245, 247, 1);
}
.list-content {
  height: 1.12rem;
  line-height: 0.48rem;
  background:rgba(255,255,255,1);
  border-bottom: solid 1px #e0e0e0;
  .icon svg {
    width: 0.18rem;
    height: 0.32rem;
  }
}

.list-content:last-child {
  border: 0;
}
</style>