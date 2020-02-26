<template>
  <div class="content" id="mapPosition">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearch="isShowSearch"
      :showBorder="isShowBorder"
      :serachFun="toSearchList"
    >
      {{ moduleName }}
    </header-bar>
    <div class="main-content">
      <div class="map-container">
        <div id="map-container"></div>
        <img class="center-position" src="@/assets/images/location2.png" />
        <div class="position">
          <div class="position-now" @click="getMyPosition">
            <img src="@/assets/images/position.png" />
            <span>定位当前</span>
          </div>
          <div class="position-ok" @click="submit">
            <img src="@/assets/images/check-cycle.png" />
            <span>确定位置</span>
          </div>
          <div class="info-box">
            <input v-model="area" />
            <p>{{ lng }}E, {{ lat }} N</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
{
  const key = '84af24a85c0ce6dbaa1dfca048fda1ae'
  let script = document.createElement('script')
  script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=' + key
  document.head.appendChild(script)
}
export default {
  name: 'mapPosition',
  data() {
    return {
      moduleName: '相关位置',
      searchKey: '',
      isShowSearch: true,
      isShowBorder: false,
      zoom: 17,
      map: null,
      area: '',
      lat: 0,
      lng: 0
    }
  },
  computed: {},
  watch: {
    lat() {
      this.map.setCenter([this.lng, this.lat])
    },
    lng() {
      this.map.setCenter([this.lng, this.lat])
    }
  },
  mounted() {
    setTimeout(() => {
      this.initMap()
    }, 1000)
  },
  methods: {
    toSearchList(e) {
      this.getLnglat(e)
    },
    initMap() {
      this.map = new AMap.Map('map-container', {
        zoom: this.zoom
      })
      this.getCenter()
      this.getMyPosition()
      this.map.on('moveend', () => {
        this.getCenter()
      })
    },
    getCenter() {
      const p = this.map.getCenter()
      this.lat = p.lat
      this.lng = p.lng
      this.getArea([this.lng, this.lat])
    },
    getArea(lnglat) {
      AMap.plugin('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder()
        geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.area = result.regeocode.formattedAddress
          }
        })
      })
    },
    getLnglat(area) {
      AMap.plugin('AMap.Geocoder', () => {
        let geocoder = new AMap.Geocoder()
        geocoder.getLocation(area, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            if (result.geocodes.length) {
              const p = result.geocodes[0].location
              this.lat = p.lat
              this.lng = p.lng
            }
          }
        })
      })
    },
    getMyPosition() {
      AMap.plugin('AMap.Geolocation', () => {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000
        })
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', e => {
          this.lat = e.position.lat
          this.lng = e.position.lng
          this.area = e.formattedAddress
        })
      })
    },
    submit() {
      this.$store.state.taskParams.taskcoords.push({
        index: 0,
        remark: '',
        lat: this.lat,
        lng: this.lng,
        title: this.area
      })
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/scss/_flex.scss';
.amap-copyright,
.amap-logo {
  display: none !important;
}
#mapPosition {
  .main-content {
    height: calc(100% - 2.32rem);
    top: 2.32rem;
    .map-container {
      @include flexbox;
      @include justify-content(center);
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100% - 1.25rem);
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
  .mappopup {
    text-align: center;
    font-size: 0.2rem;
    padding: 0.07rem;
    text-shadow: 0px 1px 6px rgba(0, 0, 0, 0.7);
  }
  .leaflet-popup-content-wrapper {
    padding: 0;
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
  .info-box {
    position: fixed;
    top: 2.65rem;
    width: 100%;
    left: 0;
    input,
    p {
      display: block;
      border: 0;
      width: calc(100% - 1.5rem);
      font-size: 0.3rem;
      margin: 0;
      min-height: 0.8rem;
      line-height: 0.5rem;
      padding: 0.15rem 0.1rem;
      text-align: center;
      background: #dbeeff;
      margin: 0 0.75rem 0.2rem;
      color: #3296fa;
    }
  }
  .position {
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0.16rem 0.32rem;
    z-index: 9999;
    width: 100%;
    overflow: hidden;
    .position-now {
      float: left;
      width: 2.7rem;
      border: 1px solid #3296fa;
      color: #3296fa;
    }
    .position-ok {
      float: right;
      width: 4rem;
      border: 1px solid #3296fa;
      background: #3296fa;
      color: #fff;
    }
    div {
      text-align: center;
      height: 0.96rem;
      span {
        font-size: 0.34rem;
        vertical-align: middle;
        line-height: 0.96rem;
      }
      img {
        width: 0.36rem;
        height: 0.36rem;
        vertical-align: middle;
        margin-right: 0.08rem;
      }
    }
  }
}
</style>
