<template>
    <div class="reservation-page">
        <!-- 预定信息表单 -->
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" class="reservation-form">
            <!-- 预定信息区块 -->
            <div class="form-section">
                <h3 class="section-title">预定信息</h3>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="预定人姓名:" prop="name">
                            <div>{{ formData.name }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预定人电话:" prop="mobile">
                            <div>{{ formData.mobile }}</div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="与老人关系:" prop="relation">
                            <div>{{ formData.relation }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="床位" prop="bed">
                            <div>{{ formData.bed }}</div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="开始日期:" prop="startDate">
                            <div>{{ formData.startDate }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预定时长（天）:" prop="day">
                            <div>{{ formData.day }}</div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="定金应收:" prop="amount">
                            <div>{{ formData.amount }}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <!-- 预定协议区块 -->
            <div class="form-section">
                <h3 class="section-title">预定协议</h3>
                <el-form-item class="FormWraps" label="上传图片">
                    <uploads ref="uploadRef" v-model="image" :baseUrl="VITE_IMG_URL" :uploadUrl="imageUrl"
                        :isText="true">
                        <template #upload-text>
                            <el-button type="primary">上传图片</el-button>
                        </template>
                    </uploads>
                    <!-- 图片展示区域：支持多张图片展示 -->
                    <div class="image-preview-container" v-if="previewImages.length > 0">
                        <img v-for="(imgUrl, index) in previewImages" :key="index" :src="imgUrl" alt="预定协议图片"
                            class="preview-img" @click="previewImage(imgUrl)">
                    </div>
                    <div v-else class="no-image-tip">暂无上传的协议图片</div>
                </el-form-item>
            </div>

            <!-- 按钮区域 -->
            <div class="form-actions">
                <el-button @click="handleCancel">返回</el-button>
            </div>
        </el-form>

        <!-- 图片预览弹窗 -->
        <el-dialog v-model="previewDialogVisible" title="图片预览" width="80%" append-to-body>
            <img :src="currentPreviewImage" class="preview-big-img" style="width: 100px;height: 200px;">
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import uploads from '../../components/upload/Uploads.vue';
import { reservationGet, reservationUpdate, } from '../../api/Reserve/Reserve';
import { useRoute, useRouter } from 'vue-router';
import type { ReserveRelationInfo } from '../../api/Reserve/ReserveType';

// 声明环境变量/上传地址
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';
const image = ref<string>('');

// 路由和导航实例
const route = useRoute();
const router = useRouter();
console.log('路由信息：', route);

const emit = defineProps(['refreshTable']);

// 表单验证规则
const formRules = reactive({
    name: [
        { required: true, message: '请输入预定人姓名', trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '请输入预定人电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' }
    ],
    relation: [
        { required: true, message: '请选择与老人关系', trigger: 'change' }
    ],
    startDate: [
        { required: true, message: '请选择开始日期', trigger: 'change' }
    ],
    days: [
        { required: true, message: '请输入预定时长', trigger: 'blur' },
        { type: 'number', min: 1, message: '时长不能小于1天', trigger: 'blur' }
    ],
    amount: [
        { required: true, message: '请输入定金金额', trigger: 'blur' },
        { type: 'number', min: 0, message: '定金不能为负数', trigger: 'blur' }
    ]
});

// 表单初始数据
const formData = reactive<ReserveRelationInfo>({
    id: 0,
    elderlyId: 0,
    name: '',
    mobile: '',
    relation: '',
    bed: '',
    startDate: '',
    day: 0,
    amount: 0,
    files: []
});

// 表单引用
const formRef = ref<FormInstance>();
const uploadRef = ref();
const submitting = ref(false);

// 图片预览相关
const previewImages = computed(() => {
    // 将逗号分隔的图片地址转为数组，过滤空值
    if (!image.value) return [];
    return image.value.split(',').filter(url => url.trim()).map(url => {
        // 确保图片地址是完整的URL
        return url.startsWith('http') ? url : VITE_IMG_URL + url;
    });
});
const previewDialogVisible = ref(false); // 图片预览弹窗显隐
const currentPreviewImage = ref(''); // 当前预览的大图地址

// 预览图片
const previewImage = (imgUrl: string) => {
    currentPreviewImage.value = imgUrl;
    previewDialogVisible.value = true;
};

// 床位变更回调
const bedChange = (idArr: string[]) => {
    formData.bed = idArr[idArr.length - 1] || '';
    console.log('床位更新：', formData.bed);
};

// 获取预定详情（用于回显）
const getReservationInfo = async () => {
    try {
        // 获取路由中的编辑ID（优先params，其次query），并进行类型转换
        const id = route.query.id || route.params.id;
        if (!id) {
            ElMessage.warning('未找到有效的记录ID');
            return;
        }

        console.log('id', id);

        const res = await reservationGet(Number(id));
        console.log('单条预订信息', res);

        if (res.code === 10000 && res.data) {
            const detail = <any>res.data;
            // 基础信息回显
            formData.id = detail.id;
            formData.bed = detail.bed || '';
            formData.elderlyId = detail.elderlyId || 0;
            formData.name = detail.name || '';
            formData.mobile = detail.mobile || '';
            formData.relation = detail.relation || '';
            formData.startDate = detail.startDate || '';
            formData.day = detail.day || 0;
            formData.amount = detail.amount || 0;
            formData.files = detail.files || [];

            // 上传图片回显
            if (detail.files && detail.files.length > 0) {
                // 拼接图片地址
                image.value = detail.files.map((item: any) => {
                    // 处理图片路径，避免重复拼接域名
                    return item.file.startsWith('http') ? item.file : VITE_IMG_URL + item.file;
                }).join(',');

                // 如果上传组件需要初始化已上传文件
                if (uploadRef.value && typeof uploadRef.value.initFiles === 'function') {
                    uploadRef.value.initFiles(detail.files);
                }
            }
        } else {
            ElMessage.error('获取预定信息失败：' + (res.msg || '未知错误'));
        }
    } catch (error) {
        console.error('获取预定详情失败：', error);
        ElMessage.error('获取预定详情失败，请刷新重试');
    }
};

// 组件挂载时
onMounted(() => {
    // 获取路由中的elderlyId（老人ID）
    const elderlyIdParam = route.query.elderlyId || route.params.elderlyId;
    console.log('老人id', elderlyIdParam);

    if (elderlyIdParam) {
        const elderlyIdNumber = Array.isArray(elderlyIdParam)
            ? Number(elderlyIdParam[0])
            : Number(elderlyIdParam);

        if (!isNaN(elderlyIdNumber)) {
            formData.elderlyId = elderlyIdNumber;
        }
    }

    // 加载已有数据回显
    getReservationInfo();
});

// 提交方法
const handleSubmit = async () => {
    if (!formRef.value) return;
    try {
        await formRef.value.validate();
    } catch (error) {
        ElMessage.warning('请完善必填项后提交');
        return;
    }

    try {
        await ElMessageBox.confirm(
            '确认要保存修改的预定信息吗？',
            '提交确认',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );
    } catch (error) {
        ElMessage.info('已取消提交');
        return;
    }

    submitting.value = true;
    try {
        const submitData = {
            ...formData,
            files: image.value
                ? image.value.split(',').map(url => ({
                    file: url.startsWith(VITE_IMG_URL) ? url.replace(VITE_IMG_URL, '') : url
                }))
                : []
        };

        let res = await reservationUpdate(submitData);
        console.log('修改预定登记', res);

        if (res.code === 200) {
            ElMessage.success(formData.id ? '修改成功' : '新增成功');
            router.push({ path: '/Reserve', query: { elderlyId: formData.elderlyId } });
        } else {
            ElMessage.error((res.msg || '操作失败') + '，请重试');
        }
    } catch (error) {
        console.error('提交预定信息失败：', error);
        ElMessage.error('提交失败，请检查网络或联系管理员');
    } finally {
        submitting.value = false;
    }
};

// 取消/返回逻辑
const handleCancel = () => {
    router.push({ path: '/Reserve' });
};
</script>

<style scoped lang="less">
.reservation-page {
    padding: 20px;
    background: #fff;
    min-height: 100vh;
}

.reservation-form {
    max-width: 1200px;
    margin: 0 auto;
}

.form-section {
    margin-bottom: 30px;

    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 20px;
        border-left: 4px solid #409eff;
        padding-left: 8px;
    }
}

.FormWraps {
    margin-bottom: 10px;
}

.form-actions {
    text-align: center;
    margin-top: 40px;

    .el-button {
        margin: 0 10px;
        padding: 8px 24px;
    }
}

// 图片预览样式
.image-preview-container {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.preview-img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: #409eff;
        transform: scale(1.02);
    }
}

.no-image-tip {
    margin-top: 10px;
    color: #909399;
    font-size: 14px;
}

.preview-big-img {
    max-height: 80vh;
    object-fit: contain;
}
</style>