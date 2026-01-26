<!-- 停止用药 -->
<template>
    <div>
        <el-dialog v-model="dialogVisibleStop" title="停止用药" width="450">
            <el-form ref="ruleFormRef" style="max-width: 450px ;padding-right: 150px;" :model="ruleForm" :rules="rules"
                label-width="auto">
                <el-form-item label="停止服药时间" prop="endDate">
                    <el-date-picker v-model="ruleForm.endDate" type="date" format="YYYY-MM-DD"
                        date-format="MMM DD, YYYY" style="width: 100%;" placeholder="请选择结束时间" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleCancel">取消</el-button>
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
import type { Plan } from '../../api/medicalcare/medicineLogs/medicineLogsType';
import { stopMedicineLogs } from '../../api/medicalcare/medicineLogs/medicineLogs';

//接受父组件传来的参数
const props = withDefaults(defineProps<{
    currentDate: any
}>(), {
    currentDate: 0
})
const dialogVisibleStop = defineModel()


const ruleFormRef = ref<FormInstance>()
//停止用药的请求参数
const ruleForm = ref<Plan>({})
//正则校验
const rules = reactive<FormRules<Plan>>({
    endDate: [
        { required: true, message: '请选择结束时间', trigger: 'blur' },
    ],
})



// 监听数据的变化，当打开时获取数据
watch(() => props.currentDate, (newVal) => {
    if (newVal && newVal.endDate) {
        //回显数据
        ruleForm.value.endDate = newVal.endDate
    } else {
        //清空数据
        ruleForm.value.endDate = ''
    }
}, { immediate: true })



//定义一个事件
const emit = defineEmits(['stop_Refresh'])
//提交
const onSubmit = async () => {
    if (props.currentDate.plans.length === 0) {
        ElMessage.error("请先添加用药计划")
        return
    }
    ruleForm.value.id = props.currentDate.id
    // console.log("停止用药的参数", ruleForm.value.id)
    //处理日期
    if (ruleForm.value.endDate) {
        ruleForm.value.endDate = dayjs(ruleForm.value.endDate).format('YYYY-MM-DD')
    }
    const res = await stopMedicineLogs(ruleForm.value)
    // console.log("停止用药的参数", ruleForm.value)

    if (!res) return
    ElMessage.success("停止用药成功")
    //关闭对话框
    dialogVisibleStop.value = false;
    emit('stop_Refresh')
}


//点击确定  触发校验
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            onSubmit()
        } else {
            // console.log('error submit!', fields)
        }
    })
}

//点击取消
const handleCancel = () => {
    //关闭对话框
    dialogVisibleStop.value = false;
}
</script>
<style lang='less' scoped></style>