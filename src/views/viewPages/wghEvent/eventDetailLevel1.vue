<template>
  <div class="content" id="eventDetailLevel1">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">
      {{moduleName}}
      <div class="right-header" slot="right" @click="toContent">事件内容</div>
    </header-bar>
    <div class="main-content">
      <div :class="['list',item.class]" v-for="(item,index) in dataList" :key="index">
        <span>{{item.label}}</span>
        <div v-if="item.type==='text'" class="right">{{detailData[item.key]}}</div>
        <div v-if="item.type==='textarea'" class="textarea">
          <textarea
            v-model="detailData[item.key]"
            rows="4"
            :placeholder="detailData[item.placeholder]"
            :readonly="!editState"
          />
        </div>
        <div class="right" v-if="item.type==='switch'">
          <aep-switch v-if="!editState" v-model="detailData[item.key]"></aep-switch>
          <mt-switch v-if="editState" v-model="detailData[item.key]"></mt-switch>
        </div>
        <div class="right" v-if="item.type==='btn'">
          <button class="add-btn" v-if="editState" @click="toTask">
            <span class="btn-img"></span>
            <span>添加任务</span>
          </button>
        </div>
        <div class="right" v-if="item.type==='contract'">
          <span>{{detailData[item.key]}}</span>
          <span class="msg"></span>
          <span class="phone"></span>
        </div>
        <div class="right" v-if="item.type==='rightArrow'">
          <span>{{detailData[item.key]}}</span>
          <span class="right-icon">
            <icon name="right" scale="1"></icon>
          </span>
        </div>
        <div v-if="item.type==='btn'&&detailData['tasks']">
          <div class="child-list" v-for="(it,idx) in detailData['tasks']" :key="idx">
            <div class="left">
              <p>{{it.name}}</p>
              <p>{{it.name}}</p>
            </div>
            <div class="right" @click="toTaskDetail(it)">
              <icon name="right" scale="1"></icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <button @click="toNextGrid" :class="followupLeve2?'':'disable-btn1'">多级处理信息</button>
      <button :class="editState?'':'disable-btn'" @click="save">确定</button>
    </div>
  </div>
</template>

<script>
import { Switch, Toast } from "mint-ui";
import moment from "moment";
export default {
  name: "EventDetailLevel1",
  components: {
    "mt-switch": Switch
  },
  data() {
    return {
      moduleName: "处理事件",
      isShowBorder: true,
      routerId: "",
      editState: true,
      dataList: [
        {
          label: "标题",
          key: "incidentTitle",
          type: "text"
        },
        {
          label: "时间",
          key: "date",
          type: "text"
        },
        { label: "审核人", key: "staffName", type: "text", value: "" },
        {
          label: "备注",
          key: "remarks",
          type: "textarea",
          placeholder: "请在此输入备注",
          class: "top-margin"
        },
        {
          label: "事件处理完毕",
          key: "results",
          type: "switch",
          class: "top-margin"
        },
        {
          label: "分派任务",
          key: "followup",
          type: "btn",
          class: "top-margin"
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
      followupLeve2: false,
      incidentId: ""
    };
  },
  computed: {
    isAddTaskState() {
      return this.$store.state.isAddTaskState;
    }
  },
  watch: {
    isAddTaskState() {
      this.getIncidentFollowupDetail();
    }
  },
  created() {
    this.routerId = this.$route.params.id;
    this.getFollowup();
    this.getIncidentFollowupDetail();
  },
  methods: {
    getFollowup() {
      this.followup = JSON.parse(JSON.stringify(this.$store.state.followup));
      this.followup.forEach(followupItem => {
        if (followupItem.level == 2) {
          //有2级followup
          this.followupLeve2 = true;
        }
      });
    },
    getIncidentFollowupDetail() {
      const payload = {
        id: this.routerId
      };
      this.$api.getIncidentFollowupDetail(payload).then(res => {
        if (res) {
          let tempObj = res;
          this.incidentId = res.incident;
          tempObj.date = moment(res.date).format("YYYY-MM-DD HH:mm");
          if (res.tasks && Array.isArray(res.tasks) && res.tasks.length) {
            tempObj.tasks = res.tasks;
            let tasksItem = this.dataList[5];
            tasksItem.label = `${tasksItem.label}（${tempObj.tasks.length}）`;
          }
          this.detailData = tempObj;
          this.staffId = res.staff;
          this.getUserByid();
          this.getIncidentDetail();
        }
      });
    },
    getIncidentDetail() {
      const payload = {
        id: this.incidentId
      };
      this.$api.getIncidentDetail(payload).then(res => {
        if (res) {
          if (res.state === 3 || res.state === 4) {
            //已完成或虚假时不可编辑，页面底部的确定按钮用来更新followup
            this.editState = false;
          }
          if (res.state === 3) {
            //事件处理完毕
            this.detailData.results = true;
          } else {
            this.detailData.results = false;
          }
        }
      });
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
    toContent() {
      this.$router.push(`/eventContent/${this.detailData.incident}`);
    },
    toNextGrid() {
      if (this.followupLeve2) {
        this.followup.forEach(followupItem => {
          if (followupItem.level === 2) {
            this.$router.push(`/eventDetail/${followupItem.id}`);
          }
        });
      }
    },
    save() {
      this.detailData.rowState = "upd";
      if (this.detailData.results) {
        //事件处理完毕，需要把事件状态变成完成
        const payload = {
          id: this.detailData.incident
        };
        Promise.all([
          this.$api.complateEvent(payload),
          this.$api.updateincidentfollowup(this.detailData)
        ])
          .then(resx => {
            if (resx[0] && resx[0] === "OK" && resx[1] && resx[1] === "OK") {
              this.tips("提交成功", "iconfont icon-success");
              this.$router.push("/eventList/1");
            } else {
              this.tips("提交失败", "iconfont icon-error");
            }
          })
          .catch(e => {
            this.tips(e, "iconfont icon-error");
          });
      } else {
        this.$api
          .updateincidentfollowup(this.detailData)
          .then(res => {
            if (res === "OK") {
              this.tips("提交成功", "iconfont icon-success");
            } else {
              this.tips(res, "iconfont icon-error");
            }
          })
          .catch(e => {
            this.tips(e, "iconfont icon-error");
          });
      }
    },
    toTask() {
      this.$store.commit("set_toTaskEvent", this.detailData.id);
      this.$store.commit("set_toTaskEventTitle", this.detailData.incidentTitle);
      this.$router.push("/putTask/1");
    },
    toTaskDetail(it) {
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
      width: calc(100% - 4.8rem);
      color: rgba(48, 48, 48, 1);
      font-size: 0.34rem;
      vertical-align: middle;
    }
    > div.right {
      float: right;
      width: 4.8rem;
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
      border-radius: 0.03rem;
      border: 0.02rem solid rgba(50, 150, 250, 1);
      color: rgba(50, 150, 250, 1);
      font-size: 0.3rem;
      @include flexbox;
      @include align-items(center);
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
    .msg {
      display: inline-block;
      width: 0.32rem;
      height: 0.31rem;
      background: url("../../../assets/images/message.png") no-repeat left
        center;
      background-size: 0.32rem 0.31rem;
      margin: 0 0.32rem;
    }
    .phone {
      display: inline-block;
      width: 0.32rem;
      height: 0.31rem;
      background: url("../../../assets/images/phone.png") no-repeat left center;
      background-size: 0.32rem 0.31rem;
      margin-right: 0.16rem;
    }
    .right-icon {
      display: inline-block;
      margin-left: 0.16rem;
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
      width: 3.28rem;
      height: 0.96rem;
      border-radius: 0.03rem;
      border: 0.02rem solid rgba(50, 150, 250, 1);
      @include flexbox;
      @include justify-content(center);
      @include align-items(center);
      font-size: 0.34rem;
      color: rgba(50, 150, 250, 1);
    }
    > button:nth-child(2) {
      background: rgba(50, 150, 250, 1);
      color: rgba(255, 255, 255, 1);
    }
    > button.disable-btn1 {
      border-color: rgb(231, 231, 231);
      color: rgb(164, 164, 164);
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