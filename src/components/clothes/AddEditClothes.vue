<template>
    <el-dialog v-model="addeditclothes" title="修改洗衣错衣">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="老人姓名" prop="name" style="width: 180px">
                <el-button> </el-button>
            </el-form-item>
            <el-form-item label="标题" prop="name">
                <el-input v-model="ruleForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="类型" prop="region">
                <el-select placeholder="请选择类型" clearable style="width: 180px">
                    <el-option v-for="item in typeItem" :key="item" :label="item.value" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="region">
                <el-select placeholder="请选择状态" clearable style="width: 180px">
                    <el-option v-for="item in stateItem" :key="item" :label="item.value" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="name">
                <el-input type="textarea" v-model="ruleForm.content" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="图片" prop="name">
                <el-button type="primary">选择照片</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="resetForm(ruleFormRef)">取消</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ClothesList } from '../../api/clothes/clothesType'

const addeditclothes = ref(false)
// 状态
const stateItem = [
    { value: '未解决', }, { value: '已解决', }
]
// 类型
const typeItem = [
    { value: '错衣', }, { value: '缺衣', }
]
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<ClothesList>({
    id: 0,
    companyId: 0,
    elderlyId: 0,
    title: '',
    content: '',
    type: '',
    state: '',
    addTime: '',
    addAccountId: 0,
    addAccountName: '',
    begName: null,
    elderlyName: null,
    elderlyPhoto: null,
    elderlyGender: null,
    elderlyIdCard: null,
    houseName: null,
    buildingName: '',
    pictures: [],
})

const rules = reactive<FormRules<ClothesList>>({
    elderlyName: { required: true, message: 'Please input Activity name', trigger: 'blur' },
    title: { required: true, message: 'Please input Activity name', trigger: 'blur' },
    type: { required: true, message: 'Please input Activity name', trigger: 'blur' },
    state: { required: true, message: 'Please input Activity name', trigger: 'blur' },
    content: { required: true, message: 'Please input Activity name', trigger: 'blur' },
    pictures: { required: true, message: 'Please input Activity name', trigger: 'blur' },
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