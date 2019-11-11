<template>
  <div class="content">
    <header-bar leftIcon="back" leftText="返回" >{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="air-note" v-if="this.pageType==1">
        <div class="level" :style="{background: AQIColor}">{{AQILevel}}</div>
        <p :class="pClass">{{airInfo1}}</p>
        <p :class="pClass">{{airInfo2}}</p>
        <p :class="pClass">{{airInfo3}}</p>
      </div>
      <div class="list-header" v-if="this.pageType!=1">
        <span>因子名</span>
        <span>最新值</span>
      </div>
      <div
        v-for="(item, index) in factorList"
        class="list-content"
        :key="index"
        @click="toFactor(item)"
      >
        <span>{{item.name}}</span>
        <span>{{item.value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import store from "store";
export default {
  name: "SiteDetail",
  data() {
    return {
      factorList: [],
      factorVals: [],
      routeId: 0,
      pageType: 0,
      AQILevel: "",
      AQIColor: "",
      airInfo1: "",
      airInfo2: "",
      airInfo3: "",
      nullValue: "--"
    };
  },
  computed: {
    detailData() {
      const arr = this.$store.state.siteList;
      let tempData;
      arr.forEach(item => {
        if (item.StationId && item.StationId == this.routeId) {
          tempData = item;
        }
      });
      return tempData;
    },
    moduleName() {
      if (this.detailData && this.detailData.StationName) {
        return this.detailData.StationName;
      } else {
        return "站点";
      }
    },
    pClass() {
      if (!this.airInfo1) {
        return "loading";
      }
    }
  },
  created() {
    this.routeId = this.$route.params.id;
    this.pageType = store.get("pageType");
    if (this.pageType == 1) {
      //空气站点
      this.getEvaluate();
    }
    this.getFactorList();
  },
  methods: {
    getEvaluate() {
      const payload = {
        refId: this.routeId,
        fromType: 0
      };
      this.$api.getAriEvaluate(payload).then(res => {
        this.AQILevel = res.AQIInfo.AQILevel;
        this.AQIColor = res.AQIInfo.AQIColor;
        this.airInfo1 = `当前空气AQI为${res.AQIInfo.Idx}，环境质量为${res.AQIInfo.AQIClass}。`;
        this.airInfo2 = res.AQIInfo.Health;
        this.airInfo3 = `建议：${res.AQIInfo.Suggestion}`;
      });
    },
    toFactor(item) {
      this.$store.commit("set_siteId", this.routeId);
      this.$store.commit("set_factorData", item);
      this.$router.push(`/factor/${item.id}`);
    },
    getFactorList() {
      const payload = {
        id: this.routeId
      };
      this.$api.getFactorList(payload).then(res => {
        this.factorList = res;
        this.getFacVals();
      });
    },
    getFacVals() {
      const payload = {
        refId: this.routeId,
        fromType: 0,
        dType: 0
      };
      this.$api.getFacVals(payload).then(res => {
        this.factorVals = res;
        this.factorList.forEach(factorItem => {
          if (res instanceof Array && res.length > 0) {
            res.forEach(valItem => {
              if (factorItem.id === valItem.id) {
                let newVal;
                if (valItem.val == 0 || valItem.val > 0) {
                  newVal = `${valItem.val} ${factorItem.unitName}`;
                } else {
                  newVal = 0;
                }
                this.$set(factorItem, "value", newVal);
              }
            });
          } else {
            this.$set(factorItem, "value", this.nullValue);
          }
        });
        this.factorList.forEach(factorItem => {
          if (!factorItem.value) {
            this.$set(factorItem, "value", this.nullValue);
          }
        });
      });
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/assets/scss/_flex.scss";
.air-note {
  padding: 0.25rem 0.32rem;
  background: rgba(248, 248, 248, 1);
  .level {
    @include flexbox;
    @include justify-content(center);
    @include align-items(center);
    width: 1rem;
    height: 0.4rem;
    border-radius: 2px;
    font-size: 0.26rem;
    margin-bottom: 0.2rem;
    background: #e9ebed;
  }
  p {
    font-size: 0.24rem;
    color: rgba(48, 48, 48, 1);
    margin: 0 0 0.1rem 0;
  }
  .loading {
    height: 0.4rem;
    line-height: 0.4rem;
    background: #e9ebed;
  }
}
.list-header,
.list-content {
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
  .loadingSpan {
    display: inline-block;
    width: 1rem;
    height: 0.4rem;
    background: #e9ebed;
  }
}
.list-header {
  height: 0.8rem;
  background: rgba(241, 245, 247, 1);
}
.list-content {
  height: 1.12rem;
  line-height: 0.48rem;
  background: rgba(255, 255, 255, 1);
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