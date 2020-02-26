<template>
  <div class="content" id="eventMap">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div class="map-container">
      <div id="map-container"></div>
    </div>
    <div class="footer">
      <button @click="getCurrentPosition">
        <span class="leftImg"></span>
        <span>定位当前</span>
      </button>
      <button @click="setLocation">
        <span class="rightImg"></span>
        <span>确定位置</span>
      </button>
    </div>
    <div class="location-tips">{{this.location}}</div>
  </div>
</template>

<script>
export default {
  name: "EventMap",
  data() {
    return {
      isShowBorder: false,
      moduleName: "事件位置",
      location: "",
      centerLocation: [],
      markers: {},
      routerId: ""
    };
  },
  mounted() {
    this.routerId = this.$route.params.id;
    this.centerLocation = JSON.parse(JSON.stringify(this.$store.state.eventLatLng));
    if (!this.centerLocation.length) {
      this.getCurrentPosition();
    } else {
      this.getLocation();
      this.initMap();
    }
  },
  methods: {
    getLocation() {
      this.location = `${this.centerLocation[1]} E,${this.centerLocation[0]} N`;
    },
    initMap() {
      this.map = this.$map.createMap("map-container", {
        zoomControl: false,
        attributionControl: false
      });
      // 加载 open street map 图层服务
      this.$map.createTileLayer(this.map);
      this.addMarker();
      this.map.on("click", e => {
        const lng = e.latlng.lng.toFixed(5);
        const lat = e.latlng.lat.toFixed(5);
        this.location = `${lng} E,${lat} N`;
        this.centerLocation = [lat, lng];
        this.addMarker();
      });
    },
    addMarker() {
      // 设施地图视图 中心位置
      if (this.markers) {
        this.map.removeLayer(this.markers);
      }
      this.map.setView(this.centerLocation, 16);
      const icon = L.icon({
        iconUrl: require("@/assets/images/location2.png"),
        iconSize: [16, 22.2]
      });
      this.markers = L.marker(this.centerLocation, {
        icon: icon
      }).addTo(this.map);
    },
    getCurrentPosition() {
      this.$map.loadScript().then(AMap => {
        AMap.plugin("AMap.Geolocation", () => {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000 //超过10秒后停止定位，默认：5s
          });
          geolocation.getCurrentPosition((status, result) => {
            if (status == "complete") {
              //解析定位结果
              if (result.position) {
                this.location = `${result.position.lng} E,${result.position.lat} N`;
                this.centerLocation = [
                  result.position.lat,
                  result.position.lng
                ];
                if (this.map) {
                  this.addMarker();
                } else {
                  this.initMap();
                }
              }
            } else {
              //解析定位错误信息
              console.error(result);
            }
          });
        });
      });
    },
    setLocation() {
      this.$store.commit("set_eventLatLng", JSON.parse(JSON.stringify(this.centerLocation)));
      this.$router.push(`/eventContent/${this.routerId}`);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
#eventMap {
  .map-container {
    @include flexbox;
    @include justify-content(center);
    position: absolute;
    left: 0;
    top: 1.29rem;
    width: 100%;
    height: calc(100% - 2.57rem);
    #map-container {
      width: 100%;
      height: 100%;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1.28rem;
    background: rgba(255, 255, 255, 1);
    @include flexbox;
    @include flex-direction(row);
    padding: 0.16rem 0;
    > button:first-child {
      width: 2.55rem;
      height: 0.96rem;
      border-radius: 0.03rem;
      border: 0.02rem solid rgba(50, 150, 250, 1);
      margin: 0 calc(33% - 2.15rem);
      > span {
        color: rgba(50, 150, 250, 1);
        font-size: 0.34rem;
      }
      > span:first-child {
        display: inline-block;
        width: 0.36rem;
        height: 0.36rem;
        background: url("../../../assets/images/currentLocation.png") no-repeat
          left center;
        background-size: 0.36rem 0.36rem;
        margin-right: 0.16rem;
      }
    }
    > button:nth-child(2) {
      width: 3.99rem;
      height: 0.96rem;
      background: rgba(50, 150, 250, 1);
      border-radius: 0.03rem;
      > span {
        color: rgba(255, 255, 255, 1);
        font-size: 0.34rem;
      }
      > span:first-child {
        display: inline-block;
        width: 0.36rem;
        height: 0.36rem;
        background: url("../../../assets/images/shape.png") no-repeat left
          center;
        background-size: 0.36rem 0.36rem;
        margin-right: 0.16rem;
      }
    }
  }
  .location-tips {
    position: absolute;
    top: 1.6rem;
    left: calc(50% - 3rem);
    z-index: 999;
    width: 6rem;
    height: 0.8rem;
    background: rgba(219, 238, 255, 1);
    border-radius: 0.03rem;
    @include flexbox;
    @include justify-content(center);
    @include align-items(center);
    color: rgba(50, 150, 250, 1);
    font-size: 0.34rem;
  }
}
</style>