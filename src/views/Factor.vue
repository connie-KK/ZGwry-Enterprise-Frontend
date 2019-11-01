<template>
  <div class="content">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{title}}</header-bar>
    <div class="main-content">
      <div v-for="item in filterHeader" :key="item.key" class="filter-list">
        <span>{{item.factor}}</span>
        <span @click="changeFilter(item.key)">
          {{item.value}}
          <span class="icon">
            <svg-icon icon-class="right"></svg-icon>
          </span>
        </span>
      </div>
      <div class="chart-container">
        <div id="chart"></div>
      </div>
      <div class="list-header">
        <span>日期</span>
        <span>数值</span>
      </div>
      <div v-if="dataList.length > 0">
        <div class="list-content" v-for="(item,index) in dataList" :key="index">
          <span>{{item.name}}</span>
          <span>{{item.val}}</span>
        </div>
      </div>
      <div v-else class="list-content list-tips">暂无数据</div>
      <mt-popup v-model="popupVisible" position="bottom">
        <mt-picker :slots="slots" @change="setdType" valueKey="valueKey"></mt-picker>
      </mt-popup>
      <div class="pickerPop">
        <mt-datetime-picker
          v-model="dateVal"
          type="date"
          ref="picker"
          @confirm="handleConfirm"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日"
        ></mt-datetime-picker>
      </div>
    </div>
  </div>
</template>

<script>
import LChart from "@/components/Chart.vue";
import chartOpation from "@/assets/scripts/chartOpation";
import HighCharts from "highCharts";
import moment from "moment";
import { Popup, Picker, DatetimePicker } from "mint-ui";
export default {
  name: "Factor",
  components: {
    "line-chart": LChart,
    "mt-popup": Popup,
    "mt-picker": Picker,
    "mt-datetime-picker": DatetimePicker
  },
  data() {
    return {
      factorId: 0,
      startTime: moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD"),
      endTime: moment().format("YYYY-MM-DD"),
      filterHeader: [
        { factor: "选择类型", value: "", key: "factor1" },
        { factor: "开始时间", value: "", key: "factor2" },
        { factor: "结束时间", value: "", key: "factor3" }
      ],
      isShowBorder: true,
      opation: chartOpation.lineOpation,
      dataList: [],
      dValue: "小时均值",
      dType: "H", //Y:年均值,M:月均值,D:日均值,H:小时均值,R:原始值 string,
      popupVisible: false,
      slots: [
        {
          values: [
            { valueKey: "小时均值", value: "H" },
            { valueKey: "日均值", value: "D" },
            { valueKey: "月均值", value: "M" },
            { valueKey: "年均值", value: "Y" },
            { valueKey: "原始值", value: "R" }
          ],
          textAlign: "center"
        }
      ],
      dateVal: "", //datetime picker绑定的时间
      selectTime: "startTime",
      loading: true,
      chartData: [0, 0, 0, 0, 0, 0, 0]
    };
  },
  computed: {
    siteId() {
      return this.$store.state.siteId;
    },
    factorData() {
      return this.$store.state.factorData;
    },
    title() {
      if (this.factorData && this.factorData.name) {
        return this.factorData.name;
      }
    }
  },
  watch: {
    dType() {
      this.getFactVal();
    }
  },
  created() {
    this.filterHeader[0].value = this.dValue;
    this.filterHeader[1].value = this.startTime;
    this.filterHeader[2].value = this.endTime;
    this.factorId = this.$route.params.id;
    this.getFactVal();
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    getFactVal() {
      const payload = {
        refId: this.siteId,
        fromType: 0,
        facId: this.factorData.id,
        sDate: this.startTime,
        eDate: this.endTime,
        dType: this.dType,
        vType: 0,
        dataType: 0 //0：单因子 1：因子组
      };
      this.$api.getFactVal(payload).then(res => {
        if (res instanceof Array && res.length > 0) {
          this.dataList = res;
          let tempArr = [];
          res.forEach(item => {
            tempArr.push(item.val);
          });
          this.chartData = tempArr;
          this.drawChart();
        } else {
          this.chartData = [0, 0, 0, 0, 0, 0, 0];
        }
      });
    },
    changeFilter(index) {
      if (index === "factor1") {
        this.popupVisible = true;
      } else if (index === "factor2") {
        this.dateVal = this.startTime;
        this.selectTime = "startTime";
        this.$refs.picker.open();
      } else if (index === "factor3") {
        this.dateVal = this.endTime;
        this.selectTime = "endTime";
        this.$refs.picker.open();
      }
    },
    setdType(picker) {
      const selectedVal = picker.getValues();
      if (selectedVal instanceof Array && selectedVal.length === 1) {
        this.dType = selectedVal[0].value;
        this.filterHeader[0].value = selectedVal[0].valueKey;
      }
    },
    handleConfirm() {
      const date = moment(this.dateVal).format("YYYY-MM-DD");
      if (this.selectTime === "startTime") {
        this.filterHeader[1].value = date;
        this.startTime = date;
      } else {
        this.filterHeader[2].value = date;
        this.endTime = date;
      }
      this.getFactVal();
    },
    drawChart() {
      let interval, format, satrtTime;
      const intervalH = 3600 * 1000; // one hour
      const intervalD = 3600 * 1000 * 24; // one day
      const intervalM = 3600 * 1000 * 24 * 30; // one month
      const intervalY = 3600 * 1000 * 24 * 365; // one year

      const year = moment(this.startTime).format("YYYY");
      const month = moment(this.startTime).format("M");
      const day = moment(this.startTime).format("D");

      if (this.dType == "H") {
        interval = intervalH;
        format = "%H:%M";
        satrtTime = Date.UTC(year, month, day);
      } else if (this.dType == "D") {
        interval = intervalD;
        format = "%e. %b '%y";
        satrtTime = Date.UTC(year, month, day);
      } else if (this.dType == "M") {
        interval = intervalM;
        format = "%b '%y";
        satrtTime = Date.UTC(year, month, 0);
      } else if (this.dType == "Y") {
        interval = intervalY;
        format = "%Y";
        satrtTime = Date.UTC(year, 0, 0);
      }

      HighCharts.chart("chart", {
        chart: {
          zoomType: "x",
          marginLeft: 25,
          marginTop: 25
        },
        title: {
          text: null
        },

        subtitle: {
          text: null
        },
        credits: { enabled: false },
        xAxis: {
          gridLineDashStyle: "grid",
          gridLineColor: "#e9edf0",
          gridLineWidth: 1,
          type: "datetime",
          labels: {
            align: "left",
            x: -30,
            y: 15,
            style: {
              color: "#999"
            },
            formatter: function() {
              return HighCharts.dateFormat(format, this.value);
            }
          }
        },
        yAxis: {
          title: null,
          gridLineDashStyle: "grid",
          gridLineColor: "#e9edf0",
          gridLineWidth: 1,
          labels: {
            align: "left",
            x: -25,
            y: 0,
            style: {
              color: "#999"
            }
          }
        },

        series: [
          {
            showInLegend: false,
            data: this.chartData,
            pointStart: satrtTime,
            pointInterval: interval,
            marker: {
              enabled: false
            }
          }
        ],
        tooltip: {
          enabled: false
        },
        exporting: {
          enabled: false
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../assets/scss/_flex.scss";
.filter-list {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  background: rgba(255, 255, 255, 1);
  height: 1.12rem;
  border-bottom: solid 1px #e0e0e0;
  padding: 0 0.32rem;
  > span:first-child {
    color: rgba(48, 48, 48, 1);
    font-size: 0.34rem;
  }
  > span:last-child {
    color: #9a9a9a;
    font-size: 0.32rem;
    .icon {
      display: inline-block;
      margin-left: 0.16rem;
      svg {
        width: 0.36rem;
        height: 0.36rem;
      }
    }
  }
}
.filter-list:nth-child(3) {
  border: 0;
}
.chart-container {
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
  margin-top: 0.4rem;
  height: 4.14rem;
  background: rgba(255, 255, 255, 1);
}
#chart {
  width: 6.6rem;
  height: 4rem;
}
.list-header,
.list-content {
  @include flexbox;
  @include align-items(center);
  @include justify-content(space-between);
  font-size: 0.34rem;
  color: rgba(48, 48, 48, 1);
  padding: 0 0.32rem;
}
.list-header {
  height: 0.8rem;
  background: rgba(241, 245, 247, 1);
}
.list-content {
  background: rgba(255, 255, 255, 1);
  border-bottom: solid 1px #e0e0e0;
  height: 1.12rem;
  > span:last-child {
    font-size: 0.3rem;
    color: rgba(0, 0, 0, 1);
  }
}
.list-tips {
  @include justify-content(center);
  font-size: 0.3rem;
}
.mint-popup {
  width: 100%;
}
</style>