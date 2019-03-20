<template>
 <div class="titleBar flex-between-row-center" v-if="setBar.showTitleBar">
    <div class="left" @click="barClick">
      <img :src="setBar.icon_fh" alt="">
      <span>返回</span>
    </div>
    <div class="right">{{setBar.time}}<span>秒</span></div>
 </div>
</template>

<script>
 export default {
   props:{
     setBar:{
       type:Object,
     }
   },
   data () {
     return {
       
     }
   },
   methods:{
     countTime(){
        let count = this.setBar.time;
        let time = count;
        let timer = setInterval(() => {
          time --;
          this.setBar.time = time;
          if(time <= 0){
            clearInterval(timer);
            window.location.href=this.setBar.tolink
          }
        },1000);
        document.body.addEventListener("click",() => 
          time = count
        )
     },
     barClick(){
       this.$emit("barClick")
     },
   },
   created(){
     this.countTime();
   },
   components: {

   }
 }
</script>

<style scoped>
.titleBar{
    background: #f8f8f8;
    height: 87px;
    line-height: 87px;
    font-size: 45px;
    padding: 0 60px;
}
.titleBar span{
  margin-left: 20px;
}
</style>