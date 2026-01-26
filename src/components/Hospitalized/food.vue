<template>
  <div class="diet-price-container">
    <!-- 标题和合计费用 -->
    <div class="header">
      <div class="title">
        <span class="indicator"></span>
        餐饮膳食
      </div>
      <div class="total-fee">
        伙食费合计：<span class="fee-amount">{{ props.daysfoodRef * Number(formData.priceFood) }}</span>
      </div>
    </div>

    <!-- 套餐单价选择 -->
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="套餐单价" prop="priceFood">
        <el-input-number v-model="formData.priceFood" @change="foodmonkeys" :min="0" :max="100" :step="1"
          style="width: 200px" :precision="0" placeholder="25/天" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { FormInstance } from 'element-plus';

// 定义组件属性
const props = defineProps({
  daysfoodRef: {
    type: Number,
    default: 0
  },
  beg: {
    type: Object,
    default: () => ({})
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'foodmonkey']);

// 表单引用
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive({
  priceFood: null
});

function foodmonkeys() {
  emit('foodmonkey', props.daysfoodRef * Number(formData.priceFood));
}

// 表单验证规则
const formRules = reactive({
  priceFood: [
    {
      required: true,
      message: '请输入套餐单价',
      trigger: 'blur'
    },
    {
      type: 'number',
      min: 1,
      message: '套餐单价必须大于0',
      trigger: 'blur'
    },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value && !/^\d+$/.test(value.toString())) {
          callback(new Error('套餐单价必须是整数'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

// 监听价格变化，同步给父组件
watch(
  () => formData.priceFood,
  (newVal) => {
    emit('update:modelValue', newVal);
  }
);
watch(props.beg, (newVal) => {
    if (newVal) {
        formData.priceFood = newVal.foodPrice;
        
    }
});
// 暴露表单引用给父组件
defineExpose({
  formRef
});
</script>

<style scoped lang="less">
.diet-price-container {
  padding: 16px 0;
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  margin-bottom: 24px;

  .title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: #303133;

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

    .fee-amount {
      font-size: 14px;
    }
  }
}

.price-input-group {
  display: flex;
  align-items: center;
  gap: 12px;

  .label {
    display: inline-block;
    width: 100px;
    color: #303133;
    font-weight: 400;

    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;

    .unit {
      color: #606266;
      font-size: 14px;
    }
  }
}

:deep(.el-input-number) {
  width: 400px;
}
</style>