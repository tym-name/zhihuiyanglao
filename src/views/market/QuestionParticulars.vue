<template>
    <!-- 动态切换弹窗标题：新增/编辑 -->
    <el-dialog v-model="dialogVisible" title="详情" width="700px" :close-on-click-modal="false"
        @close="handleDialogClose">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" label-width="100px">

            <!-- 咨询类型 -->
            <el-form-item label="咨询类型" prop="type">
                <!-- <Question v-model="ruleForm.type"></Question> -->
                <div>{{ ruleForm.type }}</div>
            </el-form-item>

            <!-- 咨询渠道/来源 -->
            <el-form-item label="咨询渠道" prop="source">
                <!--   <el-radio-group v-model="ruleForm.source" @change="handleSourceChange">
                    <el-radio label="来访登记">来访登记</el-radio>
                    <el-radio label="电话">电话</el-radio>
                </el-radio-group> -->
                <div>{{ ruleForm.source }}</div>
            </el-form-item>

            <!-- 咨询人 -->
            <el-form-item label="咨询人" prop="name">
                <!-- <el-input v-model="ruleForm.name" placeholder="请输入咨询人姓名" @blur="trimInput('name')" /> -->
                <div>{{ ruleForm.name }}</div>
            </el-form-item>

            <!-- 联系电话 -->
            <el-form-item label="联系电话" prop="mobile">
                <!-- <el-input v-model="ruleForm.mobile" placeholder="请输入11位手机号码" @blur="checkMobileFormat" /> -->
                <div>{{ ruleForm.mobile }}</div>
            </el-form-item>

            <!-- 与老人关系 -->
            <el-form-item label="与老人关系" prop="relation">
                <!-- <oldManRelation v-model="ruleForm.relation"></oldManRelation> -->
                <div>{{ ruleForm.relation }}</div>
            </el-form-item>

            <!-- 咨询时间 -->
            <el-form-item label="咨询时间" prop="visitTime">
                <!--   <el-date-picker v-model="ruleForm.visitTime" type="datetime" value-format="YYYY-MM-DD HH:mm"
                    placeholder="请选择咨询时间" style="width: 100%;" /> -->
                <div>{{ ruleForm.visitTime }}</div>
            </el-form-item>

            <!-- 咨询内容 -->
            <el-form-item label="咨询内容" prop="content">
                <!-- <el-input v-model="ruleForm.content" style="width: 100%;" :rows="2" type="textarea"
                    placeholder="请详细输入咨询内容" @blur="trimInput('content')" /> -->
                <div>{{ ruleForm.content }}</div>
            </el-form-item>
            <el-form-item label="登记人" prop="content">
                <div>{{ ruleForm.addAccountName }}</div>
            </el-form-item>
            <el-form-item label="登记日期" prop="content">
                <div>{{ ruleForm.addTime }}</div>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { reactive, ref, watch } from 'vue';
import { type FormInstance } from 'element-plus';

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
// 弹窗显隐（v-model绑定）
const dialogVisible = defineModel<boolean>({ default: false });



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
    content: '',
    addTime: '',
    addAccountName: ''
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