<template>
  <div class="other-charges">
    <h3 class="section-title">
      <span class="title-icon"></span>
      其他收费
    </h3>

    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="押金" prop="deposit">
        <el-input-number v-model="formData.deposit" placeholder="请输入" clearable @change="updateTotal" />
      </el-form-item>
      <el-form-item label="一次性生活费" prop="livingExpense">
        <el-input-number v-model="formData.livingExpense" placeholder="请输入" clearable @change="updateTotal" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive,watch} from 'vue';
import type { FormInstance } from 'element-plus';
// 定义事件
const emit = defineEmits(['depositmonkey','livingExpensemonkey']);
// 表单数据
interface OtherChargesForm {
  deposit: number | null;
  livingExpense: number | null;
}
const props = defineProps({
    beg: {
    type: Object,
    default: () => ({})
  }
});
// 表单引用
const formRef = ref<FormInstance>();

const formData = reactive<OtherChargesForm>({
  deposit: null,
  livingExpense: null
});

function updateTotal(){
  emit('depositmonkey',formData.deposit)
  emit('livingExpensemonkey',formData.livingExpense)
}
// 表单验证规则
const formRules = reactive({
  deposit: [
    { required: true, message: '请输入押金' },
    { type: 'number', min: 0, message: '押金不能为负数' },
  ],
  livingExpense: [
    { required: true, message: '请输入一次性生活费' },
    { type: 'number', min: 0, message: '一次性生活费不能为负数' },
  ]
});

// 暴露表单引用和数据给父组件
defineExpose({
  formRef,
  formData
});
watch(props.beg, (newVal) => {
    if (newVal) {
        formData.deposit =newVal.cashPledge;
        formData.livingExpense = newVal.livingPrice;
    }
});

</script>

<style scoped lang="less">
.other-charges {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
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

.charge-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 20px;

  .form-label {
    width: 120px;
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