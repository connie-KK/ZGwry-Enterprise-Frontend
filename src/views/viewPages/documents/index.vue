<template>
  <div class="x-content" id="documents">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :serachFun="toSearch"
      :toggleSearchBox="toToggleSearchBox"
    >{{ moduleName }}</header-bar>
    <div :class="[isShowSearchBox?'main-content-with-search':'','main-content']">
      <div class="w-nav" ref="wscrollbox">
        <mt-navbar v-model="mySelected">
          <mt-tab-item
            v-for="item in tabList"
            :ref="'tab' + item.id"
            :key="item.id"
            :id="item.id"
          >{{ item.name }}</mt-tab-item>
        </mt-navbar>
      </div>
      <div class="list-content" ref="scrollbox">
        <div class="list" v-for="item in list" :key="item.id">
          <img :src="require('@/assets/images/'+matchType(item.extension)+'.png')" alt />
          <span class="name-box">{{item.name}}</span>
          <img src="@/assets/images/download.png" @click="download(item)" class="pic-box" alt="下载" />
        </div>
      </div>
      <p class="tips" v-if="!list.length&&!firstState">暂无数据</p>
      <p class="tips" v-if="downState">已经到底了</p>
    </div>
  </div>
</template>

<script>
import { Navbar, TabItem } from "mint-ui";
export default {
  name: "Documents",
  components: {
    "mt-navbar": Navbar,
    "mt-tab-item": TabItem
  },
  data() {
    return {
      moduleName: "知识库",
      isShowSearchIcon: true,
      isShowSearchBox: false,
      filter: "",
      mySelected: null,
      tabList: [
        { id: null, name: "全部文件" },
        { id: 4, name: "环境管理" },
        { id: 5, name: "法律法规" },
        { id: 6, name: "环境标准" },
        { id: 7, name: "环境质量" },
        { id: 8, name: "环保知识" },
        { id: 9, name: "其他" }
      ],
      list: [],
      firstState: true,
      downState: false,
      pageIndex: 0
    };
  },
  watch: {
    mySelected() {
      let aIn = this.mySelected;
      let wLeft = 0;
      for (let i = 0; i <= aIn; i++) {
        if (this.$refs[`tab${i}`]) {
          wLeft += this.$refs[`tab${i}`][0].$el.clientWidth;
        }
      }
      this.$refs.wscrollbox.scrollLeft = wLeft - document.body.clientWidth / 2;
      this.list = [];
      this.getList();
    }
  },
  mounted() {
    window.onscroll = () => {
      const boxH = this.$refs.scrollbox ? this.$refs.scrollbox.clientHeight : 0;
      const scrollH = window.scrollY;
      const windowH = window.innerHeight;
      if (scrollH + windowH + 50 >= boxH && this.dataState) {
        if ((this.pageIndex + 1) * this.pageSize >= this.count) {
          this.downState = true;
          return;
        }
        this.pageIndex++;
        this.dataState = false;
        this.getList();
      }
    };
    this.getList();
  },
  methods: {
    getList() {
      const payload = {
        pageIndex: this.pageIndex,
        pageSize: 20,
        keyword: this.filter,
        type: 3,
        subtype: this.mySelected
      };
      this.$api.getDocumentList(payload).then(res => {
        if (res && res.list) {
          this.firstState = false;
          res.list.forEach(item => {
            if (item.name) {
              const nameArr = item.name.split(".");
              if (Array.isArray(nameArr) && nameArr.length === 2) {
                item.name = nameArr[0];
              }
            }
          });
          this.list = [...this.list, ...res.list];
        }
      });
    },
    toToggleSearchBox(e) {
      this.isShowSearchBox = e;
    },
    toSearch(e) {
      this.filter = e;
      this.list = [];
      this.pageIndex = 0;
      this.getList();
    },
    download(item) {
      let a = document.createElement("a");
      a.href = `/api/ZGEntExtend/DownAttachmentFiles?id=${item.id}`;
      a.download = item.filename;
      a.click();
    },
    matchType(suffix) {
      let type, typeName;
      if (suffix && suffix.includes(".")) {
        let tempArr = suffix.split(".");
        type = tempArr[tempArr.length - 1];
        if (type === "docx") {
          typeName = "DOC";
        } else if (type == "jpg" || type === "png" || type === "jpeg") {
          typeName = "JPG";
        } else if (type == "gif") {
          typeName = "GIF";
        } else if (type == "xls") {
          typeName = "xls";
        } else if (type == "pdf") {
          typeName = "PDF";
        } else if (type == "ppt") {
          typeName = "PPT";
        }
        return typeName;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
#documents {
  .w-nav {
    width: 100%;
    overflow-x: auto;
    .mint-navbar {
      display: block;
      width: max-content;
      border-bottom: solid 1px #e0e0e0;
      height: 0.96rem;
      padding: 0 0.32rem;
      .mint-tab-item {
        display: inline-block;
        font-size: 0.3rem;
        padding: 0 0.3rem;
        .mint-tab-item-label {
          font-size: 0.3rem;
          line-height: 0.69rem;
        }
      }
    }
  }
  .list {
    @include flexbox();
    @include align-items(center);
    width: 100%;
    height: 1.13rem;
    background: rgba(255, 255, 255, 1);
    opacity: 1;
    color: rgba(48, 48, 48, 1);
    font-size: 0.34rem;
    padding: 0 0.32rem;
    border-bottom: solid 1px #e0e0e0;
    img:first-child {
      display: inline-block;
      width: 0.52rem;
      margin-right: 0.28rem;
    }
    .name-box {
      display: inline-block;
      width: calc(100% - 1.5rem);
    }
    img:last-child {
      width: 0.44rem;
      height: 0.44rem;
    }
  }
  .list:last-child {
    border: 0;
  }
  .tips {
    line-height: 0.4rem;
    font-size: 0.24rem;
    color: #999;
    text-align: center;
    margin: 0;
    padding: 0.2rem;
  }
}
</style>