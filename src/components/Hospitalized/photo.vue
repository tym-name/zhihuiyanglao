<template>
    <div class="photo-upload-container">
        <!-- 标题 -->
        <h3 class="section-title">
            <span class="title-icon"></span>
            上传合同
        </h3>

        <!-- 文件上传区域 -->
        <div class="upload-section">
            <el-upload ref="uploadRef" :action="uploadUrl" :headers="uploadHeaders" :on-success="handleUploadSuccess"
                :on-error="handleUploadError" :before-upload="beforeUpload" :on-progress="handleUploadProgress"
                :multiple="false" :show-file-list="true" :file-list="fileList" class="upload-demo">
                <el-button type="primary" :loading="uploading">文件上传</el-button>
                <template #tip>
                    <div class="el-upload__tip">
                        请上传合同文件，支持 JPG、PNG、PDF 格式<br>
                        最多可上传 5 个文件，单个文件大小不超过 2MB
                    </div>
                </template>
            </el-upload>

            <!-- 上传进度条 -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="upload-progress">
                <el-progress :percentage="Math.round(uploadProgress)" :status="uploadProgressStatus" />
                <span class="progress-text">上传中...</span>
            </div>

            <!-- 上传失败重试 -->
            <div v-if="failedFile" class="upload-failed">
                <el-alert title="文件上传失败" type="error" :closable="false" show-icon>
                    <template #default>
                        <span>文件 {{ failedFile.name }} 上传失败，请检查网络后重试</span>
                        <el-button type="primary" size="small" @click="retryUpload" style="margin-left: 10px;">
                            重试
                        </el-button>
                    </template>
                </el-alert>
            </div>
        </div>

        <!-- 已上传文件预览 -->
        <div v-if="fileList.length > 0" class="preview-section">
            <h4 class="preview-title">已上传文件</h4>
            <div class="image-list">
                <div v-for="(file, index) in fileList" :key="index" class="image-item">
                    <!-- 图片预览 -->
                    <div v-if="file.type && file.type.startsWith('image/')" class="file-preview">
                        <el-image :src="file.url.startsWith('http') ? file.url : VITE_IMG_URL + file.url"
                            :preview-src-list="fileList.filter(f => f.type && f.type.startsWith('image/')).map(f => f.url.startsWith('http') ? f.url : VITE_IMG_URL + f.url)"
                            fit="cover" class="preview-image"></el-image>
                    </div>

                    <!-- PDF预览 -->
                    <div v-else-if="file.type === 'application/pdf'" class="file-preview">
                        <div class="pdf-preview">
                            <i class="el-icon-document"></i>
                            <span class="pdf-name">{{ file.name }}</span>
                        </div>
                    </div>

                    <!-- 其他文件类型 -->
                    <div v-else class="file-preview">
                        <div class="other-preview">
                            <i class="el-icon-document"></i>
                            <span class="other-name">{{ file.name }}</span>
                        </div>
                    </div>

                    <div class="file-actions">
                        <el-button type="primary" size="small" @click="downloadFile(file)" class="download-button">
                            下载
                        </el-button>
                        <el-button type="danger" size="small" @click="handleRemoveImage(index)" class="remove-button">
                            删除
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 定义组件属性
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error']);

// 上传相关变量
const uploadRef = ref();
const uploading = ref(false);
const fileList = ref<any[]>([]);
const image = ref<string>(props.modelValue);
const uploadProgress = ref(0);
const uploadProgressStatus = ref('');
const failedFile = ref<any>(null);

// 上传进度处理
const handleUploadProgress = (event: any, uploadFile: any, uploadFiles: any) => {
    uploadProgress.value = event.percent;
    uploadProgressStatus.value = 'normal';
};

// 重试上传
const retryUpload = () => {
    if (failedFile.value && uploadRef.value) {
        // 重置失败状态
        failedFile.value = null;
        // 重新上传
        uploadRef.value.submit();
    }
};

// 声明环境变量/上传地址
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const uploadUrl = ' http://123.57.237.81:8080/caresystem + '+ '/upload/add';

// 上传 headers
const uploadHeaders = computed(() => {
    // 这里可以添加认证信息等
    return {
        'Content-Type': 'multipart/form-data'
    };
});

// 计算属性：将逗号分隔的图片地址转为数组，处理完整URL
const imageList = computed(() => {
    if (!image.value) return [];
    // 分割图片地址并过滤空值
    return image.value.split(',').filter(url => url.trim()).map(url => {
        // 确保图片地址是完整的URL（处理相对路径/绝对路径）
        return url.startsWith('http') ? url : VITE_IMG_URL + url;
    });
});

// 上传前的校验
const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    const isLt2M = file.size / 1024 / 1024 < 2;
    const maxFiles = 5;

    if (!isImage && !isPDF) {
        ElMessage.error('只能上传图片或PDF文件！');
        return false;
    }
    if (!isLt2M) {
        ElMessage.error('文件大小不能超过 2MB！');
        return false;
    }
    if (imageList.value.length >= maxFiles) {
        ElMessage.error(`最多只能上传 ${maxFiles} 个文件！`);
        return false;
    }

    uploading.value = true;
    return true;
};

// 上传成功处理
const handleUploadSuccess = (response: any, uploadFile: any) => {
    uploading.value = false;
    uploadProgress.value = 0;
    uploadProgressStatus.value = '';
    failedFile.value = null;

    if (response && response.code === 200 && response.data) {
        // 拼接图片地址
        const imgUrl = response.data;

        // 更新图片列表
        if (image.value) {
            image.value += ',' + imgUrl;
        } else {
            image.value = imgUrl;
        }

        // 更新文件列表
        fileList.value.push({
            name: uploadFile.name,
            url: imgUrl,
            type: uploadFile.type
        });

        // 通知父组件
        emit('update:modelValue', image.value);
        emit('upload-success', imgUrl);
        ElMessage.success('文件上传成功');
    } else {
        ElMessage.error('文件上传失败，请重试');
        emit('upload-error', '上传失败：服务器返回错误');
    }
};

// 上传失败处理
const handleUploadError = (error: any, uploadFile: any) => {
    uploading.value = false;
    uploadProgress.value = 0;
    uploadProgressStatus.value = '';

    // 保存失败的文件信息
    failedFile.value = uploadFile;

    ElMessage.error('文件上传失败，请检查网络连接');
    emit('upload-error', error);
};

// 下载文件
const downloadFile = (file: any) => {
    const fileUrl = file.url.startsWith('http') ? file.url : VITE_IMG_URL + file.url;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ElMessage.success('文件开始下载');
};

// 移除图片
const handleRemoveImage = (index: number) => {
    const imgUrls = image.value.split(',');
    imgUrls.splice(index, 1);
    image.value = imgUrls.join(',');

    // 更新文件列表
    fileList.value.splice(index, 1);

    // 通知父组件
    emit('update:modelValue', image.value);
    ElMessage.info('文件已移除');
};

// 清空所有文件
const clearFiles = () => {
    image.value = '';
    fileList.value = [];
    failedFile.value = null;

    // 通知父组件
    emit('update:modelValue', '');

    // 清空上传组件的文件列表
    if (uploadRef.value && typeof uploadRef.value.clearFiles === 'function') {
        uploadRef.value.clearFiles();
    }
};

// 监听 modelValue 变化
onMounted(() => {
    image.value = props.modelValue;
});

// 暴露方法给父组件
defineExpose({
    clearFiles,
    uploadRef
});
</script>

<style scoped lang="less">
.photo-upload-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
}

.section-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 24px;

    .title-icon {
        width: 4px;
        height: 18px;
        background-color: #409eff;
        margin-right: 8px;
        border-radius: 2px;
    }
}

.upload-section {
    margin-bottom: 24px;
}

.upload-progress {
    margin-top: 16px;

    .progress-text {
        display: block;
        text-align: center;
        margin-top: 8px;
        font-size: 14px;
        color: #606266;
    }
}

.upload-failed {
    margin-top: 16px;
}

.preview-section {
    margin-top: 24px;

    .preview-title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 16px;
        border-bottom: 1px solid #e4e7ed;
        padding-bottom: 8px;
    }
}

.image-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .image-item {
        position: relative;
        width: 120px;
        height: 120px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        overflow: hidden;
        background-color: #f5f7fa;

        .file-preview {
            width: 100%;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f7fa;
        }

        .preview-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .pdf-preview,
        .other-preview {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 10px;

            i {
                font-size: 32px;
                color: #409eff;
                margin-bottom: 8px;
            }

            .pdf-name,
            .other-name {
                font-size: 12px;
                color: #606266;
                word-break: break-all;
                line-height: 1.2;
            }
        }

        .file-actions {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            background-color: rgba(255, 255, 255, 0.9);

            .download-button,
            .remove-button {
                flex: 1;
                border-radius: 0;
                font-size: 12px;
                padding: 4px;
            }
        }
    }
}

.upload-demo {
    margin-top: 16px;
}

// 响应式设计
@media (max-width: 768px) {
    .photo-upload-container {
        padding: 12px;
    }

    .image-list {
        .image-item {
            width: 100px;
            height: 100px;
        }
    }
}
</style>