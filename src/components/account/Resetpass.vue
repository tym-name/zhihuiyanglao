<template>
    <el-dialog v-model="resetpass" title="重置密码" style="width: 345px;">
        <el-form :model="form" label-width="auto" :rules="rules" ref="ruleFormRef">
            <el-form-item label="用户">
                {{ form.name }}
            </el-form-item>
            <el-form-item label="输入新密码" prop="pwd">
                <el-input v-model="form.pwd" show-password />
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="newPwd">
                <el-input v-model="form.newPwd" show-password />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    确认
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { resetPwdType } from '../../api/account/accountType';
import { accountResetPwd, uploadAdd } from '../../api/account/account';

// 表单
const resetpass = ref(false)
const ruleFormRef = ref<FormInstance>()
const form = reactive<resetPwdType>({
    id: 0,
    pwd: '',
    newPwd: '',
    name: '',
})
const validateConfirmPassword = (rule: any, value: string, callback: Function) => {
    if (!value) {
        callback(new Error('请再次输入新密码'))
    } else if (value !== form.pwd) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}
const rules = reactive<FormRules<resetPwdType>>({
    pwd: { required: true, message: '密码不能为空', trigger: 'blur' },
    newPwd: { required: true, validator: validateConfirmPassword, trigger: 'blur' },
})

// 确认
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            await accountResetPwd(form)
            ElMessage.success('密码重置成功')
            formEl.resetFields()

        } else {
            ElMessage.error('提交失败')
        }
    })
}
// 取消
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    resetpass.value = false
}

// 打开弹窗
const openDialog = (userInfo: { id: number; name: string }) => {
    form.id = userInfo.id
    form.name = userInfo.name
    form.newPwd = ''
    form.pwd = ''
    resetpass.value = true
}
// 暴露方法给父组件
defineExpose({
    openDialog,
})

</script>