<template>
  <div class="content" id="eventDetailLevel1">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div class="main-content">
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
            <aep-switch v-if="!editState" v-model="switchState"></aep-switch>
            <mt-switch v-if="editState" v-model="switchState"></mt-switch>
          </div>
          <div class="right" v-if="item.type==='btn'">
            <button class="add-btn" v-if="editState" @click="toTask">
              <span class="btn-img"></span>
              <span>添加任务</span>
            </button>
          </div>
          <div class="right" v-if="item.type==='contract'">
            <span>{{detailData[item.key]}}</span>
            <span class="phone" @click="toPhone(item.key)"></span>
          </div>
          <div class="right" v-if="item.type==='rightArrow'">
            <span>{{detailData[item.key]}}</span>
            <span class="right-icon">
              <icon name="right" scale="1"></icon>
            </span>
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
        </div>
        <div :class="['list','label-list',item.class]" v-else>{{item.label}}</div>
      </div>
    </div>
    <div class="footer">
      <button :class="editState?'':'disable-btn'" @click="save">确定</button>
    </div>
  </div>
</template>

<script>
import { Switch, Toast } from "mint-ui";
import moment from "moment";
import uploadBox from "@/components/uploadBox";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
export default {
  name: "EventDetailLevel1",
  components: {
    uploadBox,
    "mt-switch": Switch
  },
  data() {
    return {
      moduleName: "处理事件",
      isShowBorder: true,
      routerId: "",
      editState: true,
      dataList: [
        //1级处理事件列表
        {
          label: "标题",
          key: "incidentTitle",
          type: "text"
        },
        {
          label: "备注",
          key: "remarks",
          type: "textarea",
          canItemEdit: true
        },
        {
          label: "事件处理完毕",
          key: "state",
          type: "switch"
        },
        {
          label: "分派任务",
          key: "tasks",
          type: "btn"
        },
        //2级处理事件列表
        {
          label: "2级处理内容",
          class: "top-margin"
        },
        {
          label: "时间",
          key: "followup2Date",
          type: "text",
          class: "no-border"
        },
        {
          label: "审核员",
          key: "followup2staffName",
          type: "contract"
        },
        {
          label: "备注",
          key: "followup2Remarks",
          type: "textarea"
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
          key: "incidentDate",
          type: "text"
        },
        { label: "网格员", key: "incidentStaffName", type: "contract" },
        {
          label: "地址",
          key: "addr",
          type: "text",
          value: ""
        },
        {
          label: "相关企业",
          key: "enterpriseName",
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
      detailData: {},
      staffId: "",
      followupId: "",
      stateLists: [
        { value: 1, name: "未发布" },
        { value: 2, name: "处理中" },
        { value: 3, name: "已完成" },
        { value: 4, name: "虚假" }
      ],
      followup: [],
      canEdit: "",
      enterPriseList: [],
      imgBaseUrl: "/ent/Grid/GetImage/",
      switchState: false,
      hasL1Followup: false,
      initt: null
    };
  },
  computed: {
    isAddTaskState() {
      return this.$store.state.isAddTaskState;
    },
    typeList() {
      return this.$store.state.eventTypeList;
    }
  },
  watch: {
    isAddTaskState() {
      if (this.$store.state.followupType === "add") {
        let task = this.$store.state.followupTask;
        this.setTask([task]);
      } else {
        this.getIncidentDetail();
      }
    },
    switchState() {
      if (!this.switchState) {
        this.detailData.state = this.detailData.preVState
          ? this.detailData.preVState
          : this.detailData.state;
      } else {
        this.detailData.preVState = this.detailData.state;
        this.detailData.state = 3;
      }
    }
  },
  created() {
    this.routerId = this.$route.params.id;
    this.getIncidentDetail();
  },
  methods: {
    getIncidentDetail() {
      const payload = {
        id: this.routerId
      };
      this.$api.getIncidentDetail(payload).then(res => {
        if (res) {
          let tempObj = {
            incidentDate: moment(res.date).format("YYYY-MM-DD HH:mm:ss"),
            incidentTitle: res.title,
            state: res.state,
            level: 1,
            staff: res.staff,
            addr: res.addr,
            enterprise: res.enterprise,
            type: res.type,
            contents: res.contents
          };

          this.detailData = tempObj;
          this.incidentStaffId = res.staff;
          this.getEnterpriseList();
          this.setImgItem(res.attaches);
          this.setEventType();
          this.getUserByid(this.incidentStaffId, "incidentStaffName");
          if (res.state === 3 || res.state === 4) {
            //已完成或虚假时不可编辑，页面底部的确定按钮用来更新followup
            this.editState = false;
          }
          if (res.state === 3) {
            //事件处理完毕
            this.switchState = true;
          } else {
            this.switchState = false;
          }
          if (Array.isArray(res.followup) && res.followup.length) {
            this.handleFollowup(res.followup);
          } else {
            this.canEdit = true;
            this.detailData.id = this.$uuid();
          }
        }
      });
    },
    handleFollowup(followup) {
      followup.forEach(fItem => {
        if (fItem.level === 1) {
          this.hasL1Followup = true;
          this.handleFollowupL1(fItem);
        } else if (fItem.level === 2) {
          this.handleFollowupL2(fItem);
        }
        if (!this.hasL1Followup) {
          this.canEdit = true;
          this.detailData.id = this.$uuid();
        }
      });
    },
    handleFollowupL1(f1Item) {
      this.detailData.date = moment(f1Item.date).format("YYYY-MM-DD HH:mm");
      if (Array.isArray(f1Item.tasks) && f1Item.tasks.length) {
        this.setTask(f1Item.tasks);
      }
      this.detailData.remarks = f1Item.remarks;
      this.detailData.id = f1Item.id;
      this.detailData.staff = f1Item.staff;
    },
    setTask(tasks) {
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
    handleFollowupL2(f2Item) {
      this.detailData.followup2Date = moment(f2Item.date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.detailData.followup2Remarks = f2Item.remarks;
      this.detailData.followup2staff = f2Item.staff;
      this.getUserByid(f2Item.staff, "followup2staffName");
    },
    setEventType() {
      if (this.detailData.type && this.typeList.length) {
        this.typeList.forEach(item => {
          if (item.type === this.detailData.type) {
            this.$set(this.detailData, "typeName", item.name);
          }
        });
      }
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
            this.$set(this.detailData, "enterpriseName", item.name);
          }
        });
      }
    },
    setImgItem(imgarr) {
      if (Array.isArray(imgarr) && imgarr.length) {
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
      }
    },
    getUserByid(id, key) {
      const payload = {
        id: id
      };
      this.$api.getUserByid(payload).then(res => {
        if (res && res.userName) {
          this.detailData[`${key}telephone`] = res.telephone;
          this.$set(this.detailData, key, res.userName);
        }
      });
    },
    save() {
      let payload = {
        id: this.detailData.id,
        rowState: this.canEdit ? "add" : "upd",
        incident: this.routerId,
        staff: this.detailData.staff,
        date: moment(this.detailData.date).format("YYYY-MM-DD HH:mm"),
        level: this.detailData.level,
        state: this.detailData.state,
        remarks: this.detailData.remarks,
        tasks: this.detailData.tasks
      };
      this.$api
        .updateincidentfollowup(payload)
        .then(res => {
          if (res === "OK") {
            this.tips("提交成功", "iconfont icon-success");
            this.$store.commit("set_followupType", "");
            const eventListPageType = this.$store.state.eventListPageType;
            this.$router.push(`/eventList/${eventListPageType}`);
          } else {
            this.tips(res, "iconfont icon-error");
          }
        })
        .catch(e => {
          this.tips(e, "iconfont icon-error");
        });
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
    toTask() {
      let followupType;
      if (!this.hasL1Followup) {
        followupType = "add";
      } else {
        followupType = "upd";
      }
      this.$store.commit("set_followupType", followupType);
      this.$store.commit("set_toTaskEvent", this.detailData.id);
      this.$store.commit("set_toTaskEventTitle", this.detailData.incidentTitle);
      this.$router.push("/putTask/1");
    },
    async toPhone(key) {
      let telephone = this.detailData[`${key}telephone`];
      if (telephone) {
        if (this.initt === "dingding") {
          await window.dingtalk.showCallMenu({
            phoneNumber: telephone, // 期望拨打的电话号码
            code: "+86", // 国家代号，中国是+86
            showDingCall: true, // 是否显示钉钉电话
            success: function(res) {},
            fail: function(err) {}
          });
        } else {
          window.location.href = "tel:" + telephone;
        }
      } else {
        this.tips("未获取到审核人手机号码", "iconfont icon-error");
      }
    },
    toTaskDetail(it) {
      const followupType = this.canEdit ? "add" : "upd";
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
#eventDetailLevel1 {
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
      margin: 0 0.32rem;
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
    @include justify-content(center);
    padding: 0.16rem 0.32rem;
    > button {
      width: 6.86rem;
      height: 0.96rem;
      border-radius: 0.03rem;
      border: 0.02rem solid rgba(50, 150, 250, 1);
      @include flexbox;
      @include justify-content(center);
      @include align-items(center);
      font-size: 0.34rem;
      color: rgba(50, 150, 250, 1);
      background: rgba(50, 150, 250, 1);
      color: rgba(255, 255, 255, 1);
    }
    > button.disable-btn {
      background: rgb(231, 231, 231);
      border-color: rgb(231, 231, 231);
      color: rgb(164, 164, 164);
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
}
</style>