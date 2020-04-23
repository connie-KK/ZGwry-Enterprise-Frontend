<template>
  <div class="content" id="eventList">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :showBorder="isShowBorder"
      :isShowSearchIcon="isShowSearchIcon"
      :serachFun="toSearchList"
      :toggleSearchBox="toToggleSearchBox"
      :customBack="goBack"
    >{{moduleName}}</header-bar>
    <div :class="[isShowSearchBox?'main-content-with-search':'','main-content']">
      <div class="content-header">
        <div class="filter-box">
          <p @click="onlyMe = !onlyMe" :class="{ active: onlyMe }">仅看我的待办事件</p>
          <p id="okbf" @click="popupVisible = true">筛选</p>
        </div>
        <div class="sort-box">
          <div
            v-for="(item,index) in sortBox"
            :class="item.class"
            :key="index"
            @click="changeSort(index)"
          >
            <span>{{item.name}}</span>
            <span :class="item.sort"></span>
          </div>
        </div>
        <div class="state-box">
          <div
            v-for="(item,index) in stateBox"
            :key="index"
            :class="item.class"
            @click="changeState(index)"
          >{{item.name}}</div>
          <div>{{listData.length}}</div>
        </div>
      </div>
      <div class="list-container">
        <div v-for="(item,index) in listData" :key="index" class="list" @click="toDetail(item)">
          <div class="left">
            <div :class="item.class">
              <span class="direction" v-if="item.directionInfo">{{item.directionInfo}}</span>
              <span class="title">{{item.title}}</span>
              <span class="info">{{item.stateInfo}}</span>
            </div>
            <div>
              <span>添加日期：{{item.showDate}}</span>
              <span>{{item.typeInfo}}</span>
            </div>
            <div v-if="item.showTaskhandletime">最新执行时间：{{item.showTaskhandletime}}</div>
          </div>
          <div class="right">
            <icon name="right" scale="1"></icon>
          </div>
        </div>
        <p class="nodata-tips" v-if="!listData.length&&!firstState">暂无数据</p>
      </div>
      <mt-datetime-picker
        ref="picker1"
        type="datetime"
        v-model="filterParams.sDate"
        @confirm="handleConfirmDate1"
      ></mt-datetime-picker>
      <mt-datetime-picker
        ref="picker2"
        type="datetime"
        v-model="filterParams.eDate"
        @confirm="handleConfirmDate2"
      ></mt-datetime-picker>
    </div>
    <mt-popup v-model="popupVisible" position="right" class="popup-box">
      <div class="filter-content">
        <p class="filter-title">筛选</p>
        <img @click="popupVisible = false" src="@/assets/images/close.png" class="close-btn" />
        <ul>
          <li>
            <p>状态</p>
            <div>
              <span
                class="tip"
                v-for="(item, key) in eventStateMap"
                :key="item.name"
                :class="{ active: filterParams.state === Number(key) }"
                @click="filterParams.state = Number(key)"
              >{{ item.name }}</span>
            </div>
          </li>
          <li>
            <p>类型</p>
            <div>
              <span
                class="tip tip1"
                v-for="(item, key) in eventTypeMap"
                :key="item.name"
                :class="{ active: filterParams.type === Number(key) }"
                @click="filterParams.type = Number(key)"
              >{{ item }}</span>
            </div>
          </li>
          <li>
            <p>来源</p>
            <div>
              <span
                class="tip tip1"
                v-for="(item, key) in eventSourceMap"
                :key="item.name"
                :class="{ active: filterParams.direction === key }"
                @click="filterParams.direction = key"
              >{{ item.name }}</span>
            </div>
          </li>
          <li>
            <p>添加时间</p>
            <div>
              <span class="tip date-tip date-tip1" @click="$refs.picker1.open()">{{ d1 }}</span>
              <img src="@/assets/images/right1.png" class="right-icon" />
              <span class="tip date-tip date-tip2" @click="$refs.picker2.open()">{{ d2 }}</span>
            </div>
          </li>
          <li>
            <p>地点名称</p>
            <div>
              <input type="text" class="area-input" v-model="filterParams.area" placeholder="请输入地点" />
            </div>
          </li>
        </ul>
      </div>
      <div class="btn-box">
        <button class="popup-btn" @click="resetFilterParams">重置</button>
        <button class="popup-btn" @click="checkFilterParams">确定</button>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import moment from "moment";
import { Navbar, TabItem, Popup, DatetimePicker } from "mint-ui";
export default {
  name: "EventList",
  components: {
    "mt-navbar": Navbar,
    "mt-tab-item": TabItem,
    "mt-popup": Popup,
    "mt-datetime-picker": DatetimePicker
  },
  data() {
    return {
      firstTabIndex: 0,
      secondTabIndex: 1,
      thirdTabIndex: 2,
      moduleName: "事件列表",
      isShowBorder: true,
      isShowSearchIcon: true,
      isShowSearchBox: false,
      selected: 0,
      tabData: ["全部事件", "未完成事件", "已解决事件"],
      userId: "",
      grid: "",
      listData: [],
      listAll: [],
      listComplate: [],
      moduleId360: "",
      levels: [
        { value: 1, name: "县级网格" },
        { value: 2, name: "乡级网格" },
        { value: 3, name: "村级网格" }
      ],
      types: [],
      firstState: true,
      gridLevel: "", //当前登录用户对应网格等级
      sortBox: [
        {
          name: "添加时间",
          class: "selected",
          sort: "sortDown",
          key: "date"
        },
        {
          name: "最新进展时间",
          key: "handledate"
        }
      ],
      stateBox: [
        {
          name: "全部",
          class: "selected"
        },
        {
          name: "未完成"
        },
        {
          name: "已解决"
        }
      ],
      popupVisible: false,
      onlyMe: "",
      eventStateMap: {
        2: {
          name: "处理中"
        },
        1: {
          name: "上报中"
        },
        3: {
          name: "已完成"
        },
        4: {
          name: "虚假"
        }
      },
      eventTypeMap: {},
      eventSourceMap: {
        issued: {
          name: "发出事件"
        },
        received: {
          name: "收到事件"
        }
      },
      filterParams: {
        seachKey: "",
        state: null,
        type: null,
        sDate: moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD"),
        eDate: moment()
          .add(1, "days")
          .format("YYYY-MM-DD 23:59:59"),
        area: "",
        direction: ""
      },
      filterParamsStatic: {},
      eventListPageType: ""
    };
  },
  watch: {
    selected() {
      this.setListData();
    },
    onlyMe() {
      if (this.onlyMe) {
        this.getOnlyMyIncidents();
      } else {
        this.getHandleEventLists();
        this.getIncidentsByKey();
      }
    }
  },
  computed: {
    d1() {
      if (this.filterParams.sDate) {
        return moment(this.filterParams.sDate).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    },
    d2() {
      if (this.filterParams.eDate) {
        return moment(this.filterParams.eDate).format("YYYY-MM-DD HH:mm:ss");
      } else {
        return "";
      }
    }
  },
  created() {
    this.eventListPageType = JSON.parse(this.$route.params.id);
    this.$store.commit("set_eventListPageType", this.eventListPageType);
    if (this.eventListPageType === 0) {
      this.onlyMe = true;
    } else if (this.eventListPageType === 1) {
      this.onlyMe = false;
      this.getHandleEventLists();
    }
    this.getUserId();
    this.getmodsList();
    this.filterParamsStatic = JSON.parse(JSON.stringify(this.filterParams));
  },
  methods: {
    setListData() {
      if (this.selected === 0 && !this.filterParams.state) {
        const tempArr = [...this.listAll, ...this.listComplate];
        this.listData = JSON.parse(JSON.stringify(tempArr));
      } else if (
        (this.selected === 1 ||
          this.filterParams.state === 1 ||
          this.filterParams.state === 2 ||
          this.filterParams.state === 4) &&
        this.selected !== 2
      ) {
        this.listData = JSON.parse(JSON.stringify(this.listAll));
      } else if (this.selected === 2 || this.filterParams.state === 3) {
        this.listData = JSON.parse(JSON.stringify(this.listComplate));
      }
      this.sortList();
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
          if (!this.onlyMe) {
            this.getIncidentsByKey();
          }
        }
      });
    },
    getIncidentsByKey() {
      const payload = {
        grid: this.grid,
        pageIndex: -1,
        pageSize: 10,
        type: 2,
        searchKey: this.filterParams.searchKey,
        direction: this.filterParams.direction,
        startDate: this.filterParams.sDate ? this.filterParams.sDate : null,
        endDate: this.filterParams.eDate ? this.filterParams.eDate : null,
        incidentType: this.filterParams.type,
        addr: this.filterParams.area,
        state: this.filterParams.state
      };
      this.$api.getIncidentsByKey(payload).then(res => {
        if (this.firstState) {
          this.firstState = false;
          this.selected = 0;
        }
        this.listAll = this.handleListData(res);
        this.setListData();
      });
      // this.$api.getIncidentCount(payload).then(res => {});
    },
    //已完成事件参数
    getHandleEventLists() {
      const payload = {
        searchKey: this.filterParams.searchKey,
        pageIndex: -1,
        pageSize: 10,
        sDate: this.filterParams.sDate ? this.filterParams.sDate : null,
        eDate: this.filterParams.eDate ? this.filterParams.eDate : null,
        state: this.filterParams.state,
        addr: this.filterParams.area,
        incidentType: this.filterParams.type,
        direction: this.filterParams.direction
      };
      this.$api.getHandleEventLists(payload).then(res => {
        if (res && Array.isArray(res)) {
          this.listComplate = this.handleListData(res);
          this.setListData();
        }
      });
      // this.$api.getHandledIncidentsCount(payload).then(res => {});
    },
    handleListData(arr) {
      if (arr && Array.isArray(arr)) {
        let tempArr = [];
        arr.forEach(item => {
          if (item.state) {
            switch (item.state) {
              case 1:
                item.stateInfo = "上报中";
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
          item.showDate = moment(item.date).format("YYYY-MM-DD");
          item.showTaskhandletime = item.taskhandletime
            ? moment(item.taskhandletime).format("YYYY-MM-DD HH:mm:ss")
            : "";
          tempArr.push(item);
        });
        return JSON.parse(JSON.stringify(tempArr));
      }
    },
    getOnlyMyIncidents() {
      const payload = {
        pageIndex: -1,
        pageSize: 10,
        searchKey: this.filterParams.searchKey,
        startDate: this.filterParams.sDate ? this.filterParams.sDate : null,
        endDate: this.filterParams.eDate ? this.filterParams.eDate : null,
        incidentType: this.filterParams.type,
        addr: this.filterParams.area,
        state: this.filterParams.state
      };
      this.$api.getPendingIncidents(payload).then(res => {
        this.firstState = false;
        if (res && res.incidentList) {
          this.listAll = this.handleListData(res.incidentList);
        } else {
          this.listAll = [];
        }
        this.listComplate = [];
        this.setListData();
      });
    },
    getmodsList() {
      this.$api.getmodsList().then(res => {
        if (res && Array.isArray(res)) {
          res.forEach(item => {
            if (item.name === "企业360模块") {
              this.moduleId360 = item.id;
              this.$store.commit("set_moduleId360", this.moduleId360);
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
          let tempTypeObj = {};
          this.types.forEach(item => {
            tempTypeObj[item.type] = item.name;
          });
          this.eventTypeMap = tempTypeObj;
          this.$store.commit("set_eventTypeList", res.incidentType);
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
    handleConfirmDate1(e) {
      this.filterParams.sDate = moment(e).format("YYYY-MM-DD HH:mm:ss");
    },
    handleConfirmDate2(e) {
      this.filterParams.eDate = moment(e).format("YYYY-MM-DD HH:mm:ss");
    },
    resetFilterParams() {
      this.filterParams = JSON.parse(JSON.stringify(this.filterParamsStatic));
    },
    checkFilterParams() {
      if (this.onlyMe) {
        this.getOnlyMyIncidents();
      } else {
        this.getIncidentsByKey();
        this.getHandleEventLists();
      }
      //展示全部
      this.changeState(0);
      this.popupVisible = false;
    },
    toSearchList(e) {
      this.filterParams.searchKey = e;
      if (this.selected === 0) {
        this.getIncidentsByKey();
        this.getHandleEventLists();
      } else if (this.selected === 1) {
        this.getIncidentsByKey();
      } else {
        this.getHandleEventLists();
      }
    },
    toToggleSearchBox(e) {
      this.isShowSearchBox = e;
    },
    goBack() {
      this.$router.push("/enList");
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
    changeSort(index) {
      let selected = this.sortBox[index];
      if (selected.class === "selected") {
        //已经是选中状态
        if (selected.sort === "sortUp") {
          selected.sort = "sortDown";
        } else if (selected.sort === "sortDown") {
          selected.sort = "sortUp";
        }
      } else {
        selected.class = "selected";
        selected.sort = "sortUp";
        let notSelected = this.sortBox[1 - index];
        notSelected.class = "";
        notSelected.sort = "";
        this.$set(this.sortBox, 1 - index, notSelected);
      }
      this.$set(this.sortBox, index, selected);
      //排序
      this.sortList();
    },
    sortList() {
      let selected;
      this.sortBox.forEach(item => {
        if (item.class === "selected") {
          selected = item;
        }
      });
      const key = selected.key;
      this.listData.sort((a, b) => {
        if (a[key] && b[key]) {
          if (selected.sort === "sortUp") {
            return new Date(a[key]).getTime() - new Date(b[key]).getTime();
          } else {
            return new Date(b[key]).getTime() - new Date(a[key]).getTime();
          }
        }
      });
    },
    changeState(index) {
      this.stateBox.forEach(item => {
        item.class = "";
      });
      let selected = this.stateBox[index];
      selected.class = "selected";
      this.$set(this.stateBox, index, selected);
      this.selected = index;
    },
    toDetail(item) {
      if (item.state === 3 && item.followup.length === 0) {
        //事件已自行处理
        this.$router.push(`/eventContent/${item.id}`);
      } else {
        if (this.gridLevel === 3) {
          //三级网格员，跳转事件内容页面
          this.$router.push(`/eventContent/${item.id}`);
        } else if (this.gridLevel === 1) {
          this.$router.push(`/eventDetailLevel1/${item.id}`);
        } else if (this.gridLevel === 2) {
          this.$router.push(`/eventDetail/${item.id}`);
        }
      }
    },
    toFollowup(item) {
      item.followup.incident = item.id;
      this.$store.commit("set_followup", item.followup);
      this.$router.push(`/eventDetailLevel1/0`);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
@import "@/assets/scss/_flex.scss";
#eventList {
  .content-header {
    .sort-box {
      width: 100%;
      height: 0.64rem;
      background: rgba(255, 255, 255, 1);
      @include flexbox;
      @include flex-direction(row);
      div {
        height: 100%;
        width: 50%;
        color: rgba(48, 48, 48, 1);
        font-size: 0.3rem;
        @include flexbox;
        @include justify-content(center);
        @include align-items(center);
        span:last-child {
          display: inline-block;
          width: 0.36rem;
          height: 0.36rem;
          margin-left: 0.11rem;
          background: url(../../../assets/images/sort.png) no-repeat;
        }
        span.sortUp {
          background: url(../../../assets/images/sortUp.png) no-repeat;
        }
        span.sortDown {
          background: url(../../../assets/images/sortDown.png) no-repeat;
        }
      }
      div:first-child {
        border-right: solid 1px #cecece;
      }
      .selected {
        color: rgba(50, 150, 250, 1);
      }
    }
    .filter-box {
      background: rgba(255, 255, 255, 1);
      padding: 0.21rem 0.32rem;
      height: 0.96rem;
      width: 100%;
      border-bottom: solid 1px #e3e3e3;
      p {
        margin: 0;
        &:nth-child(1) {
          float: left;
          line-height: 0.54rem;
          height: 0.54rem;
          padding: 0 0.2rem 0 0.63rem;
          color: #fff;
          border-radius: 0.1rem;
          position: relative;
          background: #aab8c6;
          &::before {
            content: "";
            position: absolute;
            left: 0.18rem;
            width: 0.32rem;
            height: 0.32rem;
            top: 0;
            bottom: 0;
            margin: auto;
            border: 1px solid #fff;
            border-radius: 50%;
            box-sizing: border-box;
          }
          &.active {
            background: #3296fa url("../../../assets/images/ischeck.png")
              no-repeat 0.18rem center;
            background-size: 0.32rem 0.32rem;
            &::before {
              display: none;
            }
          }
        }
        &:nth-child(2) {
          float: right;
          background: url("../../../assets/images/filterBlack.png") no-repeat
            left center;
          background-size: 0.32rem 0.32rem;
          line-height: 0.54rem;
          padding-left: 0.4rem;
          color: #303030;
          font-size: 0.3rem;
        }
      }
    }
    .state-box {
      @include flexbox;
      @include flex-direction(row);
      @include justify-content(space-between);
      padding: 0 1.23rem;
      margin: 0.3rem 0;
      div {
        @include flexbox;
        @include align-items(center);
        height: 0.54rem;
      }
      div:not(:last-child) {
        background: rgba(164, 188, 212, 1);
        border-radius: 0.06rem;
        color: rgba(255, 255, 255, 1);
        font-size: 0.3rem;
        padding: 0 0.2rem;
      }
      div:last-child {
        @include justify-content(center);
        width: 0.64rem;
        background: rgba(24, 119, 210, 1);
        border-radius: 0.25rem;
        color: rgba(255, 255, 255, 1);
        font-size: 0.32rem;
      }
      .selected {
        background: rgba(50, 150, 250, 1) !important;
      }
    }
  }
  .list-container {
    height: calc(100% - 2.74rem);
    overflow-y: auto;
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
    width: auto;
  }
  .mint-popup-bottom {
    width: 100%;
  }
  .popup-box {
    height: 100%;
    p {
      padding: 0;
      margin: 0;
    }
    .filter-content {
      width: 5.9rem;
      height: calc(100% - 1.2rem);
      overflow: auto;
      background: #fff;
      padding: 0.32rem;
      position: relative;
      .filter-title {
        font-size: 0.34rem;
        font-weight: 500;
        margin-bottom: 0.2rem;
      }
      .close-btn {
        width: 0.28rem;
        height: 0.28rem;
        position: absolute;
        right: 0.32rem;
        top: 0.42rem;
      }
    }
    ul {
      height: calc(100% - 0.7rem);
      overflow-y: auto;
      li {
        p {
          font-size: 0.32rem;
          color: #6f6f6f;
          margin-top: 0.3rem;
          margin-bottom: 0.2rem;
        }
        div {
          overflow: hidden;
        }
        .right-icon {
          float: left;
          width: 0.18rem;
          height: 0.32rem;
          margin-top: 0.09rem;
        }
        .area-input {
          border: 1px solid rgba(170, 184, 198, 1);
          font-size: 0.3rem;
          padding-left: 0.3rem;
          height: 0.54rem;
          width: 5.23rem;
          color: rgba(48, 48, 48, 1);
          border-radius: 0.06rem;
        }
        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          color: #fff;
        }
        .tip {
          float: left;
          padding: 0 0.3rem;
          line-height: 0.54rem;
          color: rgba(170, 184, 198, 1);
          margin: 0 0.3rem 0.2rem 0;
          border-radius: 0.06rem;
          border: 1px solid rgba(170, 184, 198, 1);
          &.active {
            color: rgba(255, 255, 255, 1);
            background: #3296fa;
            border: 1px solid #3296fa;
          }
          &.date-tip1 {
            width: 4.7rem;
            height: 0.54rem;
          }
          &.date-tip2 {
            width: 5.23rem;
            height: 0.54rem;
          }
        }
        .tip1 {
          padding: 0 0.5rem;
        }
        .il-check-box {
          &.checkbox2 {
            margin-left: 0.68rem;
          }
          p {
            margin: 0;
            margin-bottom: 0.13rem;
            span {
              vertical-align: middle;
              line-height: 0.42rem;
              height: 0.42rem;
              display: inline-block;
            }
            &::before {
              content: "";
              display: inline-block;
              width: 0.36rem;
              height: 0.36rem;
              border-radius: 0.08rem;
              border: 1px solid #aab8c6;
              vertical-align: middle;
              color: #aab8c6;
              margin-right: 0.1rem;
              box-sizing: border-box;
            }
            &.check {
              &::before {
                background: url("../../../assets/images/check.png") no-repeat
                  50%;
                background-size: 100% auto;
                border: 0;
              }
            }
          }
        }
      }
    }
    .btn-box {
      width: 100%;
      height: 1.2rem;
      margin-top: 0.15rem;
      padding: 0.1rem 0.32rem 0 0.32rem;
      border-top: solid 1px #e0e0e0;
      @include flexbox;
      @include justify-content(space-between);
      button {
        width: 2.4rem;
        height: 0.8rem;
        font-size: 0.32rem;
        display: block;
      }
      button:first-child {
        color: rgba(50, 150, 250, 1);
        border-radius: 3px;
        border: 1px solid rgba(50, 150, 250, 1);
      }
      button:last-child {
        border: 0;
        background: #3296fa;
        color: #fff;
      }
    }
  }
}
</style>