<template>
    <div class="swiper-container" v-if="isShow">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,index) in imgUrl" :key="index">
                <img :src="item" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
 export default {
        props:{
           imgUrl:{
               type:Array
           },
           isShow:{
               type:Boolean,
               default:false
           }
        },
        data () {
            return {

            }
        },
        components: {

        },
        mounted(){
            new Swiper ('.swiper-container', {
			    loop: true,    
			    autoplay: {
			        disableOnInteraction: false,
			    },
			})  
        }
    }
</script>

<style scoped>
    .swiper-container {
        width: 100%; height: 361px;
        }
    .swiper-wrapper {
        width: 100%; height: 100%; 
        }
    .swiper-slide { 
        width: 100%;   height: 100%;
        }
    .swiper-slide img{width: 100%;height: 100%; }
</style>