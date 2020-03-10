<template>
  <div class="content" id="eventDetail">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">
      {{moduleName}}
      <div class="right-header" slot="right" @click="toContent">事件内容</div>
    </header-bar>
    <div class="main-content" v-if="detailData">
      <div v-for="(item,index) in dataList" :key="index">
        <div :class="['list',item.class]">
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
            <button class="add-btn">
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
              <div class="left test123">
                <p>{{it.title}}</p>
                <p>{{it.content}}</p>
              </div>
              <div class="right">
                <icon name="right" scale="1"></icon>
              </div>
            </div>
          </div>
          <div v-if="item.type==='rightArrow'&&detailData['tasks']">
            <div class="child-list" v-for="(it,idx) in item.items" :key="idx">
              <div class="left test123">
                <p>{{it.title}}</p>
              </div>
              <div class="right" v-if="it.type==='contractItem'">
                <span>{{it.content}}</span>
                <span class="phone" @click="toPhone('tel')"></span>
              </div>
              <div class="right" v-if="it.type==='textItem'">
                <span>{{it.content}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="['footer', editState?'':'hidden-footer']">
      <button @click="save">确定</button>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" @change="handleTreat" valueKey="valueKey" ref="mtPicker"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { Switch, Toast, Popup, Picker } from "mint-ui";
import moment from "moment";
export default {
  name: "EventDetail",
  components: {
    "mt-switch": Switch,
    "mt-popup": Popup,
    "mt-picker": Picker
  },
  data() {
    return {
      moduleName: "处理事件",
      isShowBorder: false,
      routerId: "",
      dataList: [
        //2级处理事件列表
        {
          label: "标题",
          key: "incidentTitle",
          type: "text"
        },
        {
          label: "网格/部门",
          key: "gridName",
          type: "text"
        },
        {
          label: "时间",
          key: "date",
          type: "text"
        },
        { label: "审核人", key: "staffName", type: "contract" },
        {
          label: "事件属实",
          key: "truth",
          type: "switch",
          class: "top-margin"
        },
        {
          label: "备注",
          key: "remarks",
          type: "textarea",
          class: "top-margin"
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
      staff: "",
      followupId: "",
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
        { valueKey: "上报上级处理", value: "toUpHandle" }
      ],
      slotsValueL3: [{ valueKey: "上报上级处理", value: "toUpHandle" }],
      firstSelect: true,
      toSelect: false,
      followup: {},
      detailData: {},
      incidentId: "",
      editState: false,
      hasLevel1Followup:false
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
    detailData: {
      handler(newValue, oldValue) {
        if (!newValue.truth) {
          this.dataList.splice(5, 1);
        } else {
          if (
            this.dataList.length === 5 ||
            (this.dataList.length === 6 && this.dataList[5].key !== "treat")
          ) {
            this.dataList.splice(5, 0, this.treatItem);
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    gridLevel() {
      return this.$store.state.gridLevel;
    }
  },
  created() {
    this.routerId = this.$route.params.id;
    this.getIncidentFollowupDetail();
  },
  methods: {
    getIncidentFollowupDetail() {
      const payload = {
        id: this.routerId
      };
      this.$api.getIncidentFollowupDetail(payload).then(res => {
        if (res) {
          this.incidentId = res.incident;
          this.handleDetailData(res);
          if (res.state === 1) {
            this.detailData.treat = "上报上级处理";
          } else if (res.state === 2) {
            this.detailData.treat = "下发责令整改任务";
          }
          this.staffId = res.staff;
          this.getIncidentDetail();
          this.getUserByid();
        } else {
          this.incidentId = this.routerId;
          this.getIncidentDetail();
        }
      });
    },
    getIncidentDetail() {
      const payload = {
        id: this.incidentId
      };
      this.$api.getIncidentDetail(payload).then(res => {
        if (res && res.gridName) {
          if (res.state !== 3 && res.state !== 4) {
            // const gridLevel = res.gridLevel || res.level;
            if (this.gridLevel === 1) {
              this.slots[0].values = this.slotsValueL1;
            } else if (this.gridLevel === 2) {
              this.slots[0].values = this.slotsValueL2;
            } else if (this.gridLevel === 3) {
              this.slots[0].values = this.slotsValueL3;
            }
          }
          if (this.incidentId === this.routerId) {
            this.handleDetailData(res);
            this.detailData.incidentTitle = res.title;

            this.detailData.rowState = "add";
            this.detailData.incident = this.detailData.id;
            this.detailData.id = this.createGuid();
            this.staffId = res.staff;
            this.getUserByid();
          }
          this.$set(this.detailData, "gridName", res.gridName);
          if(res.followup){
            res.followup.forEach(item => {
              if(item.level === 1){
                this.hasLevel1Followup = true
                this.editState = false
              }
            })
          }
        }
      });
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
        res.truth = true;
      } else {
        res.truth = false;
      }
      this.detailData = res;
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
      this.$router.push(`/eventContent/${this.incidentId}`);
    },
    async toPhone(type) {
      if (this.detailData.telephone) {
        await window.dingtalk.showCallMenu({
          phoneNumber: this.detailData.telephone, // 期望拨打的电话号码
          code: "+86", // 国家代号，中国是+86
          showDingCall: true, // 是否显示钉钉电话
          success: function(res) {},
          fail: function(err) {}
        });
      } else {
        this.tips("未获取到审核人手机号码", "iconfont icon-error");
      }
    },
    save() {
      if (this.detailData.state === 3) {
        //已处理
        this.tips("事件已完成", "iconfont icon-success");
      } else {
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
            remarks: this.detailData.remarks
          };
        }
        this.$api.updateincidentfollowup(payload).then(res => {
          if (res === "OK") {
            this.tips("提交成功", "iconfont icon-success");
            if (this.gridLevel === 1) {
              this.$router.replace(`/eventDetailLevel1/${payload.id}`);
            } else if (this.gridLevel === 2) {
              this.$router.replace(`/eventDetail/${payload.id}`);
            }
          } else {
            this.tips(res, "iconfont icon-error");
          }
        });
      }
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
          } else if (key === "toUpHandle") {
            value = "上报上级处理";
            this.detailData.state = 1;
          }
          this.$set(this.detailData, "treat", value);
        }
      } else {
        return;
      }
    },
    createGuid() {
      return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
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