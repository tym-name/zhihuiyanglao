<template>
    <div>
        <el-dialog v-model="dialogVisible" title="新增机构" width="500">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="机构名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入机构名称" />
                </el-form-item>
                <el-form-item label="选择省份" prop="cityInfo">
                    <Province v-model="ruleForm.cityInfo"></Province>
                </el-form-item>
                <el-form-item label="所属地区" prop="address">
                    <el-input v-model="ruleForm.address" placeholder="请输入所属地区" />
                </el-form-item>
                <el-form-item label="管理员名称" prop="adminName">
                    <el-input v-model="ruleForm.adminName" placeholder="请输入管理员名称" />
                </el-form-item>
                <el-form-item label="联系电话" prop="telephone">
                    <el-input v-model="ruleForm.telephone" placeholder="请输入联系电话" />
                </el-form-item>
                <el-form-item label="管理员账号" prop="adminUserName">
                    <el-input v-model="ruleForm.adminUserName" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item label="密码" prop="adminPwd">
                    <el-input type="password" v-model="ruleForm.adminPwd" placeholder="请输入密码" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addCompany">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';

import { ElMessage, type FormRules } from 'element-plus'
import type { CompanyInfo } from '../../api/company/companyType';
import { companyAdd } from '../../api/company/company';
import Province from '../../components/form/Province.vue'

const dialogVisible = defineModel()

const ruleForm = reactive<CompanyInfo>({
    id: 0,
    name: '',
    address: '',
    adminName: '',
    telephone: '',
    adminUserName: '',
    adminPwd: '',
    cityInfo: undefined,
    province: '',
    city: '',
    startTime: null,
    legalPerson: null,
    mobile: null,
    creditCode: null,
    license: 0,
    medicalPoint: 0,
    house: null,
    certificate: '',
    picture: '',
    adminMobile: ''
})

// 修复：将规则类型改为CompanyInfo或创建新的规则类型
const rules = reactive<FormRules<any>>({
    name: [
        { required: true, message: '请输入机构名称', trigger: 'blur' },
    ],
    cityInfo: [
        { required: true, message: '请输入所属地区', trigger: 'blur' },
    ],
    address: [
        { required: true, message: '请输入所属地区', trigger: 'blur' },
    ],
    adminName: [
        { required: true, message: '请输入管理员名称', trigger: 'blur' },
    ],
    telephone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
    adminUserName: [
        { required: true, message: '请输入管理员账号', trigger: 'blur' },
    ],
    adminPwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ]
})

let formRef = defineProps<{ handleSuccess: any }>()


const addCompany = async () => {
    console.log('添加数据', ruleForm);
    const res = await companyAdd(ruleForm)
    console.log('添加机构', res);
}

// const ruleFormRef = ref<FormInstance>()
// const addSipplier = async () => {
//     if (!ruleFormRef.value) return
//     try {
//         // 先验证表单
//         await ruleFormRef.value.validate()
//         // 验证通过后提交
//         const res = await supplierAdd(ruleForm)
//         console.log('添加供应商', res)
//         dialogVisible.value = false
//         ElMessage.success('添加供应商成功')
//         formRef.handleSuccess()
//     } catch (error) {
//         console.log('表单验证失败或请求失败:', error)
//         // 这里可以显示具体的错误信息
//         if (error && typeof error === 'object' && 'message' in error) {
//             ElMessage.error(error.message as string)
//         }
//     }
// }
</script>

<style scoped lang='less'></style>