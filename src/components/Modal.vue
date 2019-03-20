<template>
 <div class="modal-mask" v-show="modalInfo.showModal">
    <div class="modal-body" ref="modalBody">
      <div class="modal-close" @click="hideModal">X</div>
      <div class="modal-title">
        {{modalInfo.modalTitle}}
      </div>
      <div class="modal-content" v-if="modalInfo.showGood">
        <div class="goodInfo">
          <p>品名：<b>{{goodItem.name}}</b></p>
          <p>价格：<b>{{goodItem.price}}元</b></p>
        </div>
        <div class="pay-codes flex-around-row">
          <div class="qrcode">
            <canvas id="qrcode1"></canvas>
          </div>
          <div class="qrcode">
            <canvas id="qrcode2"></canvas>
          </div>
        </div>
      </div>
      <div class="modal-content" v-else-if="modalInfo.showPhone">
        <input type="text" class="input-field" :class="{'redBorder':showTip}" v-model="phone" @focus="showBoard(1)">
        <div class="input-tip" :class="{'redTip':showTip}">{{inputTip}}</div>
        <input type="text" class="input-field" :class="{'redBorder':showTip}" v-model="rePhone" @focus="showBoard(2)">
      </div>
      <div class="modal-content" v-else-if="modalInfo.showErr">
        <div>{{modalInfo.showErr}}</div>
      </div>
      <div class="modal-footer">
        <button @click="modalBtn" v-if="modalInfo.showPhone">确定</button>
      </div>
    </div>
    <!-- 引入键盘 -->
    <vKeyboard  ref='keyboard' @input='getValue'></vKeyboard>
 </div>
</template>

<script>
// 引入qrcode
import QRCode from 'qrcode'
//  引入vKeyboard
import vKeyboard from "./keyboard.vue";

 export default {
   props:{
    modalInfo:{
      
    },
    goodItem:{
      
    }
   },
   data () {
     return {
       inputTip:"再次输入手机号码",
       phone:'',
       rePhone:"",
       showTip:false,
     }
   },
   methods:{
     showBoard(num){
       // 不弹出默认的键盘
      // document.activeElement.blur();
      this.inp = num;
      if(this.inp == 1){
        this.$refs.keyboard.show(this.phone);
      }else if(this.inp == 2){
        this.$refs.keyboard.show(this.rePhone);
      }
     },
     getValue(val){
       if(this.inp == 1){
          this.phone = val
       }else if(this.inp == 2){
         this.rePhone = val
       }
     },
     hideModal(){
        this.$emit("hideModal");
        //   重置input
        this.resetInput();
     },
     // 模态框确定按钮
     modalBtn(){
       if(this.modalInfo.showPhone){
         let phoneReg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
         if(this.phone == ''||this.rePhone == ''){
           this.inputTip = "手机号码为空";
           this.showTip = true;
         }else if(this.phone != this.rePhone){
           this.inputTip = "手机号码不一致";
           this.showTip = true;
         } else if(!phoneReg.test(this.phone)){
           this.inputTip = "手机号码不正确";
           this.showTip = true;
         }else{
          this.$emit("hideModal",this.phone);
          this.$refs.keyboard.hide();
         }
       }
     },
    //  显示二维码
    showQrcode(){
      this.$nextTick( () => {
        let qrcode1 = document.getElementById("qrcode1");
        let qrcode2 = document.getElementById("qrcode2");
        QRCode.toCanvas(qrcode1, this.modalInfo.aliurl)
        QRCode.toCanvas(qrcode2, this.modalInfo.wxurl)
      })
      
    },
    //  关闭模态框时重置input
    resetInput(){
      this.phone = this.rePhone = '';
      this.inputTip = "再次输入手机号码";
      this.showTip = false;
    },
    /**
     * 计算模态框高度
     */
     modalHeight(){
       this.$nextTick( () => {
        this.$refs.modalBody.style.marginTop =- this.$refs.modalBody.clientHeight/2 +"px";
      })
     }
   },
   components:{
     vKeyboard
   }
 }
</script>

<style scoped>
.modal-mask {
    background: rgba(0,0,0,.5);
    position: fixed;
    top: 0;
    left: 0;
    width: 1080px;
    height: 1920px;
    z-index: 2;
}
.modal-mask .modal-body {
    background: #fff;
    width: 80%;
    border-radius: 20px;
    padding: 0 10px;
    position: relative;
    top: 50%;
    left: 50%;
    margin-left: -40%;
    font-size: 40px;
}
.modal-mask .modal-body .modal-close {
    position: absolute;
    right: 30px;
    top: 17px;
    border-radius: 50%;
    height: 65px;
    width: 65px;
    border: 1px solid #000;
    text-align: center;
    line-height: 65px;
    color: #000;
}
.modal-mask .modal-body .modal-title {
    text-align: center;
    padding: 30px 0;
}
.modal-mask .modal-body .modal-content {
    text-align: center;
    padding: 30px 0;
    background: #fbfbfb;
}
.modal-mask .modal-body .modal-content p{
  line-height: 1.5;
}
.modal-mask .modal-body .modal-footer {
    padding: 20px 0;
    text-align: center;
}
.modal-mask .modal-body .modal-footer button {
    width: 60%;
    color: #fff;
    background: #0378ff;
    border-radius: 10px;
    padding: 10px 0;
    font-size: 45px;
}
.pay-codes {
  margin-top: 20px;
}
.pay-codes .qrcode{
  width: 200px;
  height: 200px;
  border: 1px solid #fff;
  background: pink;
  border-radius: 10px;
}
#qrcode1,#qrcode2{
  width: 100%!important;
  height: 100%!important;
}
.input-field{
  border: 1px solid #ccc;
  height: 60px;
  width: 410px;
  font-size: 40px;
  padding: 0 15px;
}
.input-tip{
  margin: 20px 0;
}
.redBorder{
  border-color: #f30;
}
.input-tip.redTip{
  color: #f30;
}

input{
	-webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
#num-input{
	margin: 0;
	padding: 0;
	display: block;
}
.default-input{
	/* display: block; */
	/* min-width: 100px !important; */
	/* margin: 0; */
	/* padding: 0; */
	border: 1px solid #000;
	/* width: 100%; */
	/* height: 36px; */
	/* letter-spacing: 1px; */
	/* font-size: 18px; */
	/* padding: 0 15px; */
	border-radius: 5px;
	overflow: hidden;
	box-sizing: border-box;
}
</style>