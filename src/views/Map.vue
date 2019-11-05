<template>
  <div class="content">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="map-container">
        <div id="map-container"></div>
        <MapTools :changeMaker="addMarker"></MapTools>
      </div>
    </div>
  </div>
</template>

<script>
import MapTools from "@/components/MapTools.vue";
export default {
  name: "MapView",
  components: { MapTools },
  data() {
    return {
      isShowBorder: false,
      moduleName: "AQI分布情况",
      map: null,
      OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      markerArr: [],
      defaultColor: "#d8d8d8"
    };
  },
  computed: {
    location() {
      let arr = JSON.parse(JSON.stringify(this.$store.state.airList));
      arr.forEach(item => {
        if (!item.AQI && typeof item.AQI !== "undefined" && item.AQI != 0) {
          item.AQI = "--";
          item.color = this.defaultColor;
        }
      });
      return arr;
    }
  },
  mounted() {
    this.initMap();
    this.addMarker();
    this.map.on("click", e => {
      this.addMarker();
    });
  },
  methods: {
    initMap() {
      this.map = this.$map.createMap("map-container", {
        zoomControl: false,
        attributionControl: false
      });
      // 加载 open street map 图层服务
      this.$map.createTileLayer(this.map, this.OSMUrl, {});

      // 设施地图视图 中心位置
      let centerLocation;
      if (this.location instanceof Array && this.location.length > 0) {
        const firstPoint = this.location[0];
        centerLocation = [firstPoint.Loclat, firstPoint.Loclng];
      } else {
        centerLocation = [38.97138889, 117.5761111];
      }
      this.map.setView(centerLocation, 10);
    },
    addMarker(markerType = "AQI") {
      if (this.markerArr instanceof Array && this.markerArr.length > 0) {
        this.markerArr.forEach((item, index) => {
          this.map.removeLayer(this.markerArr[index]);
        });
      }
      let gifIcon = this.$map.createIcon({
        iconUrl: require("./../assets/images/location.png"),
        iconSize: [32, 32]
      });
      let colorClassText = "";
      this.location.forEach((item, index) => {
        this.markerArr[index] = this.$map.createMakerByXY(
          this.map,
          [item.Loclat, item.Loclng],
          {
            icon: gifIcon,
            interactive: false
          }
        );

        this.getMarkerVal(index, markerType);
        
        let popup = this.$map.createPopup(this.map, {
          maxWidth: 200,
          minWidth: 60,
          className: `color-box-${index}`
        });
        colorClassText += `.color-box-${index}{background:${item.color};} `;
        popup.setContent(
          `<div>${item.StationName}</div><div>${item[markerType]}</div>`
        );
        // this.markerArr[index].bindTooltip();
        this.markerArr[index].bindPopup(popup).openPopup();
      });
      document.getElementById("color-box").innerText = colorClassText;
    },
    getMarkerVal(index, type) {
      let tempArr = this.location[index];
      tempArr.FactorVals.forEach(facItem => {
        if (facItem.FacName === type) {
          if (
            !facItem.IAqi &&
            typeof facItem.IAqi !== "undefined" &&
            facItem.IAqi != 0
          ) {
            //为null
            tempArr[type] = "--";
            tempArr.color = this.defaultColor;
          } else {
            tempArr[type] = facItem.IAqi;
            tempArr.color = facItem.Color;
          }
        }
      });
      this.$set(this.location, index, tempArr);
    }
  }
};
</script>
<style lang="scss">
@import "../assets/scss/_flex.scss";
.main-content {
  height: calc(100% - 1.29rem);
  .map-container {
    @include flexbox;
    @include justify-content(center);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    #map-container {
      width: 100%;
      height: 100%;
    }
  }
  .leaflet-popup-content-wrapper {
    height: 40px;
    background: transparent;
    border-radius: 3px;
    color: rgba(255, 255, 255, 1);
    font-size: 14px;
    .leaflet-popup-content {
      @include flexbox;
      @include align-items(center);
      @include justify-content(space-around);
      @include flex-direction(column);
      height: 100%;
      margin: 0;
    }
  }
  .leaflet-popup-tip-container,
  .leaflet-popup-close-button {
    display: none;
  }
}
</style>
