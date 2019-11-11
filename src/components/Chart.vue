<template>
  <div :id="id"></div>
</template> 

<script>
import HighCharts from "highCharts";
import moment from "moment";
export default {
  name: "Chart",
  props: {
    id: {
      type: String,
      default: "chart"
    },
    dateStart: {
      type: String,
      default: moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD")
    },
    dateType: {
      type: String,
      default: "H" //Y:年均值,M:月均值,D:日均值,H:小时均值,R:原始值 string,
    },
    dateEnd: {
      type: String,
      default: moment().format("YYYY-MM-DD")
    },
    datas: {
      //数据
      type: Array,
      default: () => {
        return [];
      }
    },
    opation: {
      //折线图配置项
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    datas() {
      console.log(this.datas);
    }
  },
  mounted() {
    HighCharts.dateFormats = {
      W: function(timestamp) {
        var date = new Date(timestamp),
          day = date.getUTCDay() === 0 ? 7 : date.getUTCDay(),
          dayNumber;
        date.setDate(date.getUTCDate() + 4 - day);
        dayNumber = Math.floor(
          (date.getTime() - new Date(date.getUTCFullYear(), 0, 1, -6)) /
            86400000
        );
        return 1 + Math.floor(dayNumber / 7);
      }
    };
    HighCharts.chart(this.id, {
      chart: {
        type: "line",
        zoomType: "x",
        panning: true,
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
      yAxis: [
        {
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
        }
      ],
      xAxis: [
        {
          type: "datetime",
          tickInterval: 12,
          gridLineDashStyle: "grid",
          gridLineColor: "#e9edf0",
          gridLineWidth: 1,
          dateTimeLabelFormats: {
            millisecond: "%H:%M:%S.%L",
            second: "%H:%M:%S",
            minute: "%H:%M",
            hour: "%H:%M",
            day: "%m-%d",
            week: "%m-%d",
            month: "%Y-%m",
            year: "%Y"
          }
        }
      ],

      series: [
        {
          name: "",
          showInLegend: false,
          type: "line",
          lineWidth: 1,
          color: "#5B8FF9",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          marker: {
            enabled: false
          },
          pointStart: Date.UTC(2013, 1, 7)
        }
      ],
      tooltip: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom"
              }
            }
          }
        ]
      }
    });
  }
};
</script>
