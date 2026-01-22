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
                            <el-input v-model="formData.name" placeholder="请输入姓名" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预定人电话:" prop="mobile">
                            <el-input v-model="formData.mobile" placeholder="请输入预定人电话" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="与老人关系:" prop="relation">
                            <oldManRelation v-model="formData.relation"></oldManRelation>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="床位" prop="bed">
                            <CascaderBeg @bedChange="bedChange" v-model="formData.bed" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="开始日期:" prop="startDate">
                            <el-date-picker v-model="formData.startDate" type="date" placeholder="请选择"
                                format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预定时长（天）:" prop="day">
                            <el-input v-model="formData.day" placeholder="请输入预定时长" type="number" clearable min="1" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="定金应收:" prop="amount">
                            <el-input v-model="formData.amount" placeholder="请输入定金应收" type="number" clearable min="0"
                                step="0.01" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>

            <!-- 预定协议区块 -->
            <div class="form-section">
                <h3 class="section-title">预定协议</h3>
                <el-form-item class="FormWraps">
                    <uploads ref="uploadRef" v-model="image" :baseUrl="VITE_IMG_URL" :uploadUrl="imageUrl"
                        :isText="true" v-if="!image || image.trim() === ''">
                        <template #upload-text>
                            <el-button type="primary">上传图片</el-button>
                        </template>
                    </uploads>

                    <!-- 图片展示区域：支持单/多张图片展示 -->
                    <div class="image-preview-area" v-if="imageList.length > 0">
                        <img v-for="(imgUrl, index) in imageList" :key="index" :src="imgUrl" alt="预定协议图片"
                            class="preview-img" @click="openImagePreview(imgUrl)">
                    </div>
                    <!-- 无图片时的提示 -->
                </el-form-item>
            </div>

            <!-- 按钮区域 -->
            <div class="form-actions">
                <el-button type="primary" :loading="submitting" @click="handleSubmit">
                    保存并提交
                </el-button>
                <el-button @click="handleCancel">取消</el-button>
            </div>
        </el-form>

        <!-- 图片预览弹窗 -->
        <el-dialog v-model="previewDialogVisible" title="协议图片预览" width="80%" append-to-body>
            <img :src="currentPreviewImage" alt="大图预览" class="big-preview-img" style="width: 100%;">
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import oldManRelation from '../../components/form/oldManRelation.vue';
import CascaderBeg from '../../components/form/CascaderBeg.vue';
import uploads from '../../components/upload/Uploads.vue';
import { reservationAdd } from '../../api/Reserve/Reserve';
import { useRoute } from 'vue-router';
import router from '../../router';

// 完善表单类型定义（修正files类型为数组）
interface ReservationForm {
    begId: number;
    elderlyId: any;
    name: string;
    mobile: string;
    relation: string;
    bed: string;
    startDate: string;
    day: number | null;
    amount: number | null;
    files: Array<{ // 修正为Array类型，兼容更多场景
        file: string;
        fileName: string;
    }>;
}

// 声明环境变量/上传地址
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';
const image = ref<string>('');

// 图片预览相关变量
const previewDialogVisible = ref(false); // 预览弹窗显隐
const currentPreviewImage = ref(''); // 当前预览的大图地址
// 计算属性：将逗号分隔的图片地址转为数组，处理完整URL
const imageList = computed(() => {
    if (!image.value) return [];
    // 分割图片地址并过滤空值
    return image.value.split(',').filter(url => url.trim()).map(url => {
        // 确保图片地址是完整的URL（处理相对路径/绝对路径）
        return url.startsWith('http') ? url : VITE_IMG_URL + url;
    });
});

// 打开图片预览弹窗
const openImagePreview = (imgUrl: string) => {
    currentPreviewImage.value = imgUrl;
    previewDialogVisible.value = true;
};

// 获取路由实例
const route = useRoute();
console.log('路由信息：', route);

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
    bed: [ // 新增床位必填验证
        { required: true, message: '请选择床位', trigger: 'change' }
    ],
    startDate: [
        { required: true, message: '请选择开始日期', trigger: 'change' }
    ],
    day: [
        { required: true, message: '请输入预定时长', trigger: 'blur' },
        // { type: 'number', min: 1, message: '时长不能小于1天', trigger: 'blur' }
    ],
    amount: [
        { required: true, message: '请输入定金金额', trigger: 'blur' },
        // { type: 'number', min: 0, message: '定金不能为负数', trigger: 'blur' }
    ]
});

// 表单初始数据
const formData = reactive<ReservationForm>({
    begId: 0,
    name: '',
    mobile: '',
    relation: '',
    bed: '',
    startDate: '',
    day: null,
    amount: null,
    files: [], // 初始化为空数组（更符合实际场景）
    elderlyId: '' // 初始值设为0
});

// 组件挂载时获取路由参数并赋值给elderlyId
onMounted(() => {
    // 方式1：获取路由params中的id（如路由配置为 /reservation/:id）
    const routeId = route.query.id;
    console.log(111, routeId);
    formData.elderlyId = routeId;
});

// 床位变更回调
let bedChange = (idArr: any[]) => {
    const lastId = idArr[idArr.length - 1]
    formData.begId = typeof lastId === 'number' ? lastId : parseInt(lastId)
    // 同时更新bed字段，确保提交时包含床位信息
    formData.bed = lastId.toString()
}

// 表单引用
const formRef = ref<FormInstance>();
const uploadRef = ref();
const submitting = ref(false);

// 核心：保存并提交方法（带详细调试和错误处理）
const handleSubmit = async () => {
    // 1. 校验表单引用是否存在
    if (!formRef.value) {
        ElMessage.error('表单初始化失败，请刷新页面重试');
        return;
    }

    try {
        // 2. 触发表单验证
        await formRef.value.validate();

        submitting.value = true;

        console.log('开始表单验证，当前表单数据：', JSON.parse(JSON.stringify(formData)));

        // 3. 校验图片是否上传
        if (!image.value || image.value.trim() === '') {
            ElMessage.warning('请先上传预定协议图片！');
            submitting.value = false;
            return;
        }

        // 4. 核心逻辑：将image的值赋值到formData.files的file字段中
        formData.files = imageList.value.map(imgUrl => {
            const fileName = imgUrl.split('/').pop() || '预定协议图片';
            // 移除域名，只保留相对路径（适配接口要求）
            const fileUrl = imgUrl.startsWith(VITE_IMG_URL) ? imgUrl.replace(VITE_IMG_URL, '') : imgUrl;
            return {
                file: fileUrl,
                fileName: fileName
            };
        });

        // 5. 调试最终提交的数据
        // 确保数据类型与ReserveInfo接口匹配
        const submitData = {
            ...formData,
            elderlyId: typeof formData.elderlyId === 'number' ? formData.elderlyId : parseInt(formData.elderlyId || '0'),
            day: typeof formData.day === 'number' ? formData.day : parseInt(formData.day || '0'),
            amount: typeof formData.amount === 'number' ? formData.amount : parseFloat(formData.amount || '0')
        };
        console.log('最终提交到接口的数据：', submitData);

        // 6. 调用接口提交数据（增加超时处理）
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('接口请求超时')), 10000); // 10秒超时
        });

        // 接口请求+超时控制
        const res = await Promise.race([reservationAdd(submitData), timeoutPromise]);
        console.log('接口返回结果：', res);
        ElMessage.success('预定信息提交成功！');
        // 跳转到Reserve页面
        router.push('/Reserve');

    } catch (error: any) {
        // 详细的异常处理
        console.error('提交异常详情：', error);
        // 区分不同类型的错误
        if (error.message.includes('Validation failed')) {
            ElMessage.warning('表单填写不完整，请检查必填项');
        } else if (error.message === '接口请求超时') {
            ElMessage.error('提交失败：请求服务器超时，请检查网络或稍后重试');
        } else {
            ElMessage.error(`提交失败：${error.message || '未知错误'}`);
        }
    } finally {
        submitting.value = false; // 无论成功失败，都关闭加载状态
    }
};

// 取消/重置逻辑（完善重置）
const handleCancel = () => {
    if (formRef.value) {
        formRef.value.resetFields();
    }

    // 重置表单数据（保留elderlyId，因为是路由传递的固定值）
    formData.begId = 0;
    formData.name = '';
    formData.mobile = '';
    formData.relation = '';
    formData.bed = '';
    formData.startDate = '';
    formData.day = null;
    formData.amount = null;
    formData.files = []; // 重置files数组
    image.value = ''; // 重置图片变量

    // 重置上传组件
    if (uploadRef.value && typeof uploadRef.value.clearFiles === 'function') {
        uploadRef.value.clearFiles();
    }

    ElMessage.info('已取消当前操作，表单已重置');
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
.image-preview-area {
    display: flex;
    gap: 15px;
    margin-top: 15px;
    flex-wrap: wrap;
}

.preview-img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #409eff;
        box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
        transform: scale(1.02);
    }
}

.no-image-tip {
    margin-top: 15px;
    color: #909399;
    font-size: 14px;
    line-height: 1.5;
}

// 大图预览样式
.big-preview-img {
    max-height: 80vh;
    object-fit: contain;
}
</style>