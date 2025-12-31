<template>
    <div id="Main">
        <img class="login_bg" src="../../assets/image/login/login_bg.jpg" alt="" srcset="">
        <div class="login_form">
            <div class="form_title">
                <div class="title">账号登录</div>
                <img class="QRcode" src="../../assets/image/login/QRcode.png" alt="" srcset="">
            </div>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名">
                        <template #prefix>
                            <i class="icon iconfont icon-icon-user"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" placeholder="密码">
                        <template #prefix>
                            <i class="icon iconfont icon-jiesuo"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="imgcode">
                    <el-input v-model="ruleForm.imgcode" placeholder="验证码">
                        <template #prefix>
                            <i class="icon iconfont icon-anquanzhongxin"></i>
                        </template>
                        <template #suffix>
                            <img class="imageCode" src="../../assets/image/login/imgCode.png" alt="" srcset="">
                        </template>
                    </el-input>
                </el-form-item>
                <div>
                    <el-checkbox v-model="checked1" label="记住我" size="large" />
                </div>

                <el-button type="primary" @click="submitForm(ruleFormRef)">
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
import type { FormInstance, FormRules } from 'element-plus'
const checked1 = ref(true)
interface RuleForm {
    username: string;
    password: string;
    imgcode: string;
}

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    username: '',
    password: '',
    imgcode: ''

})

const rules = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    imgcode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

</script>

<style scoped lang='less'>
@import url('../../assets/less/login/main/main.less');
</style>