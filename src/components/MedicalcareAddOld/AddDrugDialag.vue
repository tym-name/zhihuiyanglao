<template>
    <div>
        <el-dialog v-model="ruleForm.dialogVisible" :title="ruleForm.id ? '编辑药品' : '新增药品'" width="500">
            <el-form ref="ruleFormRef" style="max-width: 350px;padding: 30px;" :model="fromDate" :rules="rules"
                label-width="auto">
                <el-form-item label="药品名称" prop="name">
                    <el-input v-model="fromDate.name" placeholder="请输入药品名称"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="counts">
                    <div style="display: flex; justify-content: space-evenly; flex: 1;">
                        <el-input type="number" :min="1" :max="100" :step="1" v-model="fromDate.counts"
                            controls-position="right" placeholder="请输入数量" />
                        <el-select style="  margin-left: 10px" v-model="fromDate.unit" placeholder="盒">
                            <el-option label="盒" value="盒" />
                            <el-option label="袋" value="袋" />
                            <el-option label="粒" value="粒" />
                        </el-select>
                    </div>
                </el-form-item>

                <el-form-item label="有效期" prop="expTime">
                    <el-date-picker v-model="fromDate.expTime" type="date" format="YYYY-MM-DD"
                        date-format="MMM DD, YYYY" style="width: 100%;" placeholder="请选择日期" />
                </el-form-item>

                <el-form-item label="剂量" prop="sum">
                    <div style="display: flex; justify-content: space-evenly; flex: 1;">
                        <el-input type="number" :min="1" :max="100" :step="1" v-model="fromDate.sum"
                            controls-position="right" placeholder="请输入剂量" />

                        <el-select style=" margin-left: 10px" v-model="fromDate.norms" placeholder="盒">
                            <el-option label="盒" value="盒" />
                            <el-option label="袋" value="袋" />
                            <el-option label="粒" value="粒" />
                        </el-select>
                    </div>
                </el-form-item>

                <el-form-item label="使用方法" prop="remarks">
                    <el-input placeholder="请输入使用方法" type="textarea" v-model="fromDate.remarks"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="submitForm(ruleFormRef)">确定</el-button>
                    <el-button @click="closeDialog">
                        取消
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { dayjs, ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref, watchEffect, watch } from 'vue';
import type { AddMedicineLogsParams, tableData } from '../../api/medicalcare/medicineLogs/medicineLogsType';


const ruleForm = defineModel<AddMedicineLogsParams>({ default: () => ({}) });

//自定义的参数
let fromDate = reactive<tableData>({});
const props = defineProps<{
    editDate: any;
    elderlyId?: number;
    familyName?: string;
    addTime?: string;
}>()

const ruleFormRef = ref<FormInstance>();

// 关闭对话框的统一方法
const closeDialog = () => {
    ruleForm.value.dialogVisible = false;
};

// 正则校验
const rules = reactive<FormRules<AddMedicineLogsParams>>({
    name: [
        { required: true, message: '请输入药品名称', trigger: 'blur' },
    ],
    counts: [
        { required: true, message: '请输入数量', trigger: 'blur' },
    ],
    unit: [
        { required: true, message: '请选择单位', trigger: 'change' }
    ],
    expTime: [
        { required: true, message: '请选择有效期', trigger: 'change' }
    ],
    sum: [
        { required: true, message: '请输入计量数值', trigger: 'blur' }
    ],
    norms: [
        { required: true, message: '请选择计量单位', trigger: 'change' }
    ],
    remarks: [
        { required: true, message: '请输入使用方法', trigger: 'blur' }
    ]
});

// 在 script setup 中添加 watchEffect，监听 ruleForm 变化并同步到 fromDate
watchEffect(() => {
    // 只有当对话框打开时，才同步数据
    if (ruleForm.value.dialogVisible) {
        // 将 ruleForm.value 中的数据（除了 dialogVisible）拷贝到 fromDate
        Object.assign(fromDate, {
            id: ruleForm.value.id || undefined,
            name: ruleForm.value.name || '',
            counts: ruleForm.value.counts || undefined,
            unit: ruleForm.value.unit || '盒',
            expTime: ruleForm.value.expTime ? new Date(ruleForm.value.expTime) : null, // DatePicker 需要 Date 对象
            sum: ruleForm.value.sum || undefined,
            norms: ruleForm.value.norms || '粒',
            remarks: ruleForm.value.remarks || '',
            // 保留其他可能的字段，如 elderlyId 等
            elderlyId: ruleForm.value.elderlyId || undefined,
        });
    }
});

// 移除了不再需要的handleClose函数


// 监听 editData 变化，更新表单数据（仅在editData有值时更新）
watch(() => props.editDate, (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
        Object.assign(fromDate, {
            ...newVal,
            expTime: newVal.expTime ? new Date(newVal.expTime) : null
        })
    }
}, { deep: true })

// 监听弹窗显示状态，如果打开且是新增模式，重置表单
watch(() => ruleForm.value.dialogVisible, (visible) => {
    if (visible && !fromDate.id) {
        // 新增模式，重置表单
        Object.assign(fromDate, {
            id: undefined,
            name: '',
            counts: undefined,
            unit: '盒',
            expTime: null,
            sum: undefined,
            norms: '粒',
            remarks: '',
        })
    }
})

// 定义一个事件  添加
const emit = defineEmits(['addMedicine']);

// 导入更新药品API
import { updateMedicineLogs } from '../../api/medicalcare/medicineLogs/medicineLogs';

const onSubmit = async () => {
    // 创建提交数据的副本，避免修改原始 fromDate 对象
    const submitData = {
        ...fromDate,
        // 确保包含所有必要的属性
        elderlyId: props.elderlyId,
        familyName: props.familyName,
        addTime: props.addTime
    };

    // 格式化有效期日期
    if (submitData.expTime) {
        const expTimeValue = submitData.expTime as any;
        if (expTimeValue instanceof Date || (typeof expTimeValue === 'object' && expTimeValue !== null && 'getTime' in expTimeValue)) {
            submitData.expTime = dayjs(expTimeValue).format('YYYY-MM-DD');
        } else if (typeof expTimeValue === 'string') {
            // 如果已经是字符串格式，确保格式正确
            submitData.expTime = dayjs(expTimeValue).format('YYYY-MM-DD');
        }
    }

    // 如果是编辑模式，调用API更新数据
    if (submitData.id) {
        try {
            await updateMedicineLogs(submitData as any);
            ElMessage.success('药品更新成功');
            ruleForm.value.dialogVisible = false;
            emit('addMedicine', submitData);
        } catch (error) {
            ElMessage.error('药品更新失败');
            console.error('更新药品失败:', error);
        }
    } else {
        // 新增模式，只更新表格数据
        ruleForm.value.dialogVisible = false;
        emit('addMedicine', submitData);
    }
};

// 点击确定  触发校验
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            // console.log('submit!');
            await onSubmit();
        } else {
            // console.log('error submit!', fields);
            ElMessage.error('请检查表单信息');
        }
    });
};
</script>

<style lang='less' scoped></style>
