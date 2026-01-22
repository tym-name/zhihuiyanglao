<template>
    <div class="reservation-page">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" class="reservation-form">
            <!-- 步骤条 -->
            <step :currentStep="currentStep"></step>
            <div style="display: flex; gap: 300px;">
                <oldMan :oldManData="elderlyInfo"></oldMan>
                <relation ref="relationRef"></relation>
            </div>
            <!-- 选择床位 -->
            <bed ref="bedRef"></bed>
            <!-- 餐饮膳食 -->
            <food ref="foodRef"></food>
            <!-- 护理服务 -->
            <nurse ref="nurseRef"></nurse>
            <!-- 服务项目 -->
            <serve ref="serveRef" v-model="formData.services"></serve>
            <!-- 其他收费 -->
            <elses ref="elsesRef"></elses>
            <!-- 入院费用核定周期设置 -->
            <kernel ref="kernelRef"></kernel>
            <!-- 按钮区域 -->
            <div>
                <el-button @click="goBack">返回</el-button>
                <el-button type="primary" @click="nextStep">下一步</el-button>
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
import { reservationAdd } from '../../api/Reserve/Reserve';
import { useRoute } from 'vue-router';

import step from '../../components/Hospitalized/step.vue';
import bed from '../../components/Hospitalized/bed.vue';
import food from '../../components/Hospitalized/food.vue';
import nurse from '../../components/Hospitalized/nurse.vue';
import serve from '../../components/Hospitalized/serve.vue';
import elses from '../../components/Hospitalized/elses.vue';
import kernel from '../../components/Hospitalized/kernel.vue';
import relation from '../../components/Hospitalized/relation.vue';
import oldMan from '../../components/Hospitalized/oldMan.vue';
import router from '../../router';


// 接收HospitalizedAdd组件传来的数据
const route = useRoute();

// 老人信息
const elderlyInfo = ref({
    name: '',
    idCard: '',
    photo: ''
});

onMounted(() => {
    console.log('路由参数111：', route.query);
    // 从路由参数获取老人信息
    if (route.query) {
        elderlyInfo.value.name = route.query.name as string || '';
        elderlyInfo.value.idCard = route.query.idCard as string || '';
        // 处理老人头像，确保路径正确
        const photo = route.query.photo as string || '';
        if (photo) {
            // 检查是否是完整的URL，如果不是，则与VITE_IMG_URL拼接
            if (photo.startsWith('http')) {
                elderlyInfo.value.photo = photo;
            } else {
                elderlyInfo.value.photo = VITE_IMG_URL + photo;
            }
        } else {
            elderlyInfo.value.photo = '';
        }
    }
});



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
    dietPrice: number;
    services: Array<{
        name: string;
        description: string;
        amount: number;
    }>;
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
//返回按钮
const goBack = () => {
    router.push({ path: '/Hospitalized' });
}
// 下一步按钮
const nextStep = async () => {
    // 1. 校验表单引用是否存在
    if (!formRef.value) {
        ElMessage.error('表单初始化失败，请刷新页面重试');
        return;
    }

    try {
        // 2. 触发表单验证
        await formRef.value.validate();

        // 3. 子组件验证
        // 验证床位组件
        if (bedRef.value && bedRef.value.formRef && bedRef.value.formRef.validate) {
            await bedRef.value.formRef.validate();
        }

        // 验证其他收费组件
        if (elsesRef.value && elsesRef.value.formRef && elsesRef.value.formRef.validate) {
            await elsesRef.value.formRef.validate();
        }

        // 验证入院费用核定周期设置组件
        if (kernelRef.value && kernelRef.value.formRef && kernelRef.value.formRef.validate) {
            await kernelRef.value.formRef.validate();
        }

        // 验证餐饮膳食组件
        if (foodRef.value && foodRef.value.formRef && foodRef.value.formRef.validate) {
            await foodRef.value.formRef.validate();
        }

        // 验证护理服务组件
        if (nurseRef.value && nurseRef.value.formRef && nurseRef.value.formRef.validate) {
            await nurseRef.value.formRef.validate();
        }

        // 4. 额外的正则验证
        let isValid = true;

        // 验证手机号
        if (formData.mobile && !/^1[3-9]\d{9}$/.test(formData.mobile)) {
            ElMessage.warning('请输入正确的11位手机号');
            isValid = false;
        }

        // 验证预定时长
        if (formData.day && formData.day < 1) {
            ElMessage.warning('预定时长不能小于1天');
            isValid = false;
        }

        // 验证定金金额
        if (formData.amount && formData.amount < 0) {
            ElMessage.warning('定金金额不能为负数');
            isValid = false;
        }

        // 5. 验证成功后执行下一步操作
        if (isValid) {
            ElMessage.success('表单验证通过，正在进入下一步...');
            // 更新当前步骤
            currentStep.value = 1;
            // 这里可以添加下一步的逻辑，例如跳转到下一个页面
            // router.push('/next-page');
        }
    } catch (error: any) {
        // 6. 验证失败的处理
        console.error('表单验证失败:', error);
        ElMessage.warning('请检查表单填写是否完整，确保所有必填项都已正确填写');
    }
}

// 获取路由实例
// const route = useRoute();
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
    dietPrice: 25, // 默认餐饮单价25元/天
    services: [], // 初始化为空数组
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
let bedChange = (idArr: number[]) => {
    formData.begId = idArr[idArr.length - 1]
}

// 表单引用
const formRef = ref<FormInstance>();
const uploadRef = ref();

// 子组件引用
const relationRef = ref();
const bedRef = ref();
const foodRef = ref();
const nurseRef = ref();
const serveRef = ref();
const elsesRef = ref();
const kernelRef = ref();
const submitting = ref(false);

// 当前步骤
const currentStep = ref(0);

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
        const submitData = JSON.parse(JSON.stringify(formData));
        console.log('最终提交到接口的数据：', submitData);

        // 6. 调用接口提交数据（增加超时处理）
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('接口请求超时')), 10000); // 10秒超时
        });

        // 接口请求+超时控制
        const res = await Promise.race([reservationAdd(submitData), timeoutPromise]);
        console.log('接口返回结果：', res);
        router.push('/reservation');

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
    formData.dietPrice = 25; // 重置为默认值
    formData.services = []; // 重置服务列表
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