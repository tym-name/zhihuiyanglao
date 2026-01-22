<!-- src/components/UploadLicense.vue -->
<template>
  <div class="upload-license">
    <el-upload class="avatar-uploader" :action="uploadUrl" :headers="uploadHeaders" :show-file-list="false"
      :on-success="handleSuccess" :before-upload="beforeUpload" :disabled="disabled">
      <img v-if="modelValue && !isText" :src="displayUrl" class="avatar" style="width: 148px;height: 148px;" />

      <el-icon v-if="!modelValue && !isText" class="avatar-uploader-icon">
        <Plus />
      </el-icon>
      <template v-if="isText" #default="">
        <slot name="upload-text"></slot>
      </template>
    </el-upload>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

interface Props {
  modelValue: string; // 图片URL
  uploadUrl: string; // 上传地址
  uploadHeaders?: Record<string, any>;  // 上传请求头
  maxSize?: number; // MB
  allowedTypes?: string[];  // 允许上传的文件类型
  tip?: string; // 提示信息
  disabled?: boolean;   // 是否禁用
  baseUrl?: string; // 基础URL前缀
  isText?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  uploadHeaders: () => ({}),
  maxSize: 2,
  allowedTypes: () => ['image/jpeg', 'image/jpg', 'image/png'],
  disabled: false,
  baseUrl: '',
  isText: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'success': [response: any, file: any];
  'error': [message: string];
}>();

// 显示图片的完整URL
const displayUrl = computed(() => {
  if (!props.modelValue) return '';
  return props.modelValue.startsWith('http')
    ? props.modelValue
    : `${props.baseUrl}${props.modelValue}`;
});

// 上传成功处理
const handleSuccess = (response: any, uploadFile: any) => {
  if (response?.code === 10000 && response.data?.url) {
    emit('update:modelValue', response.data.url);
    emit('success', response, uploadFile);
  } else {
    const errorMsg = response?.msg || '上传失败';
    ElMessage.error(errorMsg);
    emit('error', errorMsg);
  }
};

// 上传前验证
const beforeUpload = (rawFile: File) => {
  // 检查文件类型
  if (!props.allowedTypes.includes(rawFile.type)) {
    const errorMsg = `上传文件只能是 ${props.allowedTypes.join(', ')} 格式!`;
    ElMessage.error(errorMsg);
    emit('error', errorMsg);
    return false;
  }

  // 检查文件大小
  if (rawFile.size / 1024 / 1024 > props.maxSize) {
    const errorMsg = `上传文件大小不能超过 ${props.maxSize}MB!`;
    ElMessage.error(errorMsg);
    emit('error', errorMsg);
    return false;
  }

  return true;
};
</script>

<style scoped>
.upload-license {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  margin-top: -750px;
  margin-left: 1240px;
  background-color: #f8f9fa;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  text-align: center;
}

.avatar {
  display: block;
  width: 148px;
  height: 148px;
  object-fit: cover;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>