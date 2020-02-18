<template>
  <div>
    <header-bar>{{ moduleName }}</header-bar>
    <div class="main-content">
      <nav-bar :selected="1"></nav-bar>
      <div class="main-content-box">
        <div>
          <div :class="['list', item.class]" v-for="(item, index) in list" :key="index">
            <p class="label">{{ item.label }}</p>
            <input type="text" v-model="item.value" class="info" />
          </div>
        </div>
        <div class="lists list-header">
          <span v-for="(item, index) in listHeader" :key="index">
            {{
            item
            }}
          </span>
        </div>
        <div
          v-for="(item, index) in productItems"
          :key="item.id"
          @click="selectItem(productItems, index)"
          :class="['lists', 'list-content', item.class]"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.value }}{{ item.unit }}</span>
        </div>
        <div class="add-item-box" v-if="productItemsState">
          <input style="width:30%;" v-model="proItemData.name" placeholder="名称" />
          <input style="width:25%;" v-model="proItemData.value" placeholder="产量" />
          <input style="width:25%;" v-model="proItemData.unit" placeholder="单位" />
          <button @click="addProItem">确定</button>
        </div>
        <div class="listBtnGroup">
          <div class="addBtn listBtn" @click="productItemsState = true">
            <span></span>
            <span>添加</span>
          </div>
          <div class="delBtn listBtn" @click="deleteItem(productItems)">
            <span></span>
            <span>删除</span>
          </div>
        </div>
        <div class="lists list-header second-header">
          <span v-for="(item, index) in listHeaderFactor" :key="index">
            {{
            item
            }}
          </span>
        </div>
        <div
          class="lists list-content"
          v-for="(item, index) in materialItmes"
          :key="item.id"
          @click="selectItem(materialItmes, index)"
          :class="item.class"
        >
          <span>{{ item.name }}</span>
          <span>{{ item.value }}{{ item.unit }}</span>
        </div>
        <div class="add-item-box" v-if="materialItmesState">
          <input style="width:30%;" v-model="matItemData.name" placeholder="名称" />
          <input style="width:25%;" v-model="matItemData.value" placeholder="使用量" />
          <input style="width:25%;" v-model="matItemData.unit" placeholder="单位" />
          <button @click="addMatItem">确定</button>
        </div>
        <div class="listBtnGroup">
          <div class="addBtn listBtn" @click="materialItmesState = true">
            <span></span>
            <span>添加</span>
          </div>
          <div class="delBtn listBtn" @click="deleteItem(materialItmes)">
            <span></span>
            <span>删除</span>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="submitBtn">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "@/components/navBar.vue";
import moment from "moment";
import { Toast } from "mint-ui";
export default {
  name: "home",
  components: {
    "nav-bar": navBar
  },
  data() {
    return {
      moduleName: "企业信息",
      enterid: "",
      listHeader: ["产品", "年产量"],
      listHeaderFactor: ["原辅材料", "材料年使用量"],
      levelArr: ["国控", "省控", "市控/重点", "区控/非重点"],
      productionStateArr: ["正常营业", "停业", "关闭"],
      productItems: [],
      materialItmes: [],
      proItemData: {
        name: "",
        value: "",
        unit: ""
      },
      matItemData: {
        name: "",
        value: "",
        unit: ""
      },
      productItemsState: false,
      materialItmesState: false
    };
  },
  computed: {
    list() {
      return this.$store.state.pollSourceInfoHeader;
    }
  },
  created() {
    // this.enterid = this.$route.params.id;
    // this.enterid = "75ae3c94-93f7-412a-8d03-5cf4554122c8";
    this.enterid = "838135fd-6a22-4d60-8d4a-d36ff2c7e14c";
    
    this.$store.state.enterId = this.enterid;
    this.$store.state.enterid = this.enterid;
    this.$store.commit("set_enterpriseid", this.enterid);
    this.getPollSourceList();
  },
  methods: {
    getPollSourceList() {
      const payload = {
        id: this.enterid
      };
      this.$api.getZGEnterpriseByid(payload).then(res => {
        if (res) {
          this.list.forEach((item, index) => {
            if (res[item.key] === 0 || res[item.key]) {
              if (item.key.includes("date") || item.key.includes("Time")) {
                item.value = moment(res[item.key]).format("YYYY-MM-DD");
              } else if (item.key === "level") {
                item.value = this.levelArr[res[item.key] - 1];
              } else {
                item.value = res[item.key];
              }
              this.$set(this.list, index, item);
            } else if (item.key === "lat-lng") {
              item.value = `${res["lng"]}E，${res["lat"]}N`;
            } else if (item.key === "region") {
              item.value = `${res["province"]} ${res["city"]} ${res["district"]}`;
            }
            if (item.value && typeof item.value === "string") {
              item.value = item.value.replace(null, "");
              item.value = item.value.replace(undefined, "");
            }
          });
          this.productItems = res.productItems;
          this.materialItmes = res.materialItmes;
        }
      });
      this.$api.getZGEnterpriseExtendByid(payload).then(res => {
        if (res) {
          this.list.forEach((item, index) => {
            if (res[item.key] === 0 || res[item.key]) {
              if (item.key.includes("date") || item.key.includes("Time")) {
                item.value = moment(res[item.key]).format("YYYY-MM-DD");
              } else if (item.key === "isMonitoring") {
                item.value = res[item.key] ? "是" : "否";
              } else if (item.key === "productionState") {
                item.value = this.productionStateArr[res[item.key] - 1];
              } else {
                item.value = res[item.key];
              }
              this.$set(this.list, index, item);
            }
          });
        }
      });
    },
    selectItem(arr, index) {
      let selecteItem = arr[index];
      arr.forEach(item => {
        item.class = "";
      });
      selecteItem.class = "selected";
      this.$set(arr, index, selecteItem);
    },
    deleteItem(arr) {
      arr.forEach((item, index) => {
        if (item.class === "selected") {
          arr.splice(index, 1);
        }
      });
    },
    addProItem() {
      for (let key in this.proItemData) {
        if (!this.proItemData[key]) {
          Toast("不能为空！");
          return false;
        }
      }
      let data = JSON.parse(JSON.stringify(this.proItemData));
      data.id = this.$uuid();
      data.rowState = "add";
      this.productItems.push(data);
      this.proItemData = {
        name: "",
        value: "",
        unit: ""
      };
      this.productItemsState = false;
    },
    addMatItem() {
      for (let key in this.matItemData) {
        if (!this.matItemData[key]) {
          Toast("不能为空！");
          return false;
        }
      }
      let data = JSON.parse(JSON.stringify(this.matItemData));
      data.id = this.$uuid();
      data.rowState = "add";
      this.materialItmes.push(data);
      this.matItemData = {
        name: "",
        value: "",
        unit: ""
      };
      this.materialItmesState = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_flex.scss";
.main-content {
  height: calc(100% - 1.29rem);
  .main-content-box {
    height: calc(100% - 50px - 1.28rem);
    overflow-y: auto;
  }
}
p {
  margin: 0;
}
.list {
  background: rgba(255, 255, 255, 1);
  padding: 0 0.24rem 0 0.32rem;
  border-bottom: solid 1px #e0e0e0;
  .label {
    line-height: 0.33rem;
    font-size: 0.24rem;
    color: #bebebe;
    padding: 0.15rem 0 0.01rem 0;
  }
  .info {
    line-height: 0.48rem;
    min-height: 0.48rem;
    font-size: 0.34rem;
    color: #3d3d3d;
    padding: 0.01rem 0 0.14rem 0;
    border: 0;
    width: 100%;
  }
}
.list:last-child {
  border: 0;
}
.interval {
  margin-top: 0.41rem;
}
.attachment {
  background: rgba(255, 255, 255, 1);
  margin-top: 0.4rem;
  padding: 0 0.24rem 0 0.32rem;
  @include flexbox;
  @include flex-direction(column);
  p {
    font-size: 0.34rem;
    line-height: 0.48rem;
    color: rgba(48, 48, 48, 1);
    padding-top: 0.33rem;
  }
  div {
    width: 100%;
    padding: 0.32rem 0 0.2rem 0;
    background: rgba(255, 255, 255, 1);
    @include flexbox;
    span {
      display: inline-block;
      height: 0.42rem;
      font-size: 0.3rem;
    }
    span:first-child {
      flex: 9;
      svg {
        fill: #3296fa;
      }
    }
    span:last-child {
      color: rgba(50, 150, 250, 1);
      flex: 1;
    }
  }
  div:last-child {
    padding-bottom: 0.33rem;
  }
}
.lists {
  color: rgba(48, 48, 48, 1);
  padding: 0 0.24rem 0 0.32rem;
  border: 0;
  @include flexbox;
  @include align-items(center);
  span:first-child {
    flex: 1.5;
  }
  span:last-child {
    flex: 1;
  }
}
.list-header {
  height: 0.7rem;
  background: rgba(229, 241, 244, 1);
  color: rgba(48, 48, 48, 1);
  font-size: 0.26rem;
}
.second-header {
  margin-top: 0.4rem;
}
.list-content {
  height: 0.75rem;
  background: rgba(255, 255, 255, 1);
  color: rgba(48, 48, 48, 1);
  font-size: 0.35rem;
}
.list-content:last-child {
  margin-bottom: 0.6rem;
}
.selected {
  background: #edf0f4;
}
.listBtnGroup {
  @include flexbox;
  @include flex-direction(row);
  padding: 0.1rem 0 0 0.32rem;
  .listBtn {
    @include flexbox;
    @include align-items(center);
    @include justify-content(center);
    width: 1.36rem;
    height: 0.6rem;
    font-size: 0.3rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.03rem;
    border: 2px solid rgba(50, 150, 250, 1);
  }
  .addBtn {
    color: rgba(255, 255, 255, 1);
    background: rgba(50, 150, 250, 1);
    span:first-child {
      display: inline-block;
      width: 0.3rem;
      height: 0.3rem;
      background: url(../../../assets/images/add.png) no-repeat;
      background-size: 100% 100%;
      margin-right: 0.13rem;
    }
  }
  .delBtn {
    margin-left: 0.32rem;
    color: #3296fa;
    span:first-child {
      display: inline-block;
      width: 0.3rem;
      height: 0.3rem;
      background: url(../../../assets/images/delete2.png) no-repeat;
      background-size: 100% 100%;
      margin-right: 0.13rem;
    }
  }
}
.footer {
  @include flexbox;
  @include align-items(center);
  @include justify-content(center);
  position: fixed;
  bottom: 0;
  height: 1.28rem;
  background: rgba(255, 255, 255, 1);
  width: 100%;
  .submitBtn {
    @include flexbox;
    @include align-items(center);
    @include justify-content(center);
    width: 6.86rem;
    height: 0.96rem;
    background: rgba(50, 150, 250, 1);
    border-radius: 3px;
    font-size: 0.34rem;
    color: rgba(255, 255, 255, 1);
  }
}
.add-item-box {
  input {
    border: 0;
    background: #fff;
    height: 0.5rem;
    margin: 0.05rem 0;
    padding-left: 0.1rem;
    margin-right: 0.1rem;
  }
  button {
    height: 0.5rem;
    width: 15%;
    padding: 0;
    border: 0;
    margin: 0.05rem 0;
    background: #3296fa;
    color: #fff;
  }
}
</style>
