<template>
    <div>
        <el-dialog v-model="dialogVisible" title="编辑体温记录" width="500" :close-on-click-modal="false">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="老人姓名" prop="elderlyName">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span v-if="ruleForm.elderlyName" style="color: #666; min-width: 150px;">
                            {{ ruleForm.elderlyName }}
                        </span>
                        <el-button @click="selectOld" v-for="button in buttons" :key="button.text" :type="button.type"
                            text bg>
                            {{ button.text }}
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="体温" prop="val">
                    <el-input v-model="ruleForm.val" placeholder="请输入体温（如：37.5）" suffix="°C"
                        @blur="formatTemperature" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="updTem" :loading="submitLoading">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <TemperatureSelect @handleSuccess2="handleAddSuccess2" v-model="showAddDialog2"></TemperatureSelect>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, type PropType } from 'vue';
import { ElMessage, type FormRules, type FormInstance } from 'element-plus';
import TemperatureSelect from './TemperatureSelect.vue';
import type { ElderlyTemperatureBasic } from '../../api/temperature/temperatureType';
import { temperatureUpdate } from '../../api/temperature/temperature';

// 1. 补充FormInstance类型定义（表单校验必备）
const ruleFormRef = ref<FormInstance>();
// 提交加载状态
const submitLoading = ref(false);

// 假设从用户信息中获取staffId，这里暂时使用默认值
const currentStaffId = ref<number>(1); // 实际项目中应从登录用户信息获取

// 弹窗显隐（兼容v-model）
const dialogVisible = defineModel<boolean>({ default: false });
const showAddDialog2 = ref(false);

// 2. 完善Props类型定义（更贴合实际业务）
interface TemperatureRecord {
    id?: number;
    elderlyId?: number;    // 补充老人ID（关键，编辑时需要）
    elderlyName?: string;
    bedName?: string;
    val?: string | number; // 兼容字符串/数字类型的体温值
    staffId?: number;      // 补充记录人ID
}

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    editData: {
        type: Object as PropType<TemperatureRecord>,
        default: () => ({}) // 改为函数式默认值，避免对象引用问题
    }
});

// 3. 完善事件定义（明确通信类型）
const emit = defineEmits(['update:modelValue', 'handleSuccess']);

// 4. 表单数据（严格类型+初始值）
const ruleForm = reactive<
    ElderlyTemperatureBasic & { staffId: number; elderlyName: string; id?: number }
>({
    id: 0,
    elderlyId: 0,
    elderlyName: '',
    val: '',
    staffId: currentStaffId.value,
});

// 5. 核心：监听editData变化，实现数据回显（关键修复）
watch(
    () => props.editData,
    (newData) => {
        if (newData && Object.keys(newData).length) {
            // 同步父组件传递的编辑数据到表单
            ruleForm.id = newData.id || 0;
            ruleForm.elderlyId = newData.elderlyId || 0; // 回显老人ID
            ruleForm.elderlyName = newData.elderlyName || ''; // 回显老人姓名
            ruleForm.val = newData.val ? String(newData.val) : ''; // 统一转为字符串，避免类型问题
            ruleForm.staffId = newData.staffId || currentStaffId.value; // 回显记录人ID
        }
    },
    { immediate: true, deep: true } // 立即执行+深度监听，确保嵌套对象变化能触发
);

// 6. 接收子组件选择的老人信息（优化逻辑）
const handleAddSuccess2 = (selectedData: any) => {
    showAddDialog2.value = false;
    if (selectedData) {
        ruleForm.elderlyId = selectedData.elderlyId || 0;
        ruleForm.elderlyName = selectedData.elderlyName || '';
        ruleForm.staffId = currentStaffId.value; // 确保记录人ID不丢失
    }
};

// 7. 完善表单校验规则（强化校验）
const rules = reactive<FormRules<typeof ruleForm>>({
    // elderlyName: [
    //     { required: true, message: '请选择老人姓名', trigger: 'change' },
    // ],
    val: [
        { required: true, message: '请输入体温', trigger: 'blur' },
        {
            pattern: /^\d+(\.\d{1,2})?$/, // 限制小数点后最多2位，更符合体温规范
            message: '请输入有效的体温数值（如：37.5，最多两位小数）',
            trigger: 'blur'
        },
        {
            validator: (rule, value, callback) => {
                // 体温范围校验（35-42℃，符合医学常识）
                const numVal = Number(value);
                if (numVal < 35 || numVal > 42) {
                    callback(new Error('体温值需在35-42℃之间'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ],
});

// 8. 新增：体温格式化（去除非数字字符，避免无效输入）
const formatTemperature = () => {
    if (ruleForm.val) {
        // 只保留数字和小数点，且确保只有一个小数点
        ruleForm.val = ruleForm.val.replace(/[^\d.]/g, '').replace(/(\.\d*)\./g, '$1');
    }
};

// 打开选择老人弹窗
const selectOld = () => {
    showAddDialog2.value = true;
};

// 9. 完善修改提交逻辑（增加表单校验、加载状态、异常处理）
const updTem = async () => {
    // 第一步：触发表单整体校验
    if (!ruleFormRef.value) return;
    let isValid = false;
    try {
        isValid = await ruleFormRef.value.validate();
    } catch (error) {
        isValid = false;
    }
    if (!isValid) return;

    // 第二步：提交数据（增加加载状态和异常处理）
    submitLoading.value = true;
    try {
        // 确保ID存在（编辑必备）
        if (!ruleForm.id) {
            ElMessage.error('缺少记录ID，无法修改！');
            submitLoading.value = false;
            return;
        }

        const res = await temperatureUpdate(ruleForm);
        console.log('修改体温成功', res);
        ElMessage.success('体温记录修改成功！');

        // 通知父组件：修改成功，触发表格刷新
        emit('handleSuccess');

        // 关闭弹窗
        dialogVisible.value = false;
        showAddDialog2.value = false;
    } catch (error) {
        console.error('修改体温失败：', error);
        ElMessage.error('体温记录修改失败，请稍后重试！');
    } finally {
        // 无论成功失败，关闭加载状态
        submitLoading.value = false;
    }
};

// 按钮配置
const buttons = [
    { type: 'primary', text: '选择老人' },
] as const;
</script>

<style scoped lang='less'></style>