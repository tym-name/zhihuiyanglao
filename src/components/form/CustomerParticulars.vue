<template>
    <div class="elderly-info-form">
        <h3 class="form-title">
            <i class="el-icon-user"></i> 老人信息
        </h3>
        <el-form ref="formRef" :model="elderlyForm" :rules="formRules" label-width="100px">
            <!-- 老人姓名 -->
            <el-form-item label="老人姓名:" prop="name">
                <!-- <el-input style="width: 250px;" v-model="elderlyForm.name" placeholder="请输入老人姓名" clearable
                    @blur="handleInputBlur" /> -->
                    <div>{{  elderlyForm.name }}</div>
            </el-form-item>

            <!-- 老人性别 -->
            <el-form-item label="老人性别:" prop="gender">
                <!-- <el-radio-group v-model="elderlyForm.gender">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                </el-radio-group> -->
                <div>{{  elderlyForm.gender }}</div>
            </el-form-item>

            <!-- 身份证号 -->
            <el-form-item label="身份证号:" prop="idCard">
                <!-- <el-input style="width: 250px;" v-model="elderlyForm.idCard" placeholder="请输入老人身份证号" clearable
                    @blur="handleInputBlur" /> -->
                <div>{{  elderlyForm.idCard }}</div>

            </el-form-item>

            <!-- 老人状况 -->
            <el-form-item label="老人状况:" prop="status">
                <!-- <el-input style="width: 250px;" v-model="elderlyForm.status" type="textarea" placeholder="请输入老人状况"
                    :rows="2" @blur="handleInputBlur" /> -->
                <div>{{  elderlyForm.status }}</div>

            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

let porp = defineProps({
    idgethomr: {
        type: Object,
        default: () => { }
    }
})

// 2. 定义组件事件
const emit = defineEmits(['update:elderlyForm', 'validate', 'form'])

// 3. 表单 Ref
const formRef = ref<FormInstance>()

// 4. 表单数据结构
const elderlyForm = reactive({
    name: '', // 老人姓名
    gender: 1, // 性别 1-男 2-女，默认男
    idCard: '', // 身份证号
    status: '' // 老人状况
})

// 5. 表单校验规则
const formRules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入老人姓名', trigger: 'blur' }
    ],
    gender: [
        { required: true, message: '请选择老人性别', trigger: 'change' }
    ],
    idCard: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
        // {
        //     pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        //     message: '请输入有效的身份证号码',
        //     trigger: 'blur'
        // }
    ],
    status: [
        { required: true, message: '请输入老人状况', trigger: 'blur' }
    ]
})

// 7. 对外暴露方法：获取表单数据
const getFormData = () => {
    return { ...elderlyForm }
}

watch(() => porp.idgethomr, (newval) => {
    if (!newval) return
    Object.assign(elderlyForm, newval)


})
// 8. 对外暴露方法：表单校验
/* const validate = async () => {
    if (!formRef.value) return false
    try {
        const valid = await formRef.value.validate()
        emit('validate', valid)
        return valid
    } catch (error) {
        emit('validate', false)
        return false
    }
} */

// 9. 对外暴露方法：重置表单
const resetForm = () => {
    formRef.value?.resetFields()
}

// 10. 监听表单变化，实时通知父组件
watch(
    elderlyForm,
    (newVal) => {
        emit('update:elderlyForm', newVal)
    },
    { deep: true }
)

// 对外暴露方法
defineExpose({
    getFormData,
    /*  validate, */
    resetForm
})
</script>

<style scoped lang="less">
.elderly-info-form {
    padding: 20px;
    background: #fff;
    border-radius: 4px;

    .form-title {
        margin: 0 0 20px 0;
        font-size: 16px;
        font-weight: bold;
        color: #303133;
        border-left: 4px solid #409eff;
        padding-left: 8px;
    }
}
</style>