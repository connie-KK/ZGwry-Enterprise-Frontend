<template>
  <div class="content" id="eventContent">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :showBorder="isShowBorder"
      :customBack="goBack"
    >{{moduleName}}</header-bar>
    <div :class="['main-content', editState? '':'main-content1']" ref="mainList">
      <div :class="['list',item.class]" v-for="(item,index) in dataList" :key="index">
        <span>{{item.label}}</span>
        <div v-if="item.type==='text'" class="right">
          <input
            type="text"
            v-model="item.value"
            :readonly="!editState ||item.readonly"
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
          <mt-switch v-model="switchValue" v-if="editState"></mt-switch>
          <aep-switch v-model="switchValue" v-if="!editState"></aep-switch>
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
          <span class="right-icon" v-if="editState">
            <icon name="right" scale="1"></icon>
          </span>
        </div>
        <div class="right" v-if="item.type==='img'">
          <span class="img" @click="toImg(item)" v-if="editState"></span>
        </div>
        <div class="img-list" v-if="item.type==='img'">
          <upload-box
            ref="upload"
            :fileId="'img'+index"
            :data="item.value"
            :autoShow="false"
            @upload="uploadData"
            @deleteItem="deleteItem"
            :showDelete="editState"
            @clickimg="openImg"
            :initt="initt"
          ></upload-box>
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
    </div>
    <div class="footer" v-if="editState">
      <button @click="save">登记</button>
    </div>
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" @change="selectValue" valueKey="valueKey"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
{
  const key = "84af24a85c0ce6dbaa1dfca048fda1ae";
  let script = document.createElement("script");
  script.src = "https://webapi.amap.com/maps?v=1.4.15&key=" + key;
  document.head.appendChild(script);
}
import moment from "moment";
import uploadBox from "@/components/uploadBox";
import ImagePreview from "vant/lib/image-preview";
import "vant/lib/image-preview/style";
import cookie from "js-cookie";
import { Switch, Popup, Picker, Toast } from "mint-ui";
export default {
  name: "EventContent",
  components: {
    uploadBox,
    "mt-switch": Switch,
    "mt-popup": Popup,
    "mt-picker": Picker
  },
  data() {
    return {
      enterpristIndex: 2,
      typeIndex: 3,
      eventImgType: 1,
      handledImgType: 2,
      eventImgIndex: 4,
      handledImgIndex: 7,
      editState: "",
      moduleName: "",
      isShowBorder: false,
      routeId: 0,
      sheetVisible: false,
      newDataList: [
        {
          label: "标题",
          key: "title",
          type: "text",
          value: "",
          placeholder: "点击输入事件标题"
        },
        {
          label: "地址",
          key: "addr",
          type: "rightArrow",
          value: ""
        },
        {
          label: "相关企业",
          key: "enterprise",
          type: "rightArrow",
          value: "请选择相关企业"
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
          imgType: 1, //事件内容 的图片
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
          key: "handled",
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
      imglist: [],
      fileId: 0,
      selectedFileId: 0,
      entPageIndex: 0,
      imgBaseUrl: "/ent/Grid/GetImage/",
      moduleId360: "",
      // initt: "dingding",
      initt: null,
      switchValue: false, //事件是否属实
      resImage: {
        label: "图片",
        key: "imgList",
        type: "img",
        imgType: 2, //自行处理的 图片
        value: []
      },
      resContent: {
        label: "详细描述",
        key: "results",
        type: "textarea",
        value: "",
        placeholder: "请输入事件处理情况"
      },
      imgType: "", //上传图片类型
      incidentDetail: {}
    };
  },
  computed: {
    enterpriseList() {
      const list = this.$store.state.enterpriseList;
      if (Array.isArray(list) && list.length) {
        return list;
      } else {
        this.getEnterpriseList();
      }
    }
  },
  watch: {
    switchValue() {
      //根据事件是否已自行处理，控制是否显示resImage,resContent
      this.dataList[6].value = this.switchValue;
      if (this.switchValue) {
        this.dataList.push(this.resImage);
        this.dataList.push(this.resContent);
        //防止编辑时，新增加的内容不在可视区
        if (this.editState) {
          this.$nextTick(() => {
            let mainList = this.$refs.mainList;
            mainList.scrollTo({
              top: mainList.scrollHeight,
              behavior: "smooth"
            });
          });
        }
      } else {
        if (this.dataList.length === 9) {
          this.dataList.pop();
          this.dataList.pop();
        }
      }
    }
  },
  created() {
    this.routeChange();
    this.getmodsList();
  },
  methods: {
    routeChange() {
      this.routeId = this.$route.params.id;
      if (this.routeId < 0) {
        //添加事件
        this.editState = true;
        this.moduleName = "事件上报";
        //防止用户输入数据到一半，跳转其他页面（地址，企业列表页等）
        //获取之前输入数据
        const sotreDataList = JSON.parse(
          JSON.stringify(this.$store.state.newDatalist)
        );
        if (sotreDataList.length) {
          this.dataList = sotreDataList;
        } else {
          this.dataList = this.newDataList;
        }
        setTimeout(() => {
          this.getLocation();
        }, 1000);
        this.getSelectedEnteprise();
        this.getUserId();
      } else {
        this.editState = false;
        this.moduleName = "事件内容";
        this.dataList = this.newDataList;
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
          let tempArr = [{ value: 0, valueKey: "请选择事件类型" }];
          res.incidentType.forEach(item => {
            tempArr.push({ valueKey: item.name, value: item.type });
          });
          this.$set(this.typeList[0], "values", tempArr);
          this.setSelectedType();
        }
      });
    },
    setSelectedType() {
      const tempObj = this.dataList[this.typeIndex];
      if (tempObj.value) {
        this.typeList[0].values.forEach(typeItem => {
          if (tempObj.value === typeItem.value) {
            tempObj.value = typeItem.valueKey;
          }
        });
        this.$set(this.dataList, this.typeIndex, tempObj);
      }
    },
    getIncidentDetail() {
      const payload = {
        id: this.routeId
      };
      this.$api.getIncidentDetail(payload).then(res => {
        if (res) {
          this.switchValue = res.isSelf;
          this.incidentDetail = res;
          setTimeout(() => {
            this.setListData(res);
          }, 0);
          this.userId = res.staff;
          this.getStaffInfo();
        }
      });
    },
    setListData(res) {
      Object.keys(res).forEach(resKey => {
        if (resKey === "attaches") {
          this.setImgItem(res.attaches);
        }
        this.dataList.forEach(item => {
          if (resKey === item.key) {
            if (resKey === "enterprise") {
              item.value = res[resKey];
              this.setSelectedEnteprise();
            } else if (resKey === "type") {
              if (this.typeList[0].values.length) {
                this.setSelectedType();
              } else {
                item.value = res[resKey];
              }
            } else {
              item.value = res[resKey];
            }
          }
        });
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
    getEnterpriseList() {
      const payload = {
        pageIndex: -1,
        pageSize: 10,
        keyword: ""
      };
      this.$api.getEnterpriseList(payload).then(res => {
        if (res) {
          this.$store.commit("set_enterpriseList", res.items);
          this.setSelectedEnteprise();
        }
      });
    },
    setSelectedEnteprise() {
      let obj = this.dataList[this.enterpristIndex];
      if (Array.isArray(this.enterpriseList)) {
        this.enterpriseList.forEach(eItem => {
          if (eItem.id == obj.value) {
            obj.value = eItem.name;
          }
        });
      }
      this.$set(this.dataList, this.enterpristIndex, obj);
    },
    getSelectedEnteprise() {
      const tempObj = JSON.parse(
        JSON.stringify(this.$store.state.selectedEnterprise)
      );
      if (tempObj.value && tempObj.valueKey) {
        let obj = this.dataList[this.enterpristIndex];
        obj.value = tempObj.value;
        obj.valueKey = tempObj.valueKey;
        this.$set(this.dataList, this.enterpristIndex, obj);
      }
    },
    getStaffInfo() {
      const payload = {
        id: this.userId
      };
      this.$api.getStaffInfo(payload).then(res => {
        if (res && res.grid) {
          this.staffId = res.id;
          this.grid = res.grid;
        }
      });
    },
    toPages(index) {
      if (this.editState) {
        const data = this.dataList[index];
        if (data.key === "addr") {
          this.$store.commit(
            "set_newDatalist",
            JSON.parse(JSON.stringify(this.dataList))
          );
          this.$router.push(`/eventMap/${this.routeId}`);
        } else if (data.key === "type") {
          this.slots = this.typeList;
          this.popupVisible = true;
        } else if (data.key === "enterprise") {
          this.$store.commit(
            "set_newDatalist",
            JSON.parse(JSON.stringify(this.dataList))
          );
          this.$router.push("/enterpriseList");
        }
      } else {
        return;
      }
    },
    selectValue(picker) {
      const selectedVal = picker.getValues();
      if (selectedVal instanceof Array && selectedVal.length === 1) {
        let obj, index;
        if (this.slots[0].key === "type") {
          index = this.typeIndex;
          obj = this.dataList[index];
          obj.value = selectedVal[0].valueKey;
          obj.valueKey = selectedVal[0].value;
          this.$set(this.dataList, index, obj);
        }
      }
    },
    goBack() {
      this.resetData();
      if (this.editState) {
        //登记事件
        this.$router.push("/enList");
      } else {
        window.history.go(-1);
      }
    },
    save() {
      //没有输入标题，无法提交
      const title = this.dataList[0].value;
      if (!title) {
        this.toast("请输入事件标题");
        return;
      }
      let payload = {
        id: this.$uuid(),
        rowState: "add",
        grid: this.grid,
        staff: this.staffId,
        state: 1, //未发布
        lat: this.latLng[0],
        lng: this.latLng[1],
        date: this.incidentDetail.date
          ? this.incidentDetail.date
          : moment().format()
      };
      this.dataList.forEach(item => {
        if (item.key === "imgList") {
          let tempArr = [];
          this.imglist.forEach(item => {
            tempArr.push({
              id: item.id,
              rowState: "add",
              lat: this.latLng[0],
              lng: this.latLng[1],
              type: item.type
            });
          });
          payload["attachments"] = tempArr;
        } else if (item.type === "rightArrow" && item.key !== "addr") {
          payload[item.key] = item.valueKey;
        } else if (item.key === "handled") {
          if (item.value) {
            //事件已自行处理
            payload.handleDate = moment().format();
            payload.state = 3;
          }
        } else {
          payload[item.key] = item.value;
        }
      });
      this.$api.updateincident(payload).then(res => {
        if (res === "OK") {
          this.resetData();
          const eventListPageType = this.$store.state.eventListPageType;
          this.$router.push(`/eventList/${eventListPageType}`);
        } else {
          this.toast(res);
        }
      });
    },
    toast(msg) {
      Toast({
        message: msg,
        iconClass: "iconfont icon-error",
        position: "top",
        duration: 3000
      });
    },
    resetData() {
      this.$store.commit("set_newDatalist", []);
      let selectedEnterprise = {
        value: "",
        valueKey: ""
      };
      this.$store.commit("set_selectedEnterprise", selectedEnterprise);
      this.$store.commit("set_eventLatLng", []);
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
      let geocoder = new AMap.Geocoder();
      const lngLat = this.latLng.reverse();
      geocoder.getAddress(lngLat, (status, result) => {
        if (status === "complete" && result.regeocode) {
          const tempData = result.regeocode.addressComponent;
          const tempItem = this.dataList[1];
          tempItem.value = `${tempData.province}${tempData.city}${tempData.district}${tempData.township}${tempData.street}${tempData.streetNumber}`;
          this.$set(this.dataList, 1, tempItem);
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
              const tempItem = this.dataList[1];
              tempItem.value = `${tempData.province}${tempData.city}${tempData.district}${tempData.township}${tempData.street}${tempData.streetNumber}`;
              this.$set(this.dataList, 1, tempItem);
            }
            if (result.position) {
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
    toImg(item) {
      if (item && item.imgType) {
        this.imgType = item.imgType;
      }
      this.$refs.upload[0].addItem();
    },
    async uploadData(e) {
      if (this.initt === "dingding") {
        let imgarr = [];
        for (let i = 0; i < e.length; i++) {
          try {
            let x = await window.dingtalk.uploadFile({
              url: "https://zsxt.azuratech.com:8002/api/GBM/UploadAttachment",
              filePath: e[i],
              fileName: "image",
              fileType: "image",
              header: {
                "Content-Type": "multipart/form",
                "content-type": "multipart/form",
                Authorization: `Bearer ${cookie.get("AzuraCookie")}`
              }
            });
            if (x.data && x.data.includes("id")) {
              let img = JSON.parse(x.data);
              imgarr.push(img[0]);
            }
          } catch (e) {
            alert(JSON.stringify(e))
          }
        }
        this.setImgItem(imgarr);
      } else {
        let data = new FormData();
        for (let i = 0; i < e.length; i++) {
          data.append("file" + i, e[i]);
        }
        this.$api.uploadAttachment(data).then(res => {
          this.setImgItem(res);
        });
      }
    },
    setImgItem(imgarr) {
      imgarr.forEach(item => {
        if (
          this.imgType &&
          item.url &&
          item.url.includes("Content") &&
          !item.url.includes(this.$360url)
        ) {
          item.url = this.$360url + item.url;
          item.type = this.imgType;
        } else {
          item.url = this.imgBaseUrl + item.id;
          let tempArr, index;
          if (item.type === this.handledImgType) {
            index = this.handledImgIndex;
          } else {
            index = this.eventImgIndex;
          }
          if (index) {
            tempArr = this.dataList[index];
            tempArr.value.push(item);
          }
        }
      });
      let tempArr, index;
      if (this.imgType) {
        //新上传图片，还未与事件绑定
        if (this.imgType === this.eventImgType) {
          index = this.eventImgIndex;
        } else if (this.imgType === this.handledImgType) {
          index = this.handledImgIndex;
        }
        tempArr = this.dataList[index];
        tempArr.value.push(...imgarr);
        this.$set(this.dataList, index, tempArr);
      }

      this.imglist.push(...imgarr);
    },
    deleteItem(e) {
      this.imglist.forEach((item, index) => {
        if (item.url === e.url) {
          this.imglist.splice(index, 1);
        }
      });
      let tempArr, index;
      if (e.type === this.eventImgType) {
        index = this.eventImgIndex;
      } else if (e.type === this.handledImgType) {
        index = this.handledImgIndex;
      }
      tempArr = this.dataList[index];
      tempArr.value = this.imglist.filter(item => {
        return item.type === e.type;
      });
      this.$set(this.dataList, index, tempArr);
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
      width: calc(100% - 4.2rem);
      color: rgba(48, 48, 48, 1);
      font-size: 0.34rem;
      vertical-align: middle;
    }
    > div.right {
      float: right;
      width: 4.2rem;
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