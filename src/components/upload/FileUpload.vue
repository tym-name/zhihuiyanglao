<template>
  <div class="file-upload-container">
    <el-upload
      class="file-upload"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :multiple="multiple"
      :show-file-list="true"
      :file-list="fileList"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :disabled="disabled"
      :limit="limit"
      :on-exceed="handleExceed"
      list-type="picture-card"
    >
      <el-icon class="upload-icon">
        <Plus />
      </el-icon>
      <div class="upload-text">上传文件</div>
    </el-upload>
    
    <el-dialog
      v-model="previewVisible"
      title="文件预览"
      width="80%"
      append-to-body
    >
      <img v-if="isImageFile(previewUrl)" :src="previewUrl" class="preview-image" />
      <div v-else class="preview-text">{{ previewUrl }}</div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

interface FileItem {
  name: string;
  url: string;
  uid: string;
}

interface Props {
  modelValue: string[]; // 文件URL数组
  uploadUrl: string; // 上传地址
  uploadHeaders?: Record<string, any>; // 上传请求头
  maxSize?: number; // MB
  allowedTypes?: string[]; // 允许上传的文件类型
  disabled?: boolean; // 是否禁用
  baseUrl?: string; // 基础URL前缀
  multiple?: boolean; // 是否允许多文件上传
  limit?: number; // 最大上传文件数量
}

const props = withDefaults(defineProps<Props>(), {
  uploadHeaders: () => ({}),
  maxSize: 2,
  allowedTypes: () => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  disabled: false,
  baseUrl: '',
  multiple: true,
  limit: 10
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  'success': [response: any, file: any];
  'error': [message: string];
  'remove': [file: any];
}>();

// 文件列表
const fileList = ref<FileItem[]>([]);
// 预览相关
const previewVisible = ref(false);
const previewUrl = ref('');

// 监听modelValue变化，更新fileList
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    fileList.value = newVal.map((url, index) => ({
      name: url.split('/').pop() || `文件${index + 1}`,
      url: url.startsWith('http') ? url : `${props.baseUrl}${url}`,
      uid: `initial-${index}`
    }));
  } else {
    fileList.value = [];
  }
}, { immediate: true, deep: true });

// 上传成功处理
const handleSuccess = (response: any, uploadFile: any) => {
  if (response?.code === 10000 && response.data?.url) {
    const fileUrl = response.data.url;
    // 更新fileList
    const newFileList = [...fileList.value, {
      name: uploadFile.name,
      url: fileUrl.startsWith('http') ? fileUrl : `${props.baseUrl}${fileUrl}`,
      uid: uploadFile.uid
    }];
    fileList.value = newFileList;
    // 更新modelValue
    emit('update:modelValue', newFileList.map(file => file.url));
    emit('success', response, uploadFile);
    ElMessage.success('文件上传成功');
  } else {
    const errorMsg = response?.msg || '上传失败';
    ElMessage.error(errorMsg);
    emit('error', errorMsg);
  }
};

// 删除文件处理
const handleRemove = (file: any) => {
  // 从fileList中移除
  const index = fileList.value.findIndex(item => item.uid === file.uid);
  if (index !== -1) {
    fileList.value.splice(index, 1);
    // 更新modelValue
    emit('update:modelValue', fileList.value.map(item => item.url));
    emit('remove', file);
    ElMessage.success('文件删除成功');
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

// 超过文件数量限制处理
const handleExceed = (_files: File[], _fileList: any[]) => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`);
};

// 检查是否为图片文件
const isImageFile = (url: string) => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  const ext = url.split('.').pop()?.toLowerCase() || '';
  return imageTypes.includes(ext);
};
</script>

<style scoped>
.file-upload-container {
  width: 100%;
}

.file-upload {
  margin-bottom: 20px;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.upload-text {
  margin-top: 8px;
  font-size: 12px;
  color: #8c939d;
}

.preview-image {
  width: 100%;
  max-height: 600px;
  object-fit: contain;
}

.preview-text {
  padding: 20px;
  font-size: 16px;
  color: #303133;
  background-color: #f5f7fa;
  border-radius: 4px;
  word-break: break-all;
}
</style>