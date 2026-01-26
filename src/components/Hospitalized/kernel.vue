<template>
    <div class="kernel-setting">
        <h3 class="section-title">
            <span class="title-icon"></span>
            入院费用核定周期设置
        </h3>

        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px">
            <el-form-item label="入院费用核定周期" prop="cycle">
                <el-input-number v-model="formData.cycle" placeholder="请输入" clearable />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive ,watch} from 'vue';
import type { FormInstance } from 'element-plus';
const props = defineProps({
    beg: {
    type: Object,
    default: () => ({})
  }
});
// 表单数据
interface KernelSettingForm {
    cycle: number | null;
}

// 表单引用
const formRef = ref<FormInstance>();

const formData = reactive<KernelSettingForm>({
    cycle: null
});

// 表单验证规则
const formRules = reactive({
    cycle: [
        { required: true, message: '请输入入院费用核定周期' },
        { type: 'number', min: 1, message: '入院费用核定周期必须大于0' },
    ]
});

// 暴露表单引用给父组件
defineExpose({
    formRef
});
watch(props.beg, (newVal) => {
    if (newVal) {
        formData.cycle = newVal.payDays;
        
    }
});

</script>

<style scoped lang="less">
.kernel-setting {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    /*     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

.section-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 20px;

    .title-icon {
        width: 4px;
        height: 16px;
        background-color: #409eff;
        margin-right: 8px;
        border-radius: 2px;
    }
}

.setting-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-item {
    display: flex;
    align-items: center;
    gap: 20px;

    .form-label {
        width: 200px;
        font-size: 14px;
        color: #606266;
        display: flex;
        align-items: center;

        .required {
            color: #f56c6c;
            margin-right: 4px;
        }
    }

    .input-group {
        display: flex;
        align-items: center;
        gap: 0;

        .el-input {
            width: 200px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;

            :deep(.el-input__wrapper) {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }

        .input-button {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-left: none;
            width: 36px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>