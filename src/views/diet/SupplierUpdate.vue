<template>
    <div>
        <el-dialog v-model="dialogVisible" title="编辑供应商" width="500">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="供应商名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="供应商名称" />
                </el-form-item>
                <el-form-item label="联系人" prop="linkMan">
                    <el-input v-model="ruleForm.linkMan" placeholder="请输入联系人" />
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="请输入联系电话" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="handleUpdate">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import type { FormRules, FormInstance } from 'element-plus';
import { reactive, watch, ref, onMounted } from 'vue';
import type { SupplierInfo } from '../../api/supplier/SupplierType';
import { supplierGet, supplierUpdate } from '../../api/supplier/Supplier';
import { ElMessage } from 'element-plus';

// 定义表单引用，用于表单校验
const ruleFormRef = ref<FormInstance>();

// let formRef = defineProps<{ handleSuccess: any }>()


const props = defineProps<{
    supplierId: number; // 明确接收的ID类型
    refreshList: Function
}>();

onMounted(() => {
    // 获取供应商数据
    getSupplier(props.supplierId);
});

// 定义弹窗显隐的双向绑定
const dialogVisible = defineModel<boolean>();

// 定义事件，用于通知父组件修改成功
const emit = defineEmits(['update-success']);

// 表单校验规则
const rules = reactive<FormRules<SupplierInfo>>({
    name: [
        { required: true, message: '请输入供应商名称', trigger: 'blur' },
    ],
    linkMan: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
    ],
    mobile: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
    ],
});

// 表单数据模型
let ruleForm = reactive<SupplierInfo>({
    id: 0,
    companyId: 0,
    name: '',
    linkMan: '',
    mobile: '',
    foodCounts: 1
});

// 重置表单方法
const resetForm = () => {
    ruleForm.id = 0;
    ruleForm.companyId = 0;
    ruleForm.name = '';
    ruleForm.linkMan = '';
    ruleForm.mobile = '';
    ruleForm.foodCounts = 1;
    // 清空表单校验状态
    ruleFormRef.value?.clearValidate();
};

// 取消按钮处理
const handleCancel = () => {
    dialogVisible.value = false;
    // 关闭弹窗时重置表单
    resetForm();
    // formRef.handleSuccess()
};


const getSupplier = async (id: number) => {
    let res = await supplierGet(id)
    console.log('根据id获取供应商', res);
    // 修复：直接对响应式对象的属性进行赋值
    Object.assign(ruleForm, res.data);
    // 实现回显
}

// 提交修改处理
const handleUpdate = async () => {
    // 1. 先进行表单校验
    try {
        await ruleFormRef.value?.validate();

        // 2. 校验通过，调用修改接口
        const res = await supplierUpdate(ruleForm);
        console.log('修改供应商返回结果:', res);

        // 3. 处理接口返回
        if (res && res.code === 10000) { // 根据实际接口返回格式调整
            ElMessage.success('供应商修改成功！');
            dialogVisible.value = false;
            props.refreshList()
            /* emit('update-success'); // 通知父组件刷新列表 */
            // formRef.handleSuccess()
            resetForm(); // 重置表单
        }
    } catch (error) {
        // 表单校验失败
        ElMessage.warning('请填写正确的表单信息！');
        console.error('表单校验失败:', error);
    }
};

// 监听弹窗关闭事件，确保表单重置
watch(dialogVisible, (isVisible) => {
    if (!isVisible) {
        resetForm();
    }
});
</script>

<style scoped lang='less'>
.dialog-footer {
    text-align: right;
}
</style>