<template>
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="老人" prop="elderlyName">
                <el-button @click="openElderlyDialog">
                    {{ ruleForm.elderlyName ? ruleForm.elderlyName : '选择老人' }}
                </el-button>
            </el-form-item>
            <el-form-item label="出院原因" prop="reason">
                <el-input v-model="ruleForm.reason" placeholder="请输入出院原因" />
            </el-form-item>
            <el-form-item label="预计时间" prop="expectDate">
                <el-date-picker v-model="ruleForm.expectDate" type="datetime" placeholder="请选择预计出院时间" clearable
                    format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledPastDate" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleClose">关闭</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
                提交
            </el-button>
        </template>
    </el-dialog>
    <ChoseOneElderly :is-show="choseElderlyVisible" :open-elderly="openElderlyDialog"
        :close-elderly="closeElderlyDialog" @select-elderly="handleSelectElderly" />
</template>

<script setup lang='ts'>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { dischargeList } from '../../api/market/dischargeType'
import { dischargeUpdate, dischargeAdd } from '../../api/market/discharge'
import ChoseOneElderly from '../../components/choseelderly/ChoseOneElderly.vue'
import type { ElderlyListItem } from '../../api/care/activity/activityType'
import { useAuthStore } from '../../stores/auth'

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

// 获取auth store
const authStore = useAuthStore()

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

const choseElderlyVisible = ref(false)
const openElderlyDialog = () => {
    choseElderlyVisible.value = true
}
const closeElderlyDialog = () => {
    choseElderlyVisible.value = false
}
const handleSelectElderly = (elderly: ElderlyListItem) => {
    ruleForm.elderlyId = elderly.id
    ruleForm.elderlyName = elderly.name
    ruleForm.elderlyPhoto = elderly.photo
    ruleForm.elderlyGender = elderly.gender === 1 ? '男' : '女'
    ruleForm.elderlyIdCard = elderly.idCard
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            const userModel = authStore.model

            // 添加调试信息
            console.log('authStore.model:', userModel)
            console.log('ruleForm before fill:', ruleForm)

            // 填充必填字段
            if (userModel) {
                // 从用户信息中获取公司ID、账户ID等
                ruleForm.companyId = userModel.companyId || 0
                ruleForm.addAccountId = userModel.id || 0
                ruleForm.begId = userModel.begId || 0
                ruleForm.begName = userModel.begName || ''
                ruleForm.addAccountName = userModel.name || ''
            }

            // 确保必填字段都有值
            ruleForm.state = ruleForm.state || 0
            // 设置当前时间为添加时间
            ruleForm.addTime = ruleForm.addTime || new Date().toISOString()

            // 添加调试信息
            console.log('ruleForm after fill:', ruleForm)

            try {
                // 检查必填字段
                if (!ruleForm.elderlyId) {
                    ElMessage.error('请选择老人')
                    return
                }
                if (!ruleForm.companyId) {
                    ElMessage.error('公司ID不能为空')
                    return
                }
                if (!ruleForm.addAccountId) {
                    ElMessage.error('账户ID不能为空')
                    return
                }

                if (ruleForm.id) {
                    await dischargeUpdate(ruleForm)
                    ElMessage.success('编辑成功')
                } else {
                    await dischargeAdd(ruleForm)
                    ElMessage.success('新增成功')
                }
                dialogFormVisible.value = false
                emit('refresh')
            } catch (error) {
                // 错误信息已经在request.ts中处理，这里不再重复提示
                console.error('提交表单失败:', error)
            }
        }
    })
}
const handleClose = () => {
    dialogFormVisible.value = false
}

// 1. 修改 rules 中 expectDate 的验证触发方式
const rules = reactive<FormRules<dischargeList>>({
    elderlyName: { required: true, message: '请选择老人', trigger: 'blur' },
    reason: { required: true, message: '出院原因不能为空', trigger: 'blur' },
    // 修改 trigger 为 change，更贴合日期选择器
    expectDate: { required: true, message: '预计时间不能为空', trigger: 'change' },
})

// 2. 补充：禁用过去的日期和时间（如果启用了 disabled-date）
// 注意：datetime 类型的禁用，该函数只控制「日期」部分，时间部分会自动禁用过去的时段
const disabledPastDate = (time: Date) => {
    // 返回 true 表示禁用该日期，返回 false 表示可用
    // 禁用今天之前的日期（今天及未来日期可用）
    return time.getTime() < new Date(new Date().toDateString()).getTime()
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