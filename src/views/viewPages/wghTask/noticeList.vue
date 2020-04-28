<template>
  <div id="noticeList" class="noticeList">
    <header-bar leftIcon="back" leftText="返回" :isShowSearchIcon="isShowSearchIcon" :showBorder="isShowBorder" :customBack="jump">
      {{ moduleName + num}}
      <template v-slot:right>
        <span class="texts" v-on:click="updateMessageAll()">全部已读</span>
      </template>
    </header-bar>
    <div class="main-content">
      <mt-navbar v-model="selected">
        <mt-tab-item :id="item.code" v-for="(item, index) in types" :key="item.code">
          <div>{{ item.title }}</div>
          <div v-if="item.state" class="round"></div>
        </mt-tab-item>
      </mt-navbar>
      <mt-navbar v-model="childSelected">
        <mt-tab-item :id="item.code" v-for="(item, index) in childTypes" :key="item.code">
          <div>{{ item.title }}</div>
          <div v-if="item.state" class="round"></div>
        </mt-tab-item>
      </mt-navbar>
      <div class="noticelist-box">
        <ul class="tasklist-box">
          <li v-for="(item,idx) in showList" :key="idx" v-on:click="updateMessage(item)">
            <div class="task-picture"><img :src="item.url"></div>
            <div class="task-name">{{ item.title}}</div>
            <div class="task-date">{{ item.sendTime }}</div>
            <div class="task-type">{{ item.contens }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import uploadBox from '@/components/uploadBox'
  import { Navbar, TabItem } from 'mint-ui'
  import ImagePreview from 'vant/lib/image-preview'
  import 'vant/lib/image-preview/style'
  import cookie from 'js-cookie'
  export default {
    name: 'noticeList',
    components: {
      'mt-navbar': Navbar,
      'mt-tab-item': TabItem,
    },
    data() {
      return {
        moduleName: '消息通知',
        num: '',
        isShowSearchIcon: false,
        isShowBorder: true,
        selected: 1,
        childSelected: 0,
        types: [
          { title: '任务通知', code: 1, state: false },
          { title: '事件通知', code: 2, state: false },
        ],
        msgTypes: [
          { title: '全部', code: 0, state: false },
          { title: '待办', code: 7, state: false },
          { title: '流转', code: 8, state: false },
          { title: '完结', code: 10, state: false },
        ],
        taskTypes: [
          { title: '全部', code: 0, state: false },
          { title: '待办', code: 1, state: false },
          { title: '流转', code: 2, state: false },
          { title: '执行', code: 3, state: false },
          { title: '完结', code: 4, state: false },
          { title: '临期', code: 5, state: false },
          { title: '逾期', code: 6, state: false },
        ],
        showList: [],
        getTask: [],
        finishTask: [],
        nearTask: [],
        overdueTask: [],
        allIds: [],
        taskMsg: [],
        eventMsg: []
      }
    },
    watch: {
      selected: function (val) {
        this.childSelected = 0;
        this.getAllMsg();
        this.getMsg();
      },
      childSelected: function (val) {
        this.getAllMsg();
        this.getMsg();
      }
    },
    computed: {
      childTypes() {
        if (this.selected === 1) {
          return this.taskTypes;
        } else if (this.selected === 2) {
          return this.msgTypes;
        }
      }
    },
    created() {
      this.getAllMsg();
      this.getMsg();
    },
    mounted() { },
    methods: {
      jump(){
        this.$router.push('/enList')
      },
      getAllMsg: function () {
        this.$api.getGridMessageList(
          {
            pageIndex: -1,
            pageSize: -1,
            subtype: 1,
            type: null,
            state: null,
            form:2
          }
        ).then(res => {
          this.taskMsg = res;
          this.$api.getGridMessageList(
            {
              pageIndex: -1,
              pageSize: -1,
              subtype: 2,
              type: null,
              state: null,
              form: 2
            }
          ).then(res => {
            this.eventMsg = res;
            this.showRound()
          })
        })

      },
      getMsg: function () {
        this.$api.getGridMessageList(
          {
            pageIndex: -1,
            pageSize: -1,
            subtype: this.selected,
            type: this.childSelected != 0 ? this.childSelected : null,
            state: null,
            form: 2
          }
        ).then(res => {
          this.num = '';
          this.showList = []
          if (res.length > 0) {
            this.num = '(' + res.length + ')';
            res.forEach(item => {
              item.sendTime = moment(item.sendTime).format('MM-DD HH:mm')
              this.allIds.push(item.id)
            });
            this.showList = res;
            res.forEach(item => {
              if (item.type === 5) {
                if (item.state === 1) {
                  item.url = require('@/assets/images/notice-yellow.png')
                } else {
                  item.url = require('@/assets/images/unread-notice-yellow.png')
                }
              } else if (item.type == 6) {
                if (item.state === 1) {
                  item.url = require('@/assets/images/notice-red.png')
                } else {
                  item.url = require('@/assets/images/unread-notice-red.png')
                }
              } else {
                if (item.state === 1) {
                  item.url = require('@/assets/images/notice-blue.png')
                } else {
                  item.url = require('@/assets/images/unread-notice-blue.png')
                }
              }
            })
            this.showRound()
          }
        })
      },
      showRound: function () {
        this.types.forEach(item => {
          item.state = false;
        })
        this.taskTypes.forEach(item => {
          item.state = false;
        })
        this.msgTypes.forEach(item => {
          item.state = false;
        })
        this.taskMsg.forEach(item => {
          this.taskTypes.forEach(item1 => {
            if (item.type == item1.code && item.state == 0) {
              item1.state = true
            }
          })
        })
        this.eventMsg.forEach(item => {
          this.msgTypes.forEach(item1 => {
            if (item.type == item1.code && item.state == 0) {
              item1.state = true
            }
          })
        })
        this.taskTypes.forEach(item => {
          if (item.state === true) {
            this.taskTypes[0].state = true
            this.types[0].state = true
          }
        })
        this.msgTypes.forEach(item => {
          if (item.state === true) {
            this.msgTypes[0].state = true
            this.types[1].state = true
          }
        })
        console.log(this.types, this.taskTypes, this.msgTypes);
      },
      updateMessage: function (data) {
        var ids = [];
        if (typeof (data.id) == 'string') {
          ids.push(data.id)
        } else {
          ids = data.id
        }
        if (data.state === 0) {
          this.$api.updateMessageState({ ids: ids }).then(res => {
            this.getAllMsg();
            this.getMsg()
          })
          this.$router.push(`/putTask/${data.reference}`);
        } else if (data.state === 1) {
          this.$router.push(`/putTask/${data.reference}`);
        }
      },
      updateMessageAll: function () {
        var ids = []
        this.showList.forEach(item => {
          if (item.state === 0) {
            ids.push(item.id)
          }
        })
        this.$api.updateMessageState({ ids: ids }).then(res => {
          this.getAllMsg();
          this.getMsg()
        })
      }
    },
  }
</script>
<style lang="scss">
  #noticeList {
    .texts {
      color: rgba(50, 150, 250, 1);
      font-size: 0.34rem;
      display: inline-block;
    }

    .mint-popup-bottom {
      width: 100%;
    }

    .main-content {
      background: #fff;
      height: 100%;

      p {
        padding: 0;
        margin: 0;
      }

      .mint-tab-item-label {
        font-size: 0.3rem;
        display: flex;
        justify-content: center;
      }
    }

    .mint-navbar .mint-tab-item.is-selected {
      margin-bottom: -1px;
    }

    .round {
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: red;
      transform: translateY(-4px);
    }

    .noticelist-box {
      height: calc(100% - 1.35rem);
      border-top: 1px solid #d8d8d8;
      background: #f8f8f8;
      overflow-y: auto;
    }

    .tasklist-box {
      border-top: 1px solid #d8d8d8;
      background: #f8f8f8;
      overflow-y: auto;
      height: 100%;

      li {
        /* background: #fff url("../../../assets/images/right.png") no-repeat; */
        /* background-position: calc(100% - 0.52rem) 0.56rem; */
        /* background-size: 0.16rem 0.31rem; */
        height: 1.72rem;
        position: relative;
        margin: 0.4rem 0.4rem 0 0.4rem;
        background-color: #fff;

        * {
          position: absolute;
        }

        .task-name {
          font-size: 0.34rem;
          font-weight: 600;
          left: 1rem;
          line-height: 0.48rem;
          top: 0.25rem;
          width: 4.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .task-date {
          font-size: 0.28rem;
          line-height: 0.37rem;
          color: #a3a3a3;
          top: 0.25rem;
          right: 0.3rem;
        }

        .task-type {
          font-size: 0.28rem;
          line-height: 0.37rem;
          color: #9e9e9e;
          left: 0.4rem;
          top: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 5rem;
        }

        .task-picture {
          position: relative;
          left: 0.4rem;
          top: 0.25rem;

          img {
            width: 0.5rem;
            height: 0.5rem;
          }
        }
      }
    }
  }
</style>