<template>
  <div class="content" id="eventDetail">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div class="main-content" v-if="detailData">
      <div v-for="(item,index) in dataList" :key="index">
        <div :class="['list',item.class]" v-if="item.key">
          <span>{{item.label}}</span>
          <div v-if="item.type==='text'" class="right">{{detailData[item.key]}}</div>
          <div v-if="item.type==='textarea'" class="textarea">
            <textarea
              v-model="detailData[item.key]"
              rows="4"
              :placeholder="detailData[item.placeholder]"
              :readonly="!(editState&&item.canItemEdit)"
            />
          </div>
          <div class="right" v-if="item.type==='switch'">
            <aep-switch v-if="!editState" v-model="isEventTrue"></aep-switch>
            <mt-switch v-if="editState" v-model="isEventTrue"></mt-switch>
          </div>
          <div class="right" v-if="item.type==='btn'">
            <button class="add-btn" v-if="editState" @click="toAddTask">
              <span class="btn-img"></span>
              <span>添加任务</span>
            </button>
          </div>
          <div class="right" v-if="item.type==='contract'">
            <span>{{detailData[item.key]}}</span>
            <span class="phone" @click="toPhone('tel')"></span>
          </div>
          <div class="right" v-if="item.type==='rightArrow'" @click="selectTreatment">
            <span>{{detailData[item.key]}}</span>
            <span class="right-icon">
              <icon name="right" scale="1"></icon>
            </span>
          </div>
          <div v-if="item.type==='btn'&&detailData['tasks']">
            <div class="child-list" v-for="(it,idx) in detailData['tasks']" :key="idx">
              <div class="left">
                <p>{{it.name}}</p>
                <p>截至时间：{{it.deadline}}</p>
              </div>
              <div class="right" @click="toTaskDetail(it)">
                <icon name="right" scale="1"></icon>
              </div>
            </div>
          </div>
          <div v-if="item.type==='rightArrow'&&detailData['tasks']">
            <div class="child-list" v-for="(it,idx) in item.items" :key="idx">
              <div class="left">
                <p>{{it.title}}</p>
              </div>
              <div class="right" v-if="it.type==='contractItem'" @click="toPhone('tel')">
                <span>{{it.content}}</span>
                <span class="phone"></span>
              </div>
              <div class="right" v-if="it.type==='textItem'">
                <span>{{it.content}}</span>
              </div>
            </div>
          </div>
          <div class="img-list" v-if="item.type==='img'">
            <upload-box
              ref="upload"
              :fileId="'img'+index"
              :data="item.value"
              :autoShow="false"
              :showDelete="false"
              @clickimg="openImg"
            ></upload-box>
          </div>
        </div>
        <div :class="['list','label-list',item.class]" v-else>{{item.label}}</div>
      </div>
    </div>
    <div :class="['footer', editState?'':'hidden-footer']">
      <button @click="save">{{submitText}}</button>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" @change="handleTreat" valueKey="valueKey" ref="mtPicker"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { Switch, Toast, Popup, Picker } from "mint-ui";
import moment from "moment";
import uploadBox from "@/components/uploadBox";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
export default {
  name: "EventDetail",
  components: {
    uploadBox,
    "mt-switch": Switch,
    "mt-popup": Popup,
    "mt-picker": Picker
  },
  data() {
    return {
      moduleName: "处理事件",
      isShowBorder: false,
      dataList: [
        //2级处理事件列表
        {
          label: "标题",
          key: "incidentTitle",
          type: "text"
        },
        {
          label: "事件属实",
          key: "truth",
          type: "switch"
        },
        {
          label: "备注",
          key: "remarks",
          type: "textarea",
          canItemEdit: true
        },
        //事件内容
        {
          label: "上报事件内容",
          class: "top-margin"
        },
        {
          label: "标题",
          key: "incidentTitle",
          type: "text",
          class: "no-border"
        },
        {
          label: "时间",
          key: "date",
          type: "text"
        },
        { label: "网格员", key: "staffName", type: "contract" },
        {
          label: "地址",
          key: "addr",
          type: "text",
          value: ""
        },
        {
          label: "相关企业",
          key: "enterprise",
          type: "text",
          value: "请选择相关企业"
        },
        {
          label: "事件类型",
          key: "typeName",
          type: "text",
          value: ""
        },
        {
          label: "图片",
          key: "imgList",
          type: "img",
          imgType: 1, //事件内容 的图片
          value: []
        },
        {
          label: "详细描述",
          key: "contents",
          type: "textarea",
          value: "",
          placeholder: "请输入事件详细情况"
        }
      ],
      treatItem: {
        label: "处理措施",
        key: "treat",
        type: "rightArrow",
        items: [
          // {
          //   title: "审核人",
          //   content: "张三",
          //   type: "contractItem"
          // }
        ]
      },
      cerateTaskItem: {
        label: "分派任务",
        key: "tasks",
        type: "btn"
      },
      staff: "",
      popupVisible: false,
      slots: [
        {
          values: [],
          textAlign: "center"
        }
      ],
      slotsValueL1: [{ valueKey: "下发责令整改任务", value: "issueTask" }],
      slotsValueL2: [
        { valueKey: "下发责令整改任务", value: "issueTask" },
        { valueKey: "上报上级处理", value: "toUpHandle" },
        { valueKey: "完结事件", value: "overEvent" }
      ],
      slotsValueL3: [{ valueKey: "上报上级处理", value: "toUpHandle" }],
      firstSelect: true,
      toSelect: false,
      followup: {},
      detailData: {},
      incidentId: "",
      followupId: "",
      editState: false,
      enterPriseList: [],
      imgBaseUrl: "/ent/Grid/GetImage/",
      isEventTrue: false,
      submitText: "确定",
      initt: null
    };
  },
  watch: {
    popupVisible() {
      if (!this.popupVisible && this.toSelect && this.firstSelect) {
        this.handleTreat(this.$refs.mtPicker);
        this.toSelect = false;
        this.firstSelect = false;
      }
    },
    isEventTrue() {
      if (this.isEventTrue === false) {
        this.detailData.state = 4;
        if (this.dataList.length === 13) {
          this.dataList.splice(3, 1);
        } else if (this.dataList.length === 14) {
          this.dataList.splice(3, 2);
        }
        this.submitText = "完结事件";
      } else if (this.isEventTrue === true && this.dataList.length === 12) {
        this.dataList.splice(3, 0, this.treatItem);
        this.submitText = "确定";
      }
    },
    isAddTaskState() {
      if (this.$store.state.followupType === "add") {
        let task = this.$store.state.followupTask;
        this.setTasks([task]);
      } else {
        this.getIncidentDetail();
      }
    }
  },
  computed: {
    gridLevel() {
      return this.$store.state.gridLevel;
    },
    typeList() {
      return this.$store.state.eventTypeList;
    },
    isAddTaskState() {
      return this.$store.state.isAddTaskState;
    }
  },
  created() {
    this.incidentId = this.$route.params.id;
    this.getIncidentDetail();
    this.getEnterpriseList();
  },
  methods: {
    getIncidentDetail() {
      const payload = {
        id: this.incidentId
      };
      this.$api.getIncidentDetail(payload).then(res => {
        if (res && res.gridName) {
          if (res.state !== 3 && res.state !== 4) {
            if (this.gridLevel === 1) {
              this.slots[0].values = this.slotsValueL1;
            } else if (this.gridLevel === 2) {
              this.slots[0].values = this.slotsValueL2;
            } else if (this.gridLevel === 3) {
              this.slots[0].values = this.slotsValueL3;
            }
          }
          this.handleDetailData(res);
          this.detailData.incidentTitle = res.title;
          this.detailData.gridName = res.gridName;
          this.staffId = res.staff;
          this.getUserByid();
          let hasLeve2Follow = false;
          if (Array.isArray(res.followup) && res.followup.length) {
            res.followup.forEach(item => {
              if (item.level === 2) {
                hasLeve2Follow = true;
                this.followupId = item.id;
                //防止相应内容还没更新
                this.$nextTick(() => {
                  this.handlel2Follow(item);
                });
              }
            });
          }
          if (!hasLeve2Follow) {
            this.detailData.rowState = "add";
            this.detailData.id = this.$uuid();
          }
        }
      });
    },
    handlel2Follow(item) {
      if (item.state === 1) {
        this.detailData.treat = "上报上级处理";
      } else if (item.state === 2) {
        this.detailData.treat = "下发责令整改任务";
        if (this.dataList.length === 13) {
          this.dataList.splice(4, 0, this.cerateTaskItem);
          this.setTasks(item.tasks);
        } else if (this.dataList.length === 14) {
          this.setTasks(item.tasks);
        }
      }
      this.detailData.remarks = item.remarks;
      this.detailData.id = item.id;
      this.detailData.rowState = "upd";
    },
    handleDetailData(res) {
      res.date = moment(res.date).format("YYYY-MM-DD HH:mm");
      if (res.state === 3 || res.state === 4 || this.gridLevel == 1) {
        //已完成或虚假时不可编辑，页面底部的确定按钮用来更新followup
        //1级的时候也不可以，因为不是自己的followup
        this.editState = false;
      } else {
        this.editState = true;
      }
      if (res.state !== 4) {
        this.isEventTrue = true;
      } else {
        this.isEventTrue = false;
      }
      this.detailData = res;
      this.detailData.incident = res.id;
      this.setEventType();
      this.setImgItem(this.detailData.attaches);
    },
    setImgItem(imgarr) {
      let tempArr, index;
      this.dataList.forEach((dItem, dIndex) => {
        if (dItem.type === "img") {
          index = dIndex;
          tempArr = dItem;
        }
      });
      imgarr.forEach(item => {
        item.url = this.imgBaseUrl + item.id;
        tempArr.value.push(item);
      });
      this.$set(this.dataList, index, tempArr);
    },
    getEnterpriseList() {
      const payload = {
        pageIndex: -1,
        pageSize: 10,
        keyword: ""
      };
      this.$api.getEnterpriseList(payload).then(res => {
        if (res) {
          this.enterPriseList = res.items;
          this.setEnterpriseName();
        }
      });
    },
    setEnterpriseName() {
      if (this.detailData.enterprise && this.enterPriseList.length) {
        this.enterPriseList.forEach(item => {
          if (item.id === this.detailData.enterprise) {
            this.detailData.enterprise = item.name;
          }
        });
      }
    },
    setEventType() {
      if (this.detailData.type && this.typeList.length) {
        this.typeList.forEach(item => {
          if (item.type === this.detailData.type) {
            this.detailData.typeName = item.name;
          }
        });
      }
    },
    getUserByid() {
      const payload = {
        id: this.staffId
      };
      this.$api.getUserByid(payload).then(res => {
        if (res && res.userName) {
          this.detailData.telephone = res.telephone;
          this.$set(this.detailData, "staffName", res.userName);
        }
      });
    },
    async toPhone(type) {
      if (this.detailData.telephone) {
        if (this.initt === "dingding") {
          await window.dingtalk.showCallMenu({
            phoneNumber: this.detailData.telephone, // 期望拨打的电话号码
            code: "+86", // 国家代号，中国是+86
            showDingCall: true, // 是否显示钉钉电话
            success: function(res) {},
            fail: function(err) {}
          });
        } else {
          window.location.href = "tel:" + this.detailData.telephone;
        }
      } else {
        this.tips("未获取到审核人手机号码", "iconfont icon-error");
      }
    },
    save() {
      let payload = {};
      if (!this.detailData.rowState) {
        this.detailData.rowState = "upd";
        payload = this.detailData;
      } else {
        payload = {
          id: this.detailData.id,
          rowState: this.detailData.rowState,
          incident: this.detailData.incident,
          staff: this.detailData.staff,
          date: this.detailData.date,
          level: this.gridLevel,
          state: this.detailData.state,
          remarks: this.detailData.remarks,
          tasks: this.detailData.tasks
        };
      }
      this.$api.updateincidentfollowup(payload).then(res => {
        if (res === "OK") {
          this.tips("提交成功", "iconfont icon-success");
          if (this.gridLevel === 1) {
            this.$router.replace(`/eventDetailLevel1/${payload.id}`);
          } else if (this.gridLevel === 2) {
            const eventListPageType = this.$store.state.eventListPageType;
            this.$router.push(`/eventList/${eventListPageType}`);
          }
        } else {
          this.tips(res, "iconfont icon-error");
        }
      });
    },
    selectTreatment() {
      if (this.editState) {
        this.toSelect = true;
        this.popupVisible = true;
      }
    },
    handleTreat(picker) {
      if (this.toSelect) {
        const selectedVal = picker.getValues();
        if (selectedVal instanceof Array && selectedVal.length === 1) {
          let key = selectedVal[0].value;
          let value;
          if (key === "issueTask") {
            value = "下发责令整改任务";
            this.detailData.state = 2;
            if (this.dataList.length === 13) {
              this.dataList.splice(4, 0, this.cerateTaskItem);
            }
          } else if (key === "toUpHandle") {
            value = "上报上级处理";
            this.detailData.state = 1;
            if (this.dataList.length === 14) {
              this.dataList.splice(4, 1);
            }
          } else if (key === "overEvent") {
            value = "完结事件";
            this.detailData.state = 3;
            if (this.dataList.length === 14) {
              this.dataList.splice(4, 1);
            }
          }
          this.$set(this.detailData, "treat", value);
        }
      } else {
        return;
      }
    },
    toAddTask() {
      const followupType = this.detailData.rowState;
      this.$store.commit("set_followupType", followupType);
      this.$store.commit("set_toTaskEvent", this.detailData.id);
      this.$store.commit("set_toTaskEventTitle", this.detailData.incidentTitle);
      this.$router.push("/putTask/1");
    },
    toTaskDetail(it) {
      const followupType = this.detailData.rowState;
      if (followupType === "add") {
        this.$store.commit("set_followupTask", it);
        this.$store.commit(
          "set_toTaskEventTitle",
          this.detailData.incidentTitle
        );
      }
      this.$store.commit("set_followupType", followupType);
      this.$router.push(`/putTask/${it.id}`);
    },
    setTasks(tasks) {
      if (tasks && tasks.length) {
        let addTask = false;
        if (this.detailData.tasks && this.detailData.tasks.length > 0) {
          const temp = this.detailData.tasks.filter(item => {
            return item.id === tasks[0].id;
          });
          if (temp.length === 0) {
            addTask = true;
          }
        } else {
          addTask = true;
        }
        if (addTask) {
          tasks.forEach(item => {
            item.name = item.title;
            item.deadline = moment(item.deadline).format("YYYY-MM-DD");
            if (!this.detailData.tasks) {
              this.detailData.tasks = [];
            }
            this.detailData.tasks.push(item);
          });
          let taskIndex;
          this.dataList.forEach((dItem, dKey) => {
            if (dItem.key === "tasks") taskIndex = dKey;
          });
          let tasksItem = this.dataList[taskIndex];
          tasksItem.label = `分派任务（${this.detailData.tasks.length}）`;
          this.$set(this.dataList, taskIndex, tasksItem);
        }
      }
    },
    openImg(index) {
      let imgs = [];
      this.imglist.forEach(item => {
        imgs.push(item.url);
      });
      ImagePreview({
        images: imgs,
        startPosition: index,
        closeable: true
      });
    },
    tips(msg, icon) {
      Toast({
        message: msg,
        iconClass: icon,
        position: "top",
        duration: 2000
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
#eventDetail {
  .main-content {
    height: calc(100% - 2.6rem);
    overflow-y: scroll;
  }
  .right-header {
    font-size: 0.34rem;
    color: rgba(50, 150, 250, 1);
  }
  .list {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    padding: 0.14rem 0.32rem;
    border-top: solid 1px #e0e0e0;
    span {
      display: inline-block;
    }
    > span:first-child {
      line-height: 0.84rem;
      width: calc(100% - 4.5rem);
      color: rgba(48, 48, 48, 1);
      font-size: 0.34rem;
      vertical-align: middle;
    }
    > div.right {
      float: right;
      width: 4.5rem;
      color: rgb(157, 157, 157);
      height: 0.84rem;
      line-height: 0.4rem;
      text-align: right;
      font-size: 0.3rem;
      @include flexbox;
      @include justify-content(flex-end);
      @include align-items(center);
    }
    > div.textarea {
      width: 100%;
      font-size: 0.3rem;
      textarea {
        border: 0;
        font-size: 0.3rem;
        color: rgb(157, 157, 157);
        width: 100%;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      textarea::placeholder {
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    .mint-switch-core {
      width: 0.96rem;
      height: 0.5rem;
    }
    .mint-switch-core::before {
      width: 0.92rem;
      height: 0.46rem;
      background-color: #969696;
    }
    .mint-switch-core::after {
      width: 0.46rem;
      height: 0.46rem;
    }
    .mint-switch-input:checked + .mint-switch-core::after {
      -webkit-transform: translateX(0.48rem);
      transform: translateX(0.48rem);
    }
    .add-btn {
      width: 2.4rem;
      height: 0.74rem;
      border: 0;
      color: rgba(50, 150, 250, 1);
      font-size: 0.3rem;
      padding: 0;
      @include flexbox;
      @include align-items(center);
      @include justify-content(flex-end);
      > span:first-child {
        display: inline-block;
        width: 0.32rem;
        height: 0.31rem;
        background: url("../../../assets/images/addBtn.png") no-repeat left
          center;
        background-size: 0.32rem 0.31rem;
        margin-right: 0.16rem;
      }
    }
    .phone {
      display: inline-block;
      width: 0.32rem;
      height: 0.31rem;
      background: url("../../../assets/images/phone.png") no-repeat left center;
      background-size: 0.32rem 0.31rem;
      margin-right: 0.16rem;
      margin: 0 0.16rem 0 0.32rem;
    }
    .right-icon {
      display: inline-block;
      margin-left: 0.16rem;
    }
    .img-list {
      width: 100%;
      @include flexbox;
      @include flex-direction(row);
      @include flex-wrap(wrap);
      > div {
        display: inline-block;
      }
    }
    .child-list {
      width: 100%;
      height: 1rem;
      background: rgb(248, 248, 248);
      @include flexbox;
      @include flex-direction(row);
      @include align-items(center);
      padding: 0.1rem 0.32rem 0.1rem 0.2rem;
      margin-top: 0.19rem;
      .left {
        @include flex(2);
        > p {
          margin: 0;
          font-size: 0.3rem;
          color: rgba(48, 48, 48, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > p:nth-child(2) {
          font-size: 0.26rem;
          color: rgb(157, 157, 157);
        }
      }
      .right {
        @include flex(1);
        @include flexbox;
        @include align-items(center);
        @include justify-content(flex-end);
        > span {
          color: rgb(157, 157, 157);
        }
      }
    }
  }
  .label-list {
    height: 0.8rem;
    background: rgba(241, 245, 247, 1);
    font-size: 0.34rem;
    font-weight: 500;
    color: rgba(48, 48, 48, 1);
    line-height: 0.48rem;
  }
  .no-border {
    border: 0;
  }
  .top-margin {
    margin-top: 0.4rem;
    border-top: 0;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.28rem;
    background: rgba(255, 255, 255, 1);
    @include flexbox;
    @include flex-direction(row);
    @include justify-content(space-between);
    padding: 0.16rem 0.32rem;

    > button {
      width: 100%;
      height: 0.96rem;
      background: rgba(50, 150, 250, 1);
      border-radius: 0.03rem;
      color: rgba(255, 255, 255, 1);
      @include flexbox;
      @include justify-content(center);
      @include align-items(center);
      font-size: 0.34rem;
    }
  }
  .hidden-footer {
    display: none;
  }
}
</style>