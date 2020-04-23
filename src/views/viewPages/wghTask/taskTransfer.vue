<template>
  <div id="taskTransfer">
    <header-bar leftIcon="back" leftText="返回" :isShowSearchIcon="isShowSearchIcon" :showBorder="isShowBorder">
      {{ moduleName }}
    </header-bar>
    <div class="main-content">
      <table style=" background-color: #ECEEF0;">
        <tr>
          <th style="width: 30%;">时间</th>
          <th style="width: 20%;">操作人</th>
          <th style="width: 50%;">操作</th>
        </tr>
      </table>
      <div class="list-container">
        <table>
          <tr v-for="(item,idx) in list">
            <th style="width: 30%;">{{ item.date }}</th>
            <th style="width: 20%;">{{ item.staffname }}</th>
            <th style="width: 50%;">{{ item.describe }}</th>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { Popup, Picker } from 'mint-ui'
  import checkTree from '@/components/checkTree'
  export default {
    name: 'taskTransfer',
    components: {
    },
    data() {
      return {
        isFirst: true,
        moduleName: '任务流转记录',
        isShowSearchIcon: false,
        isShowBorder: true,
        list:[]
      }
    },
    computed: {
    },
    watch: {

    },
    mounted() {
     this.list = this.$store.state.recordCircule
    },
    methods: {

    }
  }
</script>

<style lang="scss">
  #taskTransfer {
    .list-container {
      height: calc(100% - 0.4rem);
      overflow-y: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 18px;
      color: #444444;
    }

    table th {
      height: 35px;
      line-height: 35px;
      color: #303030;
      font-weight: 400;
    }



    table td {
      padding: 0 10px;
      height: 35px;
      line-height: 35px;
      color: #303030;
      text-align: center;
    }
  }
</style>