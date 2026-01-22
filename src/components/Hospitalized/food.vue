<template>
  <div class="diet-price-container">
    <!-- 标题和合计费用 -->
    <div class="header">
      <div class="title">
        <span class="indicator"></span>
        餐饮膳食
      </div>
      <div class="total-fee">
        伙食费合计：<span class="fee-amount">{{ totalFee.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 套餐单价选择 -->
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="套餐单价" prop="price">
        <el-input-number v-model="formData.price" :min="0" :max="100" :step="1" style="width: 200px" :precision="0"
          placeholder="25/天" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
// 定义组件属性
const props = defineProps({
  // 绑定值（父组件可通过v-model获取）
  modelValue: {
    type: Number
  },
  // 天数（用于计算合计）
  days: {
    type: Number,
    default: 0
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue']);

// 表单数据
const formData = reactive({
  price: props.modelValue || 1
});

// 表单验证规则
const formRules = reactive({
  price: [
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

// 计算伙食费合计
const totalFee = computed(() => {
  if (!formData.price || !props.days) return 0;
  return formData.price * props.days;
});

// 监听价格变化，同步给父组件
watch(
  () => formData.price,
  (newVal) => {
    emit('update:modelValue', newVal);
  }
);

// 监听父组件传入的modelValue变化
watch(
  () => props.modelValue,
  (newVal) => {
    formData.price = newVal || 1;
  }
);
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