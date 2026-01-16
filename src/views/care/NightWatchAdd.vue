<!-- NightWatchAdd.vue 子组件（完善版） -->
<template>
    <div>
        <el-dialog v-model="dialogVisible" title="新增夜巡" width="500">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="巡检地点" prop="address">
                    <el-input v-model="ruleForm.address" placeholder="请输入巡检地点" />
                </el-form-item>
                <el-form-item label="巡检状态" prop="state">
                    <el-input v-model="ruleForm.state" placeholder="请输入巡检状态" />
                </el-form-item>
                <el-form-item label="巡检记录" prop="comment">
                    <el-input v-model="ruleForm.comment" placeholder="请输入巡检记录" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="getPatrolAdd">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import type { PatrolPayload } from '../../api/nightwatch/nightwatchType';
import { ElMessage, type FormRules, type FormInstance } from 'element-plus';
import { patrolAdd } from '../../api/nightwatch/nightwatch';

// 1. 定义 model 值（接收父组件传入的 v-model）
const dialogVisible = defineModel()

// 2. 定义表单 ref（用于表单校验，可选但推荐）
const ruleFormRef = ref<FormInstance>()

// 3. 表单数据
const ruleForm = reactive<PatrolPayload>({
    address: '',
    state: '',
    comment: ''
})

// 4. 表单校验规则
const rules = reactive<FormRules<PatrolPayload>>({
    address: [
        { required: true, message: '请输入巡检地点', trigger: 'blur' },
    ],
    state: [
        { required: true, message: '请输入巡检状态', trigger: 'blur' },
    ],
    comment: [
        { required: true, message: '请输入巡检记录', trigger: 'blur' },
    ],
})

// 5. 定义自定义事件（向外派发添加成功事件，关键！）
const emit = defineEmits<{
    (e: 'save-success'): void // 定义 save-success 事件，无参数（如需传参可添加：(e: 'save-success', data: any) => void）
}>()

// 6. 提交方法（完善版，包含表单校验和事件派发）
const getPatrolAdd = async () => {
    // 可选：先进行表单校验
    if (ruleFormRef.value) {
        try {
            await ruleFormRef.value.validate()
        } catch (error) {
            ElMessage.error('表单校验失败，请完善必填项');
            return;
        }
    }

    // 提交接口请求
    try {
        const res = await patrolAdd(ruleForm)
        console.log('夜巡添加', res);
        ElMessage.success('添加成功');
        dialogVisible.value = false; // 关闭弹窗
        
        // 关键：添加成功后，派发 save-success 事件给父组件
        emit('save-success');

        // 可选：重置表单（方便下次新增）
        if (ruleFormRef.value) {
            ruleFormRef.value.resetFields();
        }
    } catch (error) {
        ElMessage.error('添加失败，请重试');
        console.error('夜巡添加失败', error);
    }
}
</script>

<style scoped lang='less'></style>