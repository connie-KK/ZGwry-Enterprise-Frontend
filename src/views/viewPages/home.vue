<template>
  <div class="content">
    <header-bar>{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="h-nav" ref="wscrollbox">
        <mt-navbar v-model="selected">
          <mt-tab-item
            :id="item.id"
            v-for="item in tabData"
            :key="item.id"
            :ref="'tab' + item.id"
          >{{item.label}}</mt-tab-item>
        </mt-navbar>
      </div>
      <div class="second-tab">
        <mt-tab-container v-model="selected">
          <mt-tab-container-item :id="item.id" v-for="item in tabData" :key="item.id">
            <div v-if="item.secondTab">
              <mt-navbar v-model="selected2">
                <mt-tab-item
                  :id="secondItem.id"
                  v-for="secondItem in item.secondTab"
                  :key="secondItem.id"
                >{{secondItem.label}}</mt-tab-item>
              </mt-navbar>
            </div>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
      <div v-if="list&&list.length">
        <div v-if="selected===x">
          <div :class="['list', item.class]" v-for="(item,index) in list" :key="index">
            <p class="label">{{item.label}}</p>
            <p class="info">{{item.value}}</p>
          </div>
          <div class="attachment" v-if="attachments.length">
            <p>环评附件</p>
            <div v-for="(item,index) in attachments" :key="index">
              <span>
                <icon name="attachment" scale="1"></icon>
                {{item.title}}
              </span>
              <span @click="download(item)">下载</span>
            </div>
          </div>
          <div class="lists list-header" v-if="productItems && productItems.length">
            <span v-for="(item,index) in listHeader" :key="index">{{item}}</span>
          </div>
          <div class="lists list-content" v-for="item in productItems" :key="item.id">
            <span>{{item.name}}</span>
            <span>{{item.value}}</span>
          </div>
          <div class="lists list-header second-header" v-if="materialItmes && materialItmes.length">
            <span v-for="(item,index) in listHeaderFactor" :key="index">{{item}}</span>
          </div>
          <div class="lists list-content" v-for="item in materialItmes" :key="item.id">
            <span>{{item.name}}</span>
            <span>{{item.value}}</span>
          </div>
        </div>
        <div v-if="selected===y">
          <div class="list2" v-for="(item,index) in list" :key="index">
            <div class="first-line">
              <span>{{item.name}}</span>
              <span @click="toDetail(item)">详情</span>
            </div>
            <p v-if="selected2!==yGWF&& selected2!==yJC&&item.standard ">{{item.standard.name}}</p>
            <p v-if="selected2===yGWF">{{item.processingmode}}</p>
            <p v-if="selected2===yJC">{{item.value}}</p>
            <div v-if="selected2!==yJC" class="third-line">
              <span v-if="selected2!==yNoise&&selected2!==yGWF">{{item.isonlinemonitoring}}</span>
              <span v-if="selected2===yGWF">{{item.isdangerousorwaste}}</span>
              <span>{{item.filecount}}</span>
            </div>
            <div v-if="selected2===yJC" class="third-line">
              <span>{{item.factorname}}</span>
              <span>{{item.filecount}}</span>
            </div>
          </div>
        </div>
        <div v-if="selected===z">
          <div class="list2 list3" v-for="(item,index) in list" :key="index">
            <div class="first-line">
              <span>{{item.facilityname}}</span>
              <span @click="toDetail(item)">详情</span>
            </div>
            <p>{{item.treatmentprocess}}</p>
            <p v-if="item.output&&category!==7">{{item.output.name}}</p>
            <p v-if="category===7">{{item.number}}</p>
            <p>{{item.remark}}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-content">暂无数据</div>
    </div>
  </div>
</template>

<script>
import store from "store";
import moment from "moment";
import { Navbar, TabItem, TabContainer, TabContainerItem } from "mint-ui";
export default {
  name: "Home",
  components: {
    "mt-navbar": Navbar,
    "mt-tab-item": TabItem,
    "mt-tab-container": TabContainer,
    "mt-tab-container-item": TabContainerItem
  },
  data() {
    return {
      x: "1",
      y: "4",
      z: "5",
      yJC: "4-0",
      yNoise: "4-6",
      yGWF: "4-7",
      moduleName: "企业信息",
      enterid: 0,
      selected: "1",
      selected2: "",
      category: "",
      list: [],
      listHeader: ["产品", "年产量"],
      listHeaderFactor: ["原辅材料", "材料年使用量"],
      levelArr: ["国控", "省控", "市控/重点", "区控/非重点"],
      productionStateArr: ["正常营业", "停业", "关闭"],
      productItems: [],
      materialItmes: [],
      attachments: [] //环评附件
    };
  },
  computed: {
    tabData() {
      return this.$store.state.tabData;
    },
    pollSourceInfoHeader() {
      return this.$store.state.pollSourceInfoHeader;
    }
  },
  watch: {
    selected() {
      const aIn = Number(this.selected);
      let wLeft = 0;
      for (let i = 0; i < aIn; i++) {
        wLeft += this.$refs[`tab${this.selected}`][0].$el.clientWidth;
      }
      this.$refs.wscrollbox.scrollLeft = wLeft - document.body.clientWidth / 2;
      if (this.selected === this.x) {
        //获取污染源信息数据
        this.list = this.pollSourceInfoHeader;
        this.selected2 = "";
        this.getPollSourceList();
      } else if (this.selected === this.y) {
        this.selected2 = `${this.selected}-2`;
        this.list = [];
      } else if (this.selected === this.z) {
        this.selected2 = `${this.selected}-2`;
        this.list = [];
      }
    },
    selected2() {
      if (this.selected2 === "4-0") {
        //获取监测数据列表
        this.getMonitorList();
      } else if (this.selected2) {
        this.category = JSON.parse(this.selected2.split("-")[1]);
        if (this.selected === this.y) {
          this.getOutletList();
        } else if (this.selected === this.z) {
          this.getPollControlList();
        }
      }
    }
  },
  created() {
    // this.enterid = this.getQueryString("id");
    // this.enterid = "75ae3c94-93f7-412a-8d03-5cf4554122c8";
    this.enterid = "82bd35e2-acd5-4a66-86fd-f1d435eb12fe";
    this.list = this.pollSourceInfoHeader;
    this.getPollSourceList();
  },
  methods: {
    getPollSourceList() {
      const payload = {
        id: this.enterid
      };
      this.$api.getZGEnterpriseByid(payload).then(res => {
        if (res) {
          this.list.forEach((item, index) => {
            if (res[item.key] === 0 || res[item.key]) {
              if (item.key.includes("date") || item.key.includes("Time")) {
                item.value = moment(res[item.key]).format("YYYY-MM-DD");
              } else if (item.key === "level") {
                item.value = this.levelArr[res[item.key] - 1];
              } else {
                item.value = res[item.key];
              }
              this.$set(this.list, index, item);
            } else if (item.key === "lat-lng") {
              item.value = `${res["lng"]}E，${res["lat"]}N`;
            } else if (item.key === "region") {
              item.value = `${res["province"]} ${res["city"]} ${res["district"]}`;
            }
            if (item.value && typeof item.value === "string") {
              item.value = item.value.replace(null, "");
              item.value = item.value.replace(undefined, "");
            }
          });
          this.productItems = res.productItems;
          this.materialItmes = res.materialItmes;
        }
      });
      this.$api.getZGEnterpriseExtendByid(payload).then(res => {
        if (res) {
          this.list.forEach((item, index) => {
            if (res[item.key] === 0 || res[item.key]) {
              if (item.key.includes("date") || item.key.includes("Time")) {
                item.value = moment(res[item.key]).format("YYYY-MM-DD");
              } else if (item.key === "isMonitoring") {
                item.value = res[item.key] ? "是" : "否";
              } else if (item.key === "productionState") {
                item.value = this.productionStateArr[res[item.key] - 1];
              } else {
                item.value = res[item.key];
              }
              this.$set(this.list, index, item);
            }
          });
          if (res.attachments) {
            this.attachments = res.attachments;
          }
        }
      });
    },
    getOutletList() {
      const payload = {
        enterid: this.enterid,
        category: this.category,
        pageIndex: 0,
        pageSize: 0
      };
      this.$api.getZGOutputList(payload).then(res => {
        if (res) {
          res.items.forEach(item => {
            if (item.standard) {
              item.standard.name = `排放标准：${item.standard.name}`;
            }
            item.isonlinemonitoring = item.isonlinemonitoring
              ? item.isonlinemonitoring
              : "无";
            item.processingmode = `处理方式：${item.processingmode}`;
            item.isdangerousorwaste = item.isdangerousorwaste ? "是" : "否";
            item.isdangerousorwaste = `是否危废：${item.isdangerousorwaste}`;
            item.isonlinemonitoring = `在线监控：${item.isonlinemonitoring}`;
            item.filecount = `附件数：${item.filecount}`;
          });
          this.list = res.items;
        }
      });
    },
    getMonitorList() {
      const payload = {
        enterid: this.enterid,
        pageIndex: 0,
        pageSize: 0
      };
      this.$api.getZGDataList(payload).then(res => {
        if (res) {
          res.items.forEach(item => {
            item.name = moment(item.monitordate).format("YYYY-MM-DD");
            item.value = `监测结果：${item.value}`;
            item.factorname = `监测指标：${item.factorname}`;
            item.filecount = `附件数：${item.filecount}`;
          });
          this.list = res.items;
        }
      });
    },
    getPollControlList() {
      const payload = {
        enterid: this.enterid,
        category: this.category,
        pageIndex: 0,
        pageSize: 0
      };
      this.$api.getZGTreatFacilityList(payload).then(res => {
        if (res) {
          res.items.forEach(item => {
            if (this.category === 2) {
              //废水
              item.treatmentprocess = `废水净化方法：${item.treatmentprocess}`;
            } else if (this.category === 1) {
              //废气
              item.treatmentprocess = `废气净化方法：${item.treatmentprocess}`;
            } else if (this.category === 7) {
              //固危废
              item.treatmentprocess = `处理工艺：${item.treatmentprocess}`;
            }
            if (item.output) {
              item.output.name = `排放口：${item.output.name}`;
            }
            item.number = `数量：${item.number}`;
            item.remark = `备注：${item.remark}`;
          });
          this.list = res.items;
        }
      });
    },
    toDetail(e) {
      store.set("pageType", this.selected2);
      this.$router.push(`/detail/${e.id}`);
    },
    download(item) {
      let a = document.createElement("a");
      a.href = `/api/ZGEntExtend/DownAttachmentFiles?id=${item.id}`;
      a.download = item.title;
      a.click();
    },
    getQueryString(name) {
      const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      const urlObj = window.location;
      var r =
        urlObj.href.indexOf("#") > -1
          ? urlObj.search.substr(1).match(reg)
          : urlObj.hash.split("?")[1].match(reg);
      if (r != null) {
        return unescape(r[2]);
      } else {
        return null;
      }
    }
  }
};
</script>

<style lang='scss'>
@import "@/assets/scss/_flex.scss";
.mint-navbar {
  overflow-x: auto;
  border-bottom: solid 1px #e0e0e0;
  height: 0.96rem;
  margin-bottom: 0 !important;
  padding: 0 0.32rem;
  .mint-tab-item {
    display: inline-block;
    font-size: 0.3rem;
    margin: 0 0.41rem 0 0;
    padding: 0;
    .mint-tab-item-label {
      font-size: 0.3rem;
      line-height: 42px;
    }
  }
  .is-selected {
    margin-bottom: 0 !important;
  }
}
.h-nav {
  width: 100%;
  height: 1rem;
  overflow-x: auto;
  .mint-navbar {
    display: block;
    width: max-content;
    border: 0 !important;
  }
}
.second-tab {
  .mint-tab-item {
    flex: auto;
    .mint-tab-item-label {
      font-size: 0.26rem;
    }
  }
}
p {
  margin: 0;
}
.list {
  background: rgba(255, 255, 255, 1);
  padding: 0 0.24rem 0 0.32rem;
  border-bottom: solid 1px #e0e0e0;
  .label {
    line-height: 0.33rem;
    font-size: 0.24rem;
    color: #bebebe;
    padding: 0.15rem 0 0.01rem 0;
  }
  .info {
    line-height: 0.48rem;
    min-height: 0.48rem;
    font-size: 0.34rem;
    color: #3d3d3d;
    padding: 0.01rem 0 0.14rem 0;
  }
}
.interval {
  margin-top: 0.41rem;
}
.attachment {
  background: rgba(255, 255, 255, 1);
  margin-top: 0.4rem;
  padding: 0 0.24rem 0 0.32rem;
  @include flexbox;
  @include flex-direction(column);
  p {
    font-size: 0.34rem;
    line-height: 0.48rem;
    color: rgba(48, 48, 48, 1);
    padding-top: 0.33rem;
  }
  div {
    width: 100%;
    padding: 0.32rem 0 0.2rem 0;
    background: rgba(255, 255, 255, 1);
    @include flexbox;
    span {
      display: inline-block;
      height: 0.42rem;
      font-size: 0.3rem;
    }
    span:first-child {
      flex: 9;
      svg {
        fill: #3296fa;
      }
    }
    span:last-child {
      color: rgba(50, 150, 250, 1);
      flex: 1;
    }
  }
  div:last-child {
    padding-bottom: 0.33rem;
  }
}
.lists {
  color: rgba(48, 48, 48, 1);
  padding: 0 0.24rem 0 0.32rem;
  border: 0;
  @include flexbox;
  @include align-items(center);
  span:first-child {
    flex: 1.5;
  }
  span:last-child {
    flex: 1;
  }
}
.list-header {
  height: 0.7rem;
  background: rgba(229, 241, 244, 1);
  color: rgba(48, 48, 48, 1);
  font-size: 0.26rem;
}
.second-header {
  margin-top: 0.4rem;
}
.list-content {
  height: 0.75rem;
  background: rgba(255, 255, 255, 1);
  color: rgba(48, 48, 48, 1);
  font-size: 0.35rem;
}
.list-content:last-child {
  margin-bottom: 0.6rem;
}
.list2 {
  background: rgba(255, 255, 255, 1);
  padding: 0 0.32rem;
  border-bottom: solid 1px #e0e0e0;
  div {
    @include flexbox;
    @include align-items(center);
    @include justify-content(space-between);
    font-size: 0.34rem;
  }
  .first-line {
    padding-top: 0.32rem;
    span {
      display: inline-block;
      line-height: 0.48rem;
    }
    span:last-child {
      width: 1rem;
      height: 0.44rem;
      background: rgba(50, 150, 250, 1);
      border-radius: 0.03rem;
      color: rgba(255, 255, 255, 1);
      font-size: 0.3rem;
      @include flexbox;
      @include align-items(center);
      @include justify-content(center);
    }
  }
  p {
    line-height: 0.42rem;
    padding-top: 0.2rem;
    font-size: 0.3rem;
    color: #a5a5a5;
  }
  .third-line {
    padding: 0.2rem 0 0.36rem 0;
    font-size: 0.3rem;
    span {
      display: inline-block;
      line-height: 0.42rem;
      color: #a5a5a5;
    }
    span:first-child {
      flex: 1;
    }
    span:last-child {
      flex: 1;
    }
  }
}
.list3 {
  p:last-child {
    padding-bottom: 0.32rem;
  }
}
.empty-content {
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
  height: 0.8rem;
  color: #bebebe;
}
</style>