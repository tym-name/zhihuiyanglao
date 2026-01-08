<template>
    <el-dialog v-model="showDialog" :title="dialogTitle" style="width: 450px;">
        <el-form :model="form" label-width="auto" :rules="rules" ref="ruleFormRef">
            <el-form-item label="头像" prop="photo">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="姓名" prop="username">
                <el-input v-model="form.username" placeholder="请输入姓名" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="账号" prop="name">
                <el-input v-model="form.name" placeholder="请输入账号" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="密码" prop="pwd" v-if="!form.id">
                <el-input v-model="form.pwd" placeholder="请输入密码" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="所属角色" prop="roleIds">
                <el-select v-model="form.roleIds" multiple placeholder="请选择" style="width:222.54px">
                    <el-option v-for="role in roleData" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="resetForm(ruleFormRef)">关闭</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from 'vue';
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { accountAdd, roleList } from '../../api/account/account';
import type { accountAddData, AccountResult, roleData } from '../../api/account/accountType'
// title
const dialogTitle = computed(() => {
    return form.id && form.id !== 1 ? '修改账号' : '添加账号';
});
// 表单
const ruleFormRef = ref<FormInstance>()
const showDialog = ref(false)
const form = reactive<accountAddData>({
    id: 0,
    companyId: 0,
    level: 0,
    staffId: 0,
    name: '',
    pwd: '',
    newPwd: null,
    type: 0,
    enable: 0,
    photo: '',
    mobile: '',
    username: '',
    roleIds: [],
    outLogs: null,
    verifyCode: null,
    verifyCodeId: null,
    openId: null,
})

const rules = reactive<FormRules<accountAddData>>({
    photo: { required: true, message: '头像不能为空', trigger: 'blur' },
    username: { required: true, message: '姓名不能为空', trigger: 'blur', },
    mobile: { required: true, message: '手机号不能为空', trigger: 'blur' },
    name: { required: true, message: '账号不能为空', trigger: 'blur' },
    pwd: { required: true, message: '密码不能为空', trigger: 'blur' },
    roleIds: { required: true, message: '请选择角色', trigger: 'blur' },
})
// 头像
const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像图片必须为JPG格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像图片大小不得超过2MB!')
        return false
    }
    return true
}

// 所属角色
const roleData = ref<roleData[]>([])
const getroleList = async () => {
    const res = await roleList()
    console.log('所属角色', res);
    roleData.value = res.data.list
}
getroleList()
// 重置表单
const resetform = async () => {
    Object.assign(form, {
        id: 0,
        companyId: 0,
        level: 0,
        staffId: 0,
        name: '',
        pwd: '',
        newPwd: null,
        type: 0,
        enable: 0,
        photo: '',
        mobile: '',
        username: '',
        roleIds: [],
        outLogs: null,
        verifyCode: null,
        verifyCodeId: null,
        openId: null,
    })
    imageUrl.value = ''
}
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            const res = await accountAdd(form)
            console.log('添加', res);
            ElMessage.success('提交成功')
        } else {
            ElMessage.error('提交失败')
        }
    })
}
// 取消
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    showDialog.value = false
    resetform()
}
// 打开弹窗
const openDialog = (row: AccountResult) => {
    resetform();
    showDialog.value = true
    if (row) {
        form.id = row.id;
        form.username = row.name;
        form.mobile = row.mobile;
        form.name = row.username;
        if (row.photo) {
            imageUrl.value = row.photo;
            form.photo = row.photo;
        }
        if (row.roleIds) {
            form.roleIds = row.roleIds;
        }
    }
}
// 暴露方法给父组件
defineExpose({
    openDialog,
})

</script>

<style scoped lang='less'>
.avatar-uploader {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
    border-color: var(--el-color-primary);

}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}
</style>