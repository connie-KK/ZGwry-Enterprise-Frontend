<template>
  <div class="checkTree">
    <tree
      :nodes="trueData"
      :setting="setting"
      :expandAll="expandAll"
      :checkAllNodes="checkAllNodes"
      @onCheck="onCheck"
      @onCreated="handleCreated"
    />
    <!-- <div
      v-if="false"
      v-for="item in myData"
      :key="item.id"
      class="check-tree"
    >
      <div @click="checkMe('dep', item)">
        <i :class="ischeckd(item.id, item.children)"></i>
        <span>{{ item.name }}</span>
      </div>
      <div
        @click="checkMe('user', user, item.id)"
        v-for="user in item.staffs"
        :key="user.id"
        class="user-tree"
      >
        <i :class="ischeckd(user.id, [])"></i>
        <span>{{ user.name }}</span>
      </div>
      <div
        v-for="ite in item.children"
        :key="ite.id"
        class="check-tree"
      >
        <div @click="checkMe('dep', ite)">
          <i :class="ischeckd(ite.id, ite.children)"></i>
          <span>{{ ite.name }}</span>
        </div>
        <div
          @click="checkMe('user', use, ite.id)"
          v-for="use in ite.staffs"
          :key="use.id"
          class="user-tree"
        >
          <i :class="ischeckd(use.id, [])"></i>
          <span>{{ use.name }}</span>
        </div>
        <div
          v-for="it in ite.children"
          :key="it.id"
          class="check-tree"
        >
          <div @click="checkMe('dep', it)">
            <i :class="ischeckd(it.id, [])"></i>
            <span>{{ it.name }}</span>
          </div>
          <div
            @click="checkMe('user', us, it.id)"
            v-for="us in it.staffs"
            :key="us.id"
            class="user-tree"
          >
            <i :class="ischeckd(us.id, [])"></i>
            <span>{{ us.name }}</span>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import tree from 'vue-giant-tree';
export default {
  name: 'checkTree',
  components: {
    tree
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    checkData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    first: {
      type: Boolean,
      default: false
    },
    chkStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    expandAll: {
      type: Boolean,
      default: true
    },
    checkAllNodes: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      trueData: [],
      checks: JSON.parse(JSON.stringify(this.checkData)),
      ztreeObj: null,
      ztreeState:'checkbox'
    };
  },
  computed: {
    setting() {
      let temobj = {
        check: {
          enable: true,
          // autoCheckTrigger: true
        },
        data: {
          simpleData: {
            enable: true,
            pIdKey: 'pid'
          }
        },
        view: {
          showIcon: false
        }
      };
      if (Object.keys(this.chkStyle).length > 0) {
        const obj = this.chkStyle;
        this.ztreeState = this.chkStyle.chkStyle
        Object.keys(obj).forEach(function(key) {
          temobj.check[key] = obj[key];
        });
      }
      return temobj;
    },
    myData() {
      if (!this.data) {
        return [];
      }
      let temp = [];
      let dd = [];
      if (!!this.data.templist) {
        dd = this.data.templist;
      } else {
        dd = [this.data];
      }
      dd.forEach((d1, index1) => {
        let d0cItemId = index1 + 1 + '';
        temp.push({
          id: d0cItemId,
          pid: '0',
          name: d1.name,
          data: d1,
          type: 'dep'
        });
        if (d1.staffs) {
          d1.staffs.forEach((d1sItem, d1sItemIndex) => {
            temp.push({
              id: d0cItemId + (d1sItemIndex + 1),
              pid: d0cItemId,
              name: d1sItem.name,
              data: d1sItem,
              type: 'user',
              dep: d1.id
            });
          });
        }
        if (d1.children) {
          d1.children.forEach((d2, index2) => {
            let d1cItemId = d0cItemId + (d1.staffs.length + index2 + 1);
            temp.push({
              id: d1cItemId,
              pid: d0cItemId,
              name: d2.name,
              data: d2,
              type: 'dep'
            });
            if (d2.staffs) {
              d2.staffs.forEach((d1sItem, d1sItemIndex) => {
                temp.push({
                  id: d1cItemId + (d1sItemIndex + 1),
                  pid: d1cItemId,
                  name: d1sItem.name,
                  data: d1sItem,
                  type: 'user',
                  dep: d2.id
                });
              });
            }
            if (d2.children) {
              d2.children.forEach((d3, index3) => {
                let d2cItemId = d1cItemId + (d2.staffs.length + index3 + 1);
                temp.push({
                  id: d2cItemId,
                  pid: d1cItemId,
                  name: d3.name,
                  data: d3,
                  type: 'dep'
                });
                if (d3.staffs) {
                  d3.staffs.forEach((d3sItem, d3sItemIndex) => {
                    temp.push({
                      id: d2cItemId + (d3sItemIndex + 1),
                      pid: d2cItemId,
                      name: d3sItem.name,
                      data: d3sItem,
                      type: 'user',
                      dep: d3.id
                    });
                  });
                }
                if (d3.children) {
                  d3.children.forEach((d4, index4) => {
                    let d3cItemId = d2cItemId + (d3.staffs.length + index4 + 1);
                    temp.push({
                      id: d3cItemId,
                      pid: d2cItemId,
                      name: d4.name,
                      data: d4,
                      type: 'dep'
                    });
                    if (d4.staffs) {
                      d4.staffs.forEach((d4sItem, d4sItemIndex) => {
                        temp.push({
                          id: d3cItemId + (d4sItemIndex + 1),
                          pid: d3cItemId,
                          name: d4sItem.name,
                          data: d4sItem,
                          type: 'user',
                          dep: d4.id
                        });
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
      this.trueData = JSON.parse(JSON.stringify(temp))
      console.log(this.trueData)
      return temp;
    }
  },
  watch: {
    checkData(){
      this.checks = JSON.parse(JSON.stringify(this.checkData))
    },
    checks() {
      console.log(this.checks)
      this.$emit('checkChange', this.checks);
    },
    first() {
      let temp = JSON.parse(JSON.stringify(this.myData));
      temp.forEach(item1 => {
        if(this.checks.length > 0){
          this.checks.forEach(item2 => {
          if (item1.type === item2.type) {
            if (item2.type === 'dep') {
              if (item1.data.id === item2.dep) {
                item1.checked = true;
              }
            }
            if (item2.type === 'user') {
              if (item1.data.id === item2.id) {
                item1.checked = true;
              }
            }
          }
        });
        }else{
          this.ztreeObj.checkAllNodes(false)
        }
      });
      this.trueData = temp;
    },
    expandAll() {
      this.ztreeObj.expandAll(this.expandAll);
    },
    checkAllNodes() {
      this.ztreeObj.checkAllNodes(this.checkAllNodes);
    },
    trueData(){
//        this.$nextTick(()=>{
//       let nodes = this.ztreeObj.getSelectedNodes();
// for (var i=0, l=nodes.length; i < l; i++) {
// this.ztreeObj.checkNode(nodes[i], true, true);
// }
//     })
    }
  },
  mounted(){
        this.$nextTick(()=>{
      let nodes = this.ztreeObj.getSelectedNodes();
for (var i=0, l=nodes.length; i < l; i++) {
this.ztreeObj.checkNode(nodes[i], true, true);
}
    })
  },
  methods: {
    handleCreated: function(ztreeObj) {
      this.ztreeObj = ztreeObj;
    },
    onCheck(e, treeId, treeNode) {
      // if (treeNode.type === 'user') {
      //   this.checkMe(treeNode.type, treeNode.data, treeNode.dep);
      // } else {
      //   this.checkMe(treeNode.type, treeNode.data);
      // }
      let nodes=this.ztreeObj.getCheckedNodes(true)
      console.log(nodes)
      let depids = [] 
      let checksarr = []
      for(let i=0;i<nodes.length;i++){
        let temp = {}
        if(nodes[i].type === 'user'){
          temp = {
            dep:nodes[i].dep,
            id:nodes[i].data.id,
            name:nodes[i].name,
            type:'user',
            all:false
          }
          checksarr.push(temp)
        }
        if(nodes[i].type === 'dep' && nodes[i].children){
          let checkchildren = nodes[i].children.filter(item => {
            return item.checked == true
          })
          if(checkchildren.length === nodes[i].children.length){
             depids.push(nodes[i].data.id)
          }
        }
      }
      if(depids.length > 0){
        depids.forEach(d => {
          checksarr.forEach((c,idx) => {
            if(c.dep === d){
              checksarr[idx].all = true
              this.$set(c, 'all', true)
            }
          })
        })
      }
      this.checks = checksarr
    },
    // ischeckd (id, children) {
    //   let temp = 'none'
    //   const arr = this.checks.filter(item => {
    //     return item.id === id || item.dep === id
    //   })
    //   if (arr.length && !children.length) {
    //     temp = 'check'
    //     return temp
    //   }
    //   let ids = []
    //   children.forEach(item => {
    //     item.staffs.forEach(user => {
    //       ids.push(user.id)
    //     })
    //     if (item.children.length) {
    //       item.children.forEach(ite => {
    //         ite.staffs.forEach(user => {
    //           ids.push(user.id)
    //         })
    //         if (ite.children.length) {
    //           ite.children.forEach(it => {
    //             it.staffs.forEach(user => {
    //               ids.push(user.id)
    //             })
    //             if (it.children.length) {
    //               it.children.forEach(ii => {
    //                 ii.staffs.forEach(user => {
    //                   ids.push(user.id)
    //                 })
    //               })
    //             } else {
    //               ids.push(it.id)
    //             }
    //           })
    //         } else {
    //           ids.push(ite.id)
    //         }
    //       })
    //     } else {
    //       ids.push(item.id)
    //     }
    //   })
    //   let xbbIndex = 0
    //   ids.forEach(idx => {
    //     const arr = this.checks.filter(item => {
    //       return item.id === idx || item.dep === idx
    //     })
    //     if (arr.length) {
    //       temp = 'ban'
    //       xbbIndex++
    //     }
    //   })
    //   if (xbbIndex && xbbIndex === ids.length) {
    //     temp = 'check'
    //   }
    //   return temp
    // },
    checkMe(state, data, dep) {
      if(this.ztreeState === 'checkbox'){
         if (state === 'user') {
        let tt = false;
        this.checks.forEach((item, index) => {
          if (item.id === data.id) {
            tt = true;
            this.checks.splice(index, 1);
          }
        });
        if (!tt) {
          this.checks.push({
            id: data.id,
            type: 'user',
            dep: dep,
            name:data.name
          });
        }
      } else {
        let tempArr = [];
        if (data.staffs.length) {
          data.staffs.forEach(user => {
            tempArr.push({
              id: user.id,
              type: 'user',
              dep: data.id,
               name:data.name
            });
          });
        }
        if (data.children.length) {
          data.children.forEach(item => {
            if (item.staffs.length) {
              item.staffs.forEach(user => {
                tempArr.push({
                  id: user.id,
                  type: 'user',
                  dep: data.id,
                   name:data.name
                });
              });
            }
            if (item.children.length) {
              item.children.forEach(ite => {
                if (ite.staffs.length) {
                  ite.staffs.forEach(user => {
                    tempArr.push({
                      id: user.id,
                      type: 'user',
                      dep: ite.id,
                       name:data.name
                    });
                  });
                }
                if (ite.children.length) {
                  ite.children.forEach(ite => {
                    if (ite.staffs.length) {
                      ite.staffs.forEach(user => {
                        tempArr.push({
                          id: user.id,
                          type: 'user',
                          dep: ite.id,
                           name:data.name
                        });
                      });
                    }
                  });
                } else {
                  tempArr.push({
                    id: '',
                    type: 'dep',
                    dep: ite.id
                  });
                }
              });
            } else {
              tempArr.push({
                id: '',
                type: 'dep',
                dep: item.id
              });
            }
          });
        } else {
          tempArr.push({
            id: '',
            type: 'dep',
            dep: data.id
          });
        }
        let bindex = 0;
        tempArr.forEach(item => {
          this.checks.forEach(check => {
            if (item.type === 'user') {
              if (check.id === item.id) {
                bindex++;
              }
            } else {
              if (check.dep === item.dep) {
                bindex++;
              }
            }
          });
        });
        tempArr.forEach(item => {
          let xxt = false;
          this.checks.forEach((check, index) => {
            if (item.type === 'user') {
              if (check.id === item.id) {
                xxt = true;
                if (bindex === tempArr.length) {
                  this.checks.splice(index, 1);
                }
              }
            } else {
              if (check.dep === item.dep) {
                xxt = true;
                if (bindex === tempArr.length) {
                  this.checks.splice(index, 1);
                }
              }
            }
          });
          if (!xxt) {
            this.checks.push(item);
          }
        });
      }
      }
      if(this.ztreeState === 'radio'){
        this.checks = [
          {
            id: data.id,
            type: 'user',
            dep: dep,
            name:data.name
          }
        ]
      }
     
    }
  }
};
</script>
<style lang="scss">
@import '../assets/scss/_flex.scss';
.checkTree {
  .ztree {
    .button.chk {
      width: 16px !important;
      height: 16px !important;
    }
    li {
      a {
        margin-left: 5px !important;
        .node_name {
          padding-left: 0px !important;
        }
      }
    }
  }
  .check-tree {
    span {
      line-height: 0.6rem;
      font-size: 0.3rem;
      vertical-align: middle;
    }
    i {
      display: inline-block;
      width: 0.34rem;
      height: 0.34rem;
      vertical-align: middle;
      margin-right: 0.1rem;
    }
  }
  .check {
    background: url('../assets/images/check.png') no-repeat center;
    background-size: 0.34rem auto;
  }
  .ban {
    border: 0.02rem solid #3296fa;
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 0.05rem;
    position: relative;
    background: #3296fa;
    &::before {
      content: '';
      position: absolute;
      width: 0.2rem;
      height: 0.04rem;
      background: #fff;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .none {
    border: 0.02rem solid #3296fa;
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 0.05rem;
  }
  .check-tree {
    background: #fff;
    margin-left: 0.36rem;
  }
  .user-tree {
    margin-left: 0.36rem;
  }
  .ztree li a {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ztree .center_docu:before {
    border-left-width: 0 !important;
  }
  .ztree .center_docu:after {
    border-top-width: 0 !important;
  }
  .ztree .bottom_docu:after {
    border-top-width: 0 !important;
  }
  .ztree .bottom_docu:before {
    border-left-width: 0 !important;
  }
  .ztree .line:before {
    border-right: 0 !important;
  }
  .level1:not(:last),
  .level2:not(:last),
  .level3:not(:last) {
    height: 0.8rem !important;
    line-height: 0.8rem !important;
    border-bottom: 0.01rem solid #e6e8ea !important;
  }
}
</style>
