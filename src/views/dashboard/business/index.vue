<template>
  <div>
    <header-bar>{{ moduleName }}</header-bar>
    <div class="main-content">
      <nav-bar :selected="6"></nav-bar>
      <div class="main-content-box">
        <p class="m-title">执法记录：</p>
        <ul class="ul-box">
          <li class="li-t">
            <span>执法时间</span>
            <span>执法人</span>
            <span>现场检查编号</span>
          </li>
          <li v-for="item in 10"
              :key="item">
            <span>2020-01-15 10:04</span>
            <span>李翠岗</span>
            <span>236985245963</span>
          </li>
        </ul>
        <p class="m-title">信访记录：</p>
        <ul class="ul-box ul-box2">
          <li class="li-t">
            <span>投诉内容</span>
            <span>投诉人</span>
            <span>投诉时间</span>
            <span>现场检查编号</span>
          </li>
          <li v-for="item in 10">
            <span>张某某乱扔垃圾</span>
            <span>李翠岗</span>
            <span>2020-01-15 10:04</span>
            <span>236985245963</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar.vue'
export default {
  name: 'business',
  components: {
    'nav-bar': navBar
  },
  data () {
    return {
      moduleName: '企业信息'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.main-content {
  height: calc(100% - 1.29rem);
}
.m-title {
  line-height: 0.8rem;
  font-size: 0.34rem;
  color: #333;
  padding-left: 0.32rem;
  margin-top: 0.02rem;
  background: #fff;
}
.ul-box {
  margin-bottom: 0.4rem;
  li {
    position: relative;
    line-height: 0.7rem;
    font-size: 0.34rem;
    background: #fff;
    height: 0.7rem;
  }
  span {
    position: absolute;
    &:nth-child(1) {
      left: 0.32rem;
    }
    &:nth-child(2) {
      left: 3.62rem;
    }
    &:nth-child(3) {
      left: 5.12rem;
    }
  }
  .li-t {
    background: #e5f1f4;
    font-size: 0.26rem;
  }
}
.ul-box2 {
  overflow-x: auto;
  li {
    width: 11.82rem;
  }
  span {
    position: absolute;
    &:nth-child(1) {
      left: 0.32rem;
      width: 3.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:nth-child(2) {
      left: 4.22rem;
    }
    &:nth-child(3) {
      left: 5.78rem;
    }
    &:nth-child(4) {
      left: 9.08rem;
    }
  }
}
</style>
