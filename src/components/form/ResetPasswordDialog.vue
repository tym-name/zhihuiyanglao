<template>
  <el-dialog
    v-model="dialogVisible"
    title="重置密码"
    width="30%"
    @close="handleClose"
  >
    <el-form :model="resetPasswordForm" label-width="100px" :rules="rules">
      <!-- 核心修改：显示传递过来的name（机构名称） -->
      <el-form-item label="用户">
        <span class="user-name">{{ props.name }}</span>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="resetPasswordForm.newPassword"
          type="password"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="resetPasswordForm.confirmPassword"
          type="password"
          placeholder="请确认新密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { ElMessage, type FormRules } from 'element-plus';
import { resetPassword } from '../../api/company/company';
import type { ResetPasswordParams } from '../../api/company/companyType';

// Props：新增name属性接收机构名称
const props = defineProps<{
  visible: boolean;
  accountId: number;
  name: string; // 新增：接收父组件传递的机构名称
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'reset-success'): void;
  (e: 'reset-fail', error: any): void;
}>();

// 响应式数据
const dialogVisible = ref(props.visible);
const resetPasswordForm = reactive({
  newPassword: '',
  confirmPassword: ''
});


// 监听visible属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
});

// 监听dialogVisible变化
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
});

// 关闭对话框
const handleClose = () => {
  resetForm();
};

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false;
  resetForm();
};

// 确认重置密码
const handleConfirm = async () => {
  if (!resetPasswordForm.newPassword) {
    ElMessage.warning('请输入新密码');
    return;
  }
  
  if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
    ElMessage.warning('两次输入的密码不一致');
    return;
  }
  
  try {
    // 可选：如果接口需要，可把name传递到重置密码接口中
    await resetPassword({
      id: props.accountId,
      newPassword: resetPasswordForm.newPassword,
      // name: props.name // 如有需要，传递机构名称到后端
    });
    
    dialogVisible.value = false;
    emit('reset-success');
    resetForm();
  } catch (error) {
    console.error('重置密码失败:', error);
    ElMessage.error('密码重置失败，请重试');
    emit('reset-fail', error);
  }
};

// 重置表单
const resetForm = () => {
  resetPasswordForm.newPassword = '';
  resetPasswordForm.confirmPassword = '';
};

const rules = reactive<FormRules<ResetPasswordParams>>({
  newPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
    confirmPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
  ],
    })
</script>

<style scoped>
/* 优化用户名称显示样式 */
.user-name {
  font-weight: 500;
  font-size: 14px;
}
</style>