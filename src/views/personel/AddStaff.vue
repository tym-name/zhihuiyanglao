<template>
    <el-card>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="员工头像" prop="photo">
                <uploads v-model="ruleForm.photo" :baseUrl="VITE_IMG_URL" :uploadUrl="imageUrl" />
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
                    <el-option v-for="item in typeItem" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="所属岗位" prop="roleId">
                <el-select v-model="ruleForm.roleId" placeholder="请选择岗位" clearable style="width: 308px" multiple>
                    <el-option v-for="item in roleItem" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="账号" prop="adminUserName">
                <el-input v-model="ruleForm.adminUserName" style="width: 308px;" />
            </el-form-item>
            <el-form-item label="密码" prop="adminPwd">
                <el-input v-model="ruleForm.adminPwd" type="password" style="width: 308px;" />
            </el-form-item>
            <el-form-item label="是否是护工" prop="isCarer">
                <el-radio-group v-model="ruleForm.isCarer">
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { staffUpdateData } from '../../api/staff/staffType'
import type { roleList } from '../../api/position/positionType'
import { departmentListFun } from '../../api/personel/personel'
import type { departmentList } from '../../api/personel/personelType'
import { roleListFun } from '../../api/position/position'
import router from '../../router'
import { useRoute } from 'vue-router'
import { staffGet, staffUpdate, staffAdd } from '../../api/staff/staff'
import { useAuthStore } from '../../stores/auth'
import uploads from '../../components/upload/Uploads.vue'
import { getPublicKey } from '../../api/index'
import { sm2 } from 'sm-crypto'
import type { ApiResponse } from '../../utils/request'

const route = useRoute()
const id = route.params.id ? Number(route.params.id) : 0
const ruleFormRef = ref<FormInstance>()

const authStore = useAuthStore()
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';

const ruleForm = reactive<staffUpdateData>({
    id: 0,
    companyId: authStore.model?.companyId || 0,
    photo: '',
    name: '',
    mobile: '',
    isCarer: 0,
    addAccountId: authStore.model?.id || 0,
    addAccountName: authStore.model?.name || '',
    addTime: '',
    departmentName: '',
    roles: [],
    adminId: 0,
    adminUserName: '',
    adminPwd: '',
    enable: 1,
    idCard: '',
    roleId: [],
    departmentId: ''
})

const rules = reactive<FormRules<staffUpdateData>>({
    photo: { required: true, message: '请上传员工头像', trigger: 'change' },
    name: { required: true, message: '请输入员工姓名', trigger: 'blur' },
    mobile: { required: true, message: '请输入手机号', trigger: 'blur' },
    idCard: { required: true, message: '请输入身份证号', trigger: 'blur' },
    departmentId: { required: true, message: '请选择部门', trigger: 'change' },
    roleId: { required: true, message: '请选择岗位', trigger: 'change' },
    adminUserName: { required: true, message: '请输入账号', trigger: 'blur' },
    adminPwd: { required: true, message: '请输入密码', trigger: 'blur' },
    isCarer: { required: true, message: '请选择', trigger: 'change' },
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
    ruleForm.isCarer = detailData.isCarer;
    ruleForm.enable = detailData.enable;
    // 密码不在详情中返回，保持为空
}
getStaffDetail()
// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid) => {
        if (valid) {
                // 设置当前登录用户信息
                ruleForm.companyId = authStore.model?.companyId || 0
                ruleForm.addAccountId = authStore.model?.id || 0
                ruleForm.addAccountName = authStore.model?.name || ''

                // 构建提交数据，深拷贝避免修改原表单
                const submitData = { ...ruleForm }

                // 新增模式或编辑模式且修改了密码时，需要加密密码
                if (id === 0 || (id > 0 && submitData.adminPwd)) {
                    let publicKey: ApiResponse<string>
                    try {
                        publicKey = await getPublicKey()
                        if (!publicKey.data) {
                            ElMessage.error('获取加密公钥失败，无法提交')
                            return
                        }
                        submitData.adminPwd = sm2.doEncrypt(submitData.adminPwd, publicKey.data, 1)
                    } catch (encryptError) {
                        console.error('密码加密失败：', encryptError)
                        ElMessage.error('密码加密失败，请重试')
                        return
                    }
                }

                if (id === 0) {
                    await staffAdd(submitData)
                    ElMessage.success('添加成功')
                } else {
                    await staffUpdate(submitData)
                    ElMessage.success('修改成功')
                }
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