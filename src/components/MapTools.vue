<template>
  <div class="map-tools">
    <ul>
      <li
        v-for="(item,index) in list"
        :key="index"
        :class="selectedIndex == index?'selectedLi':''"
        @click="changeSelect(index)"
      >{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "mapNavigation",
  props: {
    changeMaker: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    return {
      list:[
        {name:"AQI",type:"AQI"},
        {name:"PM10",type:"PM10"},
        {name:"PM2.5",type:"PM2.5"},
        {name:"O3",type:"臭氧"},
        {name:"CO",type:"一氧化碳"},
      ],
      selectedIndex: 0
    };
  },
  methods: {
    changeSelect(index) {
      this.selectedIndex = index;
      this.changeMaker(this.list[index].type)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/scss/_flex.scss";
.map-tools {
  position: absolute;
  top: 0.32rem;
  z-index: 999;
  height: 0.56rem;
  ul {
    @include flexbox;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      @include flexbox;
      @include align-items(center);
      @include justify-content(center);
      width: 1.38rem;
      height: 0.56rem;
      font-size: 0.28rem;
      line-height: 0.56rem;
      background-color: #fff;
      color: rgba(50, 150, 250, 1);
      cursor: pointer;
      border: solid 2px #3296fa;
      border-right: 0;
    }
    > li:first-child {
      border-radius: 3px 0 0 3px;
    }
    > li:last-child {
      border-right: solid 2px #3296fa;
      border-radius: 0 3px 3px 0;
    }
    .selectedLi {
      background: rgba(50, 150, 250, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>

