<template>
  <div id="sign">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
    >签名</header-bar>
    <div class="main-content-with-bottom">
      <div class="signature" ref="boardBox">
        <canvas ref="board" @touchstart="mStart" @touchmove="mMove" @touchend="mEnd"></canvas>
      </div>
    </div>
    <div class="footer">
      <button class="clearCanvas" @click="clearSign">清空重写</button>
      <button class="saveCanvas" @click="saveSign" >提交签名</button>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      isShowSearchIcon: false,
      isShowBorder: true,
      ctx: null,
      boardBox:null,
      canvas:null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 保存签名
    saveSign() {},
    init() {
      this.canvas = this.$refs.board; // 获取DOM
      this.boardBox = this.$refs.boardBox;
      debugger
      this.canvas.width = this.boardBox.offsetWidth; // 设置画布宽
      this.canvas.height = this.boardBox.offsetHeight; // 设置画布高
      this.ctx = this.canvas.getContext("2d"); // 二维绘图
      this.ctx.strokeStyle = "#000"; // 颜色
      this.ctx.lineWidth = 3; // 线条宽度
    },
    // 触摸(开始)
    mStart(e) {
      this.ctx.beginPath();
      this.ctx.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    },
    // 滑动中...
    mMove(e) {
      this.ctx.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
      this.ctx.stroke();
    },
    // 滑动结束
    mEnd() {
      this.ctx.closePath();
    },
    clearSign(){
      this.ctx.clearRect(0, 0, this.boardBox.offsetWidth, this.boardBox.offsetHeight);
    },
    saveSign(){
      let image = this.canvas.toDataURL();
      let formList = this.$store.state.taskFormList
      formList.forEach((item,index) => {
        if(item.toSign){
          item.image = image
          item.toSign = false
          this.$set(formList,index,item)
        }
      })
      this.$store.commit("set_taskFormList",formList)
      this.$router.go(-1)
    }
  }
};
</script>
 
<style lang="scss">
.signature {
  width: 100%;
  height: 100%;
  background: #fff;
  overflow: hidden;
}

#canvas canvas {
  display: block;
  background: #f3f3f3;
  border-radius: 8px;
  margin: 0 auto;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 1.28rem;
  background: rgba(255, 255, 255, 1);
  border-top: solid 1px #e0e0e0;
  @include flexbox;
  @include justify-content(space-between);
  padding: 0.16rem 0.32rem;
  font-size: 0.34rem;
  .clearCanvas {
    width: 2.55rem;
    height: 0.96rem;
    border-radius: 3px;
    border: 2px solid rgba(50, 150, 250, 1);
    color: rgba(50, 150, 250, 1);
  }

  .saveCanvas {
    width: 3.99rem;
    height: 0.96rem;
    background: rgba(50, 150, 250, 1);
    border-radius: 3px;
    color: #ffffff;
  }
}
</style>