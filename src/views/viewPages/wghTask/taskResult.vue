<template>
  <div id="taskResult">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
    >{{ moduleName }}</header-bar>
    <div :class="[!id ? 'main-content-with-bottom' :'main-content']" v-if="data">
      <div class="box-item" v-if="id">
        <span class="item-title">时间</span>
        <p class="checkbox2">{{ data.date1 }}</p>
      </div>
      <div class="box-item" v-if="id">
        <span class="item-title">网格/部门</span>
        <p class="checkbox2">
          {{ data.parentName
          }}
          <span v-if="data.parentName && data.gridName">-</span>
          {{ data.gridName }}
        </p>
      </div>
      <div class="box-item" v-if="id">
        <span class="item-title">执行人</span>
        <p class="checkbox2">{{ staffName }}</p>
      </div>
      <div class="box-item" @click="popupType = true">
        <span class="item-title">相关企业</span>
        <p class="checkbox">{{ enterName }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">是否违法</span>
        <p class="right">
          <mt-switch v-model="illegal"></mt-switch>
        </p>
      </div>
      <div class="box-item" @click="popupText = true">
        <span class="item-title">相关表单</span>
        <p class="checkbox2">{{ templateName }}</p>
      </div>
      <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">图片</span>
        <img class="pic-box" src="@/assets/images/pic.png" @click="addPic" />
        <upload-box
          ref="upload"
          :data="imgData"
          :autoShow="false"
          @upload="uploadData"
          @deleteItem="deleteItem"
          :showDelete="deleteState"
          @clickimg="openImg"
          :initt="initt"
        ></upload-box>
      </div>
      <p class="gang"></p>
      <!-- 自贡填写的表单内容会覆盖详细描述，该项不显示 -->
      <div class="box-item">
        <div class="model-header">
          <span class="item-title">详细描述</span>
          <button class="form-button" @click="toFormPage" v-if="taskState==='add'">填写表单</button>
        </div>
        <div class="model-content" v-html="taskFormData.contents"></div>
      </div>
    </div>
    <div class="add-btn" v-if="!id">
      <button @click="submit">确定</button>
    </div>
    <mt-popup v-if="!id" position="bottom" v-model="popupType" class="popup-box">
      <mt-picker :slots="slots" valueKey="name" @change="onValuesChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import moment from "moment";
import uploadBox from "@/components/uploadBox";
import { Switch, Popup, Picker, Toast } from "mint-ui";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
import cookie from "js-cookie";
import store from "store";
export default {
  name: "taskResult",
  components: {
    uploadBox,
    "mt-switch": Switch,
    "mt-popup": Popup,
    "mt-picker": Picker
  },
  data() {
    return {
      moduleName: "",
      searchKey: "",
      isShowSearchIcon: false,
      isShowBorder: true,
      id: "",
      contentText: "",
      imgData: [],
      popupType: false,
      // initt: 'dingding',
      initt: null,
      data: {
        task: "",
        date1: moment().format("YYYY-MM-DD HH:00:00"),
        rowState: "add",
        staff: "",
        enterprise: "",
        forassignment: "",
        parentName: "",
        gridName: ""
      },
      staffName: "",
      enterName: "",
      tableName: "",
      illegal: false,
      task: "",
      popupText: false,
      textName: "123",
      textlist: []
    };
  },
  computed: {
    deleteState() {
      return !this.id;
    },
    taskEnter() {
      return this.$store.state.taskEnter;
    },
    templateName() {
      return this.$store.state.taskParams.templateName;
    },
    template() {
      return this.$store.state.taskParams.template;
    },
    userAssInfoList() {
      return this.$store.state.userAssInfoList;
    },
    slots() {
      let temp = [
        {
          id: "",
          name: "《和企业/污染源无关》"
        },
        ...this.taskEnter
      ];
      return [
        {
          values: temp,
          className: "slottypes",
          textAlign: "center"
        }
      ];
    },
    taskFormData() {
      return this.$store.state.taskFormData;
    },
    taskState() {
      return store.get("taskState");
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.task = this.$route.params.id;
    // this.getTextlist()
    if (this.taskState == "detail") {
      this.moduleName = "任务执行结果";
      this.getData();
      this.getUser();
    } else if (this.taskState == "add") {
      this.moduleName = "任务执行记录";
      this.data.task = this.id.split("X-")[1];
      this.id = "";
      this.getUser();
      this.getModelDetail();
    }
  },
  methods: {
    getModelDetail() {
      this.$api.GetTemplateDetail({ id: this.template }).then(res => {
        if (res) {
          const obj = {
            id: res.id,
            contents: res.contents,
            replycontents: res.replycontents
          };
          this.$store.commit("set_taskFormData", obj);
        }
      });
    },
    submit() {
      let params = JSON.parse(JSON.stringify(this.data));
      let atts = [];
      this.imgData.forEach(img => {
        atts.push({
          id: img.id,
          rowState: "add"
        });
      });
      params.id = this.$uuid();
      params.task = this.task;
      params.results = this.contentText;
      params.attachments = atts;
      params.isillegal = this.illegal;
      params.forassignment = this.data.forassignment;
      params.enterprise = null;
      params.date = moment(params.date1).format("YYYY-MM-DD HH:mm:ss");
      if (
        this.taskFormData &&
        this.taskFormData.id &&
        this.taskFormData.id === this.template
      ) {
        params.results = this.taskFormData.contents;
      } else {
        params.results = this.contentText;
      }
      this.$api.updatetaskhandle(params).then(res => {
        this.$store.state.isNewTaskHandelChange = Math.random();
        this.$router.go(-1);
      });
    },
    onValuesChange(e) {
      if (e.values.length) {
        this.data.enterprise = e.values[0].id;
        this.enterName = e.values[0].name;
      }
      if (!this.data.enterprise) {
        delete this.data.enterprise;
        this.enterName = "《和企业/污染源无关》";
      }
    },
    getData() {
      this.$api
        .getTaskHandleDetail({
          id: this.id
        })
        .then(res => {
          if (res) {
            res.date1 = moment(res.date).format("YYYY-MM-DD");
            this.data = res;
            res.attachments.forEach(item => {
              if (
                item.url.includes("Content") &&
                !item.url.includes(this.$360url)
              ) {
                item.url = this.$360url + item.url;
                this.imgData.push(item);
              }
            });
            if (res.results.includes("<!DOCTYPE")) {
              const obj = {
                contents: res.results
              };
              this.$store.commit("set_taskFormData", obj);
            } else {
              this.contentText = res.results;
            }
            this.illegal = res.isillegal;
            this.getUserName(res.staff);
          }
        });
    },
    async uploadData(e) {
      if (this.initt === "dingding") {
        let imgarr = [];
        for (let i = 0; i < e.length; i++) {
          let x = await window.dingtalk.uploadFile({
            url: "https://zsxt.azuratech.com:8002/api/GBM/UploadAttachment",
            filePath: e[i],
            fileName: "image",
            fileType: "image",
            header: {
              "Content-Type": "multipart/form",
              Authorization: `Bearer ${cookie.get("AzuraCookie")}`
            }
          });
          if (x.data && x.data.includes("id")) {
            let img = JSON.parse(x.data);
            imgarr.push(img[0]);
          }
        }
        imgarr.forEach(item => {
          if (
            item.url.includes("Content") &&
            !item.url.includes(this.$360url)
          ) {
            item.url = this.$360url + item.url;
          }
        });
        this.imgData.push(...imgarr);
      } else {
        let data = new FormData();
        for (let i = 0; i < e.length; i++) {
          data.append("file" + i, e[i]);
        }
        this.$api.uploadAttachment(data).then(res => {
          res.forEach(item => {
            if (
              item.url.includes("Content") &&
              !item.url.includes(this.$360url)
            ) {
              item.url = this.$360url + item.url;
            }
          });
          this.imgData.push(...res);
        });
      }
    },
    deleteItem(e) {
      this.imgData.forEach((item, index) => {
        if (item.url === e.url) {
          this.imgData.splice(index, 1);
        }
      });
    },
    addPic() {
      this.$refs.upload.addItem();
    },
    getUserName(id) {
      this.$api
        .getUserByArrUserID({
          items: [id]
        })
        .then(res => {
          this.staffName = res[0].username;
        });
    },
    getUser() {
      this.$api.getUser().then(res => {
        if (res) {
          this.data.staff = res.id;
          this.staffName = res.username;
          this.getStaffInfo(res.id);
        }
      });
    },
    getStaffInfo(id) {
      this.$api
        .getStaffInfo({
          id
        })
        .then(res => {
          if (res) {
            this.data.parentName = res.parentGridName;
            this.data.gridName = res.gridName;
            this.userAssInfoList.forEach(item => {
              if (item.staff === res.id) {
                this.data.forassignment = item.id;
              }
            });
          }
        });
    },
    openImg(index) {
      let imgs = [];
      this.imgData.forEach(item => {
        imgs.push(item.url);
      });
      console.log(ImagePreview);
      ImagePreview({
        images: imgs,
        startPosition: index,
        closeable: true
      });
    },
    toFormPage() {
      this.$router.push(`/templateForm/${this.template}`);
    }
  }
};
</script>

<style lang="scss">
#taskResult {
  height: 100%;

  .popup-box {
    width: 100%;

    .slottypes {
      width: 100%;
    }
  }

  .add-btn {
    background: #fff;
    border-top: 1px solid #e0e0e0;
    width: 100%;
    height: 1.32rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;

    button {
      border: 0;
      margin: 0.16rem auto;
      display: block;
      width: 6.86rem;
      height: 0.96rem;
      color: #fff;
      border-radius: 0.04rem;
      font-size: 0.34rem;
      background: #3296fa;
    }
  }

  .remark-box {
    font-size: 0.3rem;
    line-height: 0.44rem;
    margin-bottom: 0.5rem;
    color: #9e9e9e;
  }

  .pic-box {
    height: 0.31rem;
    float: right;
    margin-top: 0.4rem;
  }

  p {
    padding: 0;
    margin: 0;
  }

  .gang {
    background: #f8f8f8;
    height: 0.4rem;
  }

  .mint-tab-item-label {
    font-size: 0.3rem;
  }

  .box-item {
    min-height: 1.12rem;
    font-size: 0.34rem;
    line-height: 1.12rem;
    padding: 0 0.32rem;
    border-bottom: 1px solid #e0e0e0;
    background: #fff;
    overflow: hidden;

    .item-title {
      color: #333;
    }

    input {
      width: 5rem;
      float: right;
      height: 1.12rem;
      border: 0;
      text-align: right;
      font-size: 0.3rem;
      color: #9e9e9e;
    }

    .input-unit {
      float: right;
      font-size: 0.3rem;
      color: #9e9e9e;
      margin-left: 0.1rem;
    }

    textarea {
      border: 0;
      display: block;
      margin-bottom: 0.3rem;
      color: #9e9e9e;
      font-size: 0.3rem;
      line-height: 0.4rem;
      width: 100%;
    }

    .checkbox {
      float: right;
      padding-right: 0.52rem;
      text-align: right;
      font-size: 0.3rem;
      color: #9e9e9e;
      background: url("../../../assets/images/right.png") no-repeat right center;
      background-size: auto 0.32rem;
    }

    .checkbox2 {
      float: right;
      text-align: right;
      font-size: 0.3rem;
      color: #9e9e9e;
    }

    .addbox {
      float: right;
      font-size: 0.3rem;
      line-height: 0.74rem;
      padding: 0 0.36rem 0 0.84rem;
      color: #3296fa;
      border: 0.02rem solid #3296fa;
      position: relative;
      margin-top: 0.2rem;

      &::before {
        content: "+";
        border: 0.02rem solid #3296fa;
        border-radius: 50%;
        line-height: 0.3rem;
        width: 0.3rem;
        text-align: center;
        font-size: 0.26rem;
        position: absolute;
        left: 0.37rem;
        height: 0.3rem;
        top: 0;
        bottom: 0;
        margin: auto;
        color: #3296fa;
      }
    }

    .item-ul {
      margin-bottom: 0.4rem;

      li {
        background: #f8f8f8;
        font-size: 0.3rem;
        line-height: 1rem;
        padding-left: 0.2rem;
        margin-bottom: 0.16rem;
        position: relative;

        i.delete {
          &::before {
            content: "-";
            border: 0.02rem solid #3296fa;
            border-radius: 50%;
            line-height: 0.3rem;
            width: 0.3rem;
            text-align: center;
            font-size: 0.26rem;
            position: absolute;
            right: 0.4rem;
            height: 0.3rem;
            top: 0;
            bottom: 0;
            margin: auto;
            color: #3296fa;
          }
        }

        i.jump {
          background: #f8f8f8 url("../../../assets/images/right.png") no-repeat
            right center;
          background-size: auto 0.32rem;
          right: 0.4rem;
          position: absolute;
          display: block;
          height: 0.32rem;
          width: 0.32rem;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }

    .item-ul2 {
      li {
        line-height: 0.4rem;
        padding-left: 0.2rem;
        margin-bottom: 0.16rem;
        padding-top: 0.1rem;

        span {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }

        p {
          color: #bdbdbd;
          font-size: 0.26rem;
          line-height: 0.5rem;
        }
      }
    }

    .form-button {
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      color: rgba(255, 255, 255, 1);
    }
  }
  .box-item:last-child {
    border-bottom: 0;
  }

  .model-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .model-content {
    padding: 0.1rem 0.32rem;
    margin-bottom: 0.4rem;
    background-color: #fff;
    overflow-x: auto;
    table caption:nth-child(1) {
      text-align: left;
      font-size: 0.34rem;
      padding-bottom: 0.08rem;
    }
    tbody {
      font-size: 0.3rem !important;
    }
  }

  .top-margin {
    margin-top: 0.4rem;
    border-top: 0;
  }

  .right {
    float: right;
    width: 2.5rem;
    height: 1.1rem;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    align-items: center;
    display: flex;
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

  .img {
    display: inline-block;
    width: 0.37rem;
    height: 0.31rem;
    background: url("../../../assets/images/image.png") no-repeat left center;
    background-size: 0.37rem 0.31rem;
    margin-right: 0.16rem;
  }
}
</style>