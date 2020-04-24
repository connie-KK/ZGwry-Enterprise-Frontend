<template>
  <div>
    <navigation>
      <transition :name="transitionName">
        <router-view></router-view>
      </transition>
    </navigation>
    <img
      src="../../assets/images/loading.svg"
      class="loadImg"
      v-if="loading"
    />
  </div>
</template>

<script>
import cookie from 'js-cookie'
import { Toast } from 'mint-ui'
export default {
  name: 'app',
  data () {
    return {
      transitionName: 'fade',
      timer: null,
      timer2: null,
      a: document
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading
    }
  },
  mounted () {
    this.xhOp()
  },
  watch: {
    loading () {
      clearTimeout(this.timer)
      if (this.loading) {
        this.timer = setTimeout(() => {
          this.$store.commit('set_loading', false)
        }, 10 * 1000)
      }
    },
    'a.cookie'(){
      console.log(this.a.cookie)
    }
  },
  methods: {
    xhOp () {
      this.timer2 = setInterval(() => {
        this.autoOpen()
      }, 1000)
    },
    autoOpen () {
      debugger
      const keya = 'linkData'
      const keyb = 'LinkData'
      let routex = cookie.get(keya)
      if (!routex) {
        let c = document.cookie.split(`${keyb}=`)[1]
        routex = c ? c.split(';')[0] : ''
      }
      if (routex) {
        cookie.remove(keya)
        cookie.remove(keya, { path: '', domain: '183.220.144.57' })
        // a
        {
          let cookie = document.cookie
          if (cookie.indexOf(routex) > -1) {
            document.cookie = cookie.split(routex).join('')
          }
        }
        this.$router.push(routex.split('$').join('/'))
      }
    }
  }
}
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
