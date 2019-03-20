<template>
 <div id="index">
   <!-- 引入封装的swiper组件 -->
    <Swiperv  :imgUrl="banner.imgUrl" :isShow="banner.showBanner"/>
    <!-- 引入封装的titleBar -->
    <titleBar :setBar="setBar" @barClick="goBack" />
    <div class="main flex-between-row">
      <div class="leftWrap" ref="leftScroll">
        <ul class="left-list">
          <li class="list-item" :key="index"  :class="{'active':currentIndex === index}" v-for="(item,index) in goods" @click="selectMenu(index)" :data-item="index">
            {{item.classify}}
          </li>
        </ul>
      </div>
      <div class="rightWrap flex1" ref="rightScroll">
        <ul>
          <li class="good-list-hook" v-for="(item,index) in goods" :key="index">
            <div class="title">
              {{item.classify}}
            </div>
            <ul class="good-list-ul">
              <li class="good-item" v-for="(item,index) in item.good" :key="index" @click="handleGood(item)">
                <div class="good-img">
                  <img src="" alt="" style="height: 100%;">
                </div>
                <p class="good-title">{{item.name}}</p>
                <div class="about">
                  <div class="price">￥{{item.price}}</div>
                </div>
              </li>
             
            </ul>
          </li>
           <div class="empty-tip">就这么多商品</div>
        </ul>
      </div>
    </div>
    <!-- modal -->
    <Modal :modalInfo="modalInfo" @hideModal="hideModal" :goodItem="goodItem" ref="modalRef"/>
    
 </div>
</template>

<script>
import Swiperv from "../components/swiper-v"
import banner1 from "../assets/images/banner.png"
import banner2 from "../assets/images/banner2.png"
import icon_fh from "../assets/images/fh.png"
import titleBar from "../components/titleBar"
import Modal from "../components/Modal"
import BScroll from "better-scroll"

 export default {
   data () {
     return {
       uuid:'',
       banner:{
         imgUrl:[
           banner1,banner2
         ],
         showBanner:true,
       },
        setBar:{
          showTitleBar:true,
          icon_fh,
          time:1080,
          tolink:"../main.php?uuid="+this.uuid,
        },
        goods:[],
        modalInfo:{},
        goodItem:[],
        phone:'',
        listHeight:[],
        leftScroll:{},
        rightScroll:{},
        scrollY:0,
        orderInfo:{},
        time3:"",
        type:2, //  1是洗鞋 2是洗衣
     }
   },
   components: {
       Swiperv,
       titleBar,
       Modal
   },
   methods:{
     // titleBar组件返回点击
     goBack(){
       location.href="../main.php?uuid="+this.uuid
     },
     initScroll(){
        this.menuScroll = new BScroll(this.$refs.leftScroll,{
          probeType:3,
          click:true
        });
        this.goodScroll = new BScroll(this.$refs.rightScroll,{
          probeType:3,
          click:true
        })
        this.goodScroll.on("scroll",(pos) => {
          this.scrollY = Math.abs(Math.round(pos.y)); 
        })
      },

     calculateHeight(){
        let goodList = this.$refs.rightScroll.getElementsByClassName("good-list-hook");
        let height = 0;
        this.listHeight.push(height);
        for(let i = 0;i < goodList.length;i++){
          let item = goodList[i]
          height += item.clientHeight
          this.listHeight.push(height);
        }
      },
    selectMenu(index){
        let goodList = this.$refs.rightScroll.getElementsByClassName("good-list-hook");
        let element = goodList[index];
        this.goodScroll.scrollToElement(element,250)
    },

    //  隐藏模态框
    hideModal(phone){
      this.modalInfo.showModal = false;
      //  有phone参数是从模态框确定按钮调用的
      if(phone){
        let that = this;
        this.phone = phone;
        this.$axios.get("ajax.php?action=erweima&uuid="+this.uuid+"&type="+this.type+"&phone="+this.phone+"&id=1&price="+this.goodItem.price)
        .then( res => {
          if(res.data.msg == 1){
            this.orderInfo = res.data;
            this.modalInfo={
              showModal : true,
              modalTitle : this.goodItem.name,
              showGood:true,
              aliurl:res.data.aliurl,
              wxurl:res.data.wxurl
            }
            this.$refs.modalRef.showQrcode();
            //  开始轮询
            this.timeBacks();
          }else if(res.data.msg != 1){
            console.log("系统繁忙")
          }
        })
      }else{
        //  通过右上角关闭订单信息重置
        this.orderInfo = {};
        if(this.timer3 != ''){
          clearInterval(this.timer3)
        }
      }
    },
    //  点击单个商品
    handleGood(good){
      
      this.goodItem = good;
      this.modalShowPhone();
      //  有错误时调用
      // this.modalShowErr("网络连接失败",2000);
      //  调用组件内方法计算模态框高度
      this.$refs.modalRef.modalHeight();
    },
    modalShowPhone(){
      this.modalInfo = {
        showModal : true,
        modalTitle :"输入手机号码",
        showPhone:true
      }
    },
    modalShowErr(txt,tt = 3000){
      this.modalInfo = {
        showModal:true,
        modalTitle:"错误",
        showErr:txt
      };
      let timer = setTimeout( () => {
        this.hideModal();
        clearTimeout(timer);
      },tt)
    },
    //  轮询
    timeBacks(){
      let timer = 0;
        this.timer3 = setInterval(() => {
          timer++;
          console.log(timer)
          this.$axios.get("ajax.php?action=status&oSn="+this.orderInfo.oSn)
          .then(res => {
            if(res.data.msg == 1 || timer == 30){
              clearInterval(this.timer3);
              //  结束轮询并关闭模态框
              this.hideModal();
            }
          })
        },1000)
    },
    getValue(val){
      console.log(val)
      }  
  },
  
   computed:{
     currentIndex(){
        for(let i = 0;i<this.listHeight.length;i++){
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i+1]
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){ 
            return i	
          } else if((this.listHeight[this.listHeight.length-2] - this.listHeight[this.listHeight.length-3]) / 4 + this.listHeight[this.listHeight.length-3] < this.scrollY ){
            return document.querySelectorAll(".list-item").length - 1
          }
        }
        return 0
      }
   },
   created(){
    let search = location.search;
    this.uuid = search.substring(6);
    this.$axios.get("ajax.php?action=xixie&uuid="+this.uuid+"&type="+this.type).then( res => this.goods = res.data);
    this.$nextTick(() => {
      this.initScroll();
      this.calculateHeight();
    })

   },
 }
</script>

<style scoped>
.main{
  /* padding: 0 10px; */
  position: absolute;
  top: 448px;
  bottom: 95px;
  width: 100%;
  overflow: hidden;
}
.main .leftWrap{
  width: 250px;
  height: 100%;
  background: #f8f8f8;
}
.main .leftWrap .left-list .list-item{
  width: 100%;
  font-size: 30px;
  height: 149px;
  line-height: 149px;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
  box-sizing: border-box;
  padding: 0 50px 0 50px;
}
.main .leftWrap .left-list .list-item.active {
    color: #2239c7;
    background: #fff;
}
.main .rightWrap .good-list-hook{
  padding: 20px;
}
.main .rightWrap .good-list-hook .title {
    padding: 30px 10px;
    position: relative;
    text-align: center;
    font-size: 40px;
}
.main .rightWrap .good-list-hook .title:before, .good-list-hook .title:after {
    content: '';
    position: absolute;
    top: 52%;
    background: #494949;
    width: 14%;
    height: 2px;
}
.main .rightWrap .good-list-hook .title:before {
    left: 16%;
}
.main .rightWrap .good-list-hook .title:after {
    right: 16%;
}
.main .rightWrap .good-list-hook .good-list-ul {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    justify-content: space-between;
}
.main .rightWrap .good-list-hook .good-item {
    width: 240px;
    height: 334px;
    background: #f1f1f1;
    border-radius: 19px;
    margin-bottom: 48px;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
}
.main .rightWrap .good-list-hook .good-item .good-img {
    background: #fff;
    width: 199px;
    height: 216px;
    border-radius: 19px;
    text-align: center;
}
.main .rightWrap .good-list-hook .good-item .good-title {
    font-size: 30px;
    text-align: center;
    padding: 10px 0;
}
.main .rightWrap .good-list-hook .good-item .about {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.main .rightWrap .good-list-hook .good-item .about .price {
    flex: 1;
    text-align: center;
    font-size: 30px;
}
</style>