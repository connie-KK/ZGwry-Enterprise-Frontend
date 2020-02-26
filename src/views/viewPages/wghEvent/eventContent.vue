<template>
  <div class="content" id="eventContent">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div :class="['main-content', editState? '':'main-content1']">
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
        <div v-if="item.type==='textMore'" class="right">
          <textarea
            type="text"
            v-model="item.value"
            :readonly="!editState"
            :placeholder="item.placeholder"
          ></textarea>
        </div>
        <div class="right" v-if="item.type==='switch'">
          <mt-switch v-model="item.value"></mt-switch>
        </div>
        <div v-if="item.type==='textarea'" class="textarea">
          <textarea
            v-model="item.value"
            rows="4"
            :placeholder="item.placeholder"
            :readonly="!editState"
          />
        </div>
        <div class="right" v-if="item.type==='rightArrow'" @click="toPages(index)">
          <span>{{item.value}}</span>
          <span class="right-icon">
            <icon name="right" scale="1"></icon>
          </span>
        </div>
        <div class="right" v-if="item.type==='img'">
          <span class="img" @click="toImg"></span>
        </div>
        <div class="img-list" v-if="item.type==='img'&&item.value.length">
          <div v-for="(imgItem,idx) in item.value" :key="idx">
            <div class="imgBox">
              <img :src="imgBaseUrl+imgItem.id" :alt="imgItem.name" @click="previewImg(idx)" />
            </div>
            <div v-if="editState" class="icon" @click="deleteImg(imgItem)"></div>
          </div>
        </div>
        <div class="child-list" v-if="item.type==='text'&&item.items">
          <div v-for="(it,idx) in item.items" :key="idx">
            <div class="left">{{it.title}}</div>
            <div class="right" @click="toTask(it)">
              <span>{{it.stateName}}</span>
              <span>
                <icon name="right" scale="1"></icon>
              </span>
            </div>
          </div>
        </div>
      </div>
      <input
        style="float: left;  display: none;"
        type="file"
        name="Filedata"
        id="uploadFile"
        accept="image/*"
        capture="camera"
        required="required"
        @change="readLocalFile()"
      />
    </div>
    <div class="footer" v-if="editState">
      <button @click="save">登记</button>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" @change="selectValue" valueKey="valueKey"></mt-picker>
    </mt-popup>
    <transition>
      <div v-if="isPreviewImg" class="img-prev-box">
        <mt-swipe
          :auto="0"
          :show-indicators="true"
          :speed="50"
          :continuous="false"
          :defaultIndex="selectedFileId"
          ref="mySwipe"
          @change="handleChange"
        >
          <mt-swipe-item v-for="item in imglist" :key="item.key">
            <img :src="imgBaseUrl+item.id" :alt="item.name" class="img-prev" />
          </mt-swipe-item>
        </mt-swipe>
        <span @click="closeImg" class="close-img"></span>
      </div>
    </transition>
  </div>
</template>

<script>
import moment from "moment";
import {
  Switch,
  Indicator,
  Actionsheet,
  Popup,
  Picker,
  Toast,
  Swipe,
  SwipeItem
} from "mint-ui";
import { join } from "path";
export default {
  name: "EventContent",
  components: {
    "mt-switch": Switch,
    "mt-actionsheet": Actionsheet,
    "mt-popup": Popup,
    "mt-picker": Picker,
    "mt-swipe": Swipe,
    "mt-swipe-item": SwipeItem
  },
  data() {
    return {
      editState: "",
      moduleName: "",
      isShowBorder: false,
      routeId: 0,
      sheetVisible: false,
      dataList1: [
        {
          label: "标题",
          key: "title",
          type: "text",
          value: ""
        },
        {
          label: "时间",
          key: "date",
          type: "text",
          value: "",
          class: "top-margin"
        },
        { label: "网格员", key: "role", type: "text", value: "" },
        {
          label: "地址",
          key: "addr",
          type: "text",
          value: ""
        },
        {
          label: "经纬度",
          key: "lat",
          type: "text",
          value: "",
          class: "top-margin"
        },
        {
          label: "相关企业",
          key: "enterprise",
          type: "text",
          value: ""
        },
        {
          label: "事件类型",
          key: "type",
          type: "text",
          value: ""
        },
        {
          label: "图片",
          key: "attaches",
          type: "img",
          value: []
        },
        {
          label: "详细描述",
          key: "contents",
          type: "textarea",
          value: ""
        },
        {
          label: "事件已自行处理",
          key: "results",
          type: "text",
          value: "",
          class: "top-margin"
        },
        {
          label: "相关任务",
          key: "followup",
          type: "text",
          value: "",
          class: "top-margin",
          items: [
            // {
            //   label: "在厂房周围检测水质在厂房周围检测水质在厂房周围检测水质",
            //   value: "已完成",
            //   type: "rightArrow"
            // }
          ]
        }
      ],
      newDataList: [
        {
          label: "标题",
          key: "title",
          type: "text",
          value: "",
          placeholder: "点击输入事件标题"
        },
        {
          label: "时间",
          key: "date",
          type: "text",
          value: moment().format("YYYY-MM-DD HH:mm:ss"),
          class: "top-margin"
        },
        {
          label: "网格员",
          key: "role",
          type: "text",
          value: "",
          placeholder: "请输入网格员"
        },
        {
          label: "地址",
          key: "addr",
          type: "textMore",
          value: ""
        },
        {
          label: "经纬度",
          key: "location",
          type: "rightArrow",
          value: "",
          class: "top-margin"
        },
        {
          label: "相关企业",
          key: "enterprise",
          type: "rightArrow",
          value: ""
        },
        {
          label: "事件类型",
          key: "type",
          type: "rightArrow",
          value: ""
        },
        {
          label: "图片",
          key: "imgList",
          type: "img",
          value: []
        },
        {
          label: "详细描述",
          key: "contents",
          type: "textarea",
          value: "",
          placeholder: "请输入事件详细情况"
        },
        {
          label: "事件已自行处理",
          key: "results",
          type: "switch",
          value: false,
          class: "top-margin"
        }
      ],
      dataList: [],
      latLng: [],
      userId: "",
      staffId: "",
      grid: "",
      popupVisible: false,
      slots: [],
      typeList: [
        {
          values: [],
          textAlign: "center",
          key: "type"
        }
      ],
      stateList: [
        { valueKey: "未发布", value: 0 },
        { valueKey: "待审核", value: 1 },
        { valueKey: "审核通过", value: 2 },
        { valueKey: "撤销", value: 3 },
        { valueKey: "执行中", value: 4 },
        { valueKey: "结果退回", value: 5 },
        { valueKey: "完成", value: 6 }
      ],
      enterPriseList: [],
      imglist: [],
      fileId: 0,
      isPreviewImg: false,
      selectedFileId: 0,
      entPageIndex: 0,
      imgBaseUrl: "/ent/Grid/GetImage/",
      moduleId360: ""
    };
  },
  watch: {
    enterPriseList: {
      handler() {
        let obj = this.dataList[5];
        if (Array.isArray(this.enterPriseList)) {
          this.enterPriseList.forEach(eItem => {
            if (eItem.id == obj.value) {
              obj.value = eItem.name;
            }
          });
        }
        this.$set(this.dataList, 5, obj);
      },
      deep: true
    }
  },
  created() {
    this.routeChange();
    this.getEnterpriseList();
    this.getmodsList();
  },
  methods: {
    routeChange() {
      this.routeId = this.$route.params.id;
      if (this.routeId < 0) {
        this.editState = true;
        this.moduleName = "登记事件";
        let sotreDataList = JSON.parse(
          JSON.stringify(this.$store.state.newDatalist)
        );
        if (sotreDataList.length) {
          this.dataList = sotreDataList;
        } else {
          this.dataList = this.newDataList;
        }

        this.$map.loadScript().then(AMap => {
          this.getLocation();
        });
        this.getSelectedEnteprise();
        this.getUserId();
      } else {
        this.editState = false;
        this.moduleName = "事件内容";
        this.dataList = this.dataList1;
        this.getIncidentDetail();
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
        if (res && res.incidentType && Array.isArray(res.incidentType)) {
          let tempArr = [];
          res.incidentType.forEach(item => {
            tempArr.push({ valueKey: item.name, value: item.type });
          });
          this.$set(this.typeList[0], "values", tempArr);
          const tempObj = this.dataList[6];
          tempArr.forEach(typeItem => {
            if (tempObj.value == typeItem.value) {
              tempObj.value = typeItem.valueKey;
            }
          });
          this.$set(this.dataList, 6, tempObj);
        }
      });
    },
    getSelectedEnteprise() {
      const tempObj = JSON.parse(
        JSON.stringify(this.$store.state.selectedEnterprise)
      );
      if (tempObj.value && tempObj.valueKey) {
        let obj = this.dataList[5];
        obj.value = tempObj.value;
        obj.valueKey = tempObj.valueKey;
        this.$set(this.dataList, 5, obj);
      }
    },
    getIncidentDetail() {
      const payload = {
        id: this.routeId
      };
      this.$api.getIncidentDetail(payload).then(res => {
        if (res) {
          Object.keys(res).forEach(resKey => {
            this.dataList.forEach(item => {
              if (resKey === item.key) {
                if (resKey === "results") {
                  item.value = res[resKey] === "True" ? "是" : "否";
                } else if (resKey === "date") {
                  item.value = moment(res[resKey]).format(
                    "YYYY-MM-DD HH:mm:ss"
                  );
                } else if (resKey === "lat") {
                  const lng = res.lng.toFixed(6);
                  const lat = res.lat.toFixed(6);
                  item.value = `${lng} E,${lat} N`;
                } else if (resKey === "attaches") {
                  this.imglist = res[resKey]
                  item.value = res[resKey];
                } else if (
                  resKey === "enterprise" &&
                  this.enterPriseList.length
                ) {
                  if (Array.isArray(this.enterPriseList)) {
                    this.enterPriseList.forEach(eItem => {
                      if (eItem.value == res[resKey]) {
                        item.value = eItem.valueKey;
                      }
                    });
                  } else {
                    item.value = res[resKey];
                  }
                }
                // else if (resKey === "type") {
                //   this.typeList[0].values.forEach(tItem => {
                //     if (tItem.value == res[resKey]) {
                //       item.value = tItem.valueKey;
                //     }
                //   });
                // }
                else if (resKey === "followup") {
                  if (
                    res[resKey] &&
                    Array.isArray(res[resKey]) &&
                    res[resKey].length
                  ) {
                    // const taskTemp = res[resKey][0].tasks;
                    // taskTemp.forEach(taskItem => {
                    //   this.stateList.forEach(stateItem => {
                    //     if (taskItem.state === stateItem.value) {
                    //       taskItem.stateName = stateItem.valueKey;
                    //     }
                    //   });
                    // });
                    let tasksList = [];
                    res[resKey].forEach(followupItem => {
                      followupItem.tasks.forEach(taskItem => {
                        this.stateList.forEach(stateItem => {
                          if (taskItem.state === stateItem.value) {
                            taskItem.stateName = stateItem.valueKey;
                          }
                        });
                        tasksList.push(taskItem);
                      });
                    });

                    item.items = tasksList;
                  }
                } else {
                  item.value = res[resKey];
                }
              }
            });
          });
          this.userId = res.staff;
          this.getStaffInfo();
        }
      });
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
          this.staffId = res.id;
          this.grid = res.grid;
          let tempObj = this.dataList[2];
          tempObj.value = res.name;
          this.$set(this.dataList, 2, tempObj);
        }
      });
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
        }
      });
    },
    toPages(index) {
      const data = this.dataList[index];
      if (data.key === "location") {
        this.$store.commit(
          "set_newDatalist",
          JSON.parse(JSON.stringify(this.dataList))
        );
        this.$router.push(`/eventMap/${this.routeId}`);
      } else if (data.key === "type") {
        this.slots = this.typeList;
        this.popupVisible = true;
      } else if (data.key === "enterprise") {
        this.$router.push("/enterpriseList");
      }
    },
    selectValue(picker) {
      const selectedVal = picker.getValues();
      if (selectedVal instanceof Array && selectedVal.length === 1) {
        let obj, index;
        if (this.slots[0].key === "type") {
          index = 6;
        }
        obj = this.dataList[index];
        obj.value = selectedVal[0].valueKey;
        obj.valueKey = selectedVal[0].value;
        this.$set(this.dataList, index, obj);
      }
    },
    save() {
      let id = this.createGuid();
      let payload = {
        id: id,
        rowState: "add",
        grid: this.grid,
        staff: this.staffId,
        state: 1 //未发布
      };
      this.dataList.forEach(item => {
        if (item.key === "location") {
          payload["lat"] = this.latLng[0];
          payload["lng"] = this.latLng[1];
        } else if (item.key === "imgList") {
          let tempArr = [];
          item.value.forEach(item => {
            let tempObj = {
              id: item.id,
              rowState: "add",
              lat: this.latLng[0],
              lng: this.latLng[1]
            };
            tempArr.push(tempObj);
          });
          payload["attachments"] = tempArr;
        } else if (item.type === "rightArrow") {
          payload[item.key] = item.valueKey;
        } else if (item.key === "role") {
        } else {
          payload[item.key] = item.value;
        }
      });
      this.$api.updateincident(payload).then(res => {
        if (res === "OK") {
          this.$router.push("/eventList");
        } else {
          Toast({
            message: res,
            iconClass: "iconfont icon-error",
            position: "top",
            duration: 3000
          });
        }
      });
    },
    toTask(it) {
      this.$router.push(`/putTask/${it.id}`);
    },
    getLocation() {
      this.latLng = JSON.parse(JSON.stringify(this.$store.state.eventLatLng));
      if (this.latLng.length) {
        this.getAddress();
      } else {
        this.getCurrentPosition();
      }
    },
    //通过IP获取详细地址
    getAddress() {
      const tempItem = this.dataList[4];
      tempItem.value = `${this.latLng[1]} E,${this.latLng[0]} N`;
      this.$set(this.dataList, 4, tempItem);

      let geocoder = new AMap.Geocoder();
      const lngLat = this.latLng.reverse();
      geocoder.getAddress(lngLat, (status, result) => {
        if (status === "complete" && result.regeocode) {
          const tempData = result.regeocode.addressComponent;
          const tempItem = this.dataList[3];
          tempItem.value = `${tempData.province}${tempData.city}${tempData.district}${tempData.township}${tempData.street}${tempData.streetNumber}`;
          this.$set(this.dataList, 3, tempItem);
        } else {
          console.error("根据经纬度查询地址失败");
        }
      });
    },
    //获取当前位置经纬度和地址
    getCurrentPosition() {
      AMap.plugin("AMap.Geolocation", () => {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000 //超过10秒后停止定位，默认：5s
        });
        geolocation.getCurrentPosition((status, result) => {
          if (status == "complete") {
            //解析定位结果
            if (result.addressComponent) {
              const tempData = result.addressComponent;
              const tempItem = this.dataList[3];
              tempItem.value = `${tempData.province}${tempData.city}${tempData.district}${tempData.township}${tempData.street}${tempData.streetNumber}`;
              this.$set(this.dataList, 3, tempItem);
            }
            if (result.position) {
              const tempItem = this.dataList[4];
              const location = `${result.position.lng} E,${result.position.lat} N`;
              tempItem.value = location;
              this.$set(this.dataList, 4, tempItem);
              this.latLng = [result.position.lat, result.position.lng];
              this.$store.commit(
                "set_eventLatLng",
                JSON.parse(JSON.stringify(this.latLng))
              );
            }
          } else {
            //解析定位错误信息
            console.error(result);
          }
        });
      });
    },
    toImg() {
      if (this.editState) {
        document.getElementById("uploadFile").click();
      } else {
        return;
      }
    },
    readLocalFile() {
      let localFile = document.getElementById("uploadFile");
      this.uploadImg(localFile);
    },
    uploadImg: function(e) {
      Indicator.open("上传中...");
      let formData = new window.FormData();
      let files = e.files;
      for (let x = 0; x < files.length; x++) {
        formData.append("files", files[x]);
      }
      this.$api
        .upload(formData)
        .then(res => {
          Indicator.close();
          if (Array.isArray(res)) {
            let obj = JSON.parse(JSON.stringify(this.dataList[7]));
            res.forEach(item => {
              obj.value.push({
                name: item.fname,
                url: item.id,
                id: item.id,
                key: this.fileId++
              });
            });
            this.$set(this.dataList, 7, obj);
            this.imglist = this.dataList[7].value;
          }
          // this.$nextTick(() => {
          //   this.$refs.footerBox.scrollTop = this.$refs.footerBox.scrollHeight;
          // });
        })
        .catch(err => {
          Indicator.close();
          Toast({
            message: err,
            iconClass: "iconfont icon-error",
            position: "top",
            duration: 2000
          });
        });
    },
    deleteImg(e) {
      let obj = JSON.parse(JSON.stringify(this.dataList[7]));
      obj.value = obj.value.filter(item => {
        return item.key !== e.key;
      });
      this.$set(this.dataList, 7, obj);
      this.imglist = this.dataList[7].value;
    },
    previewImg(idx) {
      this.selectedFileId = idx;
      this.isPreviewImg = true;
    },
    closeImg() {
      this.isPreviewImg = false;
    },
    handleChange(e) {
      this.selectedFileId = e;
    },
    createGuid() {
      return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/variables.scss";
#eventContent {
  .main-content {
    height: calc(100% - 2.6rem);
    overflow-y: scroll;
  }
  .main-content1 {
    height: calc(100% - #{$header-height});
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
      text-align: right;
      font-size: 0.3rem;
      @include flexbox;
      @include justify-content(flex-end);
      @include align-items(center);
      span {
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        text-align: right;
      }
      input,
      textarea {
        width: 100%;
        border: 0;
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        text-align: right;
        resize: none;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      input::placeholder,
      textarea::placeholder {
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      .img {
        display: inline-block;
        width: 0.37rem;
        height: 0.31rem;
        background: url("../../../assets/images/image.png") no-repeat left
          center;
        background-size: 0.37rem 0.31rem;
        margin-right: 0.16rem;
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
      .imgBox {
        width: 1.2rem;
        height: 1.2rem;
        margin: 0.2rem 0.56rem 0 0;
        img {
          width: 1.2rem;
          height: 1.2rem;
          object-fit: cover;
        }
      }
      .icon {
        width: 0.3rem;
        height: 0.3rem;
        background: url("../../../assets/images/delete.png") no-repeat left
          center;
        background-size: 0.3rem 0.3rem;
        position: relative;
        top: -1.3rem;
        left: 1rem;
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
    .child-list {
      div {
        width: 100%;
        height: 1rem;
        background: rgb(248, 248, 248);
        @include flexbox;
        @include flex-direction(row);
        @include align-items(center);
        padding: 0.1rem 0.1rem;
        margin: 0.2rem 0;
        .left {
          @include flex(4);
          color: rgba(48, 48, 48, 1);
          font-size: 0.3rem;
        }
        .right {
          @include flex(1);
          color: rgb(157, 157, 157);
          font-size: 0.3rem;
          text-align: right;
          > span:first-child {
            width: 1rem;
            margin-right: 0.25rem;
          }
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
    padding: 0.16rem 0.32rem;
    button {
      width: 100%;
      height: 0.96rem;
      background: rgba(50, 150, 250, 1);
      border-radius: 0.03rem;
      color: rgba(255, 255, 255, 1);
      border-radius: 0.03rem;
      font-size: 0.34rem;
    }
  }
  .mint-popup {
    width: 100%;
  }
  .img-prev-box {
    position: fixed;
    height: calc(100% - #{$header-height});
    width: 100%;
    left: 0;
    top: $header-height;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99999;
    text-align: center;
    .img-prev {
      height: 100%;
    }
    .close-img {
      width: 0.6rem;
      height: 0.6rem;
      background: #eee;
      display: inline-block;
      position: absolute;
      top: -0.3rem;
      right: 0;
      background: url("../../../assets/images/delete.png") no-repeat left center;
      background-size: 0.6rem 0.6rem;
    }
  }
}
</style>