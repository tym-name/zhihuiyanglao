<template>
    <div class="bed-select-container">
        <!-- 标题区域 -->
        <div class="header">
            <div class="title">
                <span class="indicator"></span>
                选择床位
            </div>
            <div class="total-fee">
                床位费合计：<span class="fee-amount">{{ totalFee.toFixed(2) }}</span>
            </div>
        </div>

        <!-- 表单区域 -->
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" style="width: 400px;">
            <el-form-item label="选择床位" prop="begId">
                <CascaderBeg @bedChange="bedChange" />
            </el-form-item>

            <el-form-item label="床位单价" prop="price" style="width: 300px;">
                <el-input-number v-model="formData.price" placeholder="200/天" :min="1" style="width: 100%" />
            </el-form-item>

            <el-form-item label="入住天数" prop="days" style="width: 300px;">
                <el-input-number v-model="formData.days" placeholder="请输入" :min="1" style="width: 100%" />
            </el-form-item>

            <el-form-item label="入住日期" prop="checkInDate">
                <el-date-picker v-model="formData.checkInDate" type="date" placeholder="请选择" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import CascaderBeg from '../../components/form/CascaderBeg.vue';


// 定义事件
const emit = defineEmits(['update:modelValue']);

// 表单引用
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive({
    begId: 0,
    price: null,
    days: null,
    checkInDate: ''
});

let bedChange = (idArr: number[]) => {
    formData.begId = idArr[idArr.length - 1]
}

// 表单验证规则
const formRules = reactive({
    begId: [{ required: true, message: '请选择床位', trigger: 'blur' }],
    price: [{ required: true, message: '请选择床位单价', trigger: 'blur' }],
    days: [{ required: true, message: '请输入入住天数', trigger: 'blur' }],
    checkInDate: [{ required: true, message: '请选择入住日期', trigger: 'blur' }]
});

// 计算床位费合计
const totalFee = computed(() => {
    if (!formData.price || !formData.days) return 0;
    return formData.price * formData.days;
});

// 监听表单变化，同步给父组件
watch(
    formData,
    (newVal) => {
        emit('update:modelValue', {
            ...newVal,
            totalFee: totalFee.value
        });
    },
    { deep: true }
);
</script>

<style scoped lang="less">
.bed-select-container {
    padding: 24px;
    background: #fff;
    border-radius: 4px;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .title {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-right: 20px;

        .indicator {
            width: 4px;
            height: 18px;
            background: #409eff;
            margin-right: 8px;
            border-radius: 2px;
        }
    }

    .total-fee {
        font-size: 16px;
        color: #303133;
        .fee-amount{
            font-size: 14px;
        }
    }
}

:deep(.el-form-item) {
    margin-bottom: 16px;
}

:deep(.el-select),
:deep(.el-input-number),
:deep(.el-date-picker) {
    width: 100%;
}
</style>