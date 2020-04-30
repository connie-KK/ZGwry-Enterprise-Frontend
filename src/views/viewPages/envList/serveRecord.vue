<template>
  <div id="serverecord">
    <header-bar leftIcon="back" leftText="返回" :isShowSearchIcon="isShowSearchIcon" :showBorder="isShowBorder">
      {{ moduleName }}
    </header-bar>
    <div class="main-content">
      <div class="box-item">
        <p class="item-title1">时间</p>
        <p class="item-msg">环保管家服务（交办）</p>
      </div>
      <div class="box-item">
        <p class="item-title1">任务派发时间</p>
        <p class="item-msg">2019-04-31 21:33</p>
      </div>
      <div class="box-item">
        <p class="item-title1">现场检查时间</p>
        <p class="item-msg">2019-04-31 21:33</p>
      </div>
      <p class="gang"></p>
      <div class="box-item">
        <p class="item-title1">时间</p>
        <p class="item-msg">环保管家服务（交办）</p>
      </div>
      <div class="box-item">
        <p class="item-title1">任务派发时间</p>
        <p class="item-msg">2019-04-31 21:33</p>
      </div>
      <div class="box-item">
        <p class="item-title1">现场检查时间</p>
        <p class="item-msg">2019-04-31 21:33</p>
      </div>
      <p class="gang"></p>
      <p class="type-title">环评制度落实情况</p>
      <div class="box-item  needFlex">
        <span class="item-title">该项目是否办理环评手续</span>
        <div class="right">
          <mt-switch v-model="procedures"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">该项目环评批准后是否发生重大改变</span>
        <div class="right">
          <mt-switch v-model="afterProcedures"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">是否重新办理环评手续</span>
        <div class="right">
          <mt-switch v-model="proceduresAgain"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex img">
        <span class="item-title">项目环评类型</span>
      </div>
      <div class="box-item needFlex img">
        <span class="item-title">项目建设进度</span>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">是否通过环保验收</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <p class="gang"></p>
      <p class="type-title">污染治理设施运行情况</p>
      <div class="box-item needFlex">
        <span class="item-title">是否按照环评文件要求安装污染治理设施</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">是否正常运转</span>
        <div class="right">
          <mt-switch v-model="normalWork"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex img">
        <span class="item-title">在线监控读数是否正常</span>
      </div>
      <p class="gang"></p>
      <p class="type-title">污染物排放情况</p>
      <div class="box-item needFlex img">
        <span class="item-title">排放类型</span>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">是否按规定开展自行监测</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <p class="type-title-child">废水排放情况</p>
      <div class="box-item needFlex">
        <span class="item-title">是否有废水直排</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">是否利用暗管、渗井，渗坑等违法排放行为</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">排污口是否按照环评文件设置</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <p class="type-title-child">废气排放情况</p>
      <div class="box-item needFlex">
        <span class="item-title">是否有废气直排</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">烟囱高度是否符合环评文件要求</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">排污口是否按照环评文件设置</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <p class="gang"></p>
      <p class="type-title">其他情况</p>
      <div class="box-item needFlex">
        <span class="item-title">是否涉及危废</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">物料堆场是否覆盖或采取严密围挡</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">是否定期开展应急训练</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <div class="box-item needFlex">
        <span class="item-title">是否按照要求制定环境应急并报生态环境部门备案</span>
        <div class="right">
          <mt-switch v-model="passCheck"></mt-switch>
        </div>
      </div>
      <p class="gang"></p>
      <div class="box-item needTextarea">
        <span class="textarea-item">结论及建议</span>
        <textarea rows="3" placeholder="请输入详细情况" v-model="advise" style="margin-bottom: 0.3rem;"></textarea>
      </div>
      <p class="gang"></p>
      <div class="box-item needTextarea">
        <span class="textarea-item">服务单位意见</span>
        <textarea rows="3" placeholder="请输入详细情况" v-model="advise"></textarea>
        <span class="item-name">签名</span>
      </div>
      <p class="gang"></p>
      <div class="box-item needTextarea">
        <span class="textarea-item">环保管家意见</span>
        <textarea rows="3" placeholder="请输入详细情况" v-model="advise"></textarea>
        <span class="item-name">签名</span>
      </div>
      <p class="gang"></p>
      <div class="box-item needTextarea">
        <span class="textarea-item">环保管家意见</span>
        <textarea rows="3" placeholder="请输入详细情况" v-model="advise" style="margin-bottom: 0.3rem;"></textarea>
      </div>
      <p class="gang"></p>
      <div class="add-btn">
        <button @click="">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import uploadBox from '@/components/uploadBox'
  import { Switch } from 'mint-ui'
  export default {
    name: 'serverecord',
    components: {
      "mt-switch": Switch,
    },
    data() {
      return {
        moduleName: '环保管家服务记录',
        searchKey: '',
        isShowSearchIcon: false,
        isShowBorder: true,
        procedures: false,
        afterProcedures: false,
        proceduresAgain: false,
        passCheck: false,
        normalWork: true,
        advise: '',
      }
    },
  }
</script>

<style lang="scss">
  #serverecord {
    P {
      padding: 0;
      margin: 0;
    }

    .needFlex {
      display: flex;
      align-items: center;
    }

    .box-item {
      min-height: 1.12rem;
      font-size: 0.34rem;
      padding: 0 0.32rem;
      border-bottom: 1px solid #e0e0e0;
      background: #fff;
      overflow: hidden;

      .item-title {
        color: #333;
        display: inline-block;
        width: 4.2rem;
        line-height: 0.44rem;
      }

      .item-title1 {
        color: #9e9e9e;
        font-size: 0.24rem;
        height: 0.6rem;
        line-height: 0.6rem;
      }

      .item-msg {
        color: #333;
      }

      .textarea-item {
        line-height: 1.12rem;
      }

      .item-name {
        height: 0.54rem;
        width: 1.6rem;
        text-align: center;
        line-height: 0.54rem;
        display: inline-block;
        font-size: 0.3rem;
        border-radius: 0.06rem;
        background: #3296fa;
        color: #fff;
        margin-bottom: 0.32rem;
      }

      textarea {
        border: 0;
        display: block;
        color: #9e9e9e;
        font-size: 0.3rem;
        line-height: 0.4rem;
        width: 100%;
      }
    }

    .img {
      background: #f8f8f8 url('../../../assets/images/right.png') no-repeat right center;
      background-position: calc(100% - 0.52rem) 0.4rem;
      background-size: 0.16rem 0.31rem;
      background-color: #fff;
    }

    .right {
      float: right;
      width: 2.5rem;
      height: 1.1rem;
      -webkit-box-pack: end;
      -ms-flex-pack: end;
      justify-content: flex-end;
      align-items: center;
      display: flex;
    }

    .gang {
      background: #f8f8f8;
      height: 0.4rem;
    }

    .type-title {
      background: #F1F5F7;
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 0.34rem;
      color: #303030;
      padding: 0 0.32rem;
    }

    .type-title-child {
      background: #F1F5F7;
      height: 0.6rem;
      line-height: 0.6rem;
      font-size: 0.24rem;
      color: #3296FA;
      padding: 0 0.32rem;
    }
    .add-btn {
      background: #fff;
      border-top: 1px solid #e0e0e0;
      width: 100%;
      height: 1.32rem;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 9999;

      button {
        border: 0;
        margin: 0.16rem auto;
        display: block;
        width: 6.86rem;
        height: 0.96rem;
        color: #fff;
        border-radius: 0.04rem;
        font-size: 0.34rem;
        background: #3296fa;
      }
    }
  }
</style>