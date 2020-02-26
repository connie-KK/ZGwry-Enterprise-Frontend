<template>
  <div id="taskAssign">
    <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearch="isShowSearch"
      :showBorder="isShowBorder"
    >
      {{ moduleName }}
    </header-bar>
    <div class="main-content">
      <ul class="ul-box">
        <li @click="popupVisible1 = true">
          <p>{{ depType }}</p>
        </li>
        <li
          @click="popupVisible2 = true"
          v-if="!isManyCell"
        >
          <p>{{ depStaff }}</p>
        </li>
        <li
          @click="popupVisible3 = true"
          v-if="!isManyCell"
        >
          <p>{{ staffName }}</p>
        </li>
      </ul>
      <check-tree
        class="tree-box"
        v-if="isManyCell"
        :data="gridCell"
        :checkData="checkGridCell"
        @checkChange="checkChange"
        :first="isFirst"
      ></check-tree>
    </div>
    <mt-popup
      v-model="popupVisible1"
      position="bottom"
      class="popup-box"
    >
      <mt-picker
        :slots="slotsType"
        @change="onValuesChangeType"
        valueKey="name"
      ></mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupVisible2"
      position="bottom"
      class="popup-box"
    >
      <mt-picker
        :slots="slotsDep"
        @change="onValuesChangeDep"
        valueKey="name"
      ></mt-picker>
    </mt-popup>
    <mt-popup
      v-model="popupVisible3"
      position="bottom"
      class="popup-box"
    >
      <mt-picker
        :slots="slotsPeople"
        @change="onValuesChangePeople"
        valueKey="name"
      ></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { Popup, Picker } from 'mint-ui'
import checkTree from '@/components/checkTree'
export default {
  name: 'taskAssign',
  components: {
    'mt-popup': Popup,
    'mt-picker': Picker,
    checkTree
  },
  data () {
    return {
      isFirst: true,
      moduleName: '指派给',
      searchKey: '',
      isShowSearch: false,
      isShowBorder: true,
      list: [],
      depList: [],
      popupVisible1: false,
      popupVisible2: false,
      popupVisible3: false,
      isManyCell: false,
      typesList: [
        { name: '网格', code: 1 },
        { name: '部门', code: 2 },
        { name: '多网格', code: 1 }
      ]
    }
  },
  computed: {
    gridCell () {
      return this.$store.state.gridCell
    },
    checkGridCell () {
      return this.$store.state.checkGridCell
    },
    singleGridCell () {
      if (!this.gridCell) {
        return []
      }
      let temp = [
        {
          name: this.gridCell.name,
          id: this.gridCell.id,
          staffs: this.gridCell.staffs
        }
      ]
      this.gridCell.children.forEach(item => {
        temp.push({
          name: item.name,
          id: item.id,
          staffs: item.staffs
        })
        if (item.children && item.children.length) {
          item.children.forEach(ite => {
            temp.push({
              name: ite.name,
              id: ite.id,
              staffs: ite.staffs
            })
            if (ite.children && ite.children.length) {
              ite.children.forEach(it => {
                temp.push({
                  name: it.name,
                  id: it.id,
                  staffs: it.staffs
                })
              })
            }
          })
        }
      })
      return temp
    },
    depType () {
      if (this.isManyCell) {
        return '多网格'
      }
      return this.typesList.filter(item => {
        return this.$store.state.taskParams.depType === item.code
      })[0].name
    },
    depStaff () {
      const dep = this.depList.filter(item => {
        return item.id === this.$store.state.taskParams.dep
      })
      const dep2 = this.singleGridCell.filter(item => {
        return item.id === this.$store.state.taskParams.dep
      })
      if (dep.length) {
        return dep[0].name
      }
      if (dep2.length) {
        return dep2[0].name
      }
      if (this.slotsDep[0].values.length) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$store.state.taskParams.dep = this.slotsDep[0].values[0].id
      }
      return '未指定'
    },
    staffName () {
      let temp = '未指定'
      this.depList.forEach(item => {
        if (item.id === this.$store.state.taskParams.dep) {
          item.users.forEach(user => {
            if (user.id === this.$store.state.taskParams.depStaff) {
              temp = user.name
            }
          })
        }
      })
      this.singleGridCell.forEach(item => {
        if (item.id === this.$store.state.taskParams.dep) {
          item.staffs.forEach(user => {
            if (user.id === this.$store.state.taskParams.depStaff) {
              temp = user.name
            }
          })
        }
      })
      return temp
    },
    slotsType () {
      let myIndex = 0
      this.typesList.forEach((item, index) => {
        if (item.code === this.$store.state.taskParams.depType) {
          myIndex = index
        }
      })
      if (this.isManyCell) {
        myIndex = 2
      } else if (myIndex === 2) {
        myIndex = 0
      }
      return [
        {
          flex: 1,
          values: this.typesList,
          className: 'slottypes',
          textAlign: 'center',
          defaultIndex: myIndex
        }
      ]
    },
    slotsDep () {
      let myIndex = 0
      let val
      if (this.depType === '部门') {
        val = this.depList
        this.depList.forEach((item, index) => {
          if (item.id === this.$store.state.taskParams.dep) {
            myIndex = index
          }
        })
      } else if (this.depType === '网格') {
        val = this.singleGridCell
        this.singleGridCell.forEach((item, index) => {
          if (item.id === this.$store.state.taskParams.dep) {
            myIndex = index
          }
        })
      }
      return [
        {
          flex: 1,
          values: val,
          textAlign: 'center',
          defaultIndex: myIndex
        }
      ]
    },
    slotsPeople () {
      let vals = [{ name: '未指定', id: '' }]
      let myIndex = 0
      if (this.depType === '部门') {
        const users = this.depList.filter(item => {
          return item.id === this.$store.state.taskParams.dep
        })
        if (users.length) {
          vals = [...vals, ...users[0].users]
        }
        vals.forEach((item, index) => {
          if (item.id === this.$store.state.taskParams.depStaff) {
            myIndex = index
          }
        })
      } else if (this.depType === '网格') {
        const users = this.singleGridCell.filter(item => {
          return item.id === this.$store.state.taskParams.dep
        })
        if (users.length) {
          vals = [...vals, ...users[0].staffs]
        }
        vals.forEach((item, index) => {
          if (item.id === this.$store.state.taskParams.depStaff) {
            myIndex = index
          }
        })
      }
      const temp = [
        {
          flex: 1,
          values: vals,
          textAlign: 'center',
          defaultIndex: myIndex
        }
      ]
      return temp
    },
    rrIsManyCell () {
      return this.$store.state.taskParams.isManyCell
    }
  },
  watch: {
    isManyCell () {
      this.$store.state.taskParams.isManyCell = this.isManyCell
    }
  },
  mounted () {
    this.getAllDer()
    this.isManyCell = this.rrIsManyCell
  },
  methods: {
    checkChange (e) {
      this.$store.state.checkGridCell = e
    },
    getAllDer () {
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
            this.depList = deps
            this.$nextTick(() => {
              this.isFirst = false
            })
          }
        })
    },
    onValuesChangeType (e) {
      if (this.isFirst) {
        return
      }
      this.$store.state.taskParams.depType = e.values[0].code
      if (e.values[0].name === '多网格') {
        this.isManyCell = true
      } else {
        this.isManyCell = false
      }
    },
    onValuesChangeDep (e) {
      if (!e.values.length || !e.values[0] || this.isFirst) {
        return
      }
      this.$store.state.taskParams.dep = e.values[0].id
    },
    onValuesChangePeople (e) {
      if (!e.values.length || !e.values[0] || this.isFirst) {
        return
      }
      this.$store.state.taskParams.depStaff = e.values[0].id
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
      background: #fff url("../../../assets/images/right.png") no-repeat
        calc(100% - 0.5rem) center;
      background-size: auto 0.32rem;
      font-size: 0.34rem;
      border-bottom: 1px solid #e0e0e0;
    }
  }
  .tree-box {
    background: #fff;
    padding-left: 0.3rem;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
  }
}
</style>
