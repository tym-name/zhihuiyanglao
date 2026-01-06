<template>
    <el-dialog v-model="showDialog" title="添加账号" style="width: 450px;">
        <el-form :model="form" label-width="auto" :rules="rules">
            <el-form-item label="头像" prop="photo">
                <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="姓名" prop="username">
                <el-input v-model="form.name" placeholder="请输入姓名" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.name" placeholder="请输入手机号" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="账号" prop="name">
                <el-input v-model="form.name" placeholder="请输入账号" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
                <el-input v-model="form.name" placeholder="请输入密码" style="width:222.54px" />
            </el-form-item>
            <el-form-item label="所属角色" prop="roleIds">
                <el-select v-model="form.region" placeholder="请选择" style="width:222.54px">
                    <el-option v-for="role in roleData" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="showDialog = false">关闭</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { roleList } from '../../api/account';
import type { roleData } from '../../api/accountType'

// 表单
const ruleFormRef = ref<FormInstance>()
const showDialog = ref(false)
const form = reactive({
    name: '',
    region: '',
})
interface RuleForm {
    photo: string
    username: string
    mobile: string
    name: string
    pwd: string
    roleIds: boolean
}
const rules = reactive<FormRules<RuleForm>>({
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
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
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
    console.log('roleData', roleData);
}
getroleList()
// 提交
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