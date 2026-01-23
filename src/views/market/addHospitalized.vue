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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
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
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;

// 图片预览相关变量
const previewDialogVisible = ref(false); // 预览弹窗显隐
const currentPreviewImage = ref(''); // 当前预览的大图地址

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



// 表单引用
const formRef = ref<FormInstance>();

// 子组件引用
const bedRef = ref();
const foodRef = ref();
const nurseRef = ref();
const elsesRef = ref();
const kernelRef = ref();

// 当前步骤
const currentStep = ref(0);

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