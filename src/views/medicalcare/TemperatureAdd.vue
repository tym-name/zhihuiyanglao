<template>
    <div>
        <el-dialog v-model="dialogVisible" title="增加体温记录" width="500" :close-on-click-modal="false">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="老人姓名" prop="elderlyName">
                    <!-- 显示已选老人姓名，提升用户体验 -->
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span v-if="ruleForm.elderlyName" style="color: #666; min-width: 150px;">
                            {{ ruleForm.elderlyName }}
                        </span>
                        <el-button v-if="!ruleForm.elderlyName" @click="selectOld" v-for="button in buttons" :key="button.text" :type="button.type"
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
                    <el-button type="primary" @click="addTem" :loading="submitLoading">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <TemperatureSelect @handleSuccess2="handleAddSuccess2" v-model="showAddDialog2"></TemperatureSelect>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { ElMessage, type FormRules } from 'element-plus';
import TemperatureSelect from './TemperatureSelect.vue';
import type { ElderlyTemperatureBasic } from '../../api/temperature/temperatureType';
import { temperatureAdd } from '../../api/temperature/temperature';

// 表单Ref（用于手动触发校验）
// const ruleFormRef = ref<FormInstance>();
// 提交加载状态

const submitLoading = ref(false);

const emit = defineEmits(['addRefresh']);

// 假设从用户信息中获取staffId，这里暂时使用默认值
const currentStaffId = ref<number>(1); // 实际项目中应从登录用户信息获取

// 弹窗显隐
const dialogVisible = defineModel<boolean>({ default: false });
const showAddDialog2 = ref(false);

// 表单数据（补充完整字段，明确类型）
const ruleForm = reactive<
    ElderlyTemperatureBasic & { staffId: number; elderlyName: string }
>({
    elderlyId: 0,        // 老人ID（必填）
    elderlyName: '',     // 老人姓名（用于显示）
    val: '',             // 体温值
    staffId: currentStaffId.value // 记录人ID（必填）
});

// 接收子组件选择的老人信息
const handleAddSuccess2 = (selectedData: any) => {
    showAddDialog2.value = false;
    if (selectedData) {
        ruleForm.elderlyId = selectedData.elderlyId || 0;
        ruleForm.elderlyName = selectedData.elderlyName || '';
    }
};

// 表单校验规则（恢复并强化）
const rules = reactive<FormRules<typeof ruleForm>>({
    elderlyName: [
        { required: true, message: '请选择老人姓名', trigger: 'change' },
    ],
    val: [
        { required: true, message: '请输入体温', trigger: 'blur' },
        {
            pattern: /^\d+(\.\d+)?$/,
            message: '请输入有效的体温数值（如：37.5）',
            trigger: 'blur'
        },
    ],
});

// 打开选择老人弹窗
const selectOld = () => {
    showAddDialog2.value = true;
    // 注释掉关闭父弹窗，避免用户选择老人后找不到提交入口
    // dialogVisible.value = false;
};

// 格式化体温（去除非数字，仅保留数值）
const formatTemperature = () => {
    ruleForm.val = ruleForm.val.replace(/[^\d.]/g, '');
};

// 提交体温记录（核心修复）
const addTem = async () => {
    try {
        const submitData = {
            elderlyId: ruleForm.elderlyId,
            val: ruleForm.val, // 若后端要求纯数字，可转Number：Number(ruleForm.val)
            staffId: ruleForm.staffId
        };
        const res = await temperatureAdd(submitData);

        // 5. 兼容不同的成功码（根据实际接口调整）
        const successCodes = [200, 0, 10000]; // 常见的接口成功码
        if (res && successCodes.includes(res.code)) {
            ElMessage.success('体温记录添加成功！');
            dialogVisible.value = false;
            // 重置表单
            resetForm();
        } else {
            ElMessage.error(res?.msg || '添加失败：接口返回异常');
        }
    } catch (error: any) {
        // 捕获网络错误/接口报错
        console.error('添加体温记录失败：', error);
        ElMessage.error(`添加失败：${error.message || '网络异常，请稍后重试'}`);
    } finally {
        // 关闭加载状态
        submitLoading.value = false;
    }
    emit('addRefresh');
};

// 重置表单
const resetForm = () => {
    ruleForm.elderlyId = 0;
    ruleForm.elderlyName = '';
    ruleForm.val = '';
};

// 按钮配置
const buttons = [
    { type: 'primary', text: '选择老人' },
] as const;
</script>

<style scoped lang='less'></style>