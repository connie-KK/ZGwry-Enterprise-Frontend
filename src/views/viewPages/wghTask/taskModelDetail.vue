<template>
<div id="taskModelDetail">
   <header-bar
      leftIcon="back"
      leftText="返回"
      :isShowSearchIcon="isShowSearchIcon"
      :showBorder="isShowBorder"
    >
      日常检查任务
    </header-bar>
    <div class="main-content-with-bottom">
        <div class="box-item">
        <span class="item-title">名称</span>
        <p class="checkbox2">{{ details.title }}</p>
      </div>
      <div class="box-item">
        <span class="item-title">默认期限天数</span>
        <p class="checkbox2">{{ details.period }}</p>
      </div>
      <div class="model-content" v-html="details.contents">
      </div>
       <div class="model-content" v-html="details.replycontents">
      </div>
    </div>
    <div class="add-btn">
        <button @click="submit">使用此模板</button>
      </div>
    </div>
</template>
<script>
export default {
   name: 'taskModelDetail',
   data(){
     return {
       isShowSearchIcon:false,
       isShowBorder:true,
       id:'',
       details:{}
     }
   },
   mounted(){
      this.id = this.$route.params.id;
      this.getModelDetail(this.id);
   },
   methods:{
     getModelDetail(id){
       this.$api.GetTemplateDetail({id:id}).then(res =>{
         if(res){
           this.details = res
         }
       })
     },
     submit(){
         this.$store.state.taskParams.template = this.id
      this.$store.state.taskParams.templateName = this.details.title
      // this.$router.push('/putTask/0')
      this.$router.go(-2)
     }
   }

  
}
</script>
<style lang="scss" scoped>
#taskModelDetail {
  p {
    margin: 0;
    padding: 0;
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
    .checkbox2 {
    float: right;
    text-align: right;
    font-size: 0.3rem;
    color: #9e9e9e !important;
}
 }
 .model-content {
   padding: 0.32rem;
   margin-bottom: 0.4rem;
   background-color: #fff;
   overflow-x: auto;
   table caption:nth-child(1) {
     text-align: left;
    font-size: 0.34rem;
    padding-bottom: 0.08rem;
   }
   tbody {
     font-size: 0.3rem!important;
     tr td {
          border-bottom: 0.01rem solid #ccc!important;
    border-right: 0.01rem solid #ccc!important;
     }
   }
 }
 .add-btn {
   position: fixed!important;
 }
}
</style>