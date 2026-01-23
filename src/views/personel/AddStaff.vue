<template>
    <el-card>
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="员工头像" prop="photo">
                <el-upload class="avatar-uploader" :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="ruleForm.photo" :src="VITE_IMG_URL + ruleForm.photo" class="avatar"
                        style="width: 100px;height: 100px;" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="员工姓名" prop="name">
                <el-input v-model="ruleForm.name" style="width: 308px;" />
            </el-form-item>
            <el-form-item label="联系方式" prop="mobile">
                <el-input v-model="ruleForm.mobile" style="width: 308px;" />
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="ruleForm.idCard" style="width: 308px;" />
            </el-form-item>
            <el-form-item label="所属部门" prop="departmentId">
                <el-select v-model="ruleForm.departmentId" placeholder="请选择部门" clearable style="width: 308px">
                    <el-option v-for="item in typeItem" :key="item" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="所属岗位" prop="roleId">
                <el-select v-model="ruleForm.roleId" placeholder="请选择岗位" clearable style="width: 308px">
                    <el-option v-for="item in roleItem" :key="item" :label="item.name" :value="item.id" />
                </el-select>

                <!-- <el-select-v2 v-model="ruleForm.roleId" :options="roleItem" placeholder="请选择岗位" style="width: 308px"
                    clearable multiple>
                    <template #label="{ label, value }">
                        <span>{{ label }}: </span>
                        <span style="font-weight: bold">{{ value }}</span>
                    </template>
                </el-select-v2> -->

            </el-form-item>
            <el-form-item label="账号" prop="adminUserName">
                <el-input v-model="ruleForm.adminUserName" style="width: 308px;" />
            </el-form-item>
            <el-form-item label="是否是护工" prop="enable">
                <el-radio-group v-model="ruleForm.enable">
                    <el-radio :value="1">是</el-radio>
                    <el-radio :value="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </el-card>
    <div id="div">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
        </el-button>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus'
import type { staffUpdateData } from '../../api/staff/staffType'
import type { roleList } from '../../api/position/positionType'
import { departmentListFun } from '../../api/personel/personel'
import type { departmentList } from '../../api/personel/personelType'
import { roleListFun } from '../../api/position/position'
import router from '../../router'
import { useRoute } from 'vue-router'
import { staffGet, staffUpdate } from '../../api/staff/staff'

const route = useRoute()
const id = route.params.id ? Number(route.params.id) : 0
const VITE_IMG_URL = 'http://123.57.237.81:8080/caresystem/'
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<staffUpdateData>({
    id: 0,
    companyId: 0,
    photo: '',
    name: '',
    mobile: '',
    isCarer: 0,
    addAccountId: 0,
    addAccountName: '',
    addTime: '',
    departmentName: '',
    roles: [],
    adminId: 0,
    adminUserName: '',
    adminPwd: '',
    enable: '',
    idCard: '',
    roleId: '',
    departmentId: ''
})

// 上传图片相关
const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    uploadFile
) => {
    if (uploadFile) {
        imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    }
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

const rules = reactive<FormRules<staffUpdateData>>({
    photo: { required: true, message: '请添加图片', trigger: 'blur' },
    name: { required: true, message: '请输入员工姓名', trigger: 'blur' },
    mobile: { required: true, message: '请输入手机号', trigger: 'blur' },
    idCard: { required: true, message: '请输入身份证号', trigger: 'blur' },
    departmentId: { required: true, message: '请选择部门', trigger: 'blur' },
    roleId: { required: true, message: '请选择岗位', trigger: 'change' },
    adminUserName: { required: true, message: '请输入账号', trigger: 'blur' },
    enable: { required: true, message: '请选择', trigger: 'blur' },
})
// 所属部门
const forms = reactive<departmentList>({
    id: 0,
    companyId: 0,
    name: '',
    pid: 0,
})
const typeItem = ref<departmentList[]>([])
const getdepartmentListFun = async () => {
    const res = await departmentListFun(forms)
    console.log('所属部门', res);
    typeItem.value = res.data.list
}
getdepartmentListFun()

// 所属岗位
const roleItem = ref<roleList[]>([])
const formss = reactive<roleList>({
    id: 0,
    name: '',
    companyId: 0,
    addAccountId: 0,
    addAccountName: '',
    addTime: '',
    accountCounts: 0,
    menuIds: [],
})
const getstaffListFun = async () => {
    const res = await roleListFun(formss)
    console.log('所属岗位', res);
    roleItem.value = res.data.list
}
getstaffListFun()

// 获取员工详情
const getStaffDetail = async () => {
    if (id === 0) return
    const res = await staffGet(id)
    const detailData = res.data
    ruleForm.photo = detailData.photo;
    ruleForm.name = detailData.name;
    ruleForm.mobile = detailData.mobile;
    ruleForm.idCard = detailData.idCard;
    ruleForm.departmentId = detailData.departmentId;
    ruleForm.adminUserName = detailData.adminUserName;
    ruleForm.enable = detailData.enable;
}
getStaffDetail()
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid) => {
        if (valid) {
            await staffUpdate(ruleForm)
            ElMessage.success('修改成功')
            formEl.resetFields()
            router.back()
        }
    })

}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    router.back()
}

</script>
<style scoped>
.avatar-uploader .avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}

#div {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>