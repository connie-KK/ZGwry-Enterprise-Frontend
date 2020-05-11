<template>
  <div id="templateForm">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
    >日常检查任务</header-bar>
    <div class="main-content-with-bottom">
      <div v-if="datalist">
        <div
          :class="[item.type==='sign'?'nborder-list':'','list']"
          v-for="(item,index) in datalist"
          :key="index"
        >
          <p class="label" v-if="item.label">
            <span :class="item.type==='bool'?'big-label':''">{{item.label}}</span>
            <span v-if="item.type==='bool'" class="switch">
              <mt-switch v-model="item.value"></mt-switch>
            </span>
          </p>
          <p class="info" v-if="item.type==='select'" @click="selectIcon(item,index)">
            <span
              :class="[item.value ? '':'tip-value', 'value']"
            >{{item.value ? item.value : '请选择'}}</span>
            <span class="icon"></span>
          </p>
          <input
            type="text"
            v-model="item.value"
            class="info"
            v-if="item.type==='text'"
            placeholder="请输入"
          />
          <textarea
            v-model="item.value"
            rows="3"
            v-if="item.type==='textarea'"
            placeholder="请在此输入内容"
          />
          <button
            class="sign-button"
            @click="toSign(index)"
            v-if="item.type==='sign' && !item.image"
          >签名</button>
          <span class="sign-title" v-if="item.type==='sign' && item.image">签名</span>
          <div class="sign-area" v-if="item.type==='sign' && item.image">
            <img :src="item.image" alt="签名" />
            <button class="sign-button" @click="toSign(index)">重新签名</button>
          </div>
          <my-datetime-picker
            v-if="item.type === 'datetime'"
            v-model="item.value"
            type="date"
            field-lable="时间"
            format="YYYY-MM-DD"
          ></my-datetime-picker>
        </div>
      </div>
    </div>
    <div class="add-btn">
      <button @click="submit">使用此模板</button>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" @change="setSelectedData" valueKey="value"></mt-picker>
    </mt-popup>
  </div>
</template>
<script>
import moment from "moment";
import {
  Popup,
  Switch,
  Picker,
  DatetimePicker,
  MessageBox,
  Toast
} from "mint-ui";
export default {
  name: "templateForm",
  components: {
    "mt-popup": Popup,
    "mt-picker": Picker,
    "mt-switch": Switch,
    "mt-datetime-picker": DatetimePicker
  },
  data() {
    return {
      isShowSearchIcon: false,
      isShowBorder: false,
      id: "",
      details: {},
      datalist: {},
      slots: [
        {
          values: [],
          textAlign: "center"
        }
      ],
      popupVisible: false,
      selectedIndex: "",
      forassignment: ""
    };
  },
  computed: {
    staff() {
      return this.$store.state.taskParams.staff;
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getModelDetail();
  },
  methods: {
    getModelDetail() {
      let obj = this.$store.state.taskFormData;
      if (obj.id === this.id) {
        this.details.contents = obj.contents;
        const reg = /<object[^>]*>[^<]*<\/object>/;
        let list = reg.exec(obj.contents)[0];

        const reg1 = /<(object)[^>]*>/;
        list = list.replace(reg1, "");

        const reg2 = /<\/object>/;
        list = list.replace(reg2, "");

        list = list.replace(/}/g, "},,");

        list = list.split(",,");
        let tempArr = [];
        list.forEach((item, index) => {
          if (!item.trim()) {
            //最后会多一个空字符，需移除
            list.splice(index, 1);
          } else {
            item = JSON.parse(item.replace(/"/g, '"'));
            tempArr.push(item);
          }
        });
        this.datalist = tempArr;
      }
    },
    selectIcon(item, index) {
      this.selectedIndex = index;
      if (Array.isArray(item.options) && item.options.length) {
        let tempArr = [];
        item.options.forEach((sItem, sIndex) => {
          tempArr.push({
            value: sItem
          });
        });
        this.slots[0].values = tempArr;
        this.popupVisible = true;
      }
    },
    setSelectedData(picker) {
      const selectedVal = picker.getValues();
      if (
        selectedVal instanceof Array &&
        selectedVal.length === 1 &&
        selectedVal[0]
      ) {
        const value = selectedVal[0].value;
        let selectedItem = this.datalist[this.selectedIndex];
        selectedItem.value = value;
        this.$set(this.datalist, this.selectedIndex, selectedItem);
      }
    },
    getArea() {},
    toSign(index) {
      let item = this.datalist[index];
      item.toSign = true;
      this.$set(this.datalist, index, item);
      this.$store.commit("set_taskFormList", this.datalist);
      this.$router.push(`/sign/${this.id}`);
    },
    submit() {
      this.datalist.forEach(item => {
        if (item.index >= 0) {
          let temItem = JSON.parse(JSON.stringify(item));
          if (temItem.type === "bool") {
            temItem.value = temItem.value ? "是" : "否";
          } else if (temItem.type === "sign") {
            temItem.value = temItem.image;
          }
          this.details.contents = this.details.contents.replace(
            `{${temItem.index}}`,
            temItem.value
          );
        }
      });
      const obj = {
        id: this.id,
        contents: this.details.contents
      };
      this.$store.commit("set_taskFormData", obj);
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss">
#templateForm {
  p {
    margin: 0;
    padding: 0;
  }
  .list {
    min-height: 0.9rem;
    background: rgba(255, 255, 255, 1);
    padding: 0 0.41rem 0 0.32rem;
    border-top: solid 1px #e0e0e0;
    .label {
      line-height: 0.33rem;
      font-size: 0.24rem;
      color: #bebebe;
      padding: 0.15rem 0 0.01rem 0;
      @include flexbox;
      span:first-child {
        display: inline-block;
        width: 90%;
        line-height: 0.58rem;
        vertical-align: middle;
        min-height: 0.58rem;
      }
      .big-label {
        font-size: 0.34rem;
        color: rgba(48, 48, 48, 1);
      }
      .switch {
        display: inline-flex;
      }
      .mint-switch-core {
        width: 0.9rem;
        height: 0.5rem;
      }
      .mint-switch-core::before {
        width: 0.45rem;
        height: 0.45rem;
        background-color: #969696;
      }
      .mint-switch-core::after {
        width: 0.45rem;
        height: 0.45rem;
      }
    }
    .info {
      @include flexbox;
      line-height: 0.48rem;
      min-height: 0.48rem;
      color: #3d3d3d;
      padding: 0.01rem 0 0.14rem 0;
      .value {
        font-size: 0.34rem;
        @include flex(5);
      }
      .tip-value {
        font-size: 0.3rem;
        color: #a7a7a7;
      }
      .icon {
        display: inline-block;
        width: 0.4rem;
        height: 0.32rem;
        background: #fff url("../../../assets/images/down-c.png") no-repeat
          right center;
        background-size: 0.4rem;
      }
    }
    input.info,
    textarea {
      font-size: 0.34rem;
      width: 100%;
      border: 0;
    }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      font-size: 0.3rem;
      color: #a7a7a7;
    }
    .sign-button {
      width: 1.58rem;
      height: 0.6rem;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      color: rgba(255, 255, 255, 1);
    }
    .sign-title {
      font-size: 0.24rem;
      color: #b9b9b9;
    }
    .sign-area {
      width: 100%;
      height: 1.62rem;
      @include flexbox;
      @include align-items(flex-end);
      padding-bottom: 0.1rem;
      img {
        width: 2.67rem;
        height: 1.54rem;
        border: 1px solid #b9b9b9;
        margin-right: 0.3rem;
      }
    }
  }
  .nborder-list {
    border-top: none;
  }
  .add-btn {
    position: fixed !important;
  }
}
select,
.selectbox {
  width: 100%;
  border: 0;
  line-height: 0.48rem;
  min-height: 0.48rem;
  font-size: 0.34rem;
  color: #3d3d3d;
  padding: 0.01rem 0 0.14rem 0;
  background: #fff url("../../../assets/images/down-c.png") no-repeat right
    center !important;
  background-size: 0.4rem !important;
}
</style>