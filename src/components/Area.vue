<template>
  <div class="area-box">
    <input
      class="selectbox"
      :value="myname"
      readonly="readonly"
      @click="showPicker = true"
    />
    <van-popup
      v-model="showPicker"
      position="bottom"
    >
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        :default-index="defaultPIndex"
      />
    </van-popup>
  </div>
</template>

<script>
import { Picker, Popup } from 'vant'
import pca from '@/assets/scripts/pca.js'
export default {
  name: 'Area',
  components: {
    'van-popup': Popup,
    'van-picker': Picker
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return ['', '', '']
      }
    },
    fieldLable: {
      type: String,
      default: '省市区'
    },
    type: {
      type: String,
      default: 'name' // code
    }
  },
  data() {
    return {
      pca: pca,
      myval: ['', '', ''],
      showPicker: false,
      defaultPIndex: 0,
      defaultCIndex: 0,
      defaultAIndex: 0
    }
  },
  watch: {
    value() {
      this.setDefault()
    }
  },
  mounted() {
    this.setDefault()
  },
  computed: {
    columns() {
      let temp = JSON.parse(JSON.stringify(this.pca)) || []
      temp.forEach((p, pindex) => {
        p.text = p.name
        if (pindex === this.defaultPIndex) {
          p.defaultIndex = this.defaultCIndex
        }
        p.children.forEach((c, cindex) => {
          c.text = c.name
          if (cindex === this.defaultCIndex) {
            c.defaultIndex = this.defaultAIndex
          }
          c.children.forEach(a => {
            a.text = a.name
          })
        })
      })
      return temp
    },
    myname() {
      let name = this.myval.join(' ')
      return name === '  ' ? '' : name
    }
  },
  methods: {
    setDefault() {
      if (this.type === 'name') {
        this.getCode(this.value)
        this.myval = this.value
      } else if (this.type === 'code') {
        let names = this.setCode(this.value)
        this.myval = names
      }
    },
    onConfirm(e) {
      this.myval = e
      if (this.type === 'name') {
        this.$emit('submit', e)
      } else if (this.type === 'code') {
        let codes = this.getCode(e)
        this.$emit('submit', codes)
      }
      this.showPicker = false
    },
    setCode(arr) {
      let temp = JSON.parse(JSON.stringify(this.pca)) || []
      let names = []
      temp.forEach((p, pindex) => {
        if (p.code == arr[0]) {
          names[0] = p.name
          this.defaultPIndex = pindex
          p.children.forEach((c, cindex) => {
            if (c.code == arr[1]) {
              names[1] = c.name
              this.defaultCIndex = cindex
              c.children.forEach((a, aindex) => {
                if (a.code == arr[2]) {
                  names[2] = a.name
                  this.defaultAIndex = aindex
                }
              })
            }
          })
        }
      })
      return names
    },
    getCode(arr) {
      let temp = JSON.parse(JSON.stringify(this.pca)) || []
      let codes = []
      temp.forEach((p, pindex) => {
        if (p.name === arr[0]) {
          codes[0] = p.code
          this.defaultPIndex = pindex
          p.children.forEach((c, cindex) => {
            if (c.name === arr[1]) {
              codes[1] = c.code
              this.defaultCIndex = cindex
              c.children.forEach((a, aindex) => {
                if (a.name === arr[2]) {
                  codes[2] = a.code
                  this.defaultAIndex = aindex
                }
              })
            }
          })
        }
      })
      return codes
    }
  }
}
</script>

<style lang="scss" scoped>
.area-box {
  input {
    width: 100%;
    border: 0;
    line-height: 0.48rem;
    min-height: 0.48rem;
    font-size: 0.34rem;
    color: #3d3d3d;
    padding: 0.01rem 0 0.14rem 0;
  }
}
</style>
