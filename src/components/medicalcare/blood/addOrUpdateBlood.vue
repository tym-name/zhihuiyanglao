<template>
    <div>
        <el-dialog v-model="props.isShow" :title="title" width="500" :before-close="handleClose">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="老人姓名" prop="elderlyId">
                    <span v-if="ruleForm.elderlyId && ruleForm.elderlyId > 0" @click="openElderly">{{ name
                    }}</span>
                    <el-button v-else type="primary" @click="openElderly">选择老人</el-button>
                </el-form-item>
                <el-form-item label="血压" prop="bloodPressure">
                    <el-input v-model="ruleForm.bloodPressure" placeholder="请输入血压" />
                </el-form-item>
                <el-form-item label="脉搏" prop="pulse">
                    <el-input v-model="ruleForm.pulse" placeholder="请输入脉搏" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="props.OpenOrClose">取消</el-button>
                    <el-button type="primary" @click="submit">确认</el-button>
                </div>
            </template>
        </el-dialog>
        <ChoseOneElderly :isShow="elderlyDialogVisible" :openElderly="openElderly" :closeElderly="closeElderly"
            @select-elderly="onElderlySelected">
        </ChoseOneElderly>
    </div>
</template>

<script setup lang='ts'>
// 导入依赖
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import type { bloodAddOrUpdateParams, bloodItem } from '../../../api/medicalcare/blood/bloodType';
import type { ElderlyListItem } from '../../../api/care/activity/activityType';
import ChoseOneElderly from '../../choseelderly/ChoseOneElderly.vue';
import { addBlood, updateBlood } from '@/api/medicalcare/blood/blood';



// Props定义
const props = defineProps<{
    isShow: boolean;
    OpenOrClose: () => void;
    oneBloodData: bloodItem;
    refresh: () => void;
}>();

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const elderlyDialogVisible = ref(false);
const name = ref('');

// 表单数据
const ruleForm = ref<bloodAddOrUpdateParams>({
    id: 0,
    elderlyId: null,
    bloodPressure: '',
    pulse: '',
});



// 表单验证规则
const rules = reactive<FormRules<bloodAddOrUpdateParams>>({
    elderlyId: [
        { required: true, message: '请选择老人姓名', trigger: ['change', 'blur'] },
    ],
    bloodPressure: [
        { required: true, message: '请输入血压', trigger: ['change', 'blur'] },
    ],
    pulse: [
        { required: true, message: '请输入脉搏', trigger: ['change', 'blur'] },
    ],
});

// 对话框标题
const title = computed(() => ruleForm.value.id ? '修改血压记录' : '添加血压记录');

// 关闭对话框处理
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('你确定要关闭此对话框吗?')
        .then(() => {
            done();
        })
        .catch(() => {
            // 取消关闭
        });
};

// 切换老人选择对话框
const openElderly = () => {
    elderlyDialogVisible.value = true
}
const closeElderly = () => {
    elderlyDialogVisible.value = false
}

// 老人选择回调
const onElderlySelected = (elderly: ElderlyListItem) => {
    name.value = elderly.name;
    ruleForm.value.elderlyId = elderly.id;
    elderlyDialogVisible.value = false; // 选择后自动关闭对话框
    // 选择老人后手动触发表单验证
    ruleFormRef.value?.validateField('elderlyId');
};


// 监听oneBloodData变化，初始化表单
watch(() => props.oneBloodData, (newValue) => {
    // 只有当对话框显示且oneBloodData.id大于0时才更新表单数据，避免添加时触发验证
    if (props.isShow && newValue.id > 0) {
        name.value = newValue.elderlyName;
        ruleForm.value.id = newValue.id;
        ruleForm.value.elderlyId = newValue.elderlyId;
        ruleForm.value.bloodPressure = newValue.bloodPressure;
        ruleForm.value.pulse = newValue.pulse;
    }
}, { immediate: true, deep: true }); // 增加deep:true，确保对象属性变化能被监听到

// 提交表单处理
const submit = async () => {
    // 表单验证
    if (!ruleFormRef.value) return
    await ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            //根据id来判断是添加还是修改
            if (ruleForm.value.id) {
                const res = await updateBlood(ruleForm.value)
                if (!res) return
                ElMessage.success("修改成功")
            } else {
                const res = await addBlood(ruleForm.value)
                if (!res) return
                ElMessage.success("添加成功")
            }
            //关闭对话框
            props.OpenOrClose()
            props.refresh()
            //清空表单数据
            resetForm()
        }
    })
}

// 重置表单
const resetForm = () => {
    ruleFormRef.value?.resetFields()
    name.value = ''
    // 重置表单数据到初始状态
    ruleForm.value = {
        id: 0,
        elderlyId: null,
        bloodPressure: '',
        pulse: ''
    }
}

// 监听isShow变化，当对话框关闭时重置表单
watch(() => props.isShow, (newValue) => {
    if (!newValue) {
        resetForm()
    }
})
</script>

<style scoped lang='less'></style>