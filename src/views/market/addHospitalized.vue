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
                <bed ref="bedRef" @dayslink="dayslink" @daysres="daysres"></bed>
                <!-- 餐饮膳食 -->
                <food ref="foodRef" :daysfoodRef="daysfoodRef" @foodmonkey="foodmonkey"></food>
                <!-- 护理服务 -->
                <nurse ref="nurseRef" :daysfoodRef="daysfoodRef" @nursemonkey="nursemon"></nurse>
                <!-- 服务项目 -->
                <serve ref="serveRef" v-model="formData.services"></serve>
                <!-- 其他收费 -->
                <elses ref="elsesRef" @depositmonkey="depositmonkey" @livingExpensemonkey="livingExpensemonkey"></elses>
                <!-- 入院费用核定周期设置 -->
                <kernel ref="kernelRef"></kernel>
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
                <allCost 
                  :bedFee="costData.bedFee" 
                  :foodFee="costData.foodFee" 
                  :nurseFee="costData.nurseFee" 
                  :deposit="costData.deposit" 
                  :livingExpense="costData.livingExpense"
                ></allCost>
                <!-- 入院费用核定 -->
                <hospitalCost></hospitalCost>
                <!-- 上传合同组件 -->
                <photo v-model="image" @upload-success="handleUploadSuccess" @upload-error="handleUploadError"></photo>
                <!-- 按钮区域 -->
                <div class="button-area">
                    <el-button type="primary" @click="upStep">上一步</el-button>
                    <el-button type="primary" @click="saveTemp">保存暂不提交</el-button>
                    <el-button type="primary" @click="savaSub">保存并提交</el-button>
                    <el-button>返回</el-button>
                </div>
            </div>
        </el-form>
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
import orderForm from '../../components/Hospitalized/orderForm.vue';
import photo from '../../components/Hospitalized/photo.vue';
import allCost from '../../components/Hospitalized/allCost.vue';
import hospitalCost from '../../components/Hospitalized/hospitalCost.vue';
import router from '../../router';


// 接收HospitalizedAdd组件传来的数据
const route = useRoute();

// 老人信息
const elderlyInfo = reactive({
    id:'',
    name: '',
    idCard: '',
    photo: ''
});
/* 子串父 */
const daysfoodRef = ref(0)
const dayslink = (days: number) => {
    daysfoodRef.value = days;
}

const daysres = (sum: number) => {
   costData.bedFee=sum
}
const foodmonkey = (sum: number) => {
    costData.foodFee=sum
}
const nursemon = (sum: number) => {
    costData.nurseFee=sum
}
const depositmonkey = (sum: number) => {
    costData.deposit=sum
}
const livingExpensemonkey = (sum: number) => {
    costData.livingExpense=sum
}
const isshow = ref(false);

onMounted(() => {
    console.log('路由参数111:', route.query);
    // 从路由参数获取老人信息
    Object.assign(elderlyInfo, route.query);
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
// 计算属性：将逗号分隔的图片地址转为数组，处理完整URL
const imageList = computed(() => {
    if (!image.value) return [];
    // 分割图片地址并过滤空值
    return image.value.split(',').filter(url => url.trim()).map(url => {
        // 确保图片地址是完整的URL（处理相对路径/绝对路径）
        return url.startsWith('http') ? url : VITE_IMG_URL + url;
    });
});

//返回按钮
const goBack = () => {
    router.push({ path: '/Hospitalized' });
}

// 获取路由实例
// const route = useRoute();
console.log('路由信息：', route);

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
    ]

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

//上一步按钮
const upStep = () => {
    isshow.value = false;
}

//保存暂不提交
const saveTemp = () => {

}
//保存并提交
const savaSub = () => {

}

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

// 费用相关数据
const costData = reactive({
  bedFee: 0, // 床位费
  foodFee: 0, // 伙食费
  nurseFee: 0, // 护理费
  deposit: 0, // 押金
  livingExpense: 0 // 一次性生活费
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