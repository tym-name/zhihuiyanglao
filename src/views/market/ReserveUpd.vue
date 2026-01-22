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
                            <el-input v-model.number="formData.day" placeholder="请输入预定时长" type="number" clearable
                                min="1" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="定金应收:" prop="amount">
                            <el-input v-model.number="formData.amount" placeholder="请输入定金应收" type="number" clearable
                                min="0" step="0.01" />
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import oldManRelation from '../../components/form/oldManRelation.vue';
import CascaderBeg from '../../components/form/CascaderBeg.vue';
import uploads from '../../components/upload/Uploads.vue';
// 新增：导入获取单条预定信息的接口（需根据实际接口名调整）
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
    // bed: [
    //     { required: true, message: '请选择床位', trigger: 'change' }
    // ],
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

// 床位变更回调
// 修改bedChange函数中的赋值逻辑
const bedChange = (idArr: string[]) => {
    formData.bed = idArr[idArr.length - 1] || ''; // 将0改为''
    console.log('床位更新：', formData.bed);
};

// 新增：获取预定详情（用于回显）
const getReservationInfo = async () => {
    // 获取路由中的编辑ID（优先params，其次query），并进行类型转换
    const id = route.query.id || route.params.id;

    console.log('id', id);

    const res = await reservationGet(Number(id));
    console.log('单条预订信息', res);

    const detail = <any>res.data;
    // 基础信息回显
    formData.id = detail.id; // 保存记录ID（提交修改时需要）
    formData.bed = detail.bed || '';
    formData.elderlyId = detail.elderlyId || 0; // 修正类型：应该是 number
    formData.name = detail.name || '';
    formData.mobile = detail.mobile || '';
    formData.relation = detail.relation || '';
    formData.startDate = detail.startDate || '';
    formData.day = detail.day || 0; // 修正类型：应该是 number
    formData.amount = detail.amount || 0; // 修正类型：应该是 number
    formData.files = detail.files || [];

    // 上传图片回显（根据uploads组件的回显规则处理）
    if (detail.files && detail.files.length > 0) {
        // 拼接图片地址（根据实际返回格式调整）
        image.value = detail.files.map((item: any) => VITE_IMG_URL + item.file).join(',');
        // 如果上传组件需要初始化已上传文件，调用组件方法
        if (uploadRef.value && typeof uploadRef.value.initFiles === 'function') {
            uploadRef.value.initFiles(detail.files);
        }
    }
};

// 组件挂载时：1.获取老人ID 2.编辑场景加载详情回显
onMounted(() => {
    // 获取路由中的elderlyId（老人ID）
    const elderlyIdParam = route.query.elderlyId || route.params.elderlyId;
    console.log('老人id', elderlyIdParam);

    if (elderlyIdParam) {
        // 类型转换：将字符串转换为数字
        const elderlyIdNumber = Array.isArray(elderlyIdParam)
            ? Number(elderlyIdParam[0])
            : Number(elderlyIdParam);

        if (!isNaN(elderlyIdNumber)) {
            formData.elderlyId = elderlyIdNumber;
        }
    }

    // 编辑场景：加载已有数据回显
    getReservationInfo();
});

// 完善：提交方法（包含验证、加载、错误处理、图片整合）
// 修改handleSubmit方法中的数据处理部分
const handleSubmit = async () => {
    // 1. 表单前置验证
    if (!formRef.value) return;
    try {
        await formRef.value.validate(); // 触发表单验证
    } catch (error) {
        ElMessage.warning('请完善必填项后提交');
        return;
    }

    // 2. 确认提交（增加二次确认）
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

    // 3. 处理提交数据
    submitting.value = true; // 开启加载状态
    try {
        // 整合上传图片数据（确保符合接口定义）
        const submitData = {
            ...formData,
            // 处理图片数据：只保留file字段，符合ReserveRelationInfo接口定义
            files: image.value
                ? image.value.split(',').map(url => ({
                    file: url.replace(VITE_IMG_URL, '') // 去掉域名，保留相对路径
                }))
                : []
        };

        // 4. 调用接口
        // 编辑场景：调用修改接口
        let res = await reservationUpdate(submitData);
        console.log('修改预定登记', res);


        // 5. 结果处理
        ElMessage.success(formData.id ? '修改成功' : '新增成功');
        // 提交成功后返回列表页（根据实际路由调整）
        router.push({ path: '/Reserve', query: { elderlyId: formData.elderlyId } });
    } catch (error) {
        console.error('提交预定信息失败：', error);
        ElMessage.error('提交失败，请检查网络或联系管理员');
    } finally {
        submitting.value = false; // 关闭加载状态
    }

};

// 完善：取消/重置逻辑
// 修改handleCancel函数中的Object.assign部分
const handleCancel = () => {
    ElMessageBox.confirm(
        '取消后表单数据将重置，是否确认？',
        '取消操作',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info'
        }
    ).then(async () => {
        // 1. 重置表单验证状态
        if (formRef.value) {
            formRef.value.resetFields();
        }

        // 2. 重置表单数据（保留elderlyId）
        const keepElderlyId = formData.elderlyId; // 保留老人ID
        Object.assign(formData, {
            id: undefined,
            name: '',
            mobile: '',
            relation: '',
            bed: '',  // 只保留这一行，删除重复的bed属性
            startDate: '',
            day: null,
            amount: null,
            files: []
        });
        formData.elderlyId = keepElderlyId;

        // 3. 重置图片和上传组件
        image.value = '';
        if (uploadRef.value && typeof uploadRef.value.clearFiles === 'function') {
            uploadRef.value.clearFiles();
        }

        ElMessage.info('已取消当前操作，表单已重置');
    }).catch(() => {
        ElMessage.info('已取消重置');
    });

    router.push({ path: '/Reserve', });
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
</style>