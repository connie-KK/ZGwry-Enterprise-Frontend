<template>
  <div id="tasklist">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
      :serachFun="toSearchList"
      :toggleSearchBox="toToggleSearchBox"
      :customBack="backFun"
    >
      {{ moduleName }}
    </header-bar>
    <div :class="[isShowSearchBox ? 'main-content-with-search' : '', 'main-content']">
      <div class="filter-box">
        <p @click="onlyMe = !onlyMe" :class="{active: onlyMe}">
          仅看我的待办
        </p>
        <p
          id="okbf"
          @click="popupVisible = true"
          :class="isFilter ? 'filter' : 'filter-black'"
        >
          筛选
        </p>
      </div>
      <div class="sort-box">
        <div
          v-for="(item, index) in sortBox"
          :class="item.class"
          :key="index"
          @click="changeSort(index)"
        >
          <span>{{ item.name }}</span>
          <span :class="item.sort"></span>
        </div>
      </div>
      <ul class="grades">
        <li
          v-for="(item, idx) in types"
          :key="idx"
          @click="selected = item.code"
          :class="[selected == item.code ? 'grade-choiced' : 'grade-nochoiced']"
        >
          {{ item.title }}
        </li>
        <li>{{ `${listData.length}` }}</li>
      </ul>
      <!-- <mt-navbar v-model="selected">
        <mt-tab-item
          :id="'tab' + item.code"
          v-for="(item, index) in types"
          :key="index + 'type'"
          >{{ item.title }}</mt-tab-item
        >
      </mt-navbar> -->
      <ul class="tasklist-box" ref="srollbox" :class="isBack ? 'isback' : 'auto'">
        <li v-for="item in listData" :key="item.task" @click="clickItem(item)">
          <span class="task-method" :style="{background:taskMethodMap[item.method].color}">{{ taskMethodMap[item.method].name }}</span>
          <p class="task-name">{{ item.name }}</p>
          <span
            class="task-state"
            :style="{
              color: taskStateMap[item.state].color,
              background: taskStateMap[item.state].bkColor
            }"
            >{{ taskStateMap[item.state].name }}</span
          >
          <p class="task-date">执行期限：{{ item.date }}</p>
          <p class="task-type">任务性质：{{ taskTypeMap[item.type] }}</p>
          <p class="task-date1">最新执行时间：{{ item.date1 }}</p>
        </li>
      </ul>
      <!-- <div
        class="add-btn"
        v-if="!isBack"
      >
        <button @click="$router.push('/putTask/0')">发布任务</button>
      </div> -->
    </div>
    <mt-popup v-model="popupVisible" position="right" class="popup-box">
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
                :class="{active: filterParams.state === Number(key)}"
                @click="filterParams.state = Number(key)"
                >{{ item.name }}</span
              >
            </div>
          </li>
          <li>
            <p>类型</p>
            <div>
              <span
                class="tip"
                v-for="(item, key) in taskTypeMap"
                :key="item"
                :class="{active: filterParams.type === Number(key)}"
                @click="filterParams.type = Number(key)"
                >{{ item }}</span
              >
            </div>
          </li>
          <li>
            <p>来源</p>
            <div>
              <span
                class="tip"
                v-for="item in source"
                :key="item.code"
                :class="{active: filterParams.direction === item.code}"
                @click="filterParams.direction = item.code"
                >{{ item.name }}</span
              >
            </div>
          </li>
          <li>
            <p>添加时间</p>
            <div>
              <span class="tip date-tip date-tip1" @click="$refs.picker1.open()">{{
                d1
              }}</span>
              <img src="@/assets/images/right1.png" class="right-icon" />
              <span class="tip date-tip date-tip2" @click="$refs.picker2.open()">{{
                d2
              }}</span>
            </div>
          </li>
          <li>
            <p>地点名称</p>
            <div>
              <input
                type="text"
                class="area-input"
                :class="{active: filterParams.area}"
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
                :class="{active: filterParams.orderBy === key}"
                @click="filterParams.orderBy = key"
                >{{ item }}</span
              >
            </div>
          </li>
          <li>
            <p class="cells">
              网格<span
                :class="[isExpandAllCell ? 'drop-all' : 'put-away', 'drop-down']"
                @click="expand('cell')"
              ></span>
            </p>
            <check-tree
              class="tree-box"
              :data="gridCell"
              :checkData="filterParamsTrue.checkGridCell"
              :checkAllNodes="isAll"
              @checkChange="checkChange"
              :expandAll="isExpandAllCell"
              :first="isFirst"
            ></check-tree>
          </li>
          <li>
            <p class="cells">
              部门<span
                :class="[isExpandAllDep ? 'drop-all' : 'put-away', 'drop-down']"
                @click="expand('dep')"
              ></span>
            </p>
            <check-tree
              class="tree-box"
              :data="depList"
              :checkData="filterParamsTrue.depCell"
              :checkAllNodes="isAll"
              @checkChange="checkChange"
              :expandAll="isExpandAllDep"
              :first="isFirst"
            ></check-tree>
          </li>
        </ul>
        <div class="btn-box">
          <button id="okb" class="popup-btn sure" @click="checkFilterParams">确定</button>
          <button id="okb" class="popup-btn reset" @click="resetParams">重置</button>
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
import {Navbar, TabItem, Popup, DatetimePicker} from 'mint-ui';
import checkTree from '@/components/checkTree';
import moment from 'moment';
export default {
  name: 'tasklist',
  components: {
    'mt-navbar': Navbar,
    'mt-tab-item': TabItem,
    'mt-popup': Popup,
    'mt-datetime-picker': DatetimePicker,
    checkTree
  },
  data() {
    return {
      moduleName: '任务列表',
      isBack: false,
      isShowSearchIcon: true,
      isShowSearchBox: false,
      isShowBorder: false,
      popupVisible: false,
      onlyMe: false,
      myStaff: '',
      myName:'',
      list: [],
      count: 0,
      selected: -1,
      types: [
        {title: '全部', code: -1},
        {title: '未完成', code: 5},
        {title: '已完成', code: 6}
      ],
      taskMethodMap: {
        1:{name:'收', color:'rgba(206,195,40,1)'},
        2:{name:'发', color:'rgba(220,137,41,1)'},
        3:{name:'自', color:'rgba(97,96,176,1)'}
      },
      taskStateMap: {
        6: {
          name: '已完成',
          color: 'rgba(122,127,131,1)',
          bkColor: 'rgba(243,243,243,1)'
        },
        5: {
          name: '退回',
          color: 'rgba(122,127,131,1)',
          bkColor: 'rgba(243,243,243,1)'
        },
        4: {
          name: '执行中',
          color: 'rgba(50,150,250,1)',
          bkColor: 'rgba(228,241,255,1)'
        },
        0: {
          name: '全部',
          color: '#9133D2',
          bkColor: '#F9EAFE'
        },
        1: {
          name: '待审核',
          color: 'rgba(51,181,17,1)',
          bkColor: 'rgba(228,255,226,1)'
        },
        2: {
          name: '审核通过',
          color: '#27AD28',
          bkColor: '#E2FFE0'
        },
        3: {
          name: '已撤销',
          color: 'rgba(50,150,250,1)',
          bkColor: 'rgba(228,241,255,1)'
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
      source: [
        {name: '自建任务', code: 'self'},
        {name: '收到任务', code: 'received'},
        {name: '发出任务', code: 'issued'}
      ],
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
        checkGridCell: [],
        depCell:[],
        direction: 'all'
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
        checkGridCell: [],
        depCell:[],
        direction: 'all'
      },
      pars: [],
      isFirst: false,
      isExpandAllCell: false,
      isExpandAllDep: false,
      depList: {},
      isFilter: false,
      sortBox: [
        {
          name: '添加时间',
          class: 'selected',
          sort: 'sortUp',
          key: 1
        },
        {
          name: '最新执行时间',
          key: 2
        }
      ],
      type: 'add',
      sort: 'sortUp',
      isAll:false
    };
  },
  computed: {
    listData() {
      let temp = [];
      let list = [];
      if(this.sort === 'sortUp'){
        list = JSON.parse(JSON.stringify(this.list));
      }
      if(this.sort === 'sortDown'){
        list = JSON.parse(JSON.stringify(this.list));
        list.reverse();
      }
      list.forEach(item => {
        // let state = this.selected.split('tab')[1];
        item.name = item.title;
        item.method = item.direction === 'issued' ? 2 : (item.direction === 'self' ? 3 : 1);
        item.date1 = moment(item.date).format('YYYY-MM-DD');
        item.date = moment(item.lastDate).format('YYYY-MM-DD');
        if (
          this.selected === -1 ||
          (Number(this.selected) === 5 && item.state < 6) ||
          (Number(this.selected) === 6 && item.state === 6) ||
          (Number(this.selected) === 1 && item.state === 1) ||
          (Number(this.selected) === 4 && item.state === 4)
        ) {
          console.log(this.onlyMe)
          // if (!this.onlyMe) {
              let ass = false;
               if(this.onlyMe && item.state === 4){
                 item.assignments.forEach(name =>{
                   if(name === this.myName){
                     ass = true
                   }
                 })
          }
            if (!this.filterParamsTrue.checkGridCell.length && !this.filterParamsTrue.depCell.length) {
              if(this.onlyMe && ass){
                temp.push(item);
              }else if(!this.onlyMe){
                 temp.push(item);
              }
              
            } else {
              let tt = false;
              let dep = false;
            
              this.filterParamsTrue.checkGridCell.forEach(grid => {
                if (
                  (grid.type === 'user' && item.staff === grid.id) ||
                  (grid.type === 'dep' && item.staff === grid.dep)
                ) {
                  tt = true;
                }
              });
               this.filterParamsTrue.depCell.forEach(grid => {
                if (
                  (grid.type === 'user' && item.staff === grid.id) ||
                  (grid.type === 'dep' && item.staff === grid.dep)
                ) {
                  dep = true;
                }
              });
            
              if ((tt || dep) && !ass ) {
                temp.push(item);
              }else if(ass && (tt || dep)){
                 temp.push(item);
              }
            // }
          }
        }
      });
      if(this.filterParamsTrue.direction !== 'all'){
          temp = temp.filter(item => {
        return this.filterParamsTrue.direction === item.direction;
      });
      }
      console.log(temp)
      return temp;
    },
    d1() {
      return moment(this.filterParams.sDate).format('YYYY-MM-DD HH:mm:ss');
    },
    d2() {
      return moment(this.filterParams.eDate).format('YYYY-MM-DD HH:mm:ss');
    },
    userName() {
      return '';
    },
    gridName() {
      return '';
    },
    gridCell() {
      return this.$store.state.gridCell;
    }
  },
  mounted() {
    this.getList();
    this.getUser();
    this.getAllDep();
    this.onlyMe = this.$store.state.waitState;
    const tempId = this.$route.params.id;
    if (tempId === '1') {
      this.isBack = true;
    }
    if(tempId === '2'){
      this.onlyMe = true
    }
    this.$store.state.followupType = 'upd';
  },
  watch: {
    popupVisible() {
      if (this.popupVisible) {
        this.$nextTick(() => {
          this.isFirst = true;
        });
      }
    },
    onlyMe() {
      this.types = []
      this.$store.commit('set_waitState', this.onlyMe)
      if (!this.onlyMe) {
        this.types = [
          {title: '全部', code: -1},
          {title: '未完成', code: 5},
          {title: '已完成', code: 6}
        ];
      } else {
        this.types = [
          {title: '全部', code: -1},
          {title: '未审核', code: 1},
          {title: '执行中', code: 4},
          {title: '已完成', code: 6}
        ];
        this.selected = -1
      }
    }
  },
  methods: {
    clickItem(item) {
      if (this.isBack) {
        this.$store.state.toEventInfo = JSON.parse(JSON.stringify(item));
        this.$router.go(-1);
      } else {
        this.$router.push('/putTask/' + item.task);
      }
    },
    getList() {
      this.list = [];
      let params = {
        pageIndex: -1,
        pageSize: 100,
        taskName: this.filterParamsTrue.seachKey, //任务名
        state: this.filterParamsTrue.state, //任务状态
        type: this.filterParamsTrue.type, //任务类型
        gridName: this.gridName, //网格名
        strDate: moment(this.filterParamsTrue.sDate).format('YYYY-MM-DD HH:mm:ss'), //开始时间
        endDate: moment(this.filterParamsTrue.eDate).format('YYYY-MM-DD HH:mm:ss'), //结束时间
        addr: this.filterParamsTrue.area, //地址
        subtype: Number(this.filterParamsTrue.orderBy), //1或者为空，根据任务创建时间倒序，2根据任务完成时间倒序
        userName: this.userName, //用户名
        isOverdue: null //true逾期, false 未逾期
      };
      for (let key in params) {
        if (!params[key]) {
          delete params[key];
        }
      }
      this.$api.getTasksByKey(params).then(res => {
        if(res instanceof Array){
           this.list = res;
           console.log(this.list)
        }
      });
    },
    getUser() {
      this.$api.getUser().then(res => {
        if (res) {
          this.myStaff = res.id;
          this.myName = res.username;
          this.getStaffInfo(res.id);
        }
      });
    },
    toSearchList(e) {
      this.filterParamsTrue.seachKey = e;
      this.getList();
    },
    toToggleSearchBox(e) {
      this.isShowSearchBox = e;
    },
    isCheck(id) {
      return (
        this.filterParams.checks.includes(id) || this.filterParams.checkCs.includes(id)
      );
    },
    checkB(id, state) {
      if (!state) {
        const tids = this.pars.filter(tidItem => {
          return tidItem.id === id;
        })[0].children;
        const index = this.filterParams.checks.indexOf(id);
        if (index >= 0) {
          this.filterParams.checks.splice(index, 1);
          tids.forEach(cidItem => {
            const cindex = this.filterParams.checkCs.indexOf(cidItem.id);
            if (cindex >= 0) {
              this.filterParams.checkCs.splice(cindex, 1);
            }
          });
        } else {
          this.filterParams.checks.push(id);
          let ids = [];
          tids.forEach(cidItem => {
            const cindex = this.filterParams.checkCs.indexOf(cidItem.id);
            if (cindex < 0) {
              ids.push(cidItem.id);
            }
          });
          this.filterParams.checkCs.push(...ids);
        }
      } else {
        const index = this.filterParams.checkCs.indexOf(id);
        if (index >= 0) {
          this.filterParams.checkCs.splice(index, 1);
        } else {
          this.filterParams.checkCs.push(id);
        }
      }
    },
    checkFilterParams() {
      this.isFilter = true;
      this.popupVisible = false;
      this.filterParamsTrue = JSON.parse(JSON.stringify(this.filterParams));
      this.getList();
    },
    resetParams() {
       this.isFirst = false;
      this.isFilter = false;
      this.filterParams = {
        seachKey: '',
        state: 0,
        type: 0,
        sDate: moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD'),
        eDate: moment().format('YYYY-MM-DD 23:59:59'),
        area: '',
        orderBy: '1',
        checkGridCell: [],
        depCell:[],
        direction: 'all'
      };
      this.filterParamsTrue = JSON.parse(JSON.stringify(this.filterParams));
         this.$nextTick(() => {
          this.isFirst = true;
        });
    },
    handleConfirmDate1(e) {
      this.filterParams.sDate = moment(e).format('YYYY-MM-DD HH:mm:ss');
    },
    handleConfirmDate2(e) {
      this.filterParams.eDate = moment(e).format('YYYY-MM-DD HH:mm:ss');
    },
    checkChange(e) {
      this.filterParams.checkGridCell = e;
    },
    getStaffInfo(id) {
      this.$api
        .getStaffInfo({
          id
        })
        .then(res => {
          if (res) {
            this.getGridCellTree(res.grid);
          }
        });
    },
    getGridCellTree(grid) {
      this.$api
        .getGridCellTree({
          grid
        })
        .then(res => {
          this.$store.state.gridCell = res;
        });
    },
    getDepartmentAll() {
      return new Promise(resove => {
        if (this.$store.state.allDep.length === 0) {
          this.$api.getDepartmentAll().then(res => {
            if (res) {
              this.$store.state.allDep = res;
              resove(true);
            }
          });
        }
      });
    },
    //获取所有部门
    getAllDep() {
      let tempdep = [];
      this.getDepartmentAll().then(() => {
        tempdep = JSON.parse(JSON.stringify(this.$store.state.allDep));
        let userIds = [];
        let deps = [];
        tempdep.forEach(dep => {
          dep.subDepts.forEach(depC => {
            depC.uitems = depC.uitems || depC.Uitems;
            deps.push(depC);
            userIds.push(...depC.uitems);
          });
        });
        this.$api
          .getUserByArrUserID({
            items: userIds
          })
          .then(resx => {
            if (resx && resx.length) {
              deps.forEach(dep => {
                if (!dep.users) {
                  dep.users = [];
                }
                dep.uitems.forEach(depUser => {
                  resx.forEach(user => {
                    if (depUser === user.id) {
                      dep.users.push({
                        id: depUser,
                        name: user.username
                      });
                    }
                  });
                });
              });
              let templist = [];
              deps.forEach(item => {
                let temp = {
                  name: item.name,
                  id: item.id,
                  level: 1,
                  staffs: item.users ? item.users : []
                };
                templist.push(temp);
              });
              this.depList = {templist};
              console.log(this.depList);
            }
          });
      });
    },
    expand(t) {
      if (t === 'cell') {
        this.isExpandAllCell = !this.isExpandAllCell;
      }
      if (t === 'dep') {
        this.isExpandAllDep = !this.isExpandAllDep;
      }
    },
    changeSort(index) {
      let selected = this.sortBox[index];
      this.type = this.sortBox[index].key;
      if (selected.class === 'selected') {
        //已经是选中状态
        if (selected.sort === 'sortUp') {
          this.$set(this.sortBox[index], 'sort', 'sortDown');
        } else if (selected.sort === 'sortDown') {
          this.$set(this.sortBox[index], 'sort', 'sortUp');
        }
          this.sort = this.sortBox[index].sort
          console.log(this.sort)
      } else {
        this.$set(this.sortBox[index], 'class', 'selected');
        this.$set(this.sortBox[index], 'sort', 'sortUp');
        let notSelected = this.sortBox[1 - index];
        notSelected.class = '';
        notSelected.sort = '';
        this.filterParams.orderBy = this.sortBox[index].key;
       this.filterParamsTrue = JSON.parse(JSON.stringify(this.filterParams));
       this.sort = 'sortUp'
        this.getList();
      }
    },
    backFun(){
       this.$store.commit('set_waitState', false)
       this.$router.go(-1);
    }
  }
};
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
    p {
      padding: 0;
      margin: 0;
    }
    .mint-tab-item-label {
      font-size: 0.3rem;
    }
  }
  .sort-box {
    height: 0.64rem;
    background: rgba(255, 255, 255, 1);
    @include flexbox;
    @include flex-direction(row);
    div {
      height: 100%;
      width: 50%;
      color: rgba(48, 48, 48, 1);
      font-size: 0.3rem;
      @include flexbox;
      @include justify-content(center);
      @include align-items(center);
      span:last-child {
        display: inline-block;
        width: 0.36rem;
        height: 0.36rem;
        margin-left: 0.11rem;
        background: url(../../../assets/images/sort.png) no-repeat;
      }
      span.sortUp {
        background: url(../../../assets/images/sortUp.png) no-repeat;
      }
      span.sortDown {
        background: url(../../../assets/images/sortDown.png) no-repeat;
      }
    }
    div:first-child {
      border-right: solid 1px #cecece;
    }
    .selected {
      color: rgba(50, 150, 250, 1);
    }
  }
  .grades {
    @include flexbox;
    @include justify-content(space-around);
    color: #faf7fa;
    padding: 0.3rem;
    height: 1.1rem;
    li {
      height: 0.54rem;
      line-height: 0.54rem;
      padding: 0 0.2rem;
      font-size: 0.3rem;
      border-radius: 0.06rem;
      vertical-align: middle;
    }
    li:last-child {
      font-size: 0.32rem;
      background: rgba(24, 119, 210, 1);
      border-radius: 0.22rem;
    }
    .grade-choiced {
      background: rgba(50, 150, 250, 1);
      color: rgba(255, 255, 255, 1);
    }
    .grade-nochoiced {
      background: rgba(170, 184, 198, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
  .filter-box {
    padding: 0.2rem 0.32rem;
    height: 0.94rem;
    border-bottom: solid 1px #f3f3f5;
    border-top: solid 1px #f3f3f5;
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
          content: '';
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
          background: #3296fa url('../../../assets/images/ischeck.png') no-repeat 0.18rem
            center;
          background-size: 0.32rem 0.32rem;
          &::before {
            display: none;
          }
        }
      }
      &:nth-child(2) {
        float: right;
        background-size: 0.32rem 0.32rem;
        line-height: 0.54rem;
        padding-left: 0.4rem;
        font-size: 0.3rem;
      }
    }
    .filter {
      background: url('../../../assets/images/filter.png') no-repeat left center;
      color: #3296fa;
    }
    .filter-black {
      background: url('../../../assets/images/filterBlack.png') no-repeat left center;
      color: #000;
    }
  }
  .tasklist-box {
    background: #f8f8f8;
    overflow-y: auto;
    &.auto {
      height: calc(100% - 2.68rem);
    }
    &.isback {
      height: calc(100% - 1.9rem);
    }
    li {
      background: #fff url('../../../assets/images/right.png') no-repeat;
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
      background: #3296fa url('../../../assets/images/add-cycle.png') no-repeat 2.3rem
        center;
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
          margin: 0.3rem 0.3rem 0.2rem 0;
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
          color: rgba(170, 184, 198, 1);
          border: 0.01rem solid rgba(170, 184, 198, 1);
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
          color: rgba(170, 184, 198, 1);
        }
        .tip {
          float: left;
          padding: 0 0.3rem;
          line-height: 0.54rem;
          color: rgba(170, 184, 198, 1);
          margin: 0 0.3rem 0.2rem 0;
          border-radius: 0.06rem;
          border: 0.01rem solid rgba(170, 184, 198, 1);
          &.active {
            background: rgba(50, 150, 250, 1);
            color: #fff;
          }
          &.date-tip1 {
            width: 4.7rem;
            background-color: #fff;
          }
          &.date-tip2 {
            width: 5.23rem;
            background-color: #fff;
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
              content: '';
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
                background: url('../../../assets/images/check.png') no-repeat 50%;
                background-size: 100% auto;
                border: 0;
              }
            }
          }
        }
      }
    }
    .drop-down {
      float: right;
      width: 0.3rem;
      height: 0.3rem;
      background: url('../../../assets/images/right1.png') no-repeat center !important;
      background-size: 50% !important;
    }
    @keyframes turn1 {
      0% {
        transform: rotate(-90deg);
      }

      100% {
        transform: rotateX(90deg);
      }
    }
    @keyframes turn2 {
      0% {
        transform: rotate(90deg);
      }

      100% {
        transform: rotateX(-90deg);
      }
    }
    .put-away {
      transform: rotate(-90deg);
      animation-name: turn2;
      // animation-duration:1s;
      transition: all 0.5s linear;
    }
    .drop-all {
      transform: rotate(90deg);
      animation-name: turn1;
      // animation-duration:1s;
      transition: all 0.5s linear;
    }
  }
  .btn-box {
    height: 0.5rem;
    margin-top: 0.3rem;
    font-size: 0.32rem;
    button {
      width: 2.4rem;
      margin-right: 0.32rem;
      float: right;
      display: block;
    }
    .sure {
      background: #3296fa;
      color: #fff;
      border: 0;
    }
    .reset {
      background: #fff;
      color: #3296fa;
      border: 0.01rem solid #3296fa;
    }
  }
  .checkTree .ztree li a .node_name {
    color: rgba(170, 184, 198, 1) !important;
    font-size: 0.3rem;
  }
  .ztree .button.bottom_close:before,
  .ztree .button.bottom_open:before,
  .ztree .button.center_close:before,
  .ztree .button.center_open:before,
  .ztree .button.noline_close:before,
  .ztree .button.noline_open:before,
  .ztree .button.root_close:before,
  .ztree .button.root_open:before,
  .ztree .button.roots_close:before,
  .ztree .button.roots_open:before,
  .ztree .button.bottom_close:before,
  .ztree .button.bottom_open:before,
  .ztree .button.center_close:before,
  .ztree .button.center_open:before,
  .ztree .button.noline_close:before,
  .ztree .button.noline_open:before,
  .ztree .button.root_close:before,
  .ztree .button.root_open:before,
  .ztree .button.roots_close:before,
  .ztree .button.roots_open:before {
    border: none !important;
    display: inline-block !important;
    width: 0.22rem;
    height: 0.22rem;
    background: url('../../../assets/images/grey-right.png') no-repeat center !important;
    background-size: 100% !important;
  }
}
</style>
