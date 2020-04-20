<template>
  <div class="content" id="emMap">
    <header-bar leftIcon="back" leftText="返回" :showBorder="isShowBorder">{{moduleName}}</header-bar>
    <div class="map-container">
      <div id="map-container"></div>
       <img class="center-position" src="@/assets/images/location2.png" />
    </div>
    <div class="footer">
      <button @click="getMyPosition">
        <span class="leftImg"></span>
        <span>定位当前</span>
      </button>
      <button @click="setLocation">
        <span class="rightImg"></span>
        <span>确定位置</span>
      </button>
    </div>
    <div class="location-tips">{{ location }}</div>
  </div>
</template>

<script>
{
  if (!AMap) {
    const key = "84af24a85c0ce6dbaa1dfca048fda1ae";
    let script = document.createElement("script");
    script.src = "https://webapi.amap.com/maps?v=1.4.15&key=" + key;
    document.head.appendChild(script);
  }
}
export default {
  name: "detailMap",
  data() {
    return {
      isShowBorder: false,
      moduleName: "选取位置",
      location: "",
      centerLocation: [],
      markers: {},
      routerId: "",
      latLngObj: {},
      latLngArr: [],
      zoom: 17,
      lat: 0,
      lng: 0
    };
  },
  watch: {
    lat() {
      this.location = `${this.lng} E,${this.lng} N`;
      this.map.setCenter([this.lng, this.lat]);
    },
    lng() {
      this.location = `${this.lng} E,${this.lng} N`;
      this.map.setCenter([this.lng, this.lat]);
    }
  },
  mounted() {
    this.routerId = this.$route.params.id;
    this.getStoreData();
    setTimeout(() => {
      this.initMap();
    }, 1000);
  },
  methods: {
    getStoreData() {
      this.latLngArr = JSON.parse(JSON.stringify(this.$store.state.latLngArr));
      this.latLngArr.forEach(lItem => {
        if (lItem.selected) {
          this.latLngObj = lItem;
          if (lItem.value) {
            this.location = this.latLngObj.value;
          }
        }
      });
    },
    getLocation() {
      let tempArr = this.location.split(",");
      if (Array.isArray(tempArr) && tempArr.length === 2) {
        let lat = tempArr[1].split(" N")[0];
        let lng = tempArr[0].split(" E")[0];
        this.centerLocation = [lat, lng];
        this.addMarker();
      }
    },
    initMap() {
      this.map = new AMap.Map("map-container", {
        zoom: this.zoom
      });
      this.getCenter();
      if (
        !this.location ||
        !this.location.length ||
        this.location === "0E，0N"
      ) {
        this.getMyPosition();
      } else {
        this.getLocation();
      }
      this.map.on("moveend", () => {
        this.getCenter();
      });
    },
    getCenter() {
      const p = this.map.getCenter();
      this.lat = p.lat;
      this.lng = p.lng;
    },
    getMyPosition() {
      AMap.plugin("AMap.Geolocation", () => {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000
        });
        AMap.event.addListener(geolocation, "complete", e => {
          this.lat = e.position.lat;
          this.lng = e.position.lng;
        });
      });
    },
    setLocation() {
      this.latLngArr.forEach((liItem, liIndex) => {
        if (liItem.selected) {
          liItem.value = this.location;
        }
      });
      this.$store.commit("set_latLng", this.latLngArr);
      this.$router.replace(`/emissionsDetail/${this.routerId}`);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/_flex.scss";
#emMap {
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
  .center-position {
    position: fixed;
    left: 0;
    right: 0;
    top: 2.32rem;
    bottom: 1.69rem;
    margin: auto;
    height: 0.44rem;
    width: 0.3rem;
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
.amap-copyright,
.amap-logo {
  display: none !important;
}
</style>