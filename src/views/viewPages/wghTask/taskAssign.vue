<template>
  <div id="taskAssign">
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
    <div :class="[isShowSearchBox ? 'main-content-with-search' : '', 'main-content']">
      <mt-navbar v-model="tab" class="tab-tree">
        <mt-tab-item id="wgy">网格员</mt-tab-item>
        <mt-tab-item id="bmry">部门人员</mt-tab-item>
      </mt-navbar>

         <!-- 网格员 -->
          <div class="all-check">
        <span>选择人员</span>
        <span class="is-open" @click="isClickExpand">全部展开</span>
      </div>
      <div class="tab0 tab-tree" v-if="tab === 'wgy'">
       <check-tree
        class="tree-box"
        :data="gridCell"
        :checkData="checkSingle"
        @checkChange="checkChange"
        :expandAll="isExpandAll"
        :first="isFirst"
        :chkStyle="treeStyle"
      ></check-tree>
      </div>
        <div class="tab1 tab-tree" v-if="tab === 'bmry'">
       <check-tree
        class="tree-box"
        :data="depList"
        :checkData="checkSingle"
        @checkChange="checkChange"
        :expandAll="isExpandAll"
        :first="isFirst"
        :chkStyle="treeStyle"
      ></check-tree>
      </div>
       
      <div class="add-btn">
        <button @click="submit">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Popup, Picker, Navbar,  TabItem} from 'mint-ui'
import checkTree from '@/components/checkTree'
import store from 'store'
export default {
  name: 'taskAssign',
  components: {
    'mt-popup': Popup,
    'mt-picker': Picker,
    'mt-navbar':Navbar,
    'mt-tab-item':TabItem,
    checkTree
  },
  data() {
    return {
      isFirst: false,
      moduleName: '指派给',
      searchKey: '',
      isShowSearchIcon: true,
      isShowBorder: false,
      list: [],
      depList: {},
      // popupVisible1: false,
      // popupVisible2: false,
      // popupVisible3: false,
      isCell: true,
      // typesList: [
      //   { name: '网格', code: 1 },
      //   { name: '部门', code: 2 },
      //   { name: '多网格', code: 1 }
      // ]
      isExpandAll:false,
      tab:'wgy',
      isShowSearchBox:false,
      treeStyle:{chkStyle:'radio',radioType:'all'},
      checkedList:[],
      checkSingle:[]
    }
  },
  computed: {
    gridCell() {
      return this.$store.state.gridCell;
    },
    isEdit() {
      return this.$store.state.isEdit
    },
    checkDep(){
      return this.$store.state.checkGridCell
    },
    data() {
      return {
        isFirst: true,
        moduleName: '指派给',
        isShowSearchIcon: false,
        isShowBorder: true,
        listData: []
      }
    }
  },
  watch:{
    tab(){
      this.isFirst = false
      if(this.tab === 'wgy'){
        this.$store.state.taskParams.depType = 1
      }else if(this.tab === 'bmry'){
        this.$store.state.taskParams.depType = 2
      }
       this.$nextTick(()=>{
      this.isFirst = true
    })
    }
  },
  created() {
    this.getAllDer()
     this.tab = 'wgy'
     const temptab = this.$store.state.taskParams.depType
     if(temptab === 1) {
       this.tab = 'wgy' 
     }
     if(temptab === 2){
       this.tab === 'bmry'
     }
  },
  mounted(){
    this.checkSingle = JSON.parse(JSON.stringify(this.$store.state.checkGridCell))
    this.$nextTick(()=>{
      this.isFirst = true
    })
  },
  methods: {
    getAllDer() {
      let res = JSON.parse(JSON.stringify(this.$store.state.allDep))
      let userIds = []
      let deps = []
      res.forEach(dep => {
        dep.subDepts.forEach(depC => {
          depC.uitems = depC.uitems || depC.Uitems
          deps.push(depC)
          userIds.push(...depC.uitems)
        })
      })
      this.$api
        .getUserByArrUserID({
          items: userIds
        })
        .then(resx => {
          if (resx && resx.length) {
            deps.forEach(dep => {
              if (!dep.users) {
                dep.users = []
              }
              dep.uitems.forEach(depUser => {
                resx.forEach(user => {
                  if (depUser === user.id) {
                    dep.users.push({
                      id: depUser,
                      name: user.username
                    })
                  }
                })
              })
            })
            //this.depList = deps
            let templist = []
            deps.forEach(item=>{
              let temp = {
                name:item.name,
                id:item.id,
                level:1,
                staffs:item.users ? item.users : []
              }
              templist.push(temp)
            })
            this.depList = {templist}
          }
        })
    },
    toToggleSearchBox(e) {
      this.isShowSearchBox = e;
    },
    isClickExpand() {
      this.isExpandAll = !this.isExpandAll;
    },
    checkChange(e){
      if(e[0]){
        this.$store.state.taskParams.depStaff = e[0].id;
      }
      this.checkedList = e
      this.$store.state.checkGridCell = e
    },
    toSearchList(){
      
    },
    submit(){
      this.$store.state.checkGridCell = this.checkedList
      this.$store.state.taskParams.isManyCell = false
       window.history.go(-1)
    }
  }
}
</script>
<style lang="scss">
#taskAssign {
  .main-content {
    top: 1.29rem;
    height: calc(100% - 1.29rem);
    p {
      padding: 0;
      margin: 0;
    }
    .mint-tab-item-label {
      font-size: 0.3rem;
    }
  }
  .popup-box {
    width: 100%;
    .slottypes {
      width: 100%;
    }
  }
  .ul-box {
    border-top: 1px solid #e0e0e0;
    li {
      height: 1.12rem;
      line-height: 1.12rem;
      padding: 0 0.32rem;
      background: #fff url('../../../assets/images/right.png') no-repeat
        calc(100% - 0.5rem) center;
      background-size: auto 0.32rem;
      font-size: 0.34rem;
      border-bottom: 1px solid #e0e0e0;
    }
  }
  .notbk {
    li {
      background: #fff;
    }
  }
  .tree-box {
    background: #fff;
    padding-left: 0.3rem;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }
    .all-check {
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.32rem;
    background-color: #f1f5f7;
    font-size: 0.32rem;
    span:nth-child(2) {
      padding-left: 0.18rem;
    }
    .is-open {
      float: right;
      color: #3296fa;
      cursor: pointer;
    }
    .is-open:hover {
      color: #227eda;
    }
  }
  .mint-navbar {
      @include justify-content(space-around!important);
       height: 0.96rem!important;
      .mint-tab-item.is-selected {
        margin-bottom: 0!important;
      }
    }
  .tab-tree {
    .mint-tab-item {
    @include flex(none!important);
    width: 35%!important;
  }
  }
  .tab-tree {
    height: calc(100% - 3.08rem);
    overflow-y: auto;
  }
   .ztree {
    font-size: 0.32rem!important;
  }
  .ztree li a {
    height: 0.8rem!important;
    line-height: 0.8rem!important;
  }
  .ztree .ico_docu {
    width: 0.3rem !important;
    height: 0.3rem !important;
    background: url('../../../assets/images/assign.png') no-repeat center !important;
    background-size: 70% !important;
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
    background: url('../../../assets/images/right1.png') no-repeat center !important;
    background-size: 50% !important;
  }
}
</style>


