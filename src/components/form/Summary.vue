<template>
    <div class="demand-summary-form">
        <h3 class="form-title">
            <i class="el-icon-document"></i> 需求总结
        </h3>
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
            <!-- 房间需求 -->
            <el-form-item label="房间需求:" prop="roomRequire">
                <el-input style="width: 250px;" v-model="formData.roomRequire" type="textarea" placeholder="请输入房间要求"
                    :rows="2" clearable />
            </el-form-item>

            <!-- 意向描述 -->
            <el-form-item label="意向描述:" prop="content">
                <el-input style="width: 250px;" v-model="formData.content" type="textarea" placeholder="请输入意向描述"
                    :rows="2" clearable />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'


// 2. 定义组件事件
const emit = defineEmits(['update:formData', 'validate'])

// 3. 表单 Ref
const formRef = ref<FormInstance>()

// 4. 表单数据结构
const formData = reactive({
    roomRequire: '', // 房间需求
    content: ''      // 意向描述
})

// 5. 表单校验规则
const formRules = reactive<FormRules>({
    roomRequire: [
        { required: true, message: '请输入老人姓名', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入意向描述', trigger: 'change' }
    ],
})



// 7. 对外暴露方法：获取表单数据
const getFormData = () => {
    return { ...formData }
}

// 8. 对外暴露方法：表单校验
const validate = async () => {
    if (!formRef.value) return false
    try {
        const valid = await formRef.value.validate()
        emit('validate', valid)
        return valid
    } catch (error) {
        emit('validate', false)
        return false
    }
}

// 9. 对外暴露方法：重置表单
const resetForm = () => {
    formRef.value?.resetFields()
}

// 10. 监听表单变化，实时通知父组件
watch(
    formData,
    (newVal) => {
        emit('update:formData', newVal)
    },
    { deep: true }
)

// 对外暴露方法
defineExpose({
    getFormData,
    validate,
    resetForm
})
</script>

<style scoped lang="less">
.demand-summary-form {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-top: 20px;

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