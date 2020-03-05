<template>
  <div class="header is-fixed" :class="showBorder ? 'header-border' : ''">
    <div class="header-bar">
      <div class="header-left" @click="goBack">
        <span class="icon" v-if="leftIcon">
          <icon name="back" scale="1"></icon>
        </span>
        <span class="text">{{leftText}}</span>
      </div>
      <div class="header-title" @click="clickTitle">
        <slot></slot>
      </div>
      <div class="header-right">
        <span class="search-box" v-if="isShowSearchIcon" @click="clickSearch"></span>
        <slot name="right" class="right-slot"></slot>
      </div>
    </div>
    <div class="searchBox" v-if="isShowSearchBox">
      <span class="icon" @click="loadSearchData">
        <icon name="search" scale="1"></icon>
      </span>
      <input type="text" v-model="searchValue" placeholder="请输入关键字" @keypress="confirmSearch" />
      <span v-if="searchValue" @click="loadSearchData">搜索</span>
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
    //搜索框显示隐藏
    toggleSearchBox: {
      type: Function,
      default: function() {}
    },
    //搜索框搜索
    serachFun: {
      type: Function,
      default: function() {}
    },
    //是否显示搜索框
    isShowSearchIcon: {
      type: Boolean,
      default: false
    },
    //是否显示下边框
    showBorder: {
      type: Boolean,
      default: false
    },
    //点击标题触发
    barTitle: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      searchValue: "",
      isShowSearchBox: false
    };
  },
  methods: {
    goBack() {
      if (this.customBack) {
        this.customBack();
      } else {
        window.history.go(-1);
      }
      this.$store.commit("set_loading", false);
    },
    confirmSearch(e) {
      if (e.keyCode == 13) {
        event.preventDefault();
        this.loadSearchData();
      }
    },
    loadSearchData() {
      this.serachFun(this.searchValue);
    },
    clickTitle() {
      this.barTitle();
    },
    clickSearch() {
      this.isShowSearchBox = !this.isShowSearchBox;
      this.toggleSearchBox(this.isShowSearchBox);
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
  @include flexbox;
  @include align-items(center);
  @include justify-content(flex-end);
  svg {
    width: 0.3rem;
    height: 0.35rem;
  }
  text-align: right;
  .search-box {
    display: inline-block;
    width: 0.36rem;
    height: 0.36rem;
    background: url(../assets/images/blue-search.png) no-repeat;
    background-size: 100%;
  }
  div:not(:first-child) {
    margin-left: 0.4rem;
  }
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
  width: calc(100% - 0.64rem);
  height: 0.72rem;
  border-radius: 0.0533rem;
  background: #efeef1;
  input {
    border: 0;
    margin-left: 0.2133rem;
    width: 5.2rem;
    height: 0.72rem;
    font-size: 0.3rem;
    background: #efeef1;
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
  span:last-child {
    color: rgba(50, 150, 250, 1);
    font-size: 0.3rem;
    margin-left: 0.3rem;
  }
}
</style>
