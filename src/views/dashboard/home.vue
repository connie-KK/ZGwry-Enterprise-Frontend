<template>
  <div class="content">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder" :customBack="goBack">{{moduleName}}</header-bar>
    <div class="main-content">
      <div v-for="(item, index) in list" class="list" :key="index" @click="toSiteList(index)">
        <span>{{item}}</span>
        <span class="icon">
           <icon name="right" scale="1"></icon>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import store from "store";
export default {
  name: "Home",
  data() {
    return {
      moduleName: "环境质量",
      list: ["地表水", "环境空气常规", "环境VOCs"],
      isShowBorder: true
    };
  },
  methods: {
    toSiteList(index) {
      store.set("pageType", index);
      // this.$router.push(`/siteList`);
    },
    goBack(){
       if (aepCloseContentPage) {
        aepCloseContentPage();
      } else {
        console.error("框架未加载！");
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/assets/scss/_flex.scss";
.list {
  height: 1.12rem;
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  padding: 0 0.32rem;
  font-size: 0.34rem;
  background: rgba(255, 255, 255, 1);
  color: rgba(48, 48, 48, 1);
  line-height: 0.48rem;
  border-bottom: solid 1px #e0e0e0;
  .icon svg {
    width: 0.18rem;
    height: 0.32rem;
  }
}
.list:last-child {
  border: 0;
}
</style>