<template>
    <div class="bed-select-container">
        <!-- 标题区域 -->
        <div class="header">
            <div class="title">
                <span class="indicator"></span>
                选择床位
            </div>
            <div class="total-fee">
                床位费合计：<span class="fee-amount">{{sum }}</span>
            </div>
        </div>
        <!-- 表单区域 -->
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" style="width: 400px;">
            <el-form-item label="选择床位" prop="begId">
                <CascaderBeg @bedChange="bedChange" v-model="formData.begId" />
            </el-form-item>

            <el-form-item label="床位单价" prop="price" style="width: 300px;">
                <el-input-number v-model="formData.price" placeholder="200/天" :min="1" style="width: 100%" />
            </el-form-item>

            <el-form-item label="入住天数" prop="days" style="width: 300px;">
                <el-input-number v-model="formData.days" placeholder="请输入" @change="dayslink" :min="1" style="width: 100%" />
            </el-form-item>

            <el-form-item label="入住日期" prop="checkInDate">
                <el-date-picker v-model="formData.checkInDate" type="date" placeholder="请选择" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import CascaderBeg from '../../components/form/CascaderBeg.vue';


// 定义组件属性
const props = defineProps({
  beg: {
    type: Object,
    default: () => ({})
  }
});
// 定义事件
const emit = defineEmits(['update:modelValue','dayslink','daysres']);

// 表单引用
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive({
    begId: 0,
    price: null,
    days: null,
    checkInDate: ''
});
const sum =ref(0)

// 计算床位费合计
function calculateSum(){
    emit('dayslink', formData.days);
    sum.value = Number(formData.price) * Number(formData.days) || 0;
    emit('daysres', sum.value);
}

// 监听价格和天数变化，自动计算合计
watch(
    () => [formData.price, formData.days],
    () => {
        calculateSum();
        // 同步数据到父组件
        emit('update:modelValue', formData);
    },
    { immediate: true }
);

// 监听床位和入住日期变化，同步到父组件
watch(
    () => [formData.begId, formData.checkInDate],
    () => {
        emit('update:modelValue', formData);
    }
);

function dayslink(){
    calculateSum();
}

let bedChange = (idArr: number[]) => {
    formData.begId = idArr[idArr.length - 1]
}

// 表单验证规则
const formRules = reactive({
    begId: [{ required: true, message: '请选择床位'}],
    price: [{ required: true, message: '请选择床位单价'}],
    days: [{ required: true, message: '请输入入住天数'}],
    checkInDate: [{ required: true, message: '请选择入住日期'}]
});

watch(props.beg, (newVal) => {
    if (newVal) {
        formData.begId = newVal.begId;
        formData.price = newVal.begPrice;
        formData.days = newVal.days;
        formData.checkInDate = newVal.addTime;
        // 数据回显后计算合计
        calculateSum();
    }
});
/* // 计算床位费合计
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
); */

// 暴露表单引用给父组件
defineExpose({
    formRef
});
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