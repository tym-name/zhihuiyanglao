<template>
    <div>
        <el-dialog v-model="props.isShow" :title="title" width="500" :before-close="handleClose">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="老人姓名" prop="elderlyId">
                    <span v-if="ruleForm.elderlyId && ruleForm.elderlyId > 0" @click="openElderly">{{ name
                        }}</span>
                    <el-button v-else type="primary" @click="openElderly">选择老人</el-button>
                </el-form-item>
                <el-form-item label="精神" prop="spirit">
                    <el-input v-model="ruleForm.spirit" placeholder="请输入精神" />
                </el-form-item>
                <el-form-item label="饮食" prop="diet">
                    <el-input v-model="ruleForm.diet" placeholder="请输入饮食" />
                </el-form-item>
                <el-form-item label="睡眠" prop="sleep">
                    <el-input v-model="ruleForm.sleep" placeholder="请输入睡眠" />
                </el-form-item>
                <el-form-item label="大便" prop="shit">
                    <el-input v-model="ruleForm.shit" placeholder="请输入大便" />
                </el-form-item>
                <el-form-item label="小便" prop="urinate">
                    <el-input v-model="ruleForm.urinate" placeholder="请输入小便" />
                </el-form-item>
                <el-form-item label="交流" prop="communicate">
                    <el-input v-model="ruleForm.communicate" placeholder="请输入交流" />
                </el-form-item>
                <el-form-item label="记忆" prop="memory">
                    <el-input v-model="ruleForm.memory" placeholder="请输入记忆" />
                </el-form-item>
                <el-form-item label="体温" prop="temperature">
                    <el-input v-model="ruleForm.temperature" placeholder="请输入体温" />
                </el-form-item>
                <el-form-item label="脉搏" prop="pulse">
                    <el-input v-model="ruleForm.pulse" placeholder="请输入脉搏" />
                </el-form-item>
                <el-form-item label="呼吸" prop="breathe">
                    <el-input v-model="ruleForm.breathe" placeholder="请输入呼吸" />
                </el-form-item>
                <el-form-item label="血压" prop="blood">
                    <el-input v-model="ruleForm.blood" placeholder="请输入血压" />
                </el-form-item>
                <el-form-item label="医生建议" prop="suggest">
                    <el-input v-model="ruleForm.suggest" placeholder="请输入医生建议" />
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
import type { ElderlyListItem } from '../../../api/care/activity/activityType';
import ChoseOneElderly from '../../choseelderly/ChoseOneElderly.vue';
import type { AddOrUpdateCheckRoomParams, checkRoomListItem } from '@/api/medicalcare/checkroom/checkroomType';
import { addCheckroom, updateCheckroom } from '@/api/medicalcare/checkroom/checkroom';



// Props定义
const props = defineProps<{
    isShow: boolean;
    OpenOrClose: () => void;
    oneCheckRoomData: checkRoomListItem;
    refresh: () => void;
}>();

// 响应式数据
const ruleFormRef = ref<FormInstance>();
const elderlyDialogVisible = ref(false);
const name = ref('');

// 表单数据
const ruleForm = ref<AddOrUpdateCheckRoomParams>({
    id: 0,
    elderlyId: null,
    spirit: "",
    diet: "",
    sleep: "",
    shit: "",
    urinate: "",
    communicate: "",
    memory: "",
    temperature: "",
    pulse: "",
    breathe: "",
    blood: "",
    suggest: "",

});


// 表单验证规则
const rules = reactive<FormRules<AddOrUpdateCheckRoomParams>>({
    elderlyId: [
        { required: true, message: '请选择老人姓名', trigger: ['change', 'blur'] },
    ],
    spirit: [
        { required: true, message: '请输入精神状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    diet: [
        { required: true, message: '请输入饮食状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    sleep: [
        { required: true, message: '请输入睡眠状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    shit: [
        { required: true, message: '请输入大便状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    urinate: [
        { required: true, message: '请输入小便状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    communicate: [
        { required: true, message: '请输入交流状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    memory: [
        { required: true, message: '请输入记忆状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    temperature: [
        { required: true, message: '请输入体温状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    pulse: [
        { required: true, message: '请输入脉搏状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    breathe: [
        { required: true, message: '请输入呼吸状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    blood: [
        { required: true, message: '请输入血压状态', trigger: ['change', 'blur'] },
        {
            pattern: /^(正常|异常)$/,
            message: '请输入“正常”或“异常”',
            trigger: 'blur'
        }
    ],
    suggest: [
        { required: true, message: '请输入医生建议', trigger: ['change', 'blur'] },
    ],
});

// 对话框标题
const title = computed(() => ruleForm.value.id ? '修改医生查房记录记录' : '增加医生查房记录');

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
watch(() => props.oneCheckRoomData, (newValue) => {
    // 只有当对话框显示且oneBloodData.id大于0时才更新表单数据，避免添加时触发验证
    if (props.isShow && newValue.id > 0) {
        name.value = newValue.elderlyName;
        ruleForm.value.id = newValue.id;
        ruleForm.value.elderlyId = newValue.elderlyId;
        ruleForm.value.spirit = newValue.spirit;
        ruleForm.value.diet = newValue.diet;
        ruleForm.value.sleep = newValue.sleep;
        ruleForm.value.shit = newValue.shit;
        ruleForm.value.urinate = newValue.urinate;
        ruleForm.value.communicate = newValue.communicate;
        ruleForm.value.memory = newValue.memory;
        ruleForm.value.temperature = newValue.temperature;
        ruleForm.value.pulse = newValue.pulse;
        ruleForm.value.breathe = newValue.breathe;
        ruleForm.value.blood = newValue.blood;
        ruleForm.value.suggest = newValue.suggest;

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
                const res = await updateCheckroom(ruleForm.value)
                if (!res) return
                ElMessage.success("修改成功")
            } else {
                const res = await addCheckroom(ruleForm.value)
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
        spirit: "",
        diet: "",
        sleep: "",
        shit: "",
        urinate: "",
        communicate: "",
        memory: "",
        temperature: "",
        pulse: "",
        breathe: "",
        blood: "",
        suggest: "",
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