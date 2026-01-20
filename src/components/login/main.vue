<template>
    <div id="Main"  >
        <img class="login_bg" src="../../assets/image/login/login_bg.jpg" alt="" srcset="">
        <div class="login_form">
            <img class="QRcode"  @click="form" v-if="!isQrcode" src="../../assets/image/login/QRcode.png" alt="" srcset="">
            <img class="QRcode" @click="form" v-else src="../../assets/image/login/QRlogo.png" alt="" srcset="">
            <component :is="isQrcode ? Qrcode : LoginForm"></component>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import LoginForm from './LoginForm.vue'
import Qrcode from './Qrcode.vue'

const isQrcode = ref(false)

const form=()=>{
    isQrcode.value = !isQrcode.value
}


</script>

<style scoped lang='less'>
@import url('../../assets/less/login/main/main.less');

.QRcode {
    width: 60px;
    height: 60px;
    position: absolute;
    right: 0;
    z-index: 2;
}
</style>