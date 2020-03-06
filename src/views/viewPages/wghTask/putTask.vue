<template>
  <div id="puttask">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
    >
      {{ id ? moduleName : '发布任务' }}
    </header-bar>
    <div class="main-content">
      <div class="box-item">
        <span class="item-title">标题</span>
        <input
          type="text"
          placeholder="请输入标题"
          v-model="taskTitle"
        />
      </div>
      <div
        class="box-item"
        @click="popupType = true"
      >
        <span class="item-title">任务性质</span>
        <p :class="notEdit ? 'checkbox' : 'checkbox2'">{{ taskTypeName }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">网格/部门</span>
        <p class="checkbox2">{{ depName || '请先选择指派' }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">时间</span>
        <p class="checkbox2">{{ taskDate }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">发出人</span>
        <p class="checkbox2">{{ staffName || '正在获取...' }}</p>
      </div>
      <div
        class="box-item"
        v-if="isEvent"
        @click="$router.push('/taskLinkEventList')"
      >
        <span class="item-title">事件</span>
        <p :class="notEdit ? 'checkbox' : 'checkbox2'">
          {{ incidentTitle || '请选择事件' }}
        </p>
      </div>
      <div
        class="box-item"
        @click="$router.push('/taskModelList')"
      >
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
      <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">状态</span>
        <p class="checkbox2">{{ stateName }}</p>
      </div>
      <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">相关企业（{{ enters.length }}）</span>
        <p
          class="addbox"
          @click="$router.push('/taskLinkEntList')"
          v-if="!id"
        >
          添加企业
        </p>
        <ul class="item-ul">
          <li
            v-for="item in enters"
            :key="item.id"
          >
            <span>{{ item.name }}</span>
            <i
              class="delete"
              v-if="!id"
              @click="deleteEnter(item.id)"
            ></i>
            <i
              class="jump"
              v-if="id"
              @click="toEnterPage(item.id)"
            ></i>
          </li>
        </ul>
      </div>
      <p class="gang"></p>
      <div class="box-item">
        <span class="item-title">相关位置（{{ positions.length }}）</span>
        <p
          class="addbox"
          @click="$router.push('/mapPosition')"
          v-if="!id"
        >
          添加位置
        </p>
        <ul class="item-ul item-ul2">
          <li
            v-for="(item, index) in positions"
            :key="index + 'pop'"
          >
            <span>{{ item.title }}</span>
            <p>{{ item.lng }}E, {{ item.lat }} N</p>
            <i
              class="delete"
              v-if="!id"
              @click="deletePosition(index)"
            ></i>
            <i
              class="jump"
              v-if="!id"
            ></i>
          </li>
        </ul>
      </div>
      <p class="gang"></p>
      <p class="item-box-top-title">指派</p>
      <div
        class="box-item"
        @click="notEdit ? $refs.picker.open() : false"
      >
        <span class="item-title">任务执行期限</span>
        <p :class="notEdit ? 'checkbox' : 'checkbox2'">{{ deadline }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">执行周期</span>
        <span class="input-unit">天</span>
        <input
          type="number"
          placeholder="填写执行周期"
          v-model="$store.state.taskParams.period"
          :disabled="notEdit ? false : 'disabled'"
        />
      </div>
      <div
        class="box-item"
        @click="$router.push('/taskAssign')"
      >
        <span class="item-title">指派给</span>
        <p class="checkbox">{{ partStaffName || '未指定' }}</p>
      </div>
      <p class="gang"></p>
      <div v-if="id">
        <p class="item-box-top-title">执行情况</p>
        <div
          class="box-item"
          v-if="taskState === 4"
          @click="$router.push('/taskResult/X-' + id)"
        >
          <span class="item-title">执行结果</span>
          <p class="checkbox">&nbsp;</p>
        </div>
        <p class="m-title">执行记录（{{ reListX.length }}）</p>
        <ul
          class="totask-list"
          v-if="reListX.length"
        >
          <li
            v-for="iit in reListX"
            :key="iit.id"
            @click="$router.push('/taskResult/' + iit.id)"
          >
            <p>{{ iit.date1 }}</p>
            <span v-if="iit.enterpriseName">{{ iit.enterpriseName }}</span>
            <span>{{ iit.parentName || '' }} {{ iit.gridName || '' }}
              {{ getStaffName(iit.staff) || '' }}</span>
          </li>
        </ul>
      </div>
      <div
        class="add-btn"
        v-if="notEdit"
      >
        <button @click="submit">确定</button>
      </div>
    </div>

    <!-- control -->
    <mt-popup
      position="bottom"
      v-model="popupType"
      class="popup-box"
    >
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
  Toast
} from 'mint-ui'
import moment from 'moment'
export default {
  name: 'tasklist',
  components: {
    'mt-navbar': Navbar,
    'mt-tab-item': TabItem,
    'mt-popup': Popup,
    'mt-datetime-picker': DatetimePicker,
    'mt-picker': Picker
  },
  data () {
    return {
      id: '',
      moduleName: '',
      isShowSearchIcon: false,
      isShowBorder: true,
      popupType: false,
      isEvent: false,
      stateOptions: [
        { code: 0, name: '未下发' },
        { code: 1, name: '未审核' },
        { code: 3, name: '已撤销' },
        { code: 4, name: '执行中' },
        { code: 5, name: '退回' },
        { code: 6, name: '任务完结' },
        { code: 7, name: '加载中' }
      ],
      enters: [],
      pickerValue: '',
      partStaffName: '',
      contentText: '',
      taskTitle: '',
      modelList: [],
      reList: [],
      reListEnters: [],
      taskHandelStaffs: [],
      notEdit: true
    }
  },
  computed: {
    isHBGJ () {
      return !this.$store.state.userInfo || this.$store.state.userInfo.isHBGJ
    },
    gridLevel () {
      return this.$store.state.userInfo
        ? this.$store.state.userInfo.gridLevel
        : 0
    },
    taskTypes () {
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
        },
        7: {
          code: 7,
          name: '任务交办'
        }
      }
      let temp = []
      if (this.isHBGJ) {
        if (this.gridLevel == 2) {
          temp = [atct[5], atct[7]]
        }
        if (this.gridLevel == 3) {
          temp = [atct[5]]
        }
      } else {
        if (this.gridLevel == 1) {
          temp = [atct[7]]
        }
        if (this.gridLevel == 2) {
          temp = [atct[5], atct[6], atct[7]]
        }
        if (this.gridLevel == 3) {
          temp = [atct[5], atct[6]]
        }
      }
      this.$store.state.taskParams.type = temp.length ? temp[0].code : 0
      return temp
    },
    reListX () {
      let temp = []
      this.reList.forEach(item => {
        item.date1 = moment(item.date).format('YYYY-MM-DD HH:mm')
        if (item.enterprise) {
          this.reListEnters.forEach(cc => {
            if (cc.id === item.enterprise) {
              item.enterpriseName = cc.name
            }
          })
        }
        temp.push(item)
      })
      return temp
    },
    slotsTypes () {
      return [
        {
          values: this.taskTypes,
          className: 'slottypes',
          textAlign: 'center'
        }
      ]
    },
    incidentTitle () {
      return this.$store.state.taskParams.incidentTitle
    },
    templateName () {
      return this.$store.state.taskParams.templateName
    },
    staffName () {
      return this.$store.state.taskParams.staffName
    },
    staffId () {
      return this.$store.state.taskParams.staff
    },
    taskDate () {
      return this.$store.state.taskParams.date
    },
    taskTypeName () {
      if (!this.$store.state.taskParams.type) {
        return ''
      }
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
        },
        7: {
          code: 7,
          name: '任务交办'
        }
      }
      return atct[this.$store.state.taskParams.type].name
    },
    stateName () {
      return this.stateOptions.filter(item => {
        return this.$store.state.taskParams.state === item.code
      })[0].name
    },
    taskState () {
      return this.$store.state.taskParams.state
    },
    taskenterprises () {
      return this.$store.state.taskParams.taskenterprises
    },
    deadline () {
      return moment(this.$store.state.taskParams.deadline).format('YYYY-MM-DD')
    },
    positions () {
      return this.$store.state.taskParams.taskcoords
    },
    mydep () {
      return this.$store.state.taskParams.dep
    },
    depName () {
      if (this.isManyCell) {
        return '多网格'
      }
      let temp = ''
      this.$store.state.allDep.forEach(depf => {
        depf.subDepts.forEach(dep => {
          if (dep.id === this.mydep) {
            temp = dep.name
          }
        })
      })
      let gridCell = this.$store.state.gridCell
      if (gridCell) {
        if (gridCell.id === this.mydep) {
          temp = gridCell.name
        } else {
          gridCell.children.forEach(cell => {
            if (cell.id === this.mydep) {
              temp = cell.name
            } else {
              cell.children.forEach(cxcell => {
                if (cxcell.id === this.mydep) {
                  temp = cxcell.name
                }
              })
            }
          })
        }
      }
      return temp
    },
    partStaffId () {
      return this.$store.state.taskParams.depStaff
    },
    isManyCell () {
      return this.$store.state.taskParams.isManyCell
    },
    templateId () {
      return this.$store.state.taskParams.template
    },
    isNewTaskHandelChange () {
      return this.$store.state.isNewTaskHandelChange
    }
  },
  watch: {
    taskTypeName () {
      if (this.$store.state.taskParams.type === 2) {
        this.isEvent = true
      } else {
        this.isEvent = false
      }
    },
    isNewTaskHandelChange () {
      this.getTaskHandleList()
    },
    isManyCell () {
      if (this.isManyCell) {
        this.partStaffName = '多网格'
      }
    },
    taskenterprises () {
      let enterApis = []
      this.taskenterprises.forEach(id => {
        enterApis.push(
          this.$api.getEnterpriseByid({
            id: id
          })
        )
      })
      Promise.all(enterApis).then(res => {
        this.$store.state.taskEnter = res
        this.enters = res
      })
    },
    deadline () {
      this.pickerValue = this.deadline
    },
    partStaffId () {
      if (this.partStaffId) {
        this.$api
          .getUserByArrUserID({
            items: [this.partStaffId]
          })
          .then(res => {
            if (res.length) {
              this.partStaffName = res[0].username
            }
          })
      }
    },
    staffId () {
      this.$api
        .getUserByArrUserID({
          items: [this.staffId]
        })
        .then(res => {
          this.$store.state.taskParams.staffName = res[0].username
        })
    },
    templateId () {
      if (this.templateId && this.modelList.length) {
        this.$store.state.taskParams.templateName = this.modelList.filter(
          item => {
            return item.id === this.templateId
          }
        )[0].title
      }
    }
  },
  mounted () {
    this.id = this.$route.params.id
    this.setFirst()
    if (this.id === '0') {
      this.id = ''
    } else if (this.id === '1') {
      console.log(this.id)
      this.$store.state.taskParams.type = 2
      this.$store.state.taskParams.incident = this.$store.state.toTaskEvent
      this.$store.state.taskParams.incidentTitle = this.$store.state.toTaskEventTitle
      this.id = ''
    }
    this.getAllDep()
    this.getModel()
    this.setDate()
    if (!this.id) {
      this.getUser()
      this.$store.state.isEdit = true
    }
    if (this.id) {
      this.getTaskDetail()
      this.notEdit = false
      this.$store.state.isEdit = false
    }
  },
  methods: {
    setFirst () {
      this.$store.state.allDep = []
      this.$store.state.gridCell = null
      this.$store.state.checkGridCell = []
      this.$store.state.taskEnter = []
      this.$store.state.userAssInfoList = []
      this.$store.state.taskParams = {
        template: null,
        templateName: '',
        staff: '',
        staffName: '',
        date: '',
        deadline: '',
        type: 0,
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
      }
    },
    getTaskDetail () {
      this.$api
        .getTaskDetail({
          id: this.id
        })
        .then(res => {
          this.getTaskUser(res.staff)
          this.moduleName = res.title
          let ass = res.taskassignments2
          this.contentText = res.contents
          this.taskTitle = res.title
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
          }
          if (res.taskassignments2.length > 1) {
            let tempass = []
            res.taskassignments2.forEach(taskass => {
              tempass.push({
                depType: taskass.staff ? 'user' : 'dep',
                dep: taskass.grid,
                id: taskass.staff
              })
            })
            this.$store.state.checkGridCell = JSON.parse(
              JSON.stringify(tempass)
            )
          }
          this.$store.state.userAssInfoList = res.taskassignments2
          this.getTaskHandleList()
        })
    },
    getStaffName (staff) {
      let temp = ''
      this.taskHandelStaffs.forEach(item => {
        if (item.id === staff) {
          temp = item.username
        }
      })
      return temp
    },
    getTaskHandleList () {
      this.$api
        .getTaskHandleList({
          task: this.id,
          staff: this.staffId
        })
        .then(res => {
          // console.log(res)
          let po = []
          let staffs = []
          res.forEach(item => {
            if (item.staff) {
              staffs.push(item.staff)
            }
            if (item.enterprise) {
              po.push(
                this.$api.getEnterpriseByid({
                  id: item.enterprise
                })
              )
            }
          })
          Promise.all(po).then(res => {
            this.reListEnters = res
          })
          this.$api
            .getUserByArrUserID({
              items: staffs
            })
            .then(res => {
              this.taskHandelStaffs = res
            })
          this.reList = res
        })
    },
    getModel () {
      this.$api
        .getTemplateByKey({
          pageIndex: -1,
          pageSize: 10
        })
        .then(res => {
          if (res && Array.isArray(res)) this.modelList = res
        })
    },
    getAllDep () {
      this.$api.getDepartmentAll().then(res => {
        this.$store.state.allDep = res
      })
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
    },
    getUser () {
      this.$api.getUser().then(res => {
        if (res) {
          this.$store.state.taskParams.staff = res.id
          this.$store.state.taskParams.staffName = res.userid
          this.getStaffInfo(res.id)
        }
      })
    },
    getTaskUser (id) {
      this.getStaffInfo(id)
    },
    setDate () {
      this.$store.state.taskParams.date = moment().format('YYYY-MM-DD HH:mm:00')
      this.$store.state.taskParams.deadline = moment().format(
        'YYYY-MM-DD 00:00:00'
      )
    },
    onValuesChangeType (e) {
      if (e.values[0].code === 2) {
        this.isEvent = true
      } else {
        this.$store.state.taskParams.incident = ''
      }
      this.$store.state.taskParams.type = e.values[0].code
    },
    deleteEnter (id) {
      MessageBox.confirm('确认删除此企业?').then(action => {
        if (action === 'confirm') {
          this.taskenterprises.forEach((item, index) => {
            if (item === id) {
              this.$store.state.taskParams.taskenterprises.splice(index, 1)
            }
          })
        }
      })
    },
    deletePosition (index) {
      MessageBox.confirm('确认删除此位置?').then(action => {
        if (action === 'confirm') {
          this.$store.state.taskParams.taskcoords.splice(index, 1)
        }
      })
    },
    handleConfirm (e) {
      this.$store.state.taskParams.deadline = moment(e).format(
        'YYYY-MM-DD 00:00:00'
      )
    },
    submitBefore (data) {
      if (!data.title) {
        return '请输入标题！'
      }
      if (!data.assignments[0].grid && !data.assignments[0].dept) {
        return '请选择网格/部门！'
      }
      if (!data.period) {
        return '请输入执行周期！'
      }
      return false
    },
    submit () {
      let temp = JSON.parse(JSON.stringify(this.$store.state.taskParams))
      const id = this.$uuid()
      let params = {
        id,
        rowState: 'add',
        incident: null, // 事件
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
      }
      let assignments = []
      // console.log(this.$store.state.checkGridCell)
      if (temp.isManyCell) {
        this.$store.state.checkGridCell.forEach(item => {
          assignments.push({
            id: this.$uuid(),
            rowState: 'add',
            dept: temp.depType === 2 ? item.dep : null,
            staff: item.id || null,
            grid: temp.depType === 1 ? temp.dep : null,
            type:
              temp.depType === 1
                ? item.type === 'dep'
                  ? 1
                  : 0
                : item.type === 'dep'
                  ? 3
                  : 2
          })
        })
      } else {
        assignments.push({
          id: this.$uuid(),
          rowState: 'add',
          dept: temp.depType === 2 ? temp.dep : null,
          staff: temp.depStaff || null,
          grid: temp.depType === 1 ? temp.dep : null,
          type:
            temp.depType === 1 ? (temp.depStaff ? 0 : 1) : temp.depStaff ? 2 : 3
        })
      }
      let coords = []
      temp.taskcoords.forEach(item => {
        let te = JSON.parse(JSON.stringify(item))
        te.id = this.$uuid()
        te.remarks = te.remark
        te.rowState = 'add'
        coords.push(te)
      })
      let enterprises = []
      temp.taskenterprises.forEach(item => {
        enterprises.push({
          id: this.$uuid(),
          rowState: 'add',
          enterprise: item
        })
      })
      // add
      params.assignments = assignments
      params.coords = coords
      params.enterprises = enterprises
      // console.log(params)
      let text = this.submitBefore(params)
      if (text) {
        Toast(text)
        return false
      }
      this.$api.updatetask(params).then(res => {
        this.$store.state.isAddTaskState = Math.random()
        this.$router.go(-1)
      })
    },
    toEnterPage (id) {
      window.location.href = `https://zsxtl.azuratech.com:8003/dashboard/#/enterInfo/${id}`
    }
  }
}
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
      color: #9e9e9e;
    }
    .input-unit {
      float: right;
      font-size: 0.3rem;
      color: #9e9e9e;
      margin-left: 0.1rem;
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
      background: url("../../../assets/images/right.png") no-repeat right center;
      background-size: auto 0.32rem;
    }
    .checkbox2 {
      float: right;
      text-align: right;
      font-size: 0.3rem;
      color: #9e9e9e;
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
        content: "+";
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
          &::before {
            content: "-";
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
          background: #f8f8f8 url("../../../assets/images/right.png") no-repeat
            right center;
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
  .add-btn {
    background: #fff;
    border-top: 1px solid #e0e0e0;
    bottom: 0;
    width: 100%;
    height: 1.32rem;
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
      background: #f8f8f8 url("../../../assets/images/right.png") no-repeat
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
    }
  }
}
</style>
