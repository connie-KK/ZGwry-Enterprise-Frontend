<template>
  <div class="content">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :showBorder="isShowBorder"
      :customBack="backFun"
    >{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="list" v-for="(item,index) in list" :key="index">
        <p class="label">
          <span :class="item.type==='boolean'?'big-label':''">{{item.label}}</span>
          <span v-if="item.type==='boolean'" class="switch">
            <mt-switch v-model="item.value"></mt-switch>
          </span>
        </p>
        <p class="info" v-if="item.icon && item.type!=='boolean'">
          <span class="value">{{item.value}}</span>
          <span class="icon" v-if="item.icon" @click="selectIcon(item)"></span>
        </p>
        <input
          type="text"
          v-model="item.value"
          class="info"
          v-if="!item.icon&& item.type!=='boolean'"
        />
      </div>
      <div class="attachment" v-if="selectedTab===4">
        <div class="header">
          <div class="title">附件信息（ {{attachments.length}} ）</div>
          <div class="add">
            <span class="icon"></span>
            <span @click="uploadFile">添加文件</span>
          </div>
        </div>
        <div v-for="(item,index) in attachments" :key="index" class="attch-content">
          <span @click="download(item)">
            <icon name="attachment" scale="1"></icon>
            {{item.title}}
          </span>
          <span @click="deleteFile(item)"></span>
        </div>
      </div>
      <div class="factor-list" v-if="showList">
        <div class="list-header factor">
          <span v-for="(item,index) in listHeader" :key="index">{{item.name}}</span>
        </div>
        <div
          v-for="(fitem,findex) in factors"
          :key="findex"
          @click="selectItem(factors,findex)"
          :class="['list-content','factor',fitem.class]"
        >
          <span v-for="itemHeader in listHeader" :key="itemHeader.key">
            <input
              type="text"
              v-if="fitem.rowState === 'add' && itemHeader.key !== 'standardName'"
              v-model="fitem[itemHeader.key]"
              :placeholder="itemHeader.name"
            />
            <input
              type="text"
              v-if="fitem.rowState === 'add' && itemHeader.key === 'standardName'"
              v-model="fitem[itemHeader.key]"
              :placeholder="itemHeader.name"
              readonly
              @click="setStandardid(findex)"
            />
            <span v-if="fitem.rowState !== 'add'">{{fitem[itemHeader.key]}}</span>
          </span>
        </div>
        <div class="listBtnGroup">
          <div class="addBtn listBtn" @click="addItem(listHeader,factors)">
            <span></span>
            <span>添加</span>
          </div>
          <div class="delBtn listBtn" @click="deleteItem(factors)">
            <span></span>
            <span>删除</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="submitBtn" @click="save">确定</div>
    </div>
    <input
      style="float: left;  display: none;"
      type="file"
      name="Filedata"
      id="uploadFile"
      @change="readLocalFile()"
    />
    <mt-popup v-model="popupVisible" position="bottom">
      <mt-picker :slots="slots" @change="setSelectedData" valueKey="valueKey"></mt-picker>
    </mt-popup>
    <mt-datetime-picker ref="datePicker" type="date" v-model="dateVal" @confirm="handleConfirmDate"></mt-datetime-picker>
  </div>
</template>    
<script>
import store from "store";
import moment from "moment";
import { Popup, Toast, Picker, Switch, DatetimePicker } from "mint-ui";
export default {
  name: "detail",
  components: {
    "mt-popup": Popup,
    "mt-picker": Picker,
    "mt-switch": Switch,
    "mt-datetime-picker": DatetimePicker
  },
  data() {
    return {
      moduleName: "",
      isShowBorder: false,
      id: "",
      payload: {},
      selectedTab: "",
      selectedSubTab: "",
      list: [],
      attachments: [],
      factors: [],
      listHeader1: [
        {
          name: "污染物",
          key: "factorname"
        },
        {
          name: "排放标准限值",
          key: "standardlimit"
        },
        {
          name: "排放标准单位",
          key: "unitname"
        }
      ],
      factorData1: [
        {
          key: "factorname",
          label: "污染物"
        },
        {
          key: "standardlimit",
          label: "排放标准限值"
        },
        {
          key: "unitname",
          label: "排放标准单位"
        }
      ],
      factorData2: [
        {
          key: "location",
          label: "监测点位置"
        },
        {
          key: "standardid",
          label: "适用标准id"
        }
      ],
      listHeader2: [
        {
          name: "测点位置",
          key: "location"
        },
        {
          name: "适用标准",
          key: "standardName"
        }
      ],
      processingmodeArr: ["填埋", "暂存", "自行处置", "转移给有资质单位处置"],
      destinationcategoryArr: [
        { id: 0, name: "直接进入海域" },
        { id: 1, name: "直接进入江河湖库等水环境" },
        { id: 2, name: "进入城市下水道（再入江河、湖、库）" },
        { id: 3, name: "进入城市下水道（再入沿海海域）" },
        { id: 4, name: "进入城市污水处理厂或工业废水集中处理厂" },
        { id: 5, name: "直接污灌农田" },
        { id: 6, name: "进入低渗或蒸发地" },
        { id: 7, name: "进入其他单位" }
      ],
      wastedischargelawArr: [
        { id: 0, name: "稳定连续排放" },
        { id: 1, name: "有规律间段排放" },
        { id: 2, name: "不规律间段排放" }
      ],
      //燃料种类
      fueltypeArr: [
        { id: 0, name: "其他" },
        { id: 1, name: "煤炭" },
        { id: 2, name: "煤矸石" },
        { id: 3, name: "天然气" },
        { id: 4, name: "生物质燃料" },
        { id: 5, name: "木屑" },
        { id: 6, name: "木炭" },
        { id: 7, name: "煤气" },
        { id: 8, name: "沼气" },
        { id: 9, name: "汽油" },
        { id: 10, name: "柴油" },
        { id: 11, name: "醇类燃料" }
      ],
      processingmodesArr: [
        { id: 0, name: "填埋" },
        { id: 1, name: "暂存" },
        { id: 2, name: "自行处置" },
        { id: 3, name: "转移给有资质单位处置" }
      ],
      outputStandardArr: [],
      protectionmeasuresArr: [
        { id: 0, name: "防流失" },
        { id: 1, name: "防渗漏" },
        { id: 2, name: "防扬散" }
      ],
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
      detailData: {},
      selectKey: "",
      latLngArr: [],
      dateVal: moment().format("YYYY-MM-DD"),
      setFactorIndex: -1 //噪声添加列表数据时id
    };
  },
  computed: {
    reRequest() {
      return this.$store.state.reRequest;
    },
    enterid() {
      return this.$store.state.enterid;
    },
    resDetail() {
      if (this.selectedTab === 4) {
        return this.$store.state.outputRes;
      } else {
        return this.$store.state.treatRes;
      }
    },
    showList() {
      if (this.selectedTab === 4) {
        if (this.selectedSubTab === 0) {
          return false;
        } else {
          return true;
        }
      }
    },
    listHeader() {
      if (this.selectedTab === 4) {
        if (this.selectedSubTab === 6) {
          return this.listHeader2;
        } else {
          return this.listHeader1;
        }
      }
    }
  },
  watch: {
    selectedSubTab() {
      if (this.selectedTab === 4) {
        if (this.selectedSubTab === 0) {
          //根据id获取监测数据详情
          this.moduleName = "监测数据";
          this.list = JSON.parse(
            JSON.stringify(this.$store.state.monitorHeader)
          );
          if (this.id !== "0") {
            this.getZGDataDetail();
          }
        } else {
          //根据id获取排放口信息
          if (this.selectedSubTab === 2) {
            this.moduleName = "废水";
            this.list = JSON.parse(
              JSON.stringify(this.$store.state.wasteWaterHeader)
            );
          } else if (this.selectedSubTab === 1) {
            this.moduleName = "废气";
            this.list = JSON.parse(
              JSON.stringify(this.$store.state.exhaustGasHeader)
            );
          } else if (this.selectedSubTab === 6) {
            this.moduleName = "噪声";
            this.list = JSON.parse(
              JSON.stringify(this.$store.state.noiseHeader)
            );
          } else if (this.selectedSubTab === 7) {
            this.moduleName = "固危废堆场点";
            this.list = JSON.parse(
              JSON.stringify(this.$store.state.solidDangerHeader)
            );
          }
          if (this.id !== "0" && this.reRequest) {
            this.getZGOutputDetail();
          } else {
            const tempDataExt = this.$store.state.tempData;
            if (tempDataExt.attachments) {
              this.attachments = tempDataExt.attachments;
            }
            if (tempDataExt.factors) {
              this.factors = tempDataExt.factors;
            }
            this.setLatLng();
          }
        }
        if (this.id === "0") {
          this.setLatLng();
        }
      } else if (this.selectedTab === 5) {
        //根据id获取企业污染治理设施详情
        //根据id获取排放口信息
        if (this.selectedSubTab === 2) {
          this.moduleName = "废水";
          this.list = JSON.parse(
            JSON.stringify(this.$store.state.controWaterHeader)
          );
        } else if (this.selectedSubTab === 1) {
          this.moduleName = "废气";
          this.list = JSON.parse(
            JSON.stringify(this.$store.state.controExhaustGasHeader)
          );
        } else if (this.selectedSubTab === 7) {
          this.moduleName = "固危废堆场点";
          this.list = JSON.parse(
            JSON.stringify(this.$store.state.controSolidDangerHeader)
          );
        }
        if (this.id !== "0") {
          this.getZGTreatFacilityDetail();
        }
      }
    }
  },
  mounted() {
    this.handleRequest();
    this.getZGStandardList();
  },
  methods: {
    handleRequest() {
      this.id = this.$route.params.id;
      this.payload = {
        id: this.id
      };
      const pageType = store.get("pageType");
      const pageTypeArr = pageType.split("-");
      if (Array.isArray(pageTypeArr) && pageTypeArr.length === 2) {
        this.selectedTab = JSON.parse(pageTypeArr[0]);
        this.selectedSubTab = JSON.parse(pageTypeArr[1]);
      }
    },
    getZGOutputDetail() {
      this.$api.getZGOutputDetail(this.payload).then(res => {
        if (res) {
          // this.detailData = res;
          this.list.forEach((item, index) => {
            if (
              item.key === "isonlinemonitoring" ||
              item.key === "isidentificationmark" ||
              item.key === "isstored"
            ) {
              item.value = res[item.key] ? true : false;
            } else if (item.key.includes("standard")) {
              item.value = res["standard"] ? res["standard"].name : "";
              item.keyValue = res["standard"].id;
            } else if (item.key === "destinationcategory") {
              item.value = this.destinationcategoryArr[res[item.key]].name;
              item.keyValue = res[item.key];
            } else if (item.key === "wastedischargelaw") {
              item.value = this.wastedischargelawArr[res[item.key]].name;
              item.keyValue = res[item.key];
            } else if (item.key === "fueltypes") {
              item.value = this.fueltypeArr[res[item.key]].name;
              item.keyValue = res[item.key];
            } else if (item.key === "lat-lng") {
              const lng = res["lng"] ? res["lng"] : 0
              const lat = res["lat"] ? res["lat"] : 0
              item.value = `${lng} E,${lat} N`;
            } else if (item.key === "inriverlat-inriverlng") {
              const inriverlng = res["inriverlng"] ? res["inriverlng"] : 0
              const inriverlat = res["inriverlat"] ? res["inriverlat"] : 0
              item.value = `${inriverlng} E,${inriverlat} N`;
            } else if (item.key === "processingmode") {
              if (typeof res[item.key] === "string") {
                item.value = "";
                let tempArr = res[item.key].split(",");
                tempArr.forEach((it, idx) => {
                  item.value +=
                    idx === 0
                      ? this.processingmodeArr[it]
                      : `,${this.processingmodeArr[it]}`;
                });
              } else {
                item.value = this.processingmodeArr[res[item.key]];
              }
            } else if (item.key === "protectionmeasures") {
              if (typeof res[item.key] === "string") {
                item.value = "";
                if (res[item.key].includes(",")) {
                  let tempArr = res[item.key].split(",");
                  tempArr.forEach((it, idx) => {
                    item.value +=
                      idx === 0
                        ? this.protectionmeasuresArr[it].name
                        : `,${this.protectionmeasuresArr[it].name}`;
                  });
                } else {
                  item.value = this.protectionmeasuresArr[res[item.key]].name;
                }
              } else {
                item.value = this.protectionmeasuresArr[res[item.key]];
              }
            } else {
              item.value = res[item.key];
            }
            this.$set(this.list, index, item);
          });
          this.attachments = res.attachments;
          if (this.selectedSubTab === 6) {
            let stationsArr = [];
            res.stations.forEach(sItem => {
              stationsArr.push({
                id: sItem.id,
                location: sItem.location,
                standardid: sItem.standard[0].id,
                standardName: sItem.standard[0].name
              });
            });
            this.factors = stationsArr;
          } else {
            this.factors = res.factors;
          }
          this.setLatLng();
        }
      });
    },
    //设置经纬度
    setLatLng() {
      this.latLngArr = JSON.parse(JSON.stringify(this.$store.state.latLngArr));
      if (Array.isArray(this.latLngArr)) {
        if (this.latLngArr.length) {
          this.latLngArr.forEach(laItem => {
            this.list.forEach((item, index) => {
              if (item.key === laItem.key) {
                let tempObj = item;
                item.value = laItem.value;
                this.$set(this.list, index, item);
              }
            });
          });
        } else {
          this.list.forEach(liItem => {
            if (liItem.icon && liItem.icon === "map") {
              this.latLngArr.push(liItem);
            }
          });
        }
      }
    },
    getZGDataDetail() {
      this.$api.getZGDataDetail(this.payload).then(res => {
        if (res) {
          this.list.forEach((item, index) => {
            if (item.key.includes("date") || item.key.includes("Time")) {
              item.value = moment(res[item.key]).format("YYYY-MM-DD");
            } else {
              item.value = res[item.key];
            }
            this.$set(this.list, index, item);
          });
        }
      });
    },
    getZGTreatFacilityDetail() {
      this.$api.getZGTreatFacilityDetail(this.payload).then(res => {
        if (res) {
          this.list.forEach((item, index) => {
            if (item.key.includes("date") || item.key.includes("Time")) {
              item.value = moment(res[item.key]).format("YYYY-MM-DD");
            } else if (item.key === "output") {
              item.value = res[item.key] ? res[item.key].name : "";
            } else if (item.key.includes("is")) {
              // item.value = res[item.key] ? "是" : "否";
            } else {
              item.value = res[item.key];
            }

            this.$set(this.list, index, item);
          });
        }
      });
    },
    getZGStandardList() {
      const payload = {
        category: this.selectedSubTab
      };
      this.$api.getZGStandardList(payload).then(res => {
        this.outputStandardArr = res;
      });
    },
    download(item) {
      let a = document.createElement("a");
      a.href = `http://183.220.144.57:30002/api/ZGEntExtend/DownAttachmentFiles?id=${item.id}`;
      a.download = item.title;
      a.click();
      document.body.removeChild(a);
    },
    selectIcon(item) {
      if (item.icon === "select") {
        let tempArr = [];
        let arr = [];
        if (item.key === "destinationcategory") {
          arr = this.destinationcategoryArr;
        } else if (item.key === "wastedischargelaw") {
          arr = this.wastedischargelawArr;
        } else if (item.key === "standardid") {
          arr = this.outputStandardArr;
        } else if (item.key === "fueltypes") {
          arr = this.fueltypeArr;
        } else if (item.key === "processingmode") {
          arr = this.processingmodesArr;
        } else if (item.key === "protectionmeasures") {
          arr = this.protectionmeasuresArr;
        }
        arr.forEach((it, idx) => {
          tempArr.push({ valueKey: it.name, value: it.id });
        });
        this.slots[0].values = tempArr;
        this.selectKey = item.key;

        //噪声
        this.setFactorIndex >= 0 ? (this.setFactorIndex = -1) : "";

        this.popupVisible = true;
      } else if (item.icon === "map") {
        this.latLngArr.forEach(liItem => {
          liItem.selected = false;
        });
        this.latLngArr.forEach(liItem => {
          if (liItem.key === item.key) {
            liItem.selected = true;
          }
        });

        this.$store.commit("set_latLng", this.latLngArr);
        this.storeListData();

        this.$store.commit("set_reRequest", false);
        const tempDataExt = {
          id: this.id,
          attachments: this.attachments,
          factors: this.factors
        };
        this.$store.commit("set_tempData", tempDataExt);
        this.$router.replace(`/emissionsMap/${this.id}`);
      } else if (item.icon === "date") {
        this.$refs.datePicker.open();
      }
    },
    setStandardid(findex) {
      let tempArr = [];
      this.setFactorIndex = findex;
      this.outputStandardArr.forEach((it, idx) => {
        tempArr.push({ valueKey: it.name, value: it.id });
      });
      this.slots[0].values = tempArr;
      this.popupVisible = true;
    },
    storeListData() {
      let keyName;
      if (this.selectedTab === 4) {
        if (this.selectedSubTab === 2) {
          keyName = "set_wasteWaterHeader";
        } else if (this.selectedSubTab === 1) {
          keyName = "set_exhaustGasHeader";
        }
      }
      this.$store.commit(keyName, JSON.parse(JSON.stringify(this.list)));
    },
    setSelectedData(picker) {
      const selectedVal = picker.getValues();
      if (selectedVal instanceof Array && selectedVal.length === 1) {
        const keyValue = selectedVal[0].value;
        if (this.setFactorIndex >= 0) {
          this.outputStandardArr.forEach(outItem => {
            if (outItem.id === keyValue) {
              let fItem = this.factors[this.setFactorIndex];
              fItem.standardName = outItem.name;
              fItem.standardid = keyValue;
            }
          });
        } else {
          this.list.forEach((item, index) => {
            if (item.key === this.selectKey) {
              if (item.key === "destinationcategory") {
                item.value = this.destinationcategoryArr[keyValue].name;
              } else if (item.key === "wastedischargelaw") {
                item.value = this.wastedischargelawArr[keyValue].name;
              } else if (item.key === "fueltypes") {
                item.value = this.fueltypeArr[keyValue].name;
              } else if (item.key === "processingmode") {
                item.value = this.processingmodesArr[keyValue].name;
              } else if (item.key === "protectionmeasures") {
                item.value = this.protectionmeasuresArr[keyValue].name;
              } else if (item.key === "standardid") {
                this.outputStandardArr.forEach(outItem => {
                  if (outItem.id === keyValue) {
                    item.value = outItem.name;
                  }
                });
              }
              item.keyValue = keyValue;
              this.$set(this.list, index, item);
            }
          });
        }
      }
    },
    uploadFile() {
      document.getElementById("uploadFile").click();
    },
    readLocalFile() {
      const localFile = document.getElementById("uploadFile");
      this.uploadData(localFile);
    },
    uploadData(e) {
      let data = new FormData();
      let files = e.files;
      for (let i = 0; i < files.length; i++) {
        data.append("file" + i, files[i]);
      }
      this.$api.uploadEntExtendAttachment(data).then(res => {
        res.forEach(item => (item.rowState = "add"));
        this.attachments.push(...res);
      });
      e.value = "";
    },
    deleteFile(e) {
      this.attachments.forEach((item, index) => {
        if (item.url === e.url) {
          this.attachments.splice(index, 1);
        }
      });
    },
    deleteItem(arr) {
      arr.forEach((item, index) => {
        if (item.class === "selected") {
          arr.splice(index, 1);
        }
      });
    },
    addItem() {
      let newItem = {};
      if (this.selectedTab === 4) {
        let header;
        if (this.selectedSubTab === 6) {
          header = this.factorData2;
        } else {
          header = this.factorData1;
        }
        header.forEach(item => {
          newItem[item.key] = "";
        });
        newItem.id = this.$uuid();
        newItem.rowState = "add";
        this.factors.push(newItem);
      }
    },
    handleConfirmDate(e) {
      this.dateVal = moment(e).format("YYYY-MM-DD");
      this.list.forEach((item, index) => {
        if (item.icon === "date") {
          item.value = this.dateVal;
          this.$set(this.list, index, item);
        }
      });
    },
    selectItem(arr, index) {
      let selecteItem = arr[index];
      arr.forEach(item => {
        item.class = "";
      });
      selecteItem.class = `selected`;
      this.$set(arr, index, selecteItem);
    },
    backFun() {
      this.resetData();
      this.$router.push("/emissions");
    },
    precheck(index){
      const text = this.$submitBefore(this.list[0], "value");
      if (text) {
        Toast(text);
        return false;
      }
      return true
    },
    save() {
     for(let i=0;i<this.list.length;i++){
       if((this.selectedSubTab !== 0 && i===0) || this.selectedSubTab === 0){
          let result = this.precheck(i)
          if(!result){
            return
          }
       }
     }
      this.factors.forEach(item => {
        delete item.class;
      });
      let detailData = {
        attachments: this.attachments,
        id: this.id === "0" ? this.$uuid() : this.id,
        enterpriseid: this.enterid
      };
      if (this.selectedSubTab === 6) {
        detailData.stations = this.factors;
      } else if (this.selectedSubTab > 0) {
        detailData.factors = this.factors;
      }
      this.list.forEach(item => {
        if (item.icon && item.icon === "select") {
          detailData[item.key] = item.keyValue;
        } else if (item.icon && item.icon === "map") {
          this.hanleLatlng(detailData, item);
        } else if (item.type && item.type === "boolean") {
          detailData[item.key] =
            item.value === "是" || item.value === true ? 1 : 0;
        } else {
          detailData[item.key] = item.value;
        }
      });

      if (detailData.protectionmeasures > 0) {
        detailData.protectionmeasures = [detailData.protectionmeasures];
      }
      if (this.selectedSubTab !== 0) {
        detailData.protectionmeasures = [];
      } else {
        delete detailData.attachments;
      }

      let apiName;
      if (this.selectedTab === 4) {
        this.selectedSubTab === 0
          ? (apiName = "updateZGData")
          : (apiName = "updateZGOutput");
      } else {
        apiName = "updateZGTreatFacility";
      }
      if (this.selectedSubTab > 0) {
        detailData.category = this.selectedSubTab;
      }
      this.$api[apiName](detailData).then(res => {
        if (res === true) {
          Toast("保存成功");
          this.$store.commit("set_reRequest", true);
          this.$router.replace(`/emissionsDetail/${detailData.id}`);
        } else {
          Toast(res);
        }
      });
    },
    hanleLatlng(obj, item) {
      if (item.value) {
        const keyArr = item.key.split("-");
        if (Array.isArray(keyArr) && keyArr.length === 2) {
          let valueArr = item.value.split(",");
          if (Array.isArray(valueArr) && valueArr.length === 2) {
            obj[keyArr[0]] = valueArr[1].split(" N")[0] ? valueArr[1].split(" N")[0] : null;
            obj[keyArr[1]] = valueArr[0].split(" E")[0] ? valueArr[0].split(" E")[0] : null;
          }
        }
      }
    },
    resetData() {
      this.list.forEach(item => {
        if (item.value) {
          delete item.value;
        }
        if (item.selected) {
          delete item.selected;
        }
      });
      if (this.selectedTab === 4) {
        if (this.selectedSubTab === 2) {
          this.$store.commit(
            "set_wasteWaterHeader",
            JSON.parse(JSON.stringify(this.list))
          );
        } else if (this.selectedSubTab === 1) {
          this.$store.commit(
            "set_exhaustGasHeader",
            JSON.parse(JSON.stringify(this.list))
          );
        }
      }
      this.$store.commit("set_latLng", []);
      this.$store.commit("set_reRequest", true);
      this.$store.commit("set_tempData", {});
    }
  }
};
</script>>
<style lang="scss">
@import "@/assets/scss/_flex.scss";
@import "@/assets/scss/variables.scss";
.main-content {
  height: calc(100% - #{$header-height} - 1.28rem);
  overflow-y: scroll;
}
p {
  margin: 0;
}
.list {
  min-height: 0.9rem;
  background: rgba(255, 255, 255, 1);
  padding: 0 0.41rem 0 0.32rem;
  border-bottom: solid 1px #e0e0e0;
  .label {
    line-height: 0.33rem;
    font-size: 0.24rem;
    color: #bebebe;
    padding: 0.15rem 0 0.01rem 0;
    @include flexbox;
    span:first-child {
      display: inline-block;
      width: 90%;
      line-height: 0.58rem;
      vertical-align: middle;
      height: 0.58rem;
    }
    .big-label {
      font-size: 0.34rem;
      color: rgba(48, 48, 48, 1);
    }
    .mint-switch-core {
      width: 0.9rem;
      height: 0.5rem;
    }
    .mint-switch-core::before {
      width: 0.45rem;
      height: 0.45rem;
      background-color: #969696;
    }
    .mint-switch-core::after {
      width: 0.45rem;
      height: 0.45rem;
    }
  }
  .info {
    @include flexbox;
    line-height: 0.48rem;
    min-height: 0.48rem;
    font-size: 0.34rem;
    color: #3d3d3d;
    padding: 0.01rem 0 0.14rem 0;
    .value {
      @include flex(5);
    }
    .icon {
      display: inline-block;
      width: 0.4rem;
      height: 0.32rem;
      background: #fff url("../../../assets/images/down-c.png") no-repeat right
        center;
      background-size: 0.4rem;
    }
  }
  input.info {
    width: 100%;
    border: 0;
  }
}
.list:last-child {
  border: 0;
}
.attachment {
  background: rgba(255, 255, 255, 1);
  margin-top: 0.4rem;
  padding: 0 0.24rem 0 0.32rem;
  @include flexbox;
  @include flex-direction(column);
  .header {
    @include flexbox;
    @include flex-direction(row);
    padding-top: 0.33rem;
    .title {
      flex: 2;
      @include flexbox;
      @include align-items(center);
      font-size: 0.34rem;
      line-height: 0.48rem;
      color: rgba(48, 48, 48, 1);
    }
    .add {
      flex: 1;
      @include flexbox;
      @include justify-content(center);
      @include align-items(center);
      width: 2.4rem;
      height: 0.74rem;
      border-radius: 3px;
      border: 2px solid rgba(50, 150, 250, 1);
      color: rgba(50, 150, 250, 1);
      font-size: 0.3rem;
      .icon {
        width: 0.3rem;
        height: 0.3rem;
        background: url(../../../assets/images/add.png) no-repeat;
      }
    }
  }
  .attch-content {
    width: 100%;
    padding: 0.32rem 0.33rem 0 0.8rem;
    background: rgba(255, 255, 255, 1);
    @include flexbox;
    span {
      display: inline-block;
      height: 0.42rem;
      font-size: 0.3rem;
    }
    span:first-child {
      flex: 5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      svg {
        fill: #3296fa;
      }
    }
    span:last-child {
      width: 0.3rem;
      height: 0.3rem;
      background: url(../../../assets/images/delete.png) no-repeat;
      background-size: 100% 100%;
    }
  }
}
.factor-list {
  padding: 0.33rem 0;
  .factor {
    @include flexbox;
    @include align-items(center);
    @include justify-content(space-around);
    padding-left: 0.32rem;
    span {
      @include flex(1);
      color: rgba(48, 48, 48, 1);
      text-align: left;
      input {
        width: 90%;
        border: 0;
        font-size: 0.28rem;
      }
    }
    span:nth-child(2) {
      @include flex(1.5);
      span {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 4.2rem;
      }
    }
  }
  .list-header {
    height: 0.7rem;
    background: rgba(229, 241, 244, 1);
    span {
      line-height: 0.37rem;
      font-size: 0.26rem;
    }
  }
  .list-content {
    height: 0.6rem;
    background: rgba(255, 255, 255, 1);
    span {
      line-height: 0.48rem;
      font-size: 0.34rem;
    }
  }
  .selected {
    background: #edf0f4;
  }
}
.listBtnGroup {
  @include flexbox;
  @include flex-direction(row);
  padding: 0.18rem 0 0 0.32rem;
  .listBtn {
    @include flexbox;
    @include align-items(center);
    @include justify-content(center);
    width: 1.36rem;
    height: 0.6rem;
    font-size: 0.3rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.03rem;
    border: 2px solid rgba(50, 150, 250, 1);
  }
  .addBtn {
    color: rgba(255, 255, 255, 1);
    background: rgba(50, 150, 250, 1);
  }
  .delBtn {
    margin-left: 0.32rem;
    color: #3296fa;
  }
}
.footer {
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1.28rem;
  background: rgba(255, 255, 255, 1);
  .submitBtn {
    @include flexbox;
    @include align-items(center);
    @include justify-content(center);
    width: 6.86rem;
    height: 0.96rem;
    background: rgba(50, 150, 250, 1);
    border-radius: 3px;
    font-size: 0.34rem;
    color: rgba(255, 255, 255, 1);
  }
}
.mint-popup {
  width: 100%;
}
</style>