<template>
  <div class="x-content" id="enList">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div id="enterinfo" v-cloak>
      <mt-popup v-model="popup" position="middle" class="pick-box">
        <div class="isdev">
          <img class="close" @click="popup = false" src="@/assets/images/close.png" />
          <img class="dev" src="@/assets/images/isdev.png" />
          <p @click="outputMobile">该模块正在开发中</p>
        </div>
      </mt-popup>
      <div class="main-content">
        <div :class="['list', item.extraClass]" v-for="(item, index) in listData" :key="index">
          <div class="module" v-if="item.name">
            <span class="tips"></span>
            <span class="category">{{ item.name }}</span>
          </div>
          <div v-for="(it, idx) in item.lists" :key="idx">
            <div class="name" v-if="it.categoryName">{{ it.categoryName }}</div>
            <div class="items">
              <div
                class="item"
                v-for="(imgItem, imgIndex) in it.items"
                :key="imgIndex"
                v-on:click="toDetail(imgItem)"
              >
                <img class="img" :src="imgItem.imgUrl" :alt="imgItem.name" />
                <div class="note">{{ imgItem.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "store";
import { Popup } from "mint-ui";
export default {
  name: "EnList",
  components: {
    "mt-popup": Popup
  },
  data() {
    return {
      moduleName: "执法一体化",
      isShowBorder: true,
      popup: false,
      mmIndex: 0,
      listData: [
        {
          name: "事件",
          extraClass: "",
          lists: [
            {
              items: [
                {
                  name: "事件列表",
                  imgUrl: require("@/assets/images/e11.png"),
                  url: "/eventList"
                },
                {
                  name: "添加事件",
                  imgUrl: require("@/assets/images/e12.png"),
                  url: "/eventContent/-1"
                }
              ]
            }
          ]
        },
        {
          name: "任务",
          extraClass: "space-box",
          lists: [
            {
              categoryName: "",
              items: [
                {
                  name: "任务列表",
                  imgUrl: require("@/assets/images/e21.png"),
                  url: "/taskList/0"
                },
                {
                  name: "添加任务",
                  imgUrl: require("@/assets/images/e22.png"),
                  url: "/putTask/0"
                },
                {
                  name: "任务考核",
                  imgUrl: require("@/assets/images/e23.png"),
                  url: "/taskAssess/0"
                }
              ]
            }
          ]
        },
        {
          name: "",
          extraClass: "space-box",
          lists: [
            {
              categoryName: "",
              items: [
                {
                  name: "上级下发信息",
                  imgUrl: require("@/assets/images/e31.png"),
                  url: "/msgList"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  watch: {
    mmIndex() {
      if (this.mmIndex === 5) {
        alert(window.mymobile);
      } else if (this.mmIndex > 5) {
        this.mmIndex = 0;
      }
    }
  },
  created() {},
  methods: {
    toDetail(item) {
      if (!item.url && !item.redirectUrl) {
        this.popup = true;
        return;
      }
      if (item.url) {
        this.$router.push(item.url);
      } else if (item.redirectUrl) {
        window.location.href = item.redirectUrl;
      }
    },
    outputMobile() {
      this.mmIndex++;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
#enList {
  body {
    margin: 0 !important;
  }
  [v-cloak] {
    display: none;
  }
  #enterinfo {
    width: 100%;
    height: calc(100% - 1.29rem);
    background: rgba(248, 248, 248, 1);
    overflow: hidden;
  }
  .x-content {
    height: 100%;
  }
  .main-content {
    height: calc(100% - 1.29rem);
    overflow-x: hidden;
    overflow-y: auto;
    top: 1.29rem;
  }
  .list {
    background: rgba(255, 255, 255, 1);
    padding-left: 0.32rem;
  }
  .space-box {
    margin-top: 0.4rem;
  }
  .module {
    padding-top: 0.32rem;
    span:last-child {
      display: inline-block;
      margin-left: 0.1rem;
    }
  }
  .tips {
    display: inline-block;
    width: 0.1rem;
    height: 0.24rem;
    background: rgba(50, 150, 250, 1);
  }
  .category {
    font-size: 0.32rem;
    color: rgba(48, 48, 48, 1);
    display: inline-block;
    line-height: 0.45rem;
    font-weight: 500;
  }
  .name {
    padding: 0.2rem 0 0 0.28rem;
    font-size: 0.28rem;
  }
  .items {
    padding: 0.2rem 0.1rem 0 0.28rem;
    @include flexbox;
    @include flex-direction(row);
    @include flex-wrap(wrap);
  }
  .item {
    margin-right: 0.5rem;
  }
  .img {
    width: 1.2rem;
    height: 1.2rem;
    object-fit: fill;
  }
  .note {
    text-align: center;
    font-size: 0.24rem;
    color: rgba(25, 31, 37, 1);
    margin-bottom: 0.3rem;
    width: 1.2rem;
  }

  .pick-box {
    border-radius: 0.06rem;
    border: 0.01rem solid #979797;
    overflow: hidden;
  }
  .isdev {
    width: 4.6rem;
    height: 5rem;
    background: #fff;
    position: relative;
    .close {
      position: absolute;
      right: 0.33rem;
      top: 0.33rem;
      width: 0.28rem;
      height: 0.28rem;
    }
    .dev {
      position: absolute;
      left: 0.86rem;
      top: 0.84rem;
      width: 2.88rem;
      height: 2.64rem;
    }
    p {
      position: absolute;
      color: #303030;
      line-height: 0.42rem;
      font-size: 0.3rem;
      text-align: center;
      width: 100%;
      bottom: 0.72rem;
    }
  }
}
</style>
