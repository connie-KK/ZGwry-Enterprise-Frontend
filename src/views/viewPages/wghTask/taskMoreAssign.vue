<template>
  <div id="taskMoreAssign">
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
      <div class="all-check">
        <span @click="isChoicedAll" :class="[isAll ? 'check-box-true' : '']"></span>
        <span>全选</span>
        <span class="is-open" @click="isClickExpand">全部展开</span>
      </div>
      <check-tree
        class="tree-box"
        :data="gridCell"
        :checkData="checkGridCell"
        @checkChange="checkChange"
        :expandAll="isExpandAll"
        :checkAllNodes="isAll"
        :first="isFirst"
      ></check-tree>
      <div class="add-btn">
        <button @click="submit">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import {Popup, Picker} from 'mint-ui';
import checkTree from '@/components/checkTree';
export default {
  components: {
    checkTree
  },
  data() {
    return {
      moduleName: '多网格指派',
      isShowSearchIcon: true,
      isShowSearchBox: false,
      isShowBorder: false,
      isAll: false, //是否全选
      isManyCell: true,
      isFirst: false,
      isExpandAll: false,
      checkedList: [],
      treeStyle: {chkStyle: 'checkbox'},
      checkGridCell: []
    };
  },
  computed: {
    gridCell() {
      console.log(this.$store.state.gridCell);
      return this.$store.state.gridCell;
    }
  },
  mounted() {
    this.checkGridCell = JSON.parse(JSON.stringify(this.$store.state.checkGridCell));
    this.$nextTick(() => {
      this.isFirst = true;
    });
  },
  methods: {
    toToggleSearchBox(e) {
      this.isShowSearchBox = e;
    },
    toSearchList() {},
    isChoicedAll() {
      this.isAll = !this.isAll;
    },
    checkChange(e) {
      this.checkedList = e;
      if (e[0]) {
        this.$store.state.taskParams.depStaff = e[0].id;
      }
    },
    isClickExpand() {
      this.isExpandAll = !this.isExpandAll;
    },
    submit() {
      this.$store.state.checkGridCell = this.checkedList;
      this.$store.state.taskParams.isManyCell = this.isManyCell;
      window.history.go(-1);
    }
  }
};
</script>

<style lang="scss">
#taskMoreAssign {
  .all-check {
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.32rem;
    background-color: #f1f5f7;
    font-size: 0.32rem;
    span:nth-child(1) {
      display: inline-block;
      position: relative;
      width: 0.32rem;
      height: 0.32rem;
      border: 0.01rem solid #d7dde4;
      border-radius: 0.03rem;
      vertical-align: text-bottom;
    }
    .check-box-true {
      border-color: #39f;
      background-color: #39f;
    }
    .check-box-true::after {
      position: absolute;
      top: 24%;
      left: 0.04rem;
      width: 70%;
      height: 0.04rem;
      content: '';
      border-bottom: 0.04rem solid #fff;
    }
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
  .tree-box {
    background: #fff;
    height: calc(100% - 2.12rem);
    overflow-y: auto;
    padding: 0.16rem 0.32rem 0.32rem 0.32rem !important;
  }
  .add-line:after {
    width: 100%;
    height: 0.04rem;
    border-bottom: 0.04rem solid red;
  }
  .ztree {
    font-size: 0.32rem !important;
  }
  .ztree li a {
    height: 0.8rem !important;
    line-height: 0.8rem !important;
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
