<template>
  <div class="header is-fixed" :class="showBorder ? 'header-border' : ''">
    <div class="header-bar">
      <div class="header-left" @click="goBack">
        <span class="icon" v-if="leftIcon">
          <icon name="back" scale="1"></icon>
        </span>
        <span class="text">{{leftText}}</span>
      </div>
      <div class="header-title">
        <slot></slot>
      </div>
      <div class="header-right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="searchBox" v-if="isShowSearch">
      <span class="icon" @click="loadSearchData">
        <icon name="search" scale="1"></icon>
      </span>
      <input type="search" v-model="searchValue" placeholder="搜索" @keypress="confirmSearch" />
    </div>
  </div>
</template>

<script>
import icon from "@/components/aepIcon";
export default {
  name: "HeaderBar",
  components: {
    icon
  },
  props: {
    //头部导航 左侧要显示的图标
    leftIcon: {
      type: String,
      default: ""
    },
    //头部导航 左侧要显示的文字
    leftText: {
      type: String,
      default: ""
    },
    //返回
    customBack: {
      type: Function
    },
    //搜索框搜索
    serachFun: {
      type: Function,
      default: function() {}
    },
    //是否显示搜索框
    isShowSearch: {
      type: Boolean,
      default: false
    },
    //是否显示下边框
    showBorder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchValue: ""
    };
  },
  methods: {
    goBack() {
      if (this.customBack) {
        this.customBack();
      } else {
        window.history.go(-1);
      }
    },
    confirmSearch(e) {
      if (e.keyCode == 13) {
        event.preventDefault();
        this.loadSearchData();
      }
    },
    loadSearchData() {
      this.serachFun(this.searchValue);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_flex.scss";
@import "@/assets/scss/variables.scss";
.header.is-fixed {
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #fff;
}
.header-border {
  border-bottom: solid 1px #d8d8d8;
}
.header-bar {
  @include flexbox;
  @include align-items(center);
  width: 100%;
  height: $header-height;
  color: #191f25;
  box-sizing: border-box;
  line-height: 1;
  padding: 0 10px;
  text-align: center;
}
.header-left,
.header-right {
  @include flex(0.5);
  .text {
    color: rgba(50, 150, 250, 1);
    font-size: 0.34rem;
    display: inline-block;
    margin-left: 0.2rem;
  }
}
.header-left {
  @include flexbox;
  @include align-items(center);
}
.header-right {
  svg {
    width: 0.3rem;
    height: 0.35rem;
  }
  text-align: right;
}
.header-title {
  @include flex(1.5);
  text-align: center;
  font-size: 0.34rem;
  font-weight: 500;
  vertical-align: middle;
}
.header-table {
  height: 100%;
  width: 100%;
  display: table;
}
.header-cell {
  display: table-cell;
  vertical-align: middle;
}
.icon-back span {
  width: 20px;
  height: 20px;
  margin: 12px 0 0 10px;
  background-position: -20px 0;
}
.searchBox {
  @include flexbox;
  @include align-items(center);
  margin: 0 0 0.3rem 0.32rem;
  width: 6.86rem;
  height: 0.72rem;
  border-radius: 0.0533rem;
  border: 1px solid #e3e3e4;
  background-color: #e3e3e4;
  input {
    border: 0;
    margin-left: 0.2133rem;
    width: 6.86rem;
    height: 0.72rem;
    font-size: 0.3rem;
    background-color: #e3e3e4;
    color: #989a9d;
  }
  .icon {
    display: inline-block;
    margin-left: 0.12rem;
    .iconClass {
      width: 0.32rem;
      height: 0.32rem;
    }
  }
}
</style>
