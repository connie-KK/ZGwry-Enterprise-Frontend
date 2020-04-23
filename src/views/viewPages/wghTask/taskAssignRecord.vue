<template>
  <div id="taskTransfer">
    <header-bar leftIcon="back" leftText="返回" :isShowSearchIcon="isShowSearchIcon" :showBorder="isShowBorder">
      {{ moduleName }}
    </header-bar>
    <div class="main-content">
      <table style=" background-color: #E5F1F4;">
        <tr>
          <th style="width: 30%;">时间</th>
          <th style="width: 30%;">操作人</th>
          <th style="width: 40%;">操作</th>
        </tr>
      </table>
      <div class="list-container">
        <table>
          <tr v-for="(item,idx) in list">
            <td style="width: 30%;">{{ item.date }}</td>
            <td style="width: 30%;">任务管理员</td>
            <td style="width: 40%;">{{ item.describe }}</td>
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
        list: []
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
      height: calc(100% - 0.7rem);
      overflow-y: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 0.32rem;
      color: #444444;
    }

    table th {
      height: 0.7rem;
      line-height: 35px;
      color: #303030;
      font-weight: 400;
    }

    table td {
      height: 0.7rem;
      line-height: 35px;
      color: #303030;
      text-align: center;
    }

    table td:nth-child(3) {
      text-align: left;
    }
    table th:nth-child(3) {
      text-align: left;
    }
  }
</style>