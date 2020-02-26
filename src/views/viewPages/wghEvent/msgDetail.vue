<template>
  <div class="content" id="msgDetail">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div class="main-content">
      <div :class="['list',item.class]" v-for="(item,index) in dataList" :key="index">
        <span>{{item.label}}</span>
        <div v-if="item.type==='text'" class="right">
          <input
            type="text"
            v-model="item.value"
            :readonly="!editState"
            :placeholder="item.placeholder"
          />
        </div>
        <div v-if="item.type==='textarea'" class="textarea">
          <textarea
            v-model="item.value"
            rows="4"
            :placeholder="item.placeholder"
            :readonly="!editState"
          />
        </div>
        <div class="child-list" v-if="item.type==='attachments'">
          <div v-for="(it,idx) in item.items" :key="idx">
            <div class="left">
              <span class="icon"></span>
              <span>{{it.title}}</span>
            </div>
            <div class="right" @click="download(it)">
              <span>下载</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "MsgDetail",
  data() {
    return {
      isShowBorder: false,
      moduleName: "下发信息",
      editState: false,
      routeId: "",
      dataList: [
        {
          label: "类型",
          key: "type",
          type: "text",
          value: "政策法规"
        },
        {
          label: "日期",
          key: "date",
          type: "text",
          value: ""
        },
        {
          label: "下发人",
          key: "user",
          type: "text",
          value: ""
        },
        {
          label: "信息内容",
          key: "contents",
          type: "textarea",
          value: "",
          class: "top-margin"
        },
        {
          label: "附件",
          key: "attachments",
          type: "attachments",
          value: "",
          class: "top-margin",
          items: [
            // {
            //   title: "文件名称1",
            //   id: "file1"
            // }
          ]
        }
      ],
      typeList: [{ value: 1, name: "政策法规" }, { value: 2, name: "通知" }],
      modid: "C105368C-7AF6-49C8-AED3-6A0C7A9E3F7B", //360模块id
      staff: ""
    };
  },
  created() {
    this.routeId = this.$route.params.id;
    this.getDetail();
  },
  methods: {
    getDetail() {
      const payload = {
        id: this.routeId
      };
      this.$api.getMsgDetail(payload).then(res => {
        if (res) {
          this.staff = res.staff;
          Object.keys(res).forEach(resKey => {
            this.dataList.forEach(item => {
              if (item.key === resKey) {
                if (resKey === "date") {
                  item.value = moment(res[resKey]).format("YYYY-MM-DD");
                } else if (resKey === "type") {
                  this.typeList.forEach(tItem => {
                    if (tItem.value === res[resKey]) {
                      item.value = tItem.name;
                    }
                  });
                } else if (resKey === "attachments") {
                  item.items = res[resKey];
                } else if (resKey === "contents") {
                  item.items = res[resKey]
                    .replace("<p>", "")
                    .replace("</p>", "")
                    .replace("<br>", "");
                } else {
                  item.value = res[resKey];
                }
              }
            });
          });
          this.getUserRole();
        }
      });
    },
    getUserRole() {
      const payload = {
        items: [this.staff]
      };
      this.$api.getUserRole(payload).then(res => {
        if (Array.isArray(res) && res.length === 1) {
          const tempObj = this.dataList[2];
          tempObj.value = res[0].username;
          this.$set(this.dataList, 2, tempObj);
        }
      });
    },
    download(item) {
      let a = document.createElement("a");
      a.href = `/ent${item.url}`;
      a.download = item.title;
      a.click();
    }
  }
};
</script>

<style lang="scss">
#msgDetail {
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
      text-align: right;
      font-size: 0.3rem;
      @include flexbox;
      @include justify-content(flex-end);
      @include align-items(center);
      input {
        width: 100%;
        border: 0;
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        text-align: right;
        resize: none;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      input::placeholder {
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
    }
    > div.textarea {
      width: 100%;
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
    > div.child-list {
      div {
        width: 100%;
        height: 0.7rem;
        background: rgba(255, 255, 255, 1);
        @include flexbox;
        @include flex-direction(row);
        @include align-items(center);
        padding: 0.1rem 0.1rem;
        .left {
          @include flex(5);
          color: rgba(48, 48, 48, 1);
          font-size: 0.3rem;
          > span:nth-child(1) {
            display: inline-block;
            width: 0.29rem;
            height: 0.28rem;
            background: url("../../../assets/images/attachment.png") no-repeat
              left center;
            background-size: 0.29rem 0.28rem;
            margin-right: 0.11rem;
          }
        }
        .right {
          @include flex(1);
          > span {
            display: inline-block;
            width: 100%;
            color: rgba(50, 150, 250, 1);
            font-size: 0.3rem;
            text-align: right;
          }
        }
      }
    }
  }
  .top-margin {
    margin-top: 0.4rem;
    border-top: 0;
  }
}
</style>