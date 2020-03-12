<template>
  <div class="lnglat-box">
    <input
      class="selectbox"
      :value="myval2"
      readonly="readonly"
      @click="showMap = true"
    />
    <van-popup
      v-model="showMap"
      position="right"
    >
      <div
        class="map-content"
        :style="mapStyle"
      >
        <div
          class="map-main"
          ref="mapp"
        ></div>
        <van-button
          type="default"
          @click="showMap = false"
          class="cancel-btn"
        >取消</van-button>
        <van-button
          type="info"
          class="ok-btn"
          @click="onConfirm"
        >确定</van-button>
        <div class="location-box">
          <van-icon
            name="location"
            class="location"
            size="0.6rem"
            color="red"
          />
        </div>
        <div class="info-box">{{ myval }}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
const PI = 3.1415926535897932384626
const a = 6378245.0
const ee = 0.00669342162296594323

import { Popup, Button, Icon } from 'vant'
export default {
  name: 'lnglat',
  components: {
    'van-popup': Popup,
    'van-button': Button,
    'van-icon': Icon
  },
  props: {
    fieldLable: {
      type: String,
      default: '经纬度'
    },
    lng: {
      type: [String, Number],
      default: 117.000923
    },
    lat: {
      type: [String, Number],
      default: 36.675807
    }
  },
  data() {
    return {
      map: null,
      showMap: false,
      mylng: this.wgs84togcj02(this.lng, this.lat)[0].toFixed(8),
      mylat: this.wgs84togcj02(this.lng, this.lat)[1].toFixed(8)
    }
  },
  computed: {
    mapStyle() {
      return {
        width: window.innerWidth + 'px',
        height: window.innerHeight + 'px'
      }
    },
    trueLngLat() {
      let data = this.gcj02towgs84(this.mylng, this.mylat)
      return {
        lng: data[0].toFixed(8),
        lat: data[1].toFixed(8)
      }
    },
    myval() {
      return `${this.trueLngLat.lng} E, ${this.trueLngLat.lat} N`
    },
    myval2() {
      return `${this.lng} E, ${this.lat} N`
    }
  },
  watch: {
    showMap() {
      this.$nextTick(() => {
        this.defaultMap()
      })
    },
    lng() {
      this.mylng = this.wgs84togcj02(this.lng, this.lat)[0].toFixed(8)
      this.mylat = this.wgs84togcj02(this.lng, this.lat)[1].toFixed(8)
    },
    lat() {
      this.mylng = this.wgs84togcj02(this.lng, this.lat)[0].toFixed(8)
      this.mylat = this.wgs84togcj02(this.lng, this.lat)[1].toFixed(8)
    }
  },
  methods: {
    defaultMap() {
      this.map = new AMap.Map(this.$refs.mapp, {
        center: [this.mylng, this.mylat],
        zoom: 11,
        resizeEnable: true
      });
      this.map.on('moveend', this.logMapinfo)
      this.map.on('zoomend', this.logMapinfo)
    },
    logMapinfo() {
      let data = this.map.getCenter()
      this.mylng = data.lng
      this.mylat = data.lat
    },
    onConfirm() {
      this.$emit('submit', this.trueLngLat)
      this.showMap = false
    },
    wgs84togcj02(lng, lat) {
      lng = Number(lng)
      lat = Number(lat)
      let dlat = this.transformlat(lng - 105.0, lat - 35.0)
      let dlng = this.transformlng(lng - 105.0, lat - 35.0)
      let radlat = lat / 180.0 * PI
      let magic = Math.sin(radlat)
      magic = 1 - ee * magic * magic
      let sqrtmagic = Math.sqrt(magic)
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
      let mglat = lat + dlat
      let mglng = lng + dlng
      return [mglng, mglat]
    },
    gcj02towgs84(lng, lat) {
      lng = Number(lng)
      lat = Number(lat)
      let dlat = this.transformlat(lng - 105.0, lat - 35.0)
      let dlng = this.transformlng(lng - 105.0, lat - 35.0)
      let radlat = lat / 180.0 * PI
      let magic = Math.sin(radlat)
      magic = 1 - ee * magic * magic
      let sqrtmagic = Math.sqrt(magic)
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
      let mglat = lat + dlat
      let mglng = lng + dlng
      return [lng * 2 - mglng, lat * 2 - mglat]
    },
    transformlat(lng, lat) {
      let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
      ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
      ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
      return ret
    },
    transformlng(lng, lat) {
      let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
      ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
      ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
      ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
      return ret
    }
  }
}
</script>

<style lang="scss">
.lnglat-box {
  input {
    width: 100%;
    border: 0;
    line-height: 0.48rem;
    min-height: 0.48rem;
    font-size: 0.34rem;
    color: #3d3d3d;
    padding: 0.01rem 0 0.14rem 0;
  }
  .map-content {
    width: 100px;
    height: 100px;
    .map-main {
      height: 100%;
      width: 100%;
    }
    .cancel-btn {
      position: fixed;
      z-index: 999;
      left: 1rem;
      bottom: 0.7rem;
      width: 2rem;
    }
    .ok-btn {
      position: fixed;
      z-index: 999;
      right: 1rem;
      bottom: 0.7rem;
      width: 2rem;
    }
    .location-box {
      position: fixed;
      z-index: 999;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 0.6rem;
      height: 0.6rem;
    }
    .location {
      position: relative;
      top: -0.3rem;
    }
    .info-box {
      position: fixed;
      width: 80%;
      background: #fff;
      line-height: 1rem;
      font-size: 0.3rem;
      top: 0.7rem;
      left: 0;
      right: 0;
      margin: auto;
      text-align: center;
      box-shadow: 0 4px 6px #ebedf0;
    }
  }
  .amap-logo,
  .amap-copyright {
    bottom: -100px;
  }
}
</style>
