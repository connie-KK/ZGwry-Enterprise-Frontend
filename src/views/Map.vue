<template>
  <div class="content">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div class="main-content">
      <div class="map-container">
        <div id="map-container"></div>
        <MapTools @marker="addMarker"></MapTools>
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
      OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    };
  },
  computed: {
    location() {
      return this.$store.state.ariLoaction;
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
        zoomControl: false
      });
      // 加载 open street map 图层服务
      this.$map.createTileLayer(this.map, this.OSMUrl, {});

      // 设施地图视图 中心位置
      let centerLocation;
      if (this.location instanceof Array && this.location.length > 0) {
        centerLocation = this.location[0];
      } else {
        centerLocation = [38.97138889, 117.5761111];
      }
      this.map.setView(centerLocation, 11);
    },
    addMarker() {
      let gifIcon = this.$map.createIcon({
        iconUrl: require("./../assets/images/location.png"),
        iconSize: [32, 32]
      });
      this.location.forEach(item => {
        let marker = this.$map.createMakerByXY(this.map, item, {
          icon: gifIcon,
          interactive: false
        });
        let popup = this.$map.createPopup(
          this.map,
          {
            maxWidth: 200,
            minWidth: 30,
            className: "sample-popup"
          },
          item
        );
        popup.setContent(`<div>红旗</div><div>219.0</div>`);
        marker.bindTooltip();
        marker.bindPopup(popup).openPopup();
      });
    },
    addPolygon() {},
    addPolyline() {}
  }
};
</script>
<style lang="scss" scoped>
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
}
</style>
