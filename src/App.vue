<template>
<navigation>
    <transition :name='transitionName'>
      <router-view></router-view>
    </transition>
  </navigation>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'fade'
    }
  },
  created () {
    this.$navigation.on('forward', (to, from) => {
      this.transitionName = 'fade-right'
    })
    this.$navigation.on('back', (to, from) => {
      this.transitionName = 'fade-left'
    })
    this.$navigation.on('replace', (to, from) => {
      this.transitionName = 'fade'
    })
  }
}
</script>

<style>
</style>
