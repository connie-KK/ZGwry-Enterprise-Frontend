<template>
  <div :id="id" :opation="opation"></div>
</template> 

<script>
import HighCharts from "highCharts";
export default {
  name: "Chart",
  props: {
    id: {
      type: String,
      default: "chart"
    },
    opation: {
      //折线图配置项
      type: Object,
      default: ()=> {
          return {}
      }
    }
  },
  mounted() {
    HighCharts.chart(this.id, this.opation);
  }
};
</script>
