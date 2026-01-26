<template>
    <div class="reservation-page">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" class="reservation-form">
            <!-- 步骤条 -->
            <div v-if="!isshow">
                <step :currentStep="currentStep"></step>
                <div style="display: flex; gap: 300px;">
                    <oldMan :oldManData="elderlyInfo"></oldMan>
                    <relation ref="relationRef"></relation>
                </div>
                <!-- 选择床位 -->
                <bed ref="bedRef" :beg = beg @dayslink="dayslink" @daysres="daysres" @update:modelValue="(data) => {
                    formData.begId = data.begId;
                    formData.price = data.price;
                    formData.days = data.days;
                    formData.checkInDate = data.checkInDate;
                }"></bed>
                <!-- 餐饮膳食 -->
                <food ref="foodRef" :beg = beg :daysfoodRef="daysfoodRef" @foodmonkey="foodmonkey"></food>
                <!-- 护理服务 -->
                <nurse ref="nurseRef" :beg = beg :daysfoodRef="daysfoodRef" @nursemonkey="nursemonkey"></nurse>
                <!-- 服务项目 -->
                <serve ref="serveRef" :beg = beg @addSer="handleAddSer"></serve>
                <!-- 其他收费 -->
                <elses ref="elsesRef" :beg = beg @depositmonkey="depositmonkey" @livingExpensemonkey="livingExpensemonkey"></elses>
                <!-- 入院费用核定周期设置 -->
                <kernel ref="kernelRef" :beg = beg></kernel>
                <!-- 按钮区域 -->
                <div>
                    <el-button @click="goBack">返回</el-button>
                    <el-button type="primary" @click="nextStep">下一步</el-button>
                </div>

            </div>
            <div v-else>
                <!-- 步骤条 -->
                <orderForm></orderForm>
                <div style="display: flex; gap: 300px;">
                    <oldMan :oldManData="elderlyInfo"></oldMan>
                    <relation ref="relationRef"></relation>
                </div>
                <!-- 订单总费用 -->
                <allCost :bedFee="costData.bedFee" :foodFee="costData.foodFee" :nurseFee="costData.nurseFee"
                    :deposit="costData.deposit" :livingExpense="costData.livingExpense"></allCost>
                <!-- 入院费用核定 -->
                <hospitalCost :bedFee="costData.bedFee" :foodFee="costData.foodFee" :nurseFee="costData.nurseFee"
                    :deposit="costData.deposit" :livingExpense="costData.livingExpense" :daysfoodRef="daysfoodRef">
                </hospitalCost>
                <!-- 上传合同组件 -->
                <photo v-model="image" @suploads="upload_success" @upload-success="handleUploadSuccess" @upload-error="handleUploadError"></photo>
                <!-- 按钮区域 -->
                <div class="button-area">
                    <el-button type="primary" @click="upStep">上一步</el-button>
                    <el-button type="primary" @click="saveTemp">保存暂不提交</el-button>
                    <el-button type="primary" @click="savaSub">保存并提交</el-button>
                    <el-button @click="goBack">返回</el-button>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
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
import orderForm from '../../components/Hospitalized/orderForm.vue';
import photo from '../../components/Hospitalized/photo.vue';
import allCost from '../../components/Hospitalized/allCost.vue';
import hospitalCost from '../../components/Hospitalized/hospitalCost.vue';
import router from '../../router';
import { orderAdd, orderGet, orderUpdate } from '@/api/Hospitalized/Hospitalized';


// 接收HospitalizedAdd组件传来的数据
const route = useRoute();

// 老人信息
const elderlyInfo = reactive({
    ids: '',
    name: '',
    idCard: '',
    photo: ''
});
console.log();

if(route.query.ids){
    elderlyInfo.ids = route.query.id as string;
    elderlyInfo.name = route.query.name as string;
    elderlyInfo.idCard = route.query.idCard as string;
    elderlyInfo.photo = route.query.photo as string;
}
// 表单引用
const formRef = ref<FormInstance>();

// 子组件引用
const relationRef = ref();
const bedRef = ref();
const foodRef = ref();
const nurseRef = ref();
const serveRef = ref();
const elsesRef = ref();
const kernelRef = ref();

// 当前步骤
const currentStep = ref(0);

// 图片上传
const image = ref<string>('');

// 显示状态
const isshow = ref(false);

// 子传父
const daysfoodRef = ref(0)
const dayslink = (days: number) => {
    daysfoodRef.value = days;
}

const daysres = (sum: number) => {
    costData.bedFee = sum
}
const foodmonkey = (sum: number) => {
    costData.foodFee = sum
}
const nursemonkey = (sum: number) => {

    costData.nurseFee = sum
}
const depositmonkey = (sum: number) => {
    costData.deposit = sum
}
const livingExpensemonkey = (sum: number) => {
    costData.livingExpense = sum
}
const upload_success = (sum: any) => {
    // 处理上传成功的文件
    if (sum) {
        // 清空现有文件列表
        formData.files = [];
        
        // 处理数组或单个文件路径
        const filesToProcess = Array.isArray(sum) ? sum : [sum];
        
        filesToProcess.forEach(filePath => {
            if (filePath) {
                // 提取文件名
                const fileName = filePath.split('/').pop() || 'unknown';
                
                // 添加到文件列表
                formData.files.push({
                    file: filePath,
                    fileName: fileName
                });
            }
        });
        
        console.log('文件已添加到表单:', formData.files);
    }
}
// 处理添加服务
const handleAddSer = (services: any) => {
    formData.services = services.value.map((service: any) => ({
        id: service.id, // 保留服务ID
        name: service.serviceName,
        description: service.serviceContent,
        amount: 0 // 默认金额为0
    }));
    console.log('添加的服务:', formData.services);
}

// 表单类型定义
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
    price: number | null;
    days: number | null;
    checkInDate: string;
    priceFood: number | null;
    cycle: number | null;
    services: Array<{
        name: string;
        description: string;
        amount: number;
    }>;
    files: Array<{
        file: string;
        fileName: string;
    }>;
}

// 表单初始数据
const formData = reactive<ReservationForm>({
    begId: 0,
    name: '',
    mobile: '',
    relation: '',
    bed: '',
    startDate: '2007-08-09',
    day: null,
    amount: null,
    dietPrice: 25, // 默认餐饮单价25元/天
    price: null,
    days: null,
    checkInDate: '',
    priceFood: null,
    cycle: null,
    services: [], // 初始化为空数组
    files: [], // 初始化为空数组
    elderlyId: 0 // 初始值设为0
});

// 费用相关数据
const costData = reactive({
    bedFee: 0, // 床位费
    foodFee: 0, // 伙食费
    nurseFee: 0, // 护理费
    deposit: 0, // 押金
    deposit2: 0, // 押金
    livingExpense: 0 // 一次性生活费
});

// 编辑数据，传递给子组件
let beg = reactive({});

// 组件挂载时获取路由参数并判断是添加还是编辑
async function init() { 
    try {
        const id = route.query.id;
        if (id) {
            const red = await orderGet(Number(id));
            console.log('编辑数据:', red);
            if (red?.code === 10000 && red.data) {
                Object.assign(beg, red.data);
                // 填充数据到 formData，确保编辑模式下表单正确显示
                formData.elderlyId = (red.data as any).elderlyId || '';
                formData.begId = (red.data as any).begId || 0;
                formData.price = (red.data as any).begPrice || null;
                formData.days = (red.data as any).days || null;
                formData.startDate = (red.data as any).startDate || '';
                formData.priceFood = (red.data as any).foodPrice || null;
                formData.cycle = (red.data as any).payDays || null;
                
                // 填充数据到 costData，确保编辑模式下费用正确显示
                costData.bedFee = (red.data as any).livingPrice ?? 0;
                costData.foodFee = (red.data as any).foodPrice ?? 0;
                costData.nurseFee = (red.data as any).servicePrice ?? 0;
                costData.deposit = (red.data as any).cashPledge ?? 0;
                costData.livingExpense = (red.data as any).livingPrice ?? 0;
            }
        }
    } catch (error) {
        console.error('获取编辑数据失败:', error);
    }
}

if(route.query.id){
   init();
}
// 返回按钮
const goBack = () => {
    router.push({ path: '/Hospitalized' });
}

// 表单验证规则
const formRules = reactive({
    name: [
        { required: true, message: '请输入预定人姓名' }
    ],
    mobile: [
        { required: true, message: '请输入预定人电话' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', }
    ],
    relation: [
        { required: true, message: '请选择与老人关系' }
    ],
    bed: [ // 新增床位必填验证
        { required: true, message: '请选择床位' }
    ],
    startDate: [
        { required: true, message: '请选择开始日期' }
    ],
    day: [
        { required: true, message: '请输入预定时长' },
        { type: 'number', min: 1, message: '时长不能小于1天', }
    ],
    amount: [
        { required: true, message: '请输入定金金额' },
        { type: 'number', min: 0, message: '定金不能为负数' }
    ],
    begId: [{ required: true, message: '请选择床位', }],
    price: [{ required: true, message: '请选择床位单价', }],
    days: [{ required: true, message: '请输入入住天数', }],
    checkInDate: [{ required: true, message: '请选择入住日期', }],
    priceFood: [
        { required: true, message: '请输入套餐单价' },
        { type: 'number', min: 1, message: '套餐单价必须大于0' },
    ],
    deposit: [
        { required: true, message: '请输入押金' },
        { type: 'number', min: 0, message: '押金不能为负数' },
    ],
    cycle: [
        { required: true, message: '请输入入院费用核定周期' },
        { type: 'number', min: 1, message: '入院费用核定周期必须大于0' },
    ],
    livingExpense: [
        { required: true, message: '请输入一次性生活费' },
        { type: 'number', min: 0, message: '一次性生活费不能为负数' },
    ],
    foodmonkey: [
        { required: true, message: '请输入套餐单价', },
        { type: 'number', min: 1, message: '套餐单价必须大于0', }
    ],

});

// 下一步按钮
const nextStep = async () => {
    console.log('开始验证表单');
    // 1. 校验父表单引用是否存在
    if (!formRef.value) {
        ElMessage.error('表单初始化失败，请刷新页面重试');
        return;
    }
    try {
        // 2. 触发表单验证
        await formRef.value.validate();
        console.log('父表单验证通过');

        // 3. 验证子组件表单
        const validatePromises = [];

        // 验证关系组件
        if (relationRef.value && relationRef.value.formRef) {
            validatePromises.push(relationRef.value.formRef.validate());
        }

        // 验证床位组件
        if (bedRef.value && bedRef.value.formRef) {
            validatePromises.push(bedRef.value.formRef.validate());
        }

        // 验证餐饮组件
        if (foodRef.value && foodRef.value.formRef) {
            validatePromises.push(foodRef.value.formRef.validate());
        }

        // 验证护理组件
        if (nurseRef.value && nurseRef.value.formRef) {
            validatePromises.push(nurseRef.value.formRef.validate());
        }

        // 验证服务组件
        if (serveRef.value && serveRef.value.formRef) {
            validatePromises.push(serveRef.value.formRef.validate());
        }

        // 验证其他收费组件
        if (elsesRef.value && elsesRef.value.formRef) {
            validatePromises.push(elsesRef.value.formRef.validate());
        }

        // 验证费用核定组件
        if (kernelRef.value && kernelRef.value.formRef) {
            validatePromises.push(kernelRef.value.formRef.validate());
        }

        // 执行所有子组件的验证
        await Promise.all(validatePromises);
        console.log('所有子组件表单验证通过');

        // 4. 验证通过后，进行下一步操作
        currentStep.value++;
        ElMessage.success('验证通过，进入下一步');
        isshow.value = true;

    } catch (error: any) {
        // 5. 验证失败时的处理
        console.error('表单验证失败：', error);
        ElMessage.warning('表单填写不完整，请检查必填项');
    }
}

// 上一步按钮
const upStep = () => {
    isshow.value = false;
}

// 保存暂不提交
const saveTemp = () => {
    router.push({ path: '/Hospitalized' });
}

// 保存并提交
const savaSub = async () => {
    try {
        // 获取路由参数中的id，判断是添加还是编辑
        const id = route.query.id;
       
        // 组装提交参数
        const submitData: any = {
            elderlyId: Number(formData.elderlyId) || 0,
            begId: formData.begId || 0,
            begPrice: formData.price || 0,
            days: formData.days || 0,
            startDate: formData.startDate || '',
            foodPrice: formData.priceFood || 0,
            servicePrice: costData.nurseFee || 0,
            cashPledge: costData.deposit || 0,
            livingPrice: costData.bedFee || 0,
            payDays: formData.cycle || 0,
            state: 1,
            services: formData.services && formData.services.length > 0 ? formData.services.map((service: any) => ({ serviceId: service.id || service.serviceId })) : [],
            files: formData.files && formData.files.length > 0 ? formData.files.map((file: any) => ({ file: file.file || file })) : []
        };

        console.log('提交数据:', submitData);

        try {
            let res;
            // 根据是否存在id参数判断调用哪个API
            if (id) {
                res = await orderUpdate({ ...submitData, id: Number(id) });
                console.log('编辑结果:', res);
            } else {
                // 添加模式，调用orderAdd
                res = await orderAdd(submitData as any);
                console.log('添加结果:', res);
            }

            if (res && res.code === 10000) {
                ElMessage.success('保存成功');
                // 跳转到列表页面，并添加refresh标志以确保数据刷新
                router.push({ path: '/Hospitalized', query: { refresh: 'true' } });
            } else {
                ElMessage.error('保存失败：' + (res.msg || '未知错误'));
            }
        } catch (error: any) {
            console.error('接口调用失败:', error);
            console.error('错误消息:', error.message);
            console.error('错误堆栈:', error.stack);
            ElMessage.error('保存失败：' + (error.message || '网络错误'));
        }
    } catch (error) {
        console.error('保存失败:', error);
        ElMessage.error('保存失败：网络错误');
    }
}

// 上传成功处理
const handleUploadSuccess = (imgUrl: string) => {
    console.log('文件上传成功：', imgUrl);
    // 可以在这里添加额外的上传成功处理逻辑
};

// 上传失败处理
const handleUploadError = (error: any) => {
    console.error('文件上传失败：', error);
    // 可以在这里添加额外的上传失败处理逻辑
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

.button-area {
    text-align: center;
}
</style>