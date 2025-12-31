<template>
    <div id="Main">
        <img class="login_bg" src="../../assets/image/login/login_bg.jpg" alt="" srcset="">
        <div class="login_form">
            <div class="form_title">
                <div class="title">账号登录</div>
                <img class="QRcode" src="../../assets/image/login/QRcode.png" alt="" srcset="">
            </div>
            <el-form ref="loginFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名">
                        <template #prefix>
                            <i class="icon iconfont icon-icon-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="ruleForm.pwd" placeholder="密码">
                        <template #prefix>
                            <i class="icon iconfont icon-jiesuo"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="imgcode">
                    <el-input v-model="ruleForm.verifyCode" placeholder="验证码">
                        <template #prefix>
                            <i class="icon iconfont icon-anquanzhongxin"></i>
                        </template>
                        <template #suffix>
                            <img class="imageCode" :src="captchaImage" alt="" srcset="">
                        </template>
                    </el-input>
                </el-form-item>
                <div>
                    <el-checkbox v-model="checked" label="记住我" size="large" />
                </div>

                <el-button type="primary" :loading="loading" @click="handleLogin">
                    登 录
                </el-button>
            </el-form>
            <el-divider>
                其他登录方式
            </el-divider>
            <div class="other">
                <i class="icon iconfont icon-weixin"></i>
                <i class="icon iconfont icon-QQ"></i>
                <i class="icon iconfont icon-shouji"></i>
                <i class="icon iconfont icon-guge"></i>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getCaptcha } from '../../api';
import type { RuleForm } from '../../api/indexType';
import { useAuthStore } from '../../stores/auth';
import { log } from 'echarts/types/src/util/log.js';
import router from '../../router';
const checked = ref(false)
const loading = ref(false)

const captchaImage=ref()

const loginFormRef = ref<FormInstance | undefined>(undefined)
const ruleForm = reactive<RuleForm>({
    username: '',
    pwd: '',
    verifyCode: '',
    verifyCodeId:''
})

const rules = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    verifyCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
})

// 图形验证码
const getCaptchaImage=async()=>{
    let res=await getCaptcha()
    console.log('图形验证码',res);
    captchaImage.value=res.data.imageCode
    ruleForm.verifyCodeId=res.data.id
}

getCaptchaImage()

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        console.log("123456");
        
        let data = JSON.parse(JSON.stringify(ruleForm)) //深拷贝
        console.log(data,"0000");
        
        const res = await useAuthStore().userLogin(data)
        console.log('登录成功',res);
        
        if (res) router.push('/')
      } catch (error) {
        ElMessage.error('登录失败，请检查账号密码')
        getCaptchaImage()
      } finally {
        loading.value = false
      }
    }
  })
}

</script>

<style scoped lang='less'>
@import url('../../assets/less/login/main/main.less');
</style>