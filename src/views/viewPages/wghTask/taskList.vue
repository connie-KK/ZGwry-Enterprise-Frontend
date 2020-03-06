<template>
  <div id="tasklist">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
      :serachFun="toSearchList"
      :toggleSearchBox="toToggleSearchBox"
    >
      {{ moduleName }}
    </header-bar>
    <div :class="[
        isShowSearchBox ? 'main-content-with-search' : '',
        'main-content'
      ]">
      <div class="filter-box">
        <p
          @click="onlyMe = !onlyMe"
          :class="{ active: onlyMe }"
        >
          仅看我的任务
        </p>
        <p @click="popupVisible = true">筛选</p>
      </div>
      <mt-navbar v-model="selected">
        <mt-tab-item
          :id="'tab' + item.code"
          v-for="(item, index) in types"
          :key="index + 'type'"
        >{{ item.title }}</mt-tab-item>
      </mt-navbar>
      <ul
        class="tasklist-box"
        ref="srollbox"
        :class="isBack ? 'isback' : 'auto'"
      >
        <li
          v-for="item in listData"
          :key="item.task"
          @click="clickItem(item)"
        >
          <span class="task-method">{{ taskMethodMap[item.method] }}</span>
          <p class="task-name">{{ item.name }}</p>
          <span
            class="task-state"
            :style="{
              color: taskStateMap[item.state].color,
              background: taskStateMap[item.state].bkColor
            }"
          >{{
              taskStateMap[item.state].name === '全部'
                ? '未发布'
                : taskStateMap[item.state].name
            }}</span>
          <p class="task-date">执行期限：{{ item.date }}</p>
          <p class="task-type">任务性质：{{ taskTypeMap[item.type] }}</p>
          <p class="task-date1">最新执行时间：{{ item.date1 }}</p>
        </li>
      </ul>
      <div
        class="add-btn"
        v-if="!isBack"
      >
        <button @click="$router.push('/putTask/0')">发布任务</button>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible"
      position="right"
      class="popup-box"
    >
      <div class="filter-content">
        <p class="filter-title">筛选</p>
        <img
          @click="popupVisible = false"
          src="@/assets/images/close.png"
          class="close-btn"
        />
        <ul>
          <li>
            <p>状态</p>
            <div>
              <span
                class="tip"
                v-for="(item, key) in taskStateMap"
                :key="item.name"
                :class="{ active: filterParams.state === Number(key) }"
                @click="filterParams.state = Number(key)"
              >{{ item.name }}</span>
            </div>
          </li>
          <li>
            <p>任务类型</p>
            <div>
              <span
                class="tip"
                v-for="(item, key) in taskTypeMap"
                :key="item"
                :class="{ active: filterParams.type === Number(key) }"
                @click="filterParams.type = Number(key)"
              >{{ item }}</span>
            </div>
          </li>
          <li>
            <p>时间范围</p>
            <div>
              <span
                class="tip date-tip date-tip1"
                :class="{ active: filterParams.sDate }"
                @click="$refs.picker1.open()"
              >{{ d1 }}</span>
              <img
                src="@/assets/images/right1.png"
                class="right-icon"
              />
              <span
                class="tip date-tip date-tip2"
                :class="{ active: filterParams.eDate }"
                @click="$refs.picker2.open()"
              >{{ d2 }}</span>
            </div>
          </li>
          <li>
            <p>地点名称</p>
            <div>
              <input
                type="text"
                class="area-input"
                :class="{ active: filterParams.area }"
                v-model="filterParams.area"
                placeholder="请输入地点"
              />
            </div>
          </li>
          <li>
            <p>排序</p>
            <div>
              <span
                class="tip"
                v-for="(item, key) in taskOrderByMap"
                :key="item"
                :class="{ active: filterParams.orderBy === key }"
                @click="filterParams.orderBy = key"
              >{{ item }}</span>
            </div>
          </li>
          <li>
            <p>网格</p>
            <check-tree
              class="tree-box"
              :data="gridCell"
              :checkData="filterParamsTrue.checkGridCell"
              @checkChange="checkChange"
            ></check-tree>
          </li>
        </ul>
        <div class="btn-box">
          <button
            class="popup-btn"
            @click="checkFilterParams"
          >确定</button>
        </div>
      </div>
    </mt-popup>
    <mt-datetime-picker
      ref="picker1"
      type="datetime"
      v-model="filterParams.sDate"
      @confirm="handleConfirmDate1"
    >
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="picker2"
      type="datetime"
      v-model="filterParams.eDate"
      @confirm="handleConfirmDate2"
    >
    </mt-datetime-picker>
  </div>
</template>

<script>
import { Navbar, TabItem, Popup, DatetimePicker } from 'mint-ui'
import checkTree from '@/components/checkTree'
import moment from 'moment'
export default {
  name: 'tasklist',
  components: {
    'mt-navbar': Navbar,
    'mt-tab-item': TabItem,
    'mt-popup': Popup,
    'mt-datetime-picker': DatetimePicker,
    checkTree
  },
  data () {
    return {
      moduleName: '任务列表',
      isBack: false,
      isShowSearchIcon: true,
      isShowSearchBox: false,
      isShowBorder: false,
      popupVisible: false,
      onlyMe: false,
      myStaff: '',
      list: [],
      count: 0,
      selected: 'tab',
      types: [
        { title: '未完成', code: 0 },
        { title: '已完成', code: 1 },
        { title: '全部', code: '' }
      ],
      taskMethodMap: {
        1: '收',
        2: '发'
      },
      taskStateMap: {
        6: {
          name: '已完成',
          color: '#27AD28',
          bkColor: '#E2FFE0'
        },
        5: {
          name: '结果退回',
          color: '#27AD28',
          bkColor: '#E2FFE0'
        },
        4: {
          name: '执行中',
          color: '#27AD28',
          bkColor: '#E2FFE0'
        },
        0: {
          name: '全部',
          color: '#9133D2',
          bkColor: '#F9EAFE'
        },
        1: {
          name: '待审核',
          color: '#9133D2',
          bkColor: '#F9EAFE'
        },
        2: {
          name: '审核通过',
          color: '#27AD28',
          bkColor: '#E2FFE0'
        },
        3: {
          name: '已撤销',
          color: '#27AD28',
          bkColor: '#E2FFE0'
        }
      },
      taskTypeMap: {
        0: '全部',
        1: '日常任务',
        2: '事件处理任务',
        3: '双随机任务',
        4: '重污染空气',
        5: '日常巡查',
        6: '信访办理',
        7: '任务交办'
      },
      taskOrderByMap: {
        1: '执行时间',
        2: '最新执行时间'
      },
      filterParams: {
        seachKey: '',
        state: 0,
        type: 0,
        sDate: moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD'),
        eDate: moment().format('YYYY-MM-DD 23:59:59'),
        area: '',
        orderBy: '1',
        checkGridCell: []
      },
      filterParamsTrue: {
        state: 0,
        type: 0,
        sDate: moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD'),
        eDate: moment().format('YYYY-MM-DD 23:59:59'),
        area: '',
        orderBy: '1',
        checkGridCell: []
      },
      pars: []
    }
  },
  computed: {
    listData () {
      let temp = []
      let list = JSON.parse(JSON.stringify(this.list))
      list.forEach(item => {
        let state = this.selected.split('tab')[1]
        item.name = item.title
        item.method = item.direction === 'issued' ? 2 : 1
        item.date1 = moment(item.date).format('YYYY-MM-DD')
        item.date = moment(item.lastDate).format('YYYY-MM-DD')
        if (
          state === '' ||
          (Number(state) === 0 && item.state < 6) ||
          (Number(state) === 1 && item.state === 6)
        ) {
          if ((this.onlyMe && item.staff === this.myStaff) || !this.onlyMe) {
            if (!this.filterParamsTrue.checkGridCell.length) {
              temp.push(item)
            } else {
              let tt = false
              this.filterParamsTrue.checkGridCell.forEach(grid => {
                if (
                  (grid.type === 'user' && item.staff === grid.id) ||
                  (grid.type === 'dep' && item.staff === grid.dep)
                ) {
                  tt = true
                }
              })
              if (tt) {
                temp.push(item)
              }
            }
          }
        }
      })
      return temp
    },
    d1 () {
      return moment(this.filterParams.sDate).format('YYYY-MM-DD HH:mm:ss')
    },
    d2 () {
      return moment(this.filterParams.eDate).format('YYYY-MM-DD HH:mm:ss')
    },
    userName () {
      return ''
    },
    gridName () {
      return ''
    },
    gridCell () {
      return this.$store.state.gridCell
    }
  },
  mounted () {
    this.getList()
    this.getUser()
    const tempId = this.$route.params.id
    if (tempId === '1') {
      this.isBack = true
    }
    if (tempId === '3') {
      this.selected = 'tab0'
      this.onlyMe = true
    }
  },
  methods: {
    clickItem (item) {
      if (this.isBack) {
        this.$store.state.toEventInfo = JSON.parse(JSON.stringify(item))
        this.$router.go(-1)
      } else {
        this.$router.push('/putTask/' + item.task)
      }
    },
    getList () {
      let params = {
        pageIndex: -1,
        pageSize: 100,
        taskName: this.filterParamsTrue.seachKey, //任务名
        state: this.filterParamsTrue.state, //任务状态
        type: this.filterParamsTrue.type, //任务类型
        gridName: this.gridName, //网格名
        strDate: moment(this.filterParamsTrue.sDate).format(
          'YYYY-MM-DD HH:mm:ss'
        ), //开始时间
        endDate: moment(this.filterParamsTrue.eDate).format(
          'YYYY-MM-DD HH:mm:ss'
        ), //结束时间
        addr: this.filterParamsTrue.area, //地址
        subtype: Number(this.filterParamsTrue.orderBy), //1或者为空，根据任务创建时间倒序，2根据任务完成时间倒序
        userName: this.userName, //用户名
        isOverdue: null //true逾期, false 未逾期
      }
      for (let key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      this.$api.getTasksByKey(params).then(res => {
        this.list = res
      })
    },
    getUser () {
      this.$api.getUser().then(res => {
        if (res) {
          this.myStaff = res.id
          this.getStaffInfo(res.id)
        }
      })
    },
    toSearchList (e) {
      this.filterParamsTrue.seachKey = e
      this.getList()
    },
    toToggleSearchBox (e) {
      this.isShowSearchBox = e
    },
    isCheck (id) {
      return (
        this.filterParams.checks.includes(id) ||
        this.filterParams.checkCs.includes(id)
      )
    },
    checkB (id, state) {
      if (!state) {
        const tids = this.pars.filter(tidItem => {
          return tidItem.id === id
        })[0].children
        const index = this.filterParams.checks.indexOf(id)
        if (index >= 0) {
          this.filterParams.checks.splice(index, 1)
          tids.forEach(cidItem => {
            const cindex = this.filterParams.checkCs.indexOf(cidItem.id)
            if (cindex >= 0) {
              this.filterParams.checkCs.splice(cindex, 1)
            }
          })
        } else {
          this.filterParams.checks.push(id)
          let ids = []
          tids.forEach(cidItem => {
            const cindex = this.filterParams.checkCs.indexOf(cidItem.id)
            if (cindex < 0) {
              ids.push(cidItem.id)
            }
          })
          this.filterParams.checkCs.push(...ids)
        }
      } else {
        const index = this.filterParams.checkCs.indexOf(id)
        if (index >= 0) {
          this.filterParams.checkCs.splice(index, 1)
        } else {
          this.filterParams.checkCs.push(id)
        }
      }
    },
    checkFilterParams () {
      this.popupVisible = false
      this.filterParamsTrue = JSON.parse(JSON.stringify(this.filterParams))
      this.getList()
    },
    handleConfirmDate1 (e) {
      this.filterParams.sDate = moment(e).format('YYYY-MM-DD HH:mm:ss')
    },
    handleConfirmDate2 (e) {
      this.filterParams.eDate = moment(e).format('YYYY-MM-DD HH:mm:ss')
    },
    checkChange (e) {
      this.filterParams.checkGridCell = e
    },
    getStaffInfo (id) {
      this.$api
        .getStaffInfo({
          id
        })
        .then(res => {
          if (res) {
            this.getGridCellTree(res.grid)
          }
        })
    },
    getGridCellTree (grid) {
      this.$api
        .getGridCellTree({
          grid
        })
        .then(res => {
          this.$store.state.gridCell = res
        })
    }
  }
}
</script>

<style lang="scss">
#tasklist {
  .mint-popup {
    width: auto;
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
    }
  }
  .filter-box {
    padding: 0.1rem 0.32rem;
    height: 0.94rem;
    p {
      &:nth-child(1) {
        float: left;
        width: 2.63rem;
        line-height: 0.54rem;
        height: 0.54rem;
        padding-left: 0.63rem;
        color: #fff;
        border-radius: 0.1rem;
        position: relative;
        background: #aab8c6;
        &::before {
          content: "";
          position: absolute;
          left: 0.18rem;
          width: 0.32rem;
          height: 0.32rem;
          top: 0;
          bottom: 0;
          margin: auto;
          border: 1px solid #fff;
          border-radius: 50%;
          box-sizing: border-box;
        }
        &.active {
          background: #3296fa url("../../../assets/images/ischeck.png")
            no-repeat 0.18rem center;
          background-size: 0.32rem 0.32rem;
          &::before {
            display: none;
          }
        }
      }
      &:nth-child(2) {
        float: right;
        background: url("../../../assets/images/filter.png") no-repeat left
          center;
        background-size: 0.32rem 0.32rem;
        line-height: 0.54rem;
        padding-left: 0.4rem;
        color: #3296fa;
        font-size: 0.3rem;
      }
    }
  }
  .tasklist-box {
    border-top: 1px solid #d8d8d8;
    background: #f8f8f8;
    overflow-y: auto;
    &.auto {
      height: calc(100% - 3.24rem);
    }
    &.isback {
      height: calc(100% - 1.9rem);
    }
    li {
      background: #fff url("../../../assets/images/right.png") no-repeat;
      background-position: calc(100% - 0.52rem) 0.56rem;
      background-size: 0.16rem 0.31rem;
      height: 1.92rem;
      border-bottom: 1px solid #d8d8d8;
      position: relative;
      * {
        position: absolute;
      }
      .task-method {
        left: 0.32rem;
        top: 0.27rem;
        width: 0.46rem;
        height: 0.46rem;
        background: #989240;
        color: #fff;
        font-size: 0.3rem;
        text-align: center;
        line-height: 0.46rem;
      }
      .task-name {
        font-size: 0.34rem;
        left: 0.92rem;
        line-height: 0.48rem;
        top: 0.26rem;
        width: 4.6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .task-state {
        height: 0.44rem;
        line-height: 0.44rem;
        font-size: 0.3rem;
        top: 0.29rem;
        right: 0.82rem;
        padding: 0 0.1rem;
      }
      .task-date {
        font-size: 0.28rem;
        line-height: 0.37rem;
        color: #a3a3a3;
        left: 0.32rem;
        top: 0.82rem;
      }
      .task-date1 {
        font-size: 0.28rem;
        line-height: 0.37rem;
        color: #a3a3a3;
        left: 0.32rem;
        top: 1.28rem;
      }
      .task-type {
        font-size: 0.28rem;
        line-height: 0.37rem;
        color: #a3a3a3;
        left: 3.7rem;
        top: 0.82rem;
      }
    }
  }
  .add-btn {
    position: fixed;
    background: #fff;
    border-top: 1px solid #e0e0e0;
    bottom: 0;
    width: 100%;
    button {
      border: 0;
      margin: 0.16rem auto;
      display: block;
      width: 6.86rem;
      height: 0.96rem;
      color: #fff;
      border-radius: 0.04rem;
      font-size: 0.34rem;
      background: #3296fa url("../../../assets/images/add-cycle.png") no-repeat
        2.3rem center;
      background-size: 0.35rem 0.35rem;
    }
  }
  .mint-navbar .mint-tab-item.is-selected {
    margin-bottom: -1px;
  }
  .popup-box {
    height: 100%;
    p {
      padding: 0;
      margin: 0;
    }
    .filter-content {
      width: 5.9rem;
      background: #fff;
      height: 100%;
      padding: 0.32rem 0 0.32rem 0.32rem;
      position: relative;
      .filter-title {
        font-size: 0.34rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .close-btn {
        width: 0.28rem;
        height: 0.28rem;
        position: absolute;
        right: 0.32rem;
        top: 0.42rem;
      }
    }
    ul {
      height: calc(100% - 1.7rem);
      overflow-y: auto;
      li {
        p {
          font-size: 0.32rem;
          color: #6f6f6f;
          margin-top: 0.3rem;
          margin-bottom: 0.2rem;
        }
        div {
          overflow: hidden;
        }
        .right-icon {
          float: left;
          width: 0.18rem;
          height: 0.32rem;
          margin-top: 0.09rem;
        }
        .area-input {
          background: #aab8c6;
          color: #fff;
          border: 0;
          font-size: 0.3rem;
          padding-left: 0.3rem;
          height: 0.54rem;
          width: 5.23rem;
          border-radius: 0.06rem;
          &.active {
            background: #3296fa;
          }
        }
        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          color: #fff;
        }
        .tip {
          float: left;
          padding: 0 0.3rem;
          line-height: 0.54rem;
          color: #fff;
          background: #aab8c6;
          margin: 0 0.3rem 0.2rem 0;
          border-radius: 0.06rem;
          &.active {
            background: #3296fa;
          }
          &.date-tip1 {
            width: 4.7rem;
          }
          &.date-tip2 {
            width: 5.23rem;
          }
        }
        .il-check-box {
          &.checkbox2 {
            margin-left: 0.68rem;
          }
          p {
            margin: 0;
            margin-bottom: 0.13rem;
            span {
              vertical-align: middle;
              line-height: 0.42rem;
              height: 0.42rem;
              display: inline-block;
            }
            &::before {
              content: "";
              display: inline-block;
              width: 0.36rem;
              height: 0.36rem;
              border-radius: 0.08rem;
              border: 1px solid #aab8c6;
              vertical-align: middle;
              color: #aab8c6;
              margin-right: 0.1rem;
              box-sizing: border-box;
            }
            &.check {
              &::before {
                background: url("../../../assets/images/check.png") no-repeat
                  50%;
                background-size: 100% auto;
                border: 0;
              }
            }
          }
        }
      }
    }
  }
  .btn-box {
    height: 0.5rem;
    margin-top: 0.3rem;
    button {
      background: #3296fa;
      color: #fff;
      border: 0;
      width: 2rem;
      margin-right: 0.32rem;
      float: right;
      display: block;
    }
  }
}
</style>
