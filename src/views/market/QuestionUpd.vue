<template>
    <!-- 动态切换弹窗标题：新增/编辑 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑咨询登记' : '新增咨询登记'" width="700px" :close-on-click-modal="false"
        @close="handleDialogClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="100px">
            <!-- 老人选择 -->
            <el-form-item label="老人姓名" prop="customerId">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span v-if="ruleForm.elderlyName" style="color: #666; min-width: 150px;">
                        {{ ruleForm.elderlyName }}
                    </span>
                    <span v-else style="color: #999; min-width: 150px;">
                        未选择老人
                    </span>
                    <el-button @click="selectOld" type="primary" text bg>
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
                <el-radio-group v-model="ruleForm.source" @change="handleSourceChange">
                    <el-radio label="来访登记">来访登记</el-radio>
                    <el-radio label="电话">电话</el-radio>
                </el-radio-group>
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

            <!-- 咨询时间 -->
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
                    {{ isEdit ? '保存修改' : '提交' }}
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 选择老人弹窗 -->
    <TemperatureSelect @handleSuccess2="handleAddSuccess2" v-model="showAddDialog2"></TemperatureSelect>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, computed } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import TemperatureSelect from './TemperatureSelect.vue';
import Question from '../../components/form/Question.vue';
import oldManRelation from '../../components/form/oldManRelation.vue';
import { questionUpdate, questionAdd } from '../../api/Question/Question'; // 补充新增接口

// 1. 接收父组件传递的编辑数据（修复命名+类型）
const props = defineProps({
    // 编辑数据（对象类型，默认空对象）
    editData: {
        type: Object,
        required: false,
        default: () => ({})
    }
});

// 2. 定义emit事件
const emit = defineEmits(['addRefresh', 'update:dialogVisible', 'refreshTable'],);

// 3. 表单Ref（修正类型为FormInstance）
const ruleFormRef = ref<FormInstance>();
// 提交加载状态
const submitLoading = ref(false);
// 弹窗显隐（v-model绑定）
const dialogVisible = defineModel<boolean>({ default: false });
// 选择老人弹窗显隐
const showAddDialog2 = ref(false);

// 4. 判断是否为编辑场景（计算属性）
const isEdit = computed(() => {
    return !!props.editData.id; // 有id即为编辑，否则为新增
});

// 5. 表单数据
const ruleForm = reactive<any>({
    id: 0,                  // 咨询记录ID（编辑时必传）
    customerId: 0,          // 老人ID
    elderlyName: '',        // 老人姓名
    type: '',               // 咨询类型
    source: '',             // 咨询渠道
    name: '',               // 咨询人
    mobile: '',             // 联系电话
    relation: '',           // 与老人关系
    visitTime: '',          // 咨询时间
    content: ''             // 咨询内容
});

// 6. 监听父组件传递的编辑数据，实现回显
watch(
    () => props.editData,
    (newVal) => {
        if (!newVal || !newVal.id) return;

        // 重置表单验证状态（避免回显后残留旧验证提示）
        if (ruleFormRef.value) {
            ruleFormRef.value.clearValidate();
        }

        // 回显数据（深拷贝，避免修改父组件数据）
        Object.assign(ruleForm, JSON.parse(JSON.stringify(newVal)));
    },
    { immediate: true, deep: true } // 立即执行+深度监听
);

// 7. 表单验证规则
const rules = reactive<FormRules>({
    customerId: [
        { required: true, message: '请选择关联的老人', trigger: 'change' }
    ],
    type: [
        { required: true, message: '请选择咨询类型', trigger: 'change' }
    ],
    source: [
        { required: true, message: '请选择咨询渠道', trigger: 'change' }
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
        { required: true, message: '请输入咨询内容', trigger: 'blur' },
    ]
});

// 8. 接收子组件选择的老人信息
const handleAddSuccess2 = (selectedData: any) => {
    if (selectedData && selectedData.id) {
        ruleForm.customerId = selectedData.id;
        ruleForm.elderlyName = selectedData.name;
        showAddDialog2.value = false;
        ElMessage.success('老人选择成功');
    } else {
        ElMessage.error('未获取到有效的老人信息');
    }
};

// 9. 打开选择老人弹窗
const selectOld = () => {
    showAddDialog2.value = true;
};

// 10. 输入框去空格处理
const trimInput = (field: keyof typeof ruleForm) => {
    if (typeof ruleForm[field] === 'string') {
        ruleForm[field] = (ruleForm[field] as string).trim();
    }
};

// 11. 手机号格式校验
const checkMobileFormat = () => {
    const mobile = ruleForm.mobile.trim();
    if (mobile && !/^1[3-9]\d{9}$/.test(mobile)) {
        ElMessage.warning('手机号格式不正确，请检查');
    }
};

// 12. 咨询渠道变更处理
const handleSourceChange = (value: string) => {
    console.log('选择的咨询渠道：', value);
};


// 13. 核心：提交/修改逻辑（区分新增/编辑）
const handleSubmit = async () => {
    if (!ruleFormRef.value) return;

    try {
        // 表单验证
        await ruleFormRef.value.validate();

        // 二次确认
        await ElMessageBox.confirm(
            isEdit ? '确定要保存修改的咨询登记信息吗？' : '确定要提交这条咨询登记信息吗？',
            isEdit ? '修改确认' : '提交确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );

        submitLoading.value = true;

        // 区分新增/编辑接口
        let res;
        if (isEdit.value) {
            // 编辑：调用更新接口
            res = await questionUpdate(ruleForm);
        } else {
            // 新增：调用新增接口（删除id字段，避免传递）
            const { id, ...addData } = ruleForm;
            res = await questionAdd(addData);
        }

        // 结果处理
        if (res && res.code === 10000) {
            ElMessage.success(isEdit.value ? '咨询登记修改成功！' : '咨询登记提交成功！');
            dialogVisible.value = false;
            emit('addRefresh'); // 通知父组件刷新列表
        } else {
            ElMessage.error((isEdit.value ? '修改' : '提交') + '失败：' + (res?.msg || '服务器返回异常'));
        }
    } catch (error: any) {
        if (error === 'cancel') {
            ElMessage.info('已取消' + (isEdit.value ? '修改' : '提交'));
        } else if (error.name === 'ValidationError') {
            ElMessage.error('请完善表单必填项并确保格式正确');
        } else {
            console.error('咨询登记操作出错：', error);
            ElMessage.error((isEdit.value ? '修改' : '提交') + '失败，请稍后重试');
        }
    } finally {
        submitLoading.value = false;
    }
    emit('refreshTable');
};

// 14. 弹窗关闭时重置表单
const handleDialogClose = () => {
    resetForm();
};

// 15. 重置表单数据
const resetForm = () => {
    // 清空表单
    ruleForm.id = 0;
    ruleForm.customerId = 0;
    ruleForm.elderlyName = '';
    ruleForm.type = '';
    ruleForm.source = '';
    ruleForm.name = '';
    ruleForm.mobile = '';
    ruleForm.relation = '';
    ruleForm.visitTime = '';
    ruleForm.content = '';

    // 重置验证状态
    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate();
        ruleFormRef.value.resetFields();
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

:deep(.el-button--text) {
    padding: 6px 12px;
}

:deep(.el-radio-group) {
    display: flex;
    gap: 20px;
    align-items: center;
}

:deep(.el-textarea__inner) {
    resize: vertical;
}
</style>