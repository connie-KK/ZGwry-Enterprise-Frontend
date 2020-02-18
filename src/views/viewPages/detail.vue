<template>
  <div class="content">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="list" v-for="(item,index) in list" :key="index">
        <p class="label">{{item.label}}</p>
        <p class="info">{{item.value}}</p>
      </div>
      <div class="attachment" v-if="attachments.length">
        <p>附件信息</p>
        <div v-for="(item,index) in attachments" :key="index">
          <span>
            <icon name="attachment" scale="1"></icon>
            {{item.title}}
          </span>
          <span @click="download(item)">下载</span>
        </div>
      </div>
      <div class="factor-list" v-if="factors.length">
        <div class="list-header">
          <span v-for="(item,index) in listHeader" :key="index">{{item}}</span>
        </div>
        <div class="list-content" v-for="(item,index) in factors" :key="index">
          <span>{{item.factorname}}</span>
          <span>{{item.standardlimit}}</span>
          <span>{{item.unitname}}</span>
        </div>
      </div>
    </div>
  </div>
</template>    
<script>
import store from "store";
import moment from "moment";
export default {
  name: "Detail",
  data() {
    return {
      moduleName: "",
      isShowBorder: true,
      id: "",
      payload: {},
      select1: "",
      select2: "",
      list: [],
      attachments: [],
      factors: [],
      listHeader: ["污染物", "排放标准限值", "排放标准单位"],
      processingmodeArr: ["填埋", "暂存", "自行处置", "转移给有资质单位处置"],
      destinationcategoryArr: [
        "直接进入海域",
        "直接进入江河湖库等水环境",
        "进入城市下水道（再入江河、湖、库）",
        "进入城市下水道（再入沿海海域）",
        "进入城市污水处理厂或工业废水集中处理厂",
        "直接污灌农田",
        "进入低渗或蒸发地",
        "进入其他单位"
      ],
      wastedischargelawArr: [
        "稳定连续排放",
        "有规律间段排放",
        "不规律间段排放"
      ],
      protectionmeasuresArr: ["防流失", "防渗漏", "防扬散"]
    };
  },
  watch: {
    select2() {
      if (this.select1 === 2) {
        if (this.select2 === 0) {
          //根据id获取监测数据详情
          this.getZGDataDetail();
          this.moduleName = "监测数据";
          this.list = this.$store.state.monitorHeader;
        } else {
          //根据id获取排放口信息
          if (this.select2 === 2) {
            this.moduleName = "废水";
            this.list = this.$store.state.wasteWaterHeader;
          } else if (this.select2 === 1) {
            this.moduleName = "废气";
            this.list = this.$store.state.exhaustGasHeader;
          } else if (this.select2 === 6) {
            this.moduleName = "噪声";
            this.list = this.$store.state.noiseHeader;
          } else if (this.select2 === 7) {
            this.moduleName = "固危废堆场点";
            this.list = this.$store.state.solidDangerHeader;
          }
          this.getZGOutputDetail();
        }
      } else if (this.select1 === 3) {
        //根据id获取企业污染治理设施详情
        //根据id获取排放口信息
        if (this.select2 === 2) {
          this.moduleName = "废水";
          this.list = this.$store.state.controWaterHeader;
        } else if (this.select2 === 1) {
          this.moduleName = "废气";
          this.list = this.$store.state.controExhaustGasHeader;
        } else if (this.select2 === 7) {
          this.moduleName = "固危废堆场点";
          this.list = this.$store.state.controSolidDangerHeader;
        }
        this.getZGTreatFacilityDetail();
      }
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.handleRequest();
  },
  methods: {
    handleRequest() {
      this.payload = {
        id: this.id
      };
      const pageType = store.get("pageType");
      const pageTypeArr = pageType.split("-");
      if (Array.isArray(pageTypeArr) && pageTypeArr.length === 2) {
        this.select1 = JSON.parse(pageTypeArr[0]);
        this.select2 = JSON.parse(pageTypeArr[1]);
      }
    },
    getZGOutputDetail() {
      this.$api.getZGOutputDetail(this.payload).then(res => {
        if (res) {
          this.list.forEach((item, index) => {
            if (
              item.key === "isonlinemonitoring" ||
              item.key === "isidentificationmark" ||
              item.key === "isstored"
            ) {
              item.value = res[item.key] ? "是" : "否";
            } else if (item.key === "standard") {
              item.value = res[item.key] ? res[item.key].name : "";
            } else if (item.key === "destinationcategory") {
              item.value = this.destinationcategoryArr[res[item.key]];
            } else if (item.key === "wastedischargelaw") {
              item.value = this.wastedischargelawArr[res[item.key]];
            } else if (item.key === "lat-lng") {
              item.value = `${res["lat"]}E，${res["lng"]}N`;
            } else if (item.key === "inriverlng-lat") {
              item.value = `${res["inriverlat"]}E，${res["inriverlng"]}N`;
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
                let tempArr = res[item.key].split(",");
                tempArr.forEach((it, idx) => {
                  item.value +=
                    idx === 0
                      ? this.protectionmeasuresArr[it]
                      : `,${this.protectionmeasuresArr[it]}`;
                });
              } else {
                item.value = this.protectionmeasuresArr[res[item.key]];
              }
            } else {
              item.value = res[item.key];
            }
            this.$set(this.list, index, item);
          });
          this.attachments = res.attachments;
          this.factors = res.factors;
        }
      });
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
              item.value = res[item.key] ? "是" : "否";
            } else {
              item.value = res[item.key];
            }

            this.$set(this.list, index, item);
          });
        }
      });
    },
    download(item) {
      let a = document.createElement("a");
      a.href = `/api/ZGEntExtend/DownAttachmentFiles?id=${item.id}`;
      a.click();
    }
  }
};
</script>>
<style lang="scss" scoped>
@import "@/assets/scss/_flex.scss";
p {
  margin: 0;
}
.list {
  background: rgba(255, 255, 255, 1);
  padding: 0 0.24rem 0 0.32rem;
  border-bottom: solid 1px #e0e0e0;
  .label {
    line-height: 0.33rem;
    font-size: 0.24rem;
    color: #bebebe;
    padding: 0.15rem 0 0.01rem 0;
  }
  .info {
    line-height: 0.48rem;
    min-height: 0.48rem;
    font-size: 0.34rem;
    color: #3d3d3d;
    padding: 0.01rem 0 0.14rem 0;
  }
}
.attachment {
  background: rgba(255, 255, 255, 1);
  margin-top: 0.4rem;
  padding: 0 0.24rem 0 0.32rem;
  @include flexbox;
  @include flex-direction(column);
  p {
    font-size: 0.34rem;
    line-height: 0.48rem;
    color: rgba(48, 48, 48, 1);
    padding-top: 0.33rem;
  }
  div {
    width: 100%;
    padding: 0.32rem 0 0.2rem 0;
    background: rgba(255, 255, 255, 1);
    @include flexbox;
    span {
      display: inline-block;
      height: 0.42rem;
      font-size: 0.3rem;
    }
    span:first-child {
      flex: 9;
      svg {
        fill: #3296fa;
      }
    }
    span:last-child {
      color: rgba(50, 150, 250, 1);
      flex: 1;
    }
  }
  div:last-child {
    padding-bottom: 0.33rem;
  }
}
.factor-list {
  div {
    @include flexbox;
    @include align-items(center);
    @include justify-content(space-around);
    padding-left: 0.32rem;
    span {
      @include flex(1);
      color: rgba(48, 48, 48, 1);
      text-align: left;
    }
    span:nth-child(2) {
      @include flex(1.5);
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
    height: 0.75rem;
    background: rgba(255, 255, 255, 1);
    span {
      line-height: 0.48rem;
      font-size: 0.34rem;
    }
  }
}
</style>