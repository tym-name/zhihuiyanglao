<template>
<div class="logincontainer">
    <wxlogin
      :appid="wechatConfig.appId"
      scope="snsapi_login"
      :redirect_uri="wechatConfig.redirectUri"
      :href="wechatConfig.href"
      :state="wechatConfig.state"
      :style="wechatConfig.style"
    ></wxlogin>
</div>
</template>
<script setup lang='ts'> 
 import {reactive} from 'vue';
 import wxlogin from 'vue-wxlogin'
 
 // 生成安全的state参数
const generateState = () => {
  const random = window.crypto.getRandomValues(new Uint32Array(1))[0]
  return random.toString(36) + Date.now()
}

 const wechatConfig = reactive({
  appId: import.meta.env.VITE_WECHAT_APPID,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  state: generateState(),
  style: 'black',
  href:''
})

</script>
<style scoped>
    .logincontainer {
      display: flex;
      justify-content: center;
      padding: 20px;
      width: 100%;
      height: 400px;
      flex-shrink: 0;
    }
    
    .wx-login-box {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
    </style>