<template>
  <div>
    <navigation>
      <transition :name="transitionName">
        <router-view></router-view>
      </transition>
    </navigation>
    <img src="../../assets/images/loading.svg" class="loadImg" v-if="loading" />
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      transitionName: "fade",
      timer: null
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  watch: {
    loading() {
      clearTimeout(this.timer);
      if (this.loading) {
        this.timer = setTimeout(() => {
          this.$store.commit("set_loading", false);
        }, 10 * 1000);
      }
    }
  }
};
</script>

<style scoped>
.loadImg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 9999;
  width: 1.3rem;
  height: 1.3rem;
}
</style>
