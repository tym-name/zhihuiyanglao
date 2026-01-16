<template>
  <el-dialog v-model="visible" :title="dialogTitle" width="500px" @close="handleClose">
    <el-form :model="addressForm" label-width="100px" :rules="formRules" ref="formRef">
      <el-form-item label="巡检地点:" prop="name">
        <el-input v-model="addressForm.name" placeholder="请输入巡检地点" maxlength="50" show-word-limit
          style="width: 300px;" />
      </el-form-item>
      <el-form-item label="二维码:" prop="qrcode">
        <QrCode v-model="qrCodeUrl" :url="addressForm.name"></QrCode>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { ref, reactive, watch, nextTick } from 'vue';
import type { EntityItem } from '../../api/address/addressType';
import { uploadBase64 } from '../../utils/fileUtils';
import { addressAdd, addressUpdate } from '../../api/address/address';
import QrCode from '../../components/form/QrCode.vue';

// 1. 修改Props：接收父组件传入的完整行数据（可选，EntityItem类型）
const props = defineProps<{
  // 编辑时：父组件传入当前行的完整数据；新增时：传入undefined/null
  editRow?: EntityItem;
}>();

const visible = defineModel({ default: false });
const emit = defineEmits(['saveSuccess']);
const qrCodeUrl = ref("");

// 表单引用
const formRef = ref<FormInstance | null>(null);

// 弹窗标题
const dialogTitle = ref('新增地址');

// 地址表单
const addressForm = reactive<EntityItem>({
  id: 0,
  name: '',
  qrcode: '',
  companyId: 0
});

// 表单规则
const formRules = reactive<FormRules<EntityItem>>({
  name: [
    { required: true, message: '请输入巡检地点', trigger: 'blur' },
    { min: 1, max: 50, message: '巡检地点长度在 1 到 50 个字符', trigger: 'blur' }
  ]
});

// 2. 新增：表单重置方法（清空数据、二维码、校验状态）
const resetForm = () => {
  Object.assign(addressForm, {
    id: 0,
    name: '',
    qrcode: '',
    companyId: 0
  });
  qrCodeUrl.value = '';
  nextTick(() => {
    formRef.value?.clearValidate(); // 清除表单校验提示
  });
};

// 3. 核心：监听editRow变化，自动回显编辑数据（适配父组件传入行数据）
watch(
  () => props.editRow,
  async (newRow) => {
    if (newRow && newRow.id > 0) {
      // 编辑模式：回显父组件传入的完整行数据
      dialogTitle.value = '修改地址';
      // 深拷贝避免修改父组件原数据（防止双向绑定污染）
      Object.assign(addressForm, { ...newRow });
      // 同步二维码到QrCode组件（回显原有二维码）
      qrCodeUrl.value = newRow.qrcode || '';
      console.log('编辑数据回显完成', addressForm);
    } else {
      // 新增模式：重置表单
      resetForm();
      dialogTitle.value = '新增地址';
    }
  },
  { immediate: true } // 组件挂载时立即执行一次，适配初始传入数据
);

// 4. 优化：提交表单（区分新增/编辑，调用对应接口）
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    // 第一步：表单校验
    const valid = await formRef.value.validate();
    if (!valid) return;

    // 第二步：二维码上传（如有），同步到表单
    let uploadSuccess = true;
    if (qrCodeUrl.value) {
      const res = await uploadBase64(qrCodeUrl.value).catch(() => undefined);
      if (res && res.data?.url) {
        addressForm.qrcode = res.data.url;
        console.log("文件上传成功", res.data.url);
      } else {
        ElMessage.error('二维码上传失败');
        uploadSuccess = false;
      }
    }
    if (!uploadSuccess) return;

    // 第三步：区分新增/编辑，调用对应接口
    let submitRes;
    if (addressForm.id > 0) {
      // 编辑模式：调用更新接口
      submitRes = await addressUpdate(addressForm);
      console.log("编辑地址结果", submitRes);
    } else {
      // 新增模式：调用新增接口
      submitRes = await addressAdd(addressForm);
      console.log("新增地址结果", submitRes);
    }

    // 第四步：提交成功处理
    if (submitRes && submitRes.code === 10000) {
      const successMsg = addressForm.id > 0 ? '编辑地址成功' : '新增地址成功';
      ElMessage.success(successMsg);
      visible.value = false;
      emit('saveSuccess'); // 通知父组件刷新列表
      resetForm(); // 重置表单，避免残留数据
    } else {
      const errorMsg = submitRes?.msg || (addressForm.id > 0 ? '编辑地址失败' : '新增地址失败');
      ElMessage.error(errorMsg);
    }
  } catch (error) {
    console.error('保存地址信息失败:', error);
    ElMessage.error('保存地址信息失败，请稍后重试');
  }
};

// 5. 优化：弹窗关闭处理（重置表单，清除编辑数据残留）
const handleClose = () => {
  resetForm();
  visible.value = false;
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>