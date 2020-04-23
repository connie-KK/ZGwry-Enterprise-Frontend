<template>
  <div id="puttask">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
      :customBack="backFun"
    >
      {{ id ? '任务内容' : '发布任务' }}
    </header-bar>
    <div class="main-content">
      <div class="box-item">
        <span class="item-title">标题</span>
        <input
          type="text"
          placeholder="请输入标题"
          v-model="taskTitle"
          :disabled="notEdit ? false : 'disabled'"
        />
      </div>
      <div class="box-item" v-if="id">
        <span class="item-title">状态</span>
        <p class="checkbox2">{{ stateName }}</p>
      </div>
      <div class="box-item" @click="notEdit && !isEvent ? (popupType = true) : false">
        <span class="item-title">任务性质</span>
        <p :class="notEdit && !isEvent ? 'checkbox' : 'checkbox2'">{{ taskTypeName }}</p>
      </div>
      <div class="box-item" v-if="id">
        <span class="item-title">网格/部门</span>
        <p class="checkbox2">{{ depName || '' }}</p>
      </div>
      <div class="box-item" v-if="id">
        <span class="item-title">时间</span>
        <p class="checkbox2">{{ taskDate }}</p>
      </div>
      <div class="box-item" v-if="id">
        <span class="item-title">发出人</span>
        <p class="checkbox2">{{ staffName || '' }}</p>
      </div>
      <div class="box-item" v-if="isEvent" @click="toEventDetail">
        <span class="item-title">事件</span>
        <p class="checkbox">
          {{ incidentTitle }}
        </p>
      </div>
      <div class="box-item" @click="notEdit ? $router.push('/taskModelList') : false">
        <span class="item-title">模板类型</span>
        <p :class="notEdit ? 'checkbox' : 'checkbox2'">
          {{ templateName || (notEdit ? '请选择模板' : '无模板') }}
        </p>
      </div>
      <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">内容</span>
        <textarea
          rows="5"
          placeholder="请输入详细情况"
          v-model="contentText"
          :disabled="notEdit ? false : 'disabled'"
        ></textarea>
      </div>
      <!-- <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">状态</span>
        <p class="checkbox2">{{ stateName }}</p>
      </div> -->
      <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">相关企业（{{ enters.length }}）</span>
        <p class="addbox" @click="$router.push('/taskLinkEntList')" v-if="!id">
          添加企业
        </p>
        <ul class="item-ul">
          <li v-for="item in enters" :key="item.id">
            <span>{{ item.name }}</span>
            <i class="delete" v-if="!id" @click="deleteEnter(item.id)"></i>
            <!-- <i class="jump" v-if="id" @click="toEnterPage(item.id)"></i> -->
          </li>
        </ul>
      </div>
      <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">相关位置（{{ positions.length }}）</span>
        <p class="addbox" @click="$router.push('/mapPosition')" v-if="!id">
          添加位置
        </p>
        <ul class="item-ul item-ul2">
          <li v-for="(item, index) in positions" :key="index + 'pop'">
            <span>{{ item.title }}</span>
            <p>{{ item.lng }}E, {{ item.lat }} N</p>
            <i class="delete" v-if="!id" @click="deletePosition(index)"></i>
            <!-- <i class="jump" v-if="id"></i> -->
          </li>
        </ul>
      </div>
      <p class="gang"></p>
      <!-- <p class="item-box-top-title">指派</p> -->
      <div class="box-item" @click="notEdit ? $refs.picker.open() : false">
        <span class="item-title">任务执行期限</span>
        <p :class="notEdit ? 'checkbox' : 'checkbox2'">{{ deadline }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">执行周期</span>
        <span class="input-unit">天</span>
        <span v-show="showDateTips" class="date-tips">填写执行周期</span>
        <input
          type="number"
          @focus="showDateTips = false"
          @blur="isShowDateTips"
          v-model="$store.state.taskParams.period"
          :disabled="notEdit ? false : 'disabled'"
        />
      </div>
      <div class="box-item">
        <span class="item-title">多网格指派</span>
        <div class="right">
          <mt-switch v-model="switchValue"  :disabled="isSwitch"></mt-switch>
        </div>
      </div>
      <div class="box-item" @click="assignUser">
        <span class="item-title">指派给</span>
        <p class="checkbox more-cell" :title="partStaffName">
          {{ partStaffName || '未指定' }}
        </p>
      </div>
      <p class="gang"></p>
      <div v-if="id">
        <!-- <p class="item-box-top-title">执行情况</p> -->
        <!-- <div
          class="box-item"
          v-if="taskState === 4"
          @click="$router.push('/taskResult/X-' + id)"
        >
          <span class="item-title">执行结果</span>
          <p class="checkbox">&nbsp;</p>
        </div> -->
        <p class="m-title">执行记录（{{ reListX.length }}）</p>
        <ul class="totask-list" v-if="reListX.length">
          <li v-for="iit in reListX" :key="iit.id" @click="toRecordDetail(iit)">
            <p>{{ iit.date1 }}</p>
            <span v-if="iit.enterpriseName">{{ iit.enterpriseName }}</span>
            <span
              >{{ iit.parentName || '' }} {{ iit.gridName || '' }}
              {{ getStaffName(iit.staff) || '' }}</span
            >
          </li>
        </ul>
      </div>
      <p class="gang" v-if="id"></p>
      <div v-if="id">
        <p class="m-title">任务流转记录（{{ taskrecords.length }}）</p>
        <ul class="totask-list" v-if="taskrecords.length">
          <li @click="toTaskTransfer">
            <p class="record">{{ taskrecords[0].date }} {{taskrecords[0].staffname}} {{taskrecords[0].describe}}</p>
          </li>
        </ul>
      </div>
      <p class="gang" v-if="id && isRecordFinish"></p>
      <div class="add-btn" v-if="notEdit">
        <button @click="submit">确定</button>
      </div>
      <div class="btn-box" v-if="taskState === 4 && isRecordFinish && followupType !== 'add'">
        <button class="popup-btn reset" @click="addRecord">添加执行记录</button>
        <button class="popup-btn sure" @click="submitFinish">任务执行完毕</button>
      </div>
    </div>

    <!-- control -->
    <mt-popup position="bottom" v-model="popupType" class="popup-box">
      <mt-picker
        :slots="slotsTypes"
        valueKey="name"
        @change="onValuesChangeType"
      ></mt-picker>
    </mt-popup>
    <mt-datetime-picker
      type="date"
      ref="picker"
      v-model="pickerValue"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      @confirm="handleConfirm"
    >
    </mt-datetime-picker>
  </div>
</template>

<script>
import {
  Navbar,
  TabItem,
  Popup,
  DatetimePicker,
  Picker,
  MessageBox,
  Toast,
  Switch
} from 'mint-ui';
import moment from 'moment';
import store from 'store';
export default {
  name: 'tasklist',
  components: {
    'mt-navbar': Navbar,
    'mt-tab-item': TabItem,
    'mt-popup': Popup,
    'mt-datetime-picker': DatetimePicker,
    'mt-picker': Picker,
    'mt-switch': Switch
  },
  data() {
    return {
      id: '',
      moduleName: '',
      isShowSearchIcon: false,
      isShowBorder: true,
      popupType: false,
      isEvent: false,
      stateOptions: [
        {code: 0, name: '未下发'},
        {code: 1, name: '未审核'},
        {code: 3, name: '已撤销'},
        {code: 4, name: '执行中'},
        {code: 5, name: '退回'},
        {code: 6, name: '任务完结'},
        {code: 7, name: '加载中'}
      ],
      enters: [],
      pickerValue: moment().format('YYYY-MM-DD 00:00:00'),
      partStaffName: '',
      contentText: '',
      taskTitle: '',
      modelList: [],
      reList: [],
      reListEnters: [],
      taskHandelStaffs: [],
      notEdit: true,
      followupType: '',
      switchValue: false,
      showDateTips: true,
      taskrecords: [],
      isSwitch:false
    };
  },
  computed: {
    gridLevel() {
      return this.$store.state.userInfo ? this.$store.state.userInfo.gridLevel : 0;
    },
    taskTypes() {
      const atct = {
        2: {
          code: 2,
          name: '事件处理任务'
        },
        5: {
          code: 5,
          name: '日常巡查'
        },
        6: {
          code: 6,
          name: '信访办理'
        }
        // 7: {
        //   code: 7,
        //   name: '任务交办'
        // }
      };
      let temp = [];
      // if (this.gridLevel == 1) {
      //   temp = [atct[7]];
      // }
      // if (this.gridLevel == 2) {
      // temp = [atct[5], atct[6], atct[7]];
      // }
      // if (this.gridLevel == 3) {
      //   temp = [atct[5], atct[6]];
      // }
      // if (!this.$store.state.taskParams.type.id) {
      //   this.$store.state.taskParams.type = temp.length ? temp[0].code : 0
      // }
      temp = [atct[5], atct[6]];
      return temp;
    },
    reListX() {
      let temp = [];
      this.reList.forEach(item => {
        item.date1 = moment(item.date).format('YYYY-MM-DD HH:mm');
        if (item.enterprise) {
          this.reListEnters.forEach(cc => {
            if (cc.id === item.enterprise) {
              item.enterpriseName = cc.name;
            }
          });
        }
        temp.push(item);
      });
      return temp;
    },
    slotsTypes() {
      return [
        {
          values: this.taskTypes,
          className: 'slottypes',
          textAlign: 'center'
        }
      ];
    },
    incidentTitle() {
      return this.$store.state.taskParams.incidentTitle;
    },
    templateName() {
      return this.$store.state.taskParams.templateName;
    },
    staffName() {
      return this.$store.state.taskParams.staffName;
    },
    staffId() {
      return this.$store.state.taskParams.staff;
    },
    taskDate() {
      return this.$store.state.taskParams.date;
    },
    taskTypeName() {
      let temp = '';
      if (!this.$store.state.taskParams.type) {
        return '';
      }
      const atct = {
        1: {code: 1, name: '日常任务'},
        2: {code: 2, name: '事件处理任务'},
        3: {code: 3, name: '双随机任务'},
        4: {code: 4, name: '重污染空气'},
        5: {code: 5, name: '日常巡查'},
        6: {code: 6, name: '信访办理'},
        7: {code: 7, name: '任务交办'}
      };
      if (this.$store.state.taskParams.type === 1) {
        temp = '日常巡查';
      } else {
        temp = atct[this.$store.state.taskParams.type].name;
      }
      return temp;
    },
    stateName() {
      return this.stateOptions.filter(item => {
        return this.$store.state.taskParams.state === item.code;
      })[0].name;
    },
    taskState() {
      return this.$store.state.taskParams.state;
    },
    taskenterprises() {
      return this.$store.state.taskParams.taskenterprises;
    },
    deadline() {
      return moment(this.$store.state.taskParams.deadline).format('YYYY-MM-DD');
    },
    positions() {
      return this.$store.state.taskParams.taskcoords;
    },
    mydep() {
      return this.$store.state.taskParams.dep;
    },
    depName() {
      if (this.isManyCell) {
        return '多网格';
      }
      let temp = '';
      this.$store.state.allDep.forEach(depf => {
        depf.subDepts.forEach(dep => {
          if (dep.id === this.mydep) {
            temp = dep.name;
          }
        });
      });
      let gridCell = this.$store.state.gridCell;
      if (gridCell) {
        if (gridCell.id === this.mydep) {
          temp = gridCell.name;
        } else {
          gridCell.children.forEach(cell => {
            if (cell.id === this.mydep) {
              temp = cell.name;
            } else {
              cell.children.forEach(cxcell => {
                if (cxcell.id === this.mydep) {
                  temp = cxcell.name;
                }
              });
            }
          });
        }
      }
      return temp;
    },
    partStaffId() {
      return this.$store.state.taskParams.depStaff;
    },
    isManyCell() {
      return this.$store.state.taskParams.isManyCell;
    },
    templateId() {
      return this.$store.state.taskParams.template;
    },
    isNewTaskHandelChange() {
      return this.$store.state.isNewTaskHandelChange;
    },
    isRecordFinish() {
      let isFinish = false;
      if (this.id !== '0' && this.id !== '1' && this.id !== '') {
        const checkCell = this.$store.state.checkGridCell;
        const grid = this.$store.state.userInfo.id;
        if (checkCell.length > 0) {
          checkCell.forEach(item => {
            if (item.id === grid) {
              isFinish = true;
            }
          });
        }
      }
      return isFinish;
    }
  },
  watch: {
    taskTypeName() {
      if (this.$store.state.taskParams.type === 2) {
        this.isEvent = true;
      } else {
        this.isEvent = false;
      }
    },
    isNewTaskHandelChange() {
      this.getTaskHandleList();
    },
    isManyCell() {
      if (this.isManyCell) {
        this.partStaffName = '多网格';
      }
    },
    taskenterprises() {
      let enterApis = [];
      this.taskenterprises.forEach(id => {
        enterApis.push(
          this.$api.getEnterpriseByid({
            id: id
          })
        );
      });
      Promise.all(enterApis).then(res => {
        this.$store.state.taskEnter = res;
        this.enters = res;
      });
    },
    deadline() {
      this.pickerValue = this.deadline;
    },
    partStaffId() {
      let tempids = [];
      if (this.partStaffId && !this.switchValue) {
        tempids.push(this.partStaffId);
      }
      if (this.switchValue) {
        this.$store.state.checkGridCell.forEach(item => {
          tempids.push(item.id);
        });
      }
      if (tempids.length === 0) {
        return;
      }
      this.$api
        .getUserByArrUserID({
          items: tempids
        })
        .then(res => {
          if (res) {
            if (res.length === 1) {
              this.partStaffName = res[0].username;
            } else {
              let names = '';
              res.forEach(n => {
                if (names !== '') {
                  names = names + ',' + n.username;
                } else {
                  names = n.username;
                }
              });
              this.partStaffName = names;
            }
          }
        });
    },
    staffId() {
      this.$api
        .getUserByArrUserID({
          items: [this.staffId]
        })
        .then(res => {
          this.$store.state.taskParams.staffName = res[0].username;
        });
    },
    templateId() {
      if (this.templateId && this.modelList.length) {
        this.$store.state.taskParams.templateName = this.modelList.filter(item => {
          return item.id === this.templateId;
        })[0].title;
      }
    },
    switchValue() {
      if (this.id === '') {
        if (this.switchValue) {
          this.partStaffName = '多网格';
          this.$store.state.checkGridCell = [];
        } else {
          this.partStaffName = '未指定';
          this.$store.state.checkGridCell = [];
        }
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.setFirst();
    if (this.id === '0') {
      this.id = '';
    } else if (this.id === '1') {
      this.$store.state.taskParams.type = 2;
      this.isEvent = true;
      this.$store.state.taskParams.incident = this.$store.state.toTaskEvent;
      this.$store.state.taskParams.incidentTitle = this.$store.state.toTaskEventTitle;
      this.id = '';
      this.followupType = this.$store.state.followupType;
    } else {
      //从事件页跳转，查看任务，如果followupType是add,此时任务还没创建，只保存在本地
      this.followupType = this.$store.state.followupType;
      if (this.followupType === 'add') {
        this.$store.state.isEdit = true;
        this.$store.state.taskParams.incidentTitle = this.$store.state.toTaskEventTitle;
        this.$store.state.taskParams.type = 2;
        this.isEvent = true;
        const task = this.$store.state.followupTask;
        this.$nextTick(() => {
          this.handleTaskDetail(task, 'assignments');
        })
      } else {
        this.isSwitch = true
        if (this.id) {
          this.getModel().then(() => {
            this.getTaskDetail();
          });
          this.notEdit = false;
          this.$store.state.isEdit = false;
        }
      }
    }
    this.getUser();
    this.getAllDep();
    this.getModel();
    if (!this.id) {
      this.$store.state.isEdit = true;
    }
  },
  methods: {
    backFun() {
      this.$router.go(-1);
    },
    setFirst() {
      this.$store.state.allDep = [];
      this.$store.state.gridCell = null;
      this.$store.state.checkGridCell = [];
      this.$store.state.taskEnter = [];
      this.$store.state.userAssInfoList = [];
      this.$store.state.taskParams = {
        template: null,
        templateName: '',
        staff: '',
        staffName: '',
        date: moment().format('YYYY-MM-DD HH:mm:00'),
        deadline: moment().format('YYYY-MM-DD 00:00:00'),
        type: 1,
        state: 0,
        taskenterprises: [],
        taskcoords: [],
        depType: 1,
        dep: '',
        depStaff: '',
        isManyCell: false,
        period: '',
        incident: '',
        incidentTitle: ''
      };
    },
    handleTaskDetail(res, key) {
      this.showDateTips = false;
      this.moduleName = res.title;
      let ass = res[key];
      this.contentText = res.contents;
      this.taskTitle = res.title;
      this.$store.state.taskParams = {
        template: res.template,
        templateName: '',
        staff: res.staff,
        staffName: '',
        date: res.date,
        deadline: res.deadline,
        type: res.type,
        state: res.state,
        taskenterprises: res.taskenterprises,
        taskcoords: res.taskcoords,
        depType: ass.length ? (ass[0].type <= 1 ? 1 : 2) : 1,
        dep: ass.length ? ass[0].dept || ass[0].grid : '',
        depStaff: ass.length ? ass[0].staff : '',
        isManyCell: ass.length > 1 ? true : false,
        period: res.period,
        incidentTitle: res.incidentTitle,
        incident: res.followup
      };
      if (res[key].length) {
        let tempass = [];
        res[key].forEach(taskass => {
          tempass.push({
            depType: taskass.staff ? 'user' : 'dep',
            dep: taskass.grid ? taskass.grid : taskass.dept,
            id: taskass.staff,
            type: taskass.staff ? 'user' : 'dep',
          });
        });
        this.$store.state.checkGridCell = JSON.parse(JSON.stringify(tempass));
        console.log(this.$store.state.checkGridCell);
      }
      this.switchValue = res[key].length > 1 ? true : false;
      this.$store.state.userAssInfoList = res[key];
      if (this.followupType !== 'add') {
        this.getTaskHandleList();
      }
      //任务流转
      if(this.followupType !== 'add') {
          this.taskCircule(res);
      }
    },
    getTaskDetail() {
      this.$api
        .getTaskDetail({
          id: this.id
        })
        .then(res => {
          if (res) {
            this.handleTaskDetail(res, 'taskassignments2');
          }
        });
    },
    getStaffName(staff) {
      let temp = '';
      this.taskHandelStaffs.forEach(item => {
        if (item.id === staff) {
          temp = item.username;
        }
      });
      return temp;
    },
    getTaskHandleList() {
      this.$api
        .getTaskHandleList({
          task: this.id,
          staff: this.staffId
        })
        .then(res => {
          // console.log(res)
          let po = [];
          let staffs = [];
          res.forEach(item => {
            if (item.staff) {
              staffs.push(item.staff);
            }
            if (item.enterprise) {
              po.push(
                this.$api.getEnterpriseByid({
                  id: item.enterprise
                })
              );
            }
          });
          Promise.all(po).then(res => {
            this.reListEnters = res;
          });
          this.$api
            .getUserByArrUserID({
              items: staffs
            })
            .then(res => {
              this.taskHandelStaffs = res;
            });
          this.reList = res;
        });
    },
    getModel() {
      return new Promise(resove => {
        this.$api
          .getTemplateByKey({
            pageIndex: -1,
            pageSize: 10
          })
          .then(res => {
            if (res && Array.isArray(res)) this.modelList = res;
            resove(true);
          });
      });
    },
    getAllDep() {
      this.$api.getDepartmentAll().then(res => {
        this.$store.state.allDep = res;
      });
    },
    getStaffInfo(id) {
      this.$api
        .getStaffInfo({
          id
        })
        .then(res => {
          if (res && res.id) {
            this.$store.state.userInfo = res;
          }
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
    getUser() {
      this.$api.getUser().then(res => {
        if (res) {
          this.$store.state.taskParams.staff = res.id;
          this.$store.state.taskParams.staffName = res.username;
          this.getStaffInfo(res.id);
        }
      });
    },
    getTaskUser(id) {
      this.getStaffInfo(id);
    },
    onValuesChangeType(e) {
      if (!this.notEdit) {
        return;
      }
      if (e.values[0] && e.values[0].code === 2) {
        this.isEvent = true;
      } else {
        this.$store.state.taskParams.incident = '';
      }
      if (e.values[0]) {
        this.$store.state.taskParams.type = e.values[0].code;
      }
    },
    deleteEnter(id) {
      MessageBox.confirm('确认删除此企业?').then(action => {
        if (action === 'confirm') {
          this.taskenterprises.forEach((item, index) => {
            if (item === id) {
              this.$store.state.taskParams.taskenterprises.splice(index, 1);
            }
          });
        }
      });
    },
    deletePosition(index) {
      MessageBox.confirm('确认删除此位置?').then(action => {
        if (action === 'confirm') {
          this.$store.state.taskParams.taskcoords.splice(index, 1);
        }
      });
    },
    handleConfirm(e) {
      this.$store.state.taskParams.deadline = moment(e).format('YYYY-MM-DD 00:00:00');
    },
    submitBefore(data) {
      let tempdata = this.$store.state.taskParams;
      if (!data.title) {
        return '请输入标题！';
      }
      if (
        (!data.assignments[0].grid && tempdata.depType === 1) ||
        (!data.assignments[0].dept && tempdata.depType === 2)
      ) {
        console.log(data.assignments[0]);
        return '请选择网格/部门！';
      }
      if (!data.period) {
        return '请输入执行周期！';
      }
      return false;
    },
    submit() {
      let temp = JSON.parse(JSON.stringify(this.$store.state.taskParams));
      const id = (!this.id || this.id === '0' || this.id === '1') ? this.$uuid() : this.id;
      let params = {
        id: id,
        rowState: 'add',
        incident: temp.incident || null, // 事件
        staff: temp.staff,
        template: temp.template,
        title: this.taskTitle,
        contents: this.contentText,
        deadline: temp.deadline,
        period: temp.period,
        type: temp.type,
        state: 4,
        index: 0,
        date: temp.date,
        multiGrid: temp.isManyCell,
        approvedby: null, // 审批id
        approvetime: null, // 审批时间
        assignments: [],
        coords: temp.taskcoords,
        enterprises: temp.taskenterprises
      };
      let assignments = [];
      // console.log(this.$store.state.checkGridCell)
      // if (temp.isManyCell) {
      this.$store.state.checkGridCell.forEach(item => {
        assignments.push({
          id: this.$uuid(),
          rowState: 'add',
          dept: temp.depType === 2 ? item.dep : null,
          staff: item.id || null,
          grid: temp.depType === 1 ? item.dep : null,
          type:
            temp.depType === 1
              ? item.all 
                ? 1
                : 0
              : item.all 
              ? 3
              : 2
        });
      });
      // } else {
      // assignments.push({
      //   id: this.$uuid(),
      //   rowState: 'add',
      //   dept: temp.depType === 2 ? temp.dep : null,
      //   staff: temp.depStaff || null,
      //   grid: temp.depType === 1 ? temp.dep : null,
      //   type: temp.depType === 1 ? (temp.depStaff ? 0 : 1) : temp.depStaff ? 2 : 3
      // });
      // }
      let coords = [];
      temp.taskcoords.forEach(item => {
        let te = JSON.parse(JSON.stringify(item));
        te.id = this.$uuid();
        te.remarks = te.remark;
        te.rowState = 'add';
        coords.push(te);
      });
      let enterprises = [];
      temp.taskenterprises.forEach(item => {
        enterprises.push({
          id: this.$uuid(),
          rowState: 'add',
          enterprise: item
        });
      });
      // add
      params.assignments = assignments;
      params.coords = coords;
      params.enterprises = enterprises;
      // console.log(params)
      let text = this.submitBefore(params);
      if (text) {
        Toast(text);
        return false;
      }
      if (this.followupType === 'add') {
        params.taskenterprises = temp.taskenterprises;
        params.taskcoords = coords;
        this.$store.commit('set_followupTask', params);
        this.$store.state.isAddTaskState = Math.random();
        this.$router.go(-1);
        return;
      }
      this.$api.updatetask(params).then(res => {
        this.$store.state.isAddTaskState = Math.random();
        this.$router.go(-1);
      });
    },
    toEnterPage(id) {
      window.location.href = `https://zsxtl.azuratech.com:8003/dashboard/#/enterInfo/${id}`;
    },
    submitFinish() {
      this.$api
        .updateTaskStateToComplete({
          id: this.id
        })
        .then(res => {
          if (res === 'OK') {
            Toast('任务已完满执行');
            this.setFirst();
            this.getAllDep();
            this.getModel();
            this.getTaskDetail();
            this.notEdit = false;
            this.$store.state.isEdit = false;
          }
        });
    },
    assignUser() {
      if(!this.notEdit){
        this.$router.push('/taskAssignRecord')
      }else{
         if (this.switchValue) {
        this.$router.push('/taskMoreAssign');
      } else {
        this.$router.push('/taskAssign');
      }
      }
    },
    isShowDateTips() {
      if (this.$store.state.taskParams.period == '') {
        this.showDateTips = true;
      }
    },
    toEventDetail() {
      const eventid = this.$store.state.taskParams.incident;
      if (eventid && eventid !== '') {
        this.$api.getIncidentDetail({id: eventid}).then(res => {
          if (res) {
            if (res.state === 3 && res.followup.length === 0) {
              //事件已自行处理
              this.$router.push(`/eventContent/${res.id}`);
            } else {
              const gridLevel = this.$store.state.userInfo.gridLevel;
              if (gridLevel === 3) {
                //三级网格员，跳转事件内容页面
                this.$router.push(`/eventContent/${res.id}`);
              } else if (gridLevel === 1) {
                this.$router.push(`/eventDetailLevel1/${res.id}`);
              } else if (gridLevel === 2) {
                this.$router.push(`/eventDetail/${res.id}`);
              }
            }
          }
        });
      }
    },
    toRecordDetail(item) {
      store.set('taskState', 'detail');
      this.$router.push('/taskResult/' + item.id);
    },
    addRecord() {
      store.set('taskState', 'add');
      this.$router.push(`/taskResult/${this.id}`);
    },
    taskCircule(res){
      this.taskrecords = [];
      if (res.approveTime && res.approvedBy) {
        this.taskrecords.push({
          date: moment(res.approveTime).format('MM-DD HH:mm'),
          staffid: res.approvedBy,
          status: 'sp',
          describe:'进行了审批'
        });
      } 
       if (res.handledate && res.handleBy) {
        this.taskrecords.push({
          date: moment(res.handledate).format('MM-DD HH:mm'),
          staffid: res.handleBy,
          status: 'wj',
          describe:'完结任务'
        });
      } 
      if (res.taskassignments2.length > 0) {
        let tempassign = [];
        res.taskassignments2.forEach(item => {
          let ass = false;
          if (item.appointor && item.time) {
            tempassign.forEach(t => {
              if (t.appointor === item.appointor && t.time === item.time) {
                ass = true;
              }
            });
            if (ass) {
              tempassign.push({
                date: moment(item.time).format('MM-DD HH:mm'),
                staffid: item.appointor,
                status: 'xf',
                describe:'进行了任务下发'
              });
            }
          }
        });
      } 
      if (res.staff && res.date) {
        this.taskrecords.push({
          date: moment(res.date).format('MM-DD HH:mm'),
          staffid: res.staff,
          status: 'cj',
          describe:'创建此任务'
        });
      }
        let staffIds = this.taskrecords.map(staff =>{
          return staff.staffid
      })
       this.$api
        .getUserByArrUserID({
          items: staffIds
        })
        .then(res => {
          if(res){
            this.taskrecords.forEach(user => {
              let staffItem = res.filter(r => {
                return r.id === user.staffid
              })
              user.staffname = staffItem[0].username
            })
          }
        })
        this.taskrecords.sort((a,b)=>{
          return moment(a.date)-moment(b.date)
        })
        this.$store.commit('set_recordCircule', this.taskrecords)
        console.log(this.taskrecords)
    },
    toTaskTransfer(){
      this.$router.push('/taskTransfer')
    }
  }
};
</script>

<style lang="scss">
#puttask {
  .main-content {
    top: 1.29rem;
    background: #fff;
    height: calc(100% - 1.29rem);
    p {
      padding: 0;
      margin: 0;
    }
    .mint-tab-item-label {
      font-size: 0.3rem;
    }
  }
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #9e9e9e;
    font-size: 0.3rem;
  }
  .box-item {
    position: relative;
    min-height: 1.12rem;
    font-size: 0.34rem;
    line-height: 1.12rem;
    padding: 0 0.32rem;
    border-bottom: 1px solid #e0e0e0;
    background: #fff;
    overflow: hidden;
    .item-title {
      color: #333;
    }
    input {
      width: 5rem;
      float: right;
      height: 1.12rem;
      border: 0;
      text-align: right;
      font-size: 0.3rem;
      color: #9e9e9e !important;
    }
    .input-unit {
      float: right;
      font-size: 0.3rem;
      color: #9e9e9e;
      margin-left: 0.1rem;
    }
    .date-tips {
      position: absolute;
      background-color: hsla(210, 100%, 96%, 1);
      font-size: 0.3rem;
      color: #8c95a0;
      height: 0.52rem;
      /* float: right; */
      line-height: 0.52rem;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      padding: 0 0.08rem;
    }
    textarea {
      border: 0;
      display: block;
      margin-bottom: 0.3rem;
      color: #9e9e9e;
      font-size: 0.3rem;
      line-height: 0.4rem;
      width: 100%;
    }
    .checkbox {
      float: right;
      padding-right: 0.52rem;
      text-align: right;
      font-size: 0.3rem;
      color: #9e9e9e;
      background: url('../../../assets/images/right.png') no-repeat right center;
      background-size: auto 0.32rem;
    }
    .checkbox2 {
      float: right;
      text-align: right;
      font-size: 0.3rem;
      color: #9e9e9e !important;
    }
    .more-cell {
      width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .addbox {
      float: right;
      font-size: 0.3rem;
      line-height: 0.74rem;
      padding: 0 0.36rem 0 0.84rem;
      color: #3296fa;
      border: 0.02rem solid #3296fa;
      position: relative;
      margin-top: 0.2rem;
      &::before {
        content: '+';
        border: 0.02rem solid #3296fa;
        border-radius: 50%;
        line-height: 0.3rem;
        width: 0.3rem;
        text-align: center;
        font-size: 0.26rem;
        position: absolute;
        left: 0.37rem;
        height: 0.3rem;
        top: 0;
        bottom: 0;
        margin: auto;
        color: #3296fa;
      }
    }
    .item-ul {
      margin-bottom: 0.4rem;
      li {
        background: #f8f8f8;
        font-size: 0.3rem;
        line-height: 1rem;
        padding-left: 0.2rem;
        margin-bottom: 0.16rem;
        position: relative;
        i.delete {
          // background: #f8f8f8 url("../../../assets/images/right.png") no-repeat
          // right center;
          // background-size: auto 0.32rem;
          &::before {
            content: '-';
            border: 0.02rem solid #3296fa;
            border-radius: 50%;
            line-height: 0.3rem;
            width: 0.3rem;
            text-align: center;
            font-size: 0.26rem;
            position: absolute;
            right: 0.4rem;
            height: 0.3rem;
            top: 0;
            bottom: 0;
            margin: auto;
            color: #3296fa;
          }
        }
        i.jump {
          background: #f8f8f8 url('../../../assets/images/right.png') no-repeat right
            center;
          background-size: auto 0.32rem;
          right: 0.4rem;
          position: absolute;
          display: block;
          height: 0.32rem;
          width: 0.32rem;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }
    }
    .item-ul2 {
      li {
        line-height: 0.4rem;
        padding-left: 0.2rem;
        margin-bottom: 0.16rem;
        padding-top: 0.1rem;
        span {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        }
        p {
          color: #bdbdbd;
          font-size: 0.26rem;
          line-height: 0.5rem;
        }
      }
    }
    .right {
      float: right;
      width: 4.5rem;
      color: rgb(157, 157, 157);
      min-height: 1.12rem;
      text-align: right;
      font-size: 0.3rem;
      @include flexbox;
      @include justify-content(flex-end);
      @include align-items(center);
      .mint-switch-core {
        width: 1rem;
        height: 0.5rem;
        &::before {
          width: 100%;
          height: 100%;
          background-color: #969696;
        }
        &::after {
          width: 50%;
          height: 100%;
        }
      }
      .mint-switch-input:checked + .mint-switch-core::after {
        transform: translateX(100%);
      }
      span {
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        text-align: right;
      }
      input,
      textarea {
        width: 100%;
        border: 0;
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        text-align: right;
        resize: none;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      input::placeholder,
      textarea::placeholder {
        color: rgb(157, 157, 157);
        font-size: 0.3rem;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      .img {
        display: inline-block;
        width: 0.37rem;
        height: 0.31rem;
        background: url('../../../assets/images/image.png') no-repeat left center;
        background-size: 0.37rem 0.31rem;
        margin-right: 0.16rem;
      }
    }
  }
  .main-content .item-box-top-title {
    background: #f1f5f7;
    font-size: 0.34rem;
    font-weight: 700;
    padding-left: 0.32rem;
    line-height: 0.8rem;
  }
  .gang {
    background: #f8f8f8;
    height: 0.4rem;
  }
  .popup-box {
    width: 100%;
    .slottypes {
      width: 100%;
    }
  }
  .main-content .m-title {
    line-height: 1.13rem;
    font-size: 0.34rem;
    padding-left: 0.32rem;
    background: #fff;
  }
  .totask-list {
    background: #fff;
    padding-bottom: 0.3rem;
    li {
      background: #f8f8f8 url('../../../assets/images/right.png') no-repeat
        calc(100% - 0.25rem) center;
      background-size: auto 0.32rem;
      margin: 0 0.24rem 0.17rem 0.4rem;
      padding: 0.1rem 0 0.1rem 0.2rem;
      p {
        line-height: 0.42rem;
        font-size: 0.3rem;
      }
      span {
        display: block;
        line-height: 0.37rem;
        font-size: 0.26rem;
        color: #888;
      }
      .record {
        padding: 0.29rem 0;
      }
    }
  }
  .btn-box {
    height: 1.28rem;
    font-size: 0.34rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.32rem;
    align-items: center;
    button {
      width: 3.28rem;
      height: 0.96rem;
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
}
</style>
