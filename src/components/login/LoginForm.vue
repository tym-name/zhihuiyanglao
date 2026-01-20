<template>
    <div class="login_form">
        <div class="form_title">
            <div class="title">账号登录</div>
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
                <el-input v-model="ruleForm.pwd" type="password" placeholder="密码">
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

            <div v-if="showRememberMe">
                <el-checkbox v-model="checked" label="记住我" size="large" />
            </div>

            <el-button type="primary" :loading="loading" @click="handleLogin">
                登 录
            </el-button>
        </el-form>

        <template v-if="showOtherLogin">
            <el-divider>
                其他登录方式
            </el-divider>
            <div class="other">
                <i class="icon iconfont icon-weixin"></i>
                <i class="icon iconfont icon-QQ"></i>
                <i class="icon iconfont icon-shouji"></i>
                <i class="icon iconfont icon-guge"></i>
            </div>
        </template>
    </div>
</template>

<script setup lang='ts'>

import { ref, reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getCaptcha } from '../../api/index';
import type { RuleForm } from '../../api/index/indexType';
import { useAuthStore } from '../../stores/auth';
import router from '../../router';
// 定义组件的属性
const props = defineProps({
    // 是否显示登录表单
    show: {
        type: Boolean,
        default: true
    },
    // 默认用户名
    defaultUsername: {
        type: String,
        default: 'cpglyzh'
    },
    // 默认密码
    defaultPassword: {
        type: String,
        default: 'cpglyzh'
    },
    // 是否显示"记住我"
    showRememberMe: {
        type: Boolean,
        default: true
    },
    // 是否显示其他登录方式
    showOtherLogin: {
        type: Boolean,
        default: true
    }
});

// 定义组件的事件
const emit = defineEmits([
    'login-success',
    'login-fail',
    'login-loading',
    'update:show'
]);
const checked = ref(true)
const loading = ref(false)

const captchaImage = ref()

const loginFormRef = ref<FormInstance | undefined>(undefined)
const ruleForm = reactive<RuleForm>({
    username: props.defaultUsername,
    pwd: props.defaultPassword,
    verifyCode: '',
    verifyCodeId: ''
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
const getCaptchaImage = async () => {
    let res = await getCaptcha()
    console.log('图形验证码', res);
    captchaImage.value = res.data.imageCode
    ruleForm.verifyCodeId = res.data.id
}

getCaptchaImage()

const handleLogin = async () => {
    if (!loginFormRef.value) return

    loginFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true
            emit('login-loading', true)

            try {
                let data = JSON.parse(JSON.stringify(ruleForm)) //深拷贝

                const res = await useAuthStore().userLogin(data)
                console.log('登录成功', res);

                if (res) {
                    ElMessage.success('登录成功')
                    emit('login-success', res)
                    router.push('/')
                }
            } catch (error) {
                ElMessage.error('登录失败，请检查账号密码')
                emit('login-fail', error)
                getCaptchaImage()
            } finally {
                loading.value = false
                emit('login-loading', false)
            }
        }
    })
}
</script>

<style scoped lang='less'>
@import url('../../assets/less/login/main/main.less');
.el-form{
    padding: 0 30px;
}
</style>