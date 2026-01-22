<template>
    <div>
        <el-dialog v-model="dialogVisible" title="新增咨询登记" width="700px" :close-on-click-modal="false"
            @close="handleDialogClose">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="100px">
                <!-- 老人选择 -->
                <el-form-item label="老人姓名" prop="customerId">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span v-if="ruleForm.elderlyName" style="color: #666; min-width: 150px;">
                            {{ ruleForm.elderlyName }}
                        </span>
                        <el-button v-if="!ruleForm.elderlyName" @click="selectOld" type="primary" text bg>
                            选择老人
                        </el-button>
                    </div>
                </el-form-item>

                <!-- 咨询类型 -->
                <el-form-item label="咨询类型" prop="type">
                    <Question v-model="ruleForm.type"></Question>
                </el-form-item>

                <!-- 咨询渠道/来源 -->
                <el-form-item label="咨询渠道" prop="source">
                    <input type="radio" v-model="ruleForm.source" value="来访登记" name="source" >来访登记
                    <input type="radio" v-model="ruleForm.source" value="电话" name="source" >电话
                </el-form-item>

                <!-- 咨询人 -->
                <el-form-item label="咨询人" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入咨询人姓名" @blur="trimInput('name')" />
                </el-form-item>

                <!-- 联系电话 -->
                <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="请输入11位手机号码" @blur="checkMobileFormat" />
                </el-form-item>

                <!-- 与老人关系 -->
                <el-form-item label="与老人关系" prop="relation">
                    <oldManRelation v-model="ruleForm.relation"></oldManRelation>
                </el-form-item>

                <!-- 策划访问日期 -->
                <el-form-item label="咨询时间" prop="visitTime">
                    <el-date-picker v-model="ruleForm.visitTime" type="datetime" value-format="YYYY-MM-DD HH:mm"
                        placeholder="请选择咨询时间" style="width: 100%;" />
                </el-form-item>

                <!-- 咨询内容 -->
                <el-form-item label="咨询内容" prop="content">
                    <el-input v-model="ruleForm.content" style="width: 100%;" :rows="2" type="textarea"
                        placeholder="请详细输入咨询内容" @blur="trimInput('content')" />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 选择老人弹窗 -->
        <TemperatureSelect @handleSuccess2="handleAddSuccess2" v-model="showAddDialog2"></TemperatureSelect>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { ElMessage, type FormRules } from 'element-plus';
import TemperatureSelect from './TemperatureSelect.vue';
import Question from '../../components/form/Question.vue';
import oldManRelation from '../../components/form/oldManRelation.vue';
// 导入咨询登记相关类型和接口（替换原体温相关）
import { questionAdd } from '../../api/Question/Question';

// 表单Ref（用于手动触发校验）
const ruleFormRef = ref<any>();
// 提交加载状态
const submitLoading = ref(false);

// 弹窗显隐
const dialogVisible = defineModel<boolean>({ default: false });
const showAddDialog2 = ref(false);

// 定义事件：提交成功后通知父组件刷新列表
const emit = defineEmits(['addRefresh', 'refreshTable']);

// 表单数据（适配咨询登记类型）
const ruleForm = reactive<any>({
    customerId: 0,         // 老人ID（核心关联字段）
    customerName: '',      // 老人姓名（用于传递给后端）
    elderlyName: '',       // 老人姓名（用于展示）
    type: '',              // 咨询类型
    source: '',            // 咨询渠道/来源
    name: '',              // 咨询人姓名
    mobile: '',            // 联系电话
    relation: '',          // 与老人关系
    visitTime: '',         // 咨询时间
    content: ''            // 咨询内容
});

// 表单验证规则
const rules = reactive<FormRules>({
    customerId: [
        { required: true, message: '请选择关联的老人', trigger: 'change' }
    ],
    type: [
        { required: true, message: '请选择咨询类型', trigger: 'change' }
    ],
    source: [
        { required: true, message: '请输入咨询渠道', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入咨询人姓名', trigger: 'blur' },
    ],
    mobile: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号码', trigger: 'blur' }
    ],
    relation: [
        { required: true, message: '请选择与老人的关系', trigger: 'change' }
    ],
    visitTime: [
        { required: true, message: '请选择咨询时间', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请输入咨询内容', trigger: 'blur' }
    ]
});


// 接收子组件选择的老人信息
const handleAddSuccess2 = (selectedData: any) => {
    if (selectedData && selectedData.id) {
        ruleForm.customerId = selectedData.id;       // 赋值老人ID
        ruleForm.customerName = selectedData.name;   // 赋值老人姓名（传递给后端）
        ruleForm.elderlyName = selectedData.name;    // 赋值老人姓名（用于展示）
        showAddDialog2.value = false;                // 关闭选择弹窗
        ElMessage.success('老人选择成功');
    } else {
        ElMessage.error('未获取到有效的老人信息');
    }
};

// 打开选择老人弹窗
const selectOld = () => {
    showAddDialog2.value = true;
};

// 输入框去空格处理
const trimInput = (field: keyof typeof ruleForm) => {
    if (typeof ruleForm[field] === 'string') {
        ruleForm[field] = (ruleForm[field] as string).trim();
    }
};

// 手机号格式校验（单独提取，方便复用）
const checkMobileFormat = () => {
    const mobile = ruleForm.mobile.trim();
    if (mobile && !/^1[3-9]\d{9}$/.test(mobile)) {
        ElMessage.warning('手机号格式不正确，请检查');
    }
};

// 提交咨询登记（核心逻辑）
const handleSubmit = async () => {
    // 1. 表单前置校验
    if (!ruleFormRef.value) return;

    try {
        // 2. 执行表单验证
        await ruleFormRef.value.validate();

        // 3. 开启加载状态
        submitLoading.value = true;

        // 4. 调用咨询登记接口
        const res = await questionAdd(ruleForm);

        // 5. 结果处理
        if (res && res.code === 10000) {
            ElMessage.success('咨询登记新增成功！');
            dialogVisible.value = false; // 关闭弹窗
            emit('refreshTable');
        } else {
            ElMessage.error('新增失败：' + (res?.msg || '服务器返回异常'));
        }
    } catch (error: any) {
        // 处理表单验证失败
        if (error.name === 'ValidationError') {
            ElMessage.error('请完善表单必填项并确保格式正确');
        } else {
            console.error('咨询登记新增出错：', error);
            ElMessage.error('新增失败，请稍后重试');
        }
    } finally {
        // 关闭加载状态
        submitLoading.value = false;
    }
};

// 弹窗关闭时重置表单
const handleDialogClose = () => {
    resetForm();
};

// 重置表单数据
const resetForm = () => {
    ruleForm.customerId = 0;
    ruleForm.customerName = '';
    ruleForm.elderlyName = '';
    ruleForm.type = '';
    ruleForm.source = '';
    ruleForm.name = '';
    ruleForm.mobile = '';
    ruleForm.relation = '';
    ruleForm.visitTime = '';
    ruleForm.content = '';
    // 重置表单验证状态
    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate();
    }
};
</script>

<style scoped lang='less'>
.dialog-footer {
    text-align: right;
}

.el-form-item {
    margin-bottom: 18px;
}

// 适配选择老人区域样式
:deep(.el-button--text) {
    padding: 6px 12px;
}
</style>