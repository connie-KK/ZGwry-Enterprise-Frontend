<template>
  <div class="content" id="eventList">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :showBorder="isShowBorder"
      :isShowSearch="isShowSearch"
      :serachFun="toSearchList"
    >
      {{moduleName}}
      <div class="right-header" slot="right" @click="toSort">排序</div>
    </header-bar>
    <div class="main-content">
      <div class="e-nav" ref="escrollbox">
        <mt-navbar v-model="selected">
          <mt-tab-item :id="index" v-for="(item,index) in tabData" :key="index">{{item}}</mt-tab-item>
        </mt-navbar>
      </div>
      <div v-for="(item,index) in listData" :key="index" class="list" @click="toDetail(item)">
        <div class="left">
          <div :class="item.class">
            <span class="direction" v-if="item.directionInfo">{{item.directionInfo}}</span>
            <span class="title">{{item.title}}</span>
            <span class="info">{{item.stateInfo}}</span>
          </div>
          <div>
            <span>添加日期：{{item.date}}</span>
            <span>{{item.typeInfo}}</span>
          </div>
          <div v-if="item.taskhandletime">最新执行时间：{{item.taskhandletime}}</div>
        </div>
        <div class="right">
          <icon name="right" scale="1"></icon>
        </div>
      </div>
      <p class="tips" v-if="!listData.length&&!firstState">暂无数据</p>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" @change="setdType" valueKey="valueKey"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { Navbar, Popup, Picker, TabItem } from "mint-ui";
import moment from "moment";
export default {
  name: "EventList",
  components: {
    "mt-navbar": Navbar,
    "mt-popup": Popup,
    "mt-picker": Picker,
    "mt-tab-item": TabItem
  },
  watch: {
    selected() {
      this.setListData();
    }
  },
  data() {
    return {
      firstTabIndex: 0,
      secondTabIndex: 1,
      thirdTabIndex: 2,
      moduleName: "事件列表",
      isShowBorder: false,
      isShowSearch: true,
      filter: "",
      selected: "",
      tabData: ["全部事件", "未完成事件", "已解决事件"],
      userId: "",
      grid: "",
      listData: [],
      listAll: [],
      listComplate: [],
      moduleId360: "",
      popupVisible: false,
      slots: [
        {
          values: [
            { valueKey: "添加时间", value: "date" },
            { valueKey: "最新执行时间", value: "taskhandletime" }
          ],
          textAlign: "center"
        }
      ],
      levels: [
        { value: 1, name: "县级网格" },
        { value: 2, name: "乡级网格" },
        { value: 3, name: "村级网格" }
      ],
      types: [],
      firstState: true,
      gridLevel: "" //当前登录用户对应网格等级
    };
  },
  created() {
    this.getUserId();
    this.getHandleEventLists();
    this.getmodsList();
  },
  mounted() {},
  methods: {
    setListData() {
      if (this.selected === 0) {
        const tempArr = [...this.listAll, ...this.listComplate];
        this.listData = JSON.parse(JSON.stringify(tempArr));
      } else if (this.selected === 1) {
        this.listData = JSON.parse(JSON.stringify(this.listAll));
      } else if (this.selected === 2) {
        this.listData = JSON.parse(JSON.stringify(this.listComplate));
      }
    },
    getUserId() {
      this.$api.getUser().then(res => {
        if (res && res.id) {
          this.userId = res.id;
          this.getStaffInfo();
        }
      });
    },
    getStaffInfo() {
      const payload = {
        id: this.userId
      };
      this.$api.getStaffInfo(payload).then(res => {
        if (res && res.grid) {
          this.grid = res.grid;
          this.gridLevel = res.gridLevel;
          this.$store.commit("set_gridLevel", this.gridLevel);
          this.getIncidentsByKey();
        }
      });
    },
    getIncidentsByKey() {
      const payload = {
        grid: this.grid,
        searchKey: this.filter,
        pageIndex: -1,
        pageSize: 10,
        type: 2
      };
      this.$api.getIncidentsByKey(payload).then(res => {
        if (this.firstState) {
          this.firstState = false;
          this.selected = 0;
        }
        this.listAll = this.handleListData(res);
        this.setListData();
      });
    },
    //已完成事件参数
    getHandleEventLists() {
      const payload = {
        searchKey: this.filter,
        pageIndex: -1,
        pageSize: 10
      };
      this.$api.getHandleEventLists(payload).then(res => {
        if (res && Array.isArray(res)) {
          res.forEach(item => {
            item.state = 3;
          });
          this.listComplate = this.handleListData(res);
          this.setListData();
        }
      });
    },
    handleListData(arr) {
      if (arr && Array.isArray(arr)) {
        let tempArr = [];
        arr.forEach(item => {
          if (item.state) {
            switch (item.state) {
              case 1:
                item.stateInfo = "未发布";
                item.class = "reported";
                break;
              case 2:
                item.stateInfo = "处理中";
                item.class = "ongoing";
                break;
              case 3:
                item.stateInfo = "已完成";
                item.class = "completed";
                break;
              case 4:
                item.stateInfo = "虚假";
                item.class = "fake";
                break;
              default:
                break;
            }
          }
          if (item.direction) {
            if (item.direction === "issued") {
              item.directionInfo = "发";
              item.class = `${item.class} send`;
            } else if (item.direction === "received") {
              item.directionInfo = "收";
              item.class = `${item.class} received`;
            }
          }
          this.types.forEach(typeItem => {
            if (typeItem.type === item.type) {
              item.typeInfo = typeItem.name;
            }
          });
          item.date = moment(item.date).format("YYYY-MM-DD");
          item.taskhandletime = item.taskhandletime
            ? moment(item.taskhandletime).format("YYYY-MM-DD HH:mm:ss")
            : "";
          tempArr.push(item);
        });
        return JSON.parse(JSON.stringify(tempArr));
      }
    },
    getmodsList() {
      this.$api.getmodsList().then(res => {
        if (res && Array.isArray(res)) {
          res.forEach(item => {
            if (item.name === "企业360模块") {
              this.moduleId360 = item.id;
            }
          });
          this.getRolePermission();
        }
      });
    },
    getRolePermission() {
      const payload = {
        modeid: this.moduleId360
      };
      this.$api.getRolePermission(payload).then(res => {
        if (res && res.incidentType) {
          this.types = res.incidentType;
          const tempArr = [...this.listAll, ...this.listComplate];
          tempArr.forEach((itemData, itemIndex) => {
            if (
              (itemData.type === 0 || itemData.type > 0) &&
              !itemData.typeInfo
            ) {
              this.types.forEach(itemType => {
                if (itemData.type === itemType.type) {
                  itemData.typeInfo = itemType.name;
                }
                this.$set(tempArr, itemIndex, itemData);
              });
            }
          });
        }
      });
    },
    toSearchList(e) {
      this.filter = e;
      if (this.selected === 0) {
        this.getIncidentsByKey();
        this.getHandleEventLists();
      } else if (this.selected === 1) {
        this.getIncidentsByKey();
      } else {
        this.getHandleEventLists();
      }
    },
    setdType(picker) {
      const selectedVal = picker.getValues();
      if (selectedVal instanceof Array && selectedVal.length === 1) {
        let key = selectedVal[0].value;
        this.listData.sort((a, b) => {
          if (a[key] && b[key]) {
            return new Date(a[key]).getTime() - new Date(b[key]).getTime();
          }
        });
      }
    },
    toSort() {
      this.popupVisible = true;
    },
    toDetail(item) {
      if (item.state === 3 || this.gridLevel === 3) {
        //已完成或者三级网格员，跳转事件内容页面
        this.$router.push(`/eventContent/${item.id}`);
      } else {
        //跳转处理事件页面
        if (
          this.gridLevel === 1 &&
          Array.isArray(item.followup) &&
          item.followup.length
        ) {
          //1级网格（登录人的网格）,跳转到1级followup
          this.$store.commit("set_followup", item.followup);
          let toLevel1Followup = false;
          item.followup.forEach(followItem => {
            if (followItem.level === 1) {
              toLevel1Followup = true;
              this.$router.push(`/eventDetailLevel1/${followItem.id}`);
            }
          });
          if (!toLevel1Followup) {
            item.followup.forEach(followItem => {
              if (followItem.level === 2) {
                this.$router.push(`/eventDetail/${followItem.id}`);
              }
            });
          }
        } else if (
          this.gridLevel === 2 &&
          Array.isArray(item.followup) &&
          item.followup.length
        ) {
          item.followup.forEach(followItem => {
            if (followItem.level === 2) {
              this.$router.push(`/eventDetail/${followItem.id}`);
            }
          });
        } else {
          this.$router.push(`/eventDetail/${item.id}`);
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/_flex.scss";
#eventList {
  .right-header {
    font-size: 0.32rem;
    font-weight: 500;
    color: rgba(50, 150, 250, 1);
  }
  .main-content {
    top: $header-withSearch-height;
  }
  .e-nav {
    width: 100%;
    height: 1rem;
    overflow-x: auto;
  }
  .mint-navbar {
    width: 100%;
    justify-content: space-around;
    border-bottom: solid 1px #e0e0e0;
    height: 0.96rem;
    .mint-tab-item-label {
      font-size: 0.3rem;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
    }
    .is-selected {
      border-bottom: 0.04rem solid #3296fa;
      margin: 0 5px;
      .mint-tab-item-label {
        color: rgba(50, 150, 250, 1);
      }
    }
  }
  .list {
    padding: 0.26rem 0.3rem 0.16rem 0.32rem;
    @include flexbox;
    @include flex-direction(row);
    background: rgba(255, 255, 255, 1);
    border-bottom: solid 1px #e0e0e0;
    .left {
      @include flex(11);
      > div:first-child {
        font-size: 0.34rem;
        color: rgba(48, 48, 48, 1);
        @include flexbox;
        margin-bottom: 0.09rem;
        > span.direction {
          display: inline-block;
          width: 0.46rem;
          height: 0.45rem;
          line-height: 0.46rem;
          text-align: center;
          vertical-align: middle;
          color: rgba(255, 255, 255, 1);
          font-size: 0.3rem;
          margin-right: 0.14rem;
        }
        > span.title {
          @include flex(3);
        }
        > span.info {
          width: 1rem;
          height: 0.45rem;
          line-height: 0.44rem;
          border-radius: 0.03rem;
          font-size: 0.28rem;
          text-align: center;
          vertical-align: middle;
        }
      }
      > div:nth-child(2) {
        > span {
          display: inline-block;
        }
        > span:first-child {
          width: 4rem;
          color: rgb(159, 159, 159);
          line-height: 0.37rem;
          font-size: 0.26rem;
        }
        > span:nth-child(2) {
          line-height: 0.44rem;
          background: rgba(224, 246, 255, 1);
          color: rgba(50, 150, 250, 1);
          border-radius: 0.03rem;
          padding: 0 0.1rem;
          vertical-align: middle;
        }
      }
      > div:nth-child(3) {
        color: rgb(159, 159, 159);
        height: 0.37rem;
        font-size: 0.26rem;
      }
    }
    .send {
      > span.direction {
        background: rgba(220, 137, 41, 1);
      }
    }
    .received {
      > span.direction {
        background: rgba(152, 146, 64, 1);
      }
    }
    .reported {
      > span.info {
        background: rgba(237, 242, 211, 1);
        color: rgba(112, 118, 35, 1);
      }
    }
    .ongoing {
      > span.info {
        background: rgba(255, 242, 215, 1);
        color: rgba(227, 134, 18, 1);
      }
    }
    .completed {
      > span.info {
        background: rgba(226, 255, 224, 1);
        color: rgba(39, 173, 40, 1);
      }
    }
    .fake {
      > span.info {
        background: rgba(248, 217, 212, 1);
        color: rgba(226, 72, 32, 1);
      }
    }
    .right {
      @include flex(1);
      @include flexbox;
      @include justify-content(center);
      @include align-items(center);
      svg {
        width: 0.37rem;
        height: 0.36rem;
      }
    }
  }
  .list:last-child {
    border: 0;
  }
  .mint-popup {
    width: 100%;
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