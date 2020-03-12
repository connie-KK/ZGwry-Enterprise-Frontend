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
      />
    </van-popup>
  </div>
</template>

<script>
import { Picker, Popup, Field } from 'vant'
import pca from '@/assets/scripts/pca.js'
export default {
  name: 'Area',
  components: {
    'van-popup': Popup,
    'van-picker': Picker,
    'van-field': Field
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
      showPicker: false
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
      temp.forEach(p => {
        p.text = p.name
        p.children.forEach(c => {
          c.text = c.name
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
    },
  },
  methods: {
    setDefault() {
      if (this.type === 'name') {
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
      let temp = this.$newObj(this.pca) || []
      let names = []
      temp.forEach(p => {
        if (p.code == arr[0]) {
          names[0] = p.name
          p.children.forEach(c => {
            if (c.code == arr[1]) {
              names[1] = c.name
              c.children.forEach(a => {
                if (a.code == arr[2]) {
                  names[2] = a.name
                }
              })
            }
          })
        }
      })
      return names
    },
    getCode(arr) {
      let temp = this.$newObj(this.pca) || []
      let codes = []
      temp.forEach(p => {
        if (p.name === arr[0]) {
          codes[0] = p.code
          p.children.forEach(c => {
            if (c.name === arr[1]) {
              codes[1] = c.code
              c.children.forEach(a => {
                if (a.name === arr[2]) {
                  codes[2] = a.code
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
