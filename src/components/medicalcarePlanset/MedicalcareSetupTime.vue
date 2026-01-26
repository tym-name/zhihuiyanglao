<!-- 设置服药的时间 -->

<template>
    <div>
        <el-dialog v-model="dialogVisibleSetup" title="设置服药时间" width="600">
            <el-table :data="addParams.plans" max-height="500px" style="width: 100%">
                <!-- 时间列 -->
                <el-table-column label="时间">
                    <template #default="scope">
                        <el-time-picker v-model="scope.row.time" placeholder="请选择时间" value-format="HH:mm"
                            format="HH:mm" />
                    </template>
                </el-table-column>
                <!-- 服用说明列 -->
                <el-table-column label="服用说明">
                    <template #default="scope">
                        <el-input v-model="scope.row.content" placeholder="请输入服用说明" />
                    </template>
                </el-table-column>



                <!-- 操作列 -->
                <el-table-column width="80" align="center">
                    <template #header>
                        <el-button type="primary" @click="addRow" size="small" style="width: 27px;height: 24px;">
                            +
                        </el-button>
                    </template>
                    <template #default="scope">
                        <el-button size="small" @click="removeRow(scope.$index)"
                            :disabled="addParams.plans.length <= 1">
                            -
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form ref="ruleFormRef" style="max-width: 600px " :model="addParams" :rules="rules" label-width="auto">

                <el-form-item label="开始时间" style="margin-top: 20px" prop="startDate">
                    <el-date-picker v-model="addParams.startDate" type="date" format="YYYY-MM-DD" style="width: 40%;"
                        placeholder="请选择开始时间" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisibleSetup = false">取消</el-button>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang='ts'>
import { dayjs, ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref, watch } from 'vue';
import type { MedicationInfo } from '../../api/medicalcare/medicineLogs/medicineLogsType';
import { addMedicineLogsPlan } from '../../api/medicalcare/medicineLogs/medicineLogs';


//接受父组件传来的参数
const props = withDefaults(defineProps<{
    setupId: any
}>(), {
    setupId: () => ({}) // 👈 关键：用函数返回空对象！
})
const dialogVisibleSetup = defineModel()


// 注意：这里必须用 reactive 包裹整个对象，否则 plans 的响应式会失效！
let addParams = reactive<MedicationInfo>({
    startDate: '',
    plans: [],

})


// 监听 dialogVisibleSetup 的变化（当打开对话框时触发）
watch(() => dialogVisibleSetup.value, async (isOpen) => {
    if (isOpen) {
        // 有 drugId 就尝试加载，否则用空白表单
        if (props.setupId) {
            // ✅ 正确的回显方式：逐个属性赋值，保持响应式
            addParams.startDate = props.setupId.startDate ? dayjs(props.setupId.startDate).toDate() : '' as any
            addParams.plans = props.setupId.plans?.length
                ? props.setupId.plans.map((p: { time: any; content: any; }) => ({ time: p.time, content: p.content }))
                : [{ time: '', content: '' }]
            addParams.drugId = props.setupId.id

            //也可以   addParams=props.setupId
        } else {
            // 重置表单
            addParams.startDate = ''
            addParams.plans = [{ time: '', content: '' }]
            addParams.drugId = undefined
        }
    }
})
// ===== 新增方法 =====
const addRow = () => {
    addParams.plans.push({
        time: '',
        content: ''
    })
}


//不保留任何数据
const removeRow = (index: number) => {
    addParams.plans.splice(index, 1)
}


//正则校验
const rules = reactive<FormRules<MedicationInfo>>({
    startDate: [
        { required: true, message: '请选择开始时间', trigger: 'blur' },
    ],
})





const ruleFormRef = ref<FormInstance>()
//定义一个事件
const emit = defineEmits(['submit_Refresh'])
const onSubmit = async () => {
    //处理时间
    if (addParams.startDate) {
        addParams.startDate = dayjs(addParams.startDate).format('YYYY-MM-DD')
    }
    //将id添加到参数中
    if (props.setupId) {
        addParams.drugId = props.setupId.id
    }
    const res = await addMedicineLogsPlan(addParams)
    // console.log("添加用药计划返回结果", res)
    if (res.code === 10000) {
        // ✅ 更新 props 中的数据
        if (props.setupId) {
            props.setupId.startDate = addParams.startDate
            props.setupId.plans = JSON.parse(JSON.stringify(addParams.plans)) // 深拷贝
        }
        ElMessage.success('添加用药计划成功')
        dialogVisibleSetup.value = false
        emit('submit_Refresh')

    } else {
        ElMessage.error('添加用药计划失败')
    }


}

//点击确定  触发校验
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    // 判断是否有任何一行填写了 time 或 content
    const hasValidPlan = addParams.plans.some(p =>
        (p.time?.trim()) || (p.content?.trim())
    )

    const hasValidContent = addParams.plans.some(p =>
        (p.content?.trim()) || (p.content?.trim())
    )
    if (addParams.plans.length === 0 || !hasValidPlan || !hasValidContent) {
        ElMessage.error('请添加用药计划')
        return
    }


    await formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            onSubmit()
        } else {
            // console.log('error submit!', fields)
        }
    })
}
</script>
<style lang='less' scoped></style>