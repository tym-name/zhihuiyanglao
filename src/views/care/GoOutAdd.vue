<template>
    <div>
        <el-dialog v-model="dialogVisible" title="选择老人" width="800" @close="resetForm">
            <div>
                <el-form ref="ruleFormRef" style="max-width: 600px" :model="searchRuleForm" :rules="rules"
                    label-width="auto">
                    <el-form-item label="姓名" prop="name" style="width: 300px;">
                        <el-input v-model="searchRuleForm.name" placeholder="请输入姓名" />
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idCard" style="width: 300px;">
                        <el-input v-model="searchRuleForm.idCard" placeholder="请输入身份证号" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="photo" label="头像" width="180" />
                <el-table-column prop="sex" label="性别" width="100" />
                <el-table-column prop="idCard" label="身份证号" width="180" />
                <el-table-column fixed="right" label="操作" min-width="120">
                    <template #default>
                        <el-button type="primary" @click="add">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import {  reactive, watch, ref } from 'vue';
import { ElMessage, type FormRules, type FormInstance } from 'element-plus'
import type { CompanyInfo } from '../../api/company/companyType';
// 补充编辑接口（需要你确认实际接口名称）
import { companyAdd } from '../../api/company/company';
import { getPublicKey } from '../../api/index';
import type { ApiResponse } from '../../utils/request';
import { sm2 } from 'sm-crypto';
import router from '../../router';

// 1. 弹窗显隐（v-model绑定）
const dialogVisible = defineModel()

// 2. 接收父组件参数（规范类型）
const props = defineProps<{
    isAdd: boolean,          // true=新增 false=编辑
    handleSuccess: () => void, // 操作成功回调
    editData: CompanyInfo | null // 编辑数据（指定正确类型）
}>()

// 3. 表单Ref（用于校验/重置）
const ruleFormRef = ref<FormInstance>()
const search = () => {

}

const reset = () => {
    // params.value = {
    //     name: "",
    //     adminName: "",
    //     page: 1,
    //     pageSize: 15
    // }
    // tableRef.value?.refresh();
}

const tableData = [
    {
        name: '',
        photo: '',
        idCard: '',
        sex: '女',

    }
]
// 跳转到添加页面
const add = () =>{
     router.push({
        path: '/addGoOut'
    })
}

// 4. 动态标题
// const dialogTitle = computed(() => {
//     return props.isAdd ? '新增机构' : '编辑机构'
// })

const searchRuleForm = reactive<any>({
    name: "",
    idCard: "",
})

// 5. 表单数据模型
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

// 6. 表单校验规则
const rules = reactive<FormRules<CompanyInfo>>({
    name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
    cityInfo: [{ required: true, message: '请选择省份城市', trigger: 'change' }], // 改为change触发更合理
    address: [{ required: true, message: '请输入所属地区', trigger: 'blur' }],
    adminName: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }],
    telephone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    adminUserName: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
    adminPwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 7. 核心：监听editData实现数据回显
watch(() => props.editData, (newVal) => {
    // 编辑模式且有编辑数据时回显
    if (!props.isAdd && newVal) {
        // 深拷贝：避免修改父组件原数据
        const editData = JSON.parse(JSON.stringify(newVal))

        // 安全处理：编辑时清空密码（不回显密码）
        editData.adminPwd = ''

        // 适配Province组件：将province/city组装为cityInfo（关键！）
        if (editData.province && editData.city) {
            editData.cityInfo = {
                province: editData.province,
                city: editData.city
            }
        }

        // 赋值到表单（实现回显）
        Object.assign(ruleForm, editData)
    }
}, { immediate: true, deep: true }) // immediate：初始加载就触发；deep：监听对象内部属性

// 8. 重置表单（新增/弹窗关闭时调用）
const resetForm = () => {
    // 重置表单数据到初始状态
    Object.assign(ruleForm, {
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
    // 清空表单校验状态
    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate()
    }
}

// 9. 提交表单（区分新增/编辑）
const submitForm = async () => {
    JSON.parse(JSON.stringify(ruleForm.adminPwd))
    // 先校验表单
    if (!ruleFormRef.value) return
    try {
        await ruleFormRef.value.validate()

        // 处理省份/城市数据（传给后端）
        if (ruleForm.cityInfo && typeof ruleForm.cityInfo !== 'string') {
            ruleForm.province = ruleForm.cityInfo.province || ''
            ruleForm.city = ruleForm.cityInfo.city || ''
        }

        // 获取公钥并加密密码
        const publicKey: ApiResponse<string> = await getPublicKey()
        ruleForm.adminPwd = sm2.doEncrypt(ruleForm.adminPwd, publicKey.data)

        // 区分接口：新增调用companyAdd，编辑调用companyUpdate
        if (props.isAdd) {
            await companyAdd(ruleForm)
            ElMessage.success('机构新增成功！')
        } else {
            await companyAdd(ruleForm) // 编辑接口（需确保后端存在）
            ElMessage.success('机构修改成功！')
        }

        // 关闭弹窗 + 通知父组件刷新列表
        dialogVisible.value = false
        props.handleSuccess()

    } catch (error) {
        console.error('提交失败:', error)
        ElMessage.error(props.isAdd ? '机构新增失败！' : '机构修改失败！')
    }
}
</script>

<style scoped lang='less'></style>