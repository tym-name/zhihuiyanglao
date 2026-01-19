<template>
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="老人" prop="elderlyName">
                <el-button v-model="ruleForm.elderlyName">
                    {{ ruleForm.elderlyName ? ruleForm.elderlyName : '选择老人' }}
                </el-button>
            </el-form-item>
            <el-form-item label="出院原因" prop="reason">
                <el-input v-model="ruleForm.reason" placeholder="请输入出院原因" />
            </el-form-item>
            <el-form-item label="预计时间" prop="expectDate">
                <el-date-picker v-model="ruleForm.expectDate" type="datetime" placeholder="请选择" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleClose">关闭</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
                提交
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { dischargeList } from '../../api/market/dischargeType'
import { dischargeUpdate } from '../../api/market/discharge'

const props = defineProps<{
    modelValue: boolean
    editRow?: dischargeList | null
}>()
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'refresh': []
}>()
const dialogFormVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})
const dialogTitle = computed(() => {
    return props.editRow?.id ? '编辑出院申请' : '新增出院申请'
})

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<dischargeList>({
    id: 0,
    companyId: 0,
    elderlyId: 0,
    expectDate: '',
    reason: '',
    state: 0,
    addTime: '',
    addAccountId: 0,
    begId: 0,
    begName: '',
    addAccountName: '',
    elderlyName: '',
    elderlyPhoto: '',
    elderlyGender: '',
    elderlyIdCard: '',
    houseName: '',
    buildingName: '',
})

const rules = reactive<FormRules<dischargeList>>({
    elderlyName: { required: true, message: '请选择老人', trigger: 'blur' },
    reason: { required: true, message: '出院原因不能为空', trigger: 'blur' },
    expectDate: { required: true, message: '预计时间不能为空', trigger: 'blur' },
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                await dischargeUpdate(ruleForm)
                ElMessage.success(props.editRow?.id ? '编辑成功' : '新增成功')
                // 提交成功后刷新表格并关闭对话框
                emit('refresh')
                dialogFormVisible.value = false
            } catch (error) {
                console.error('提交失败:', error)
                ElMessage.error('提交失败')
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
const handleClose = () => {
    dialogFormVisible.value = false
}
const resetForm = () => {
    if (ruleFormRef.value) {
        ruleFormRef.value.resetFields()
    }
    Object.assign(ruleForm, {
        id: 0,
        companyId: 0,
        elderlyId: 0,
        expectDate: '',
        reason: '',
        state: 0,
        addTime: '',
        addAccountId: 0,
        begId: 0,
        begName: '',
        addAccountName: '',
        elderlyName: '',
        elderlyPhoto: '',
        elderlyGender: '',
        elderlyIdCard: '',
        houseName: '',
        buildingName: '',
    })
}

// 监听编辑数据变化 - 放在所有函数定义之后
watch(() => props.editRow, (newRow) => {
    if (newRow) {
        // 填充编辑数据
        Object.assign(ruleForm, newRow)
    } else {
        // 重置表单
        resetForm()
    }
}, { immediate: true })

</script>