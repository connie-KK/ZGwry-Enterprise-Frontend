<template>
  <div class="select-box">
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
        :value-key="valName"
        :default-index="defaultIndex"
      />
    </van-popup>
  </div>
</template>

<script>
import { Picker, Popup } from 'vant'
export default {
  name: 'Select',
  components: {
    'van-popup': Popup,
    'van-picker': Picker
  },
  model: {
    prop: 'fromval',
    event: 'valuePut'
  },
  props: {
    fromval: {
      type: [String, Number, Boolean],
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    valKey: {
      type: String,
      default: ''
    },
    valName: {
      type: String,
      default: ''
    },
    fieldLable: {
      type: String,
      default: ''
    },
    noneVal: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      myval: this.fromval,
      showPicker: false
    }
  },
  computed: {
    columns() {
      // let obj = {}
      // obj[this.valName] = ''
      // obj[this.valKey] = this.noneVal
      // return [
      //   obj,
      //   ...this.data
      // ]
      return this.data
    },
    defaultIndex() {
      let temp = 0
      this.columns.forEach((item, index) => {
        if (item[this.valKey] === this.myval) {
          temp = index
        }
      })
      return temp
    },
    myname() {
      let temp = ''
      this.columns.forEach(item => {
        if (item[this.valKey] === this.myval) {
          temp = item[this.valName]
        }
      })
      return temp
    }
  },
  methods: {
    onConfirm(value) {
      this.myval = value[this.valKey]
      this.$emit('valuePut', this.myval)
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss" scoped>
.select-box {
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
