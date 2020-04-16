<template>
  <div class="datepicker-box">
    <input
      class="selectbox"
      :value="mydate"
      readonly="readonly"
      @click="showPicker = true"
    />
    <van-popup
      v-model="showPicker"
      position="bottom"
    >
      <van-datetime-picker
        v-model="myval"
        :type="type"
        @confirm="onConfirm"
        @cancel="showPicker = false"
        :min-date="startDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { DatetimePicker, Popup } from 'vant'
import moment from 'moment'
export default {
  name: 'datepicker',
  components: {
    'van-popup': Popup,
    'van-datetime-picker': DatetimePicker
  },
  model: {
    prop: 'fromval',
    event: 'valuePut'
  },
  props: {
    fromval: {
      type: [String, Date],
      default: ''
    },
    fieldLable: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'datetime'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  data() {
    return {
      myval: "",
      showPicker: false,
      trueVal: "",
      //设置开始时间，默认是十年
      startDate:new Date('1950-01-01')
    }
  },
  computed: {
    mydate() {
      this.myval = this.fromval ? new Date(this.fromval) : new Date();
      this.trueVal = this.fromval ? new Date(this.fromval) : '';
      return this.trueVal ? moment(this.trueVal).format(this.format) : ''
    }
  },
  methods: {
    onConfirm(value) {
      let date = moment(value).format(this.format)
      this.myval = new Date(date)
      this.trueVal = date
      this.$emit('valuePut', this.trueVal)
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss" scoped>
.datepicker-box {
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
