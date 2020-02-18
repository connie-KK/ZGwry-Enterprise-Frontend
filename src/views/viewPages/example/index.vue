<template>
  <div>
    <header-bar>{{ moduleName }}</header-bar>
    <div class="main-content">
      <nav-bar :selected="1"></nav-bar>
      <div class="main-content-box"></div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/navBar.vue'
export default {
  name: 'example',
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
  .main-content-box {
    height: calc(100% - 50px);
    overflow-y: auto;
  }
}
</style>
