<template>
    <div>
        <!-- 动态切换弹窗标题 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑房型' : '新增房型'" width="500">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="房型名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入房型名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <!-- 动态切换提交/更新按钮 -->
                    <el-button type="primary" @click="getPatrolAdd">
                        提交
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
// 导入新增+更新接口
import type { House } from '@/api/houseType/houseType';
import { housetypeAdd, housetypeUpdate } from '@/api/houseType/house';

// 1. 弹窗显隐双向绑定
const dialogVisible = defineModel()

// 2. 接收父组件传递的编辑数据
const props = defineProps<{
    editData?: House;
}>()

// 3. 定义表单相关
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<House>({
    name: "",
    id: 0
})

// 4. 区分新增/编辑状态
const isEdit = ref(false)

// 5. 表单校验规则
const rules = reactive<FormRules<House>>({
    name: [
        { required: true, message: '请输入房型名称', trigger: 'blur' },
    ]
})

// 6. 定义成功事件派发
const emit = defineEmits<{
    (e: 'save-success'): void
}>()

// 7. 表单重置方法
const resetForm = () => {
    ruleForm.name = "";
    ruleForm.id = 0;
    ruleFormRef.value?.clearValidate();
}

// 8. 监听编辑数据，实现回显/重置
watch(() => props.editData, (newVal) => {
    if (newVal) {
        isEdit.value = true;
        Object.assign(ruleForm, newVal); // 批量赋值回显
        console.log("子组件接收的编辑数据：", newVal);
    } else {
        isEdit.value = false;
        resetForm(); // 新增状态重置表单
    }
}, { immediate: true })

// 可选：弹窗关闭时重置表单
watch(dialogVisible, (newVal) => {
    if (!newVal) {
        resetForm();
    }
})

// 9. 统一提交方法（区分新增/编辑）
const getPatrolAdd = async () => {
    // 表单校验
    if (ruleFormRef.value) {
        try {
            await ruleFormRef.value.validate()
        } catch (error) {
            ElMessage.error('表单校验失败，请完善必填项');
            return;
        }
    }

    // 提交接口
    try {
        if (isEdit.value) {
            await housetypeUpdate(ruleForm); // 编辑：调用更新接口
            ElMessage.success('更新成功');
        } else {
            await housetypeAdd(ruleForm); // 新增：调用添加接口
            ElMessage.success('添加成功');
        }

        dialogVisible.value = false;
        emit('save-success'); // 统一派发刷新事件
        resetForm();
    } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败，请重试' : '添加失败，请重试');
        console.error(isEdit.value ? '服务更新失败' : '服务添加失败', error);
    }
}
</script>

<style scoped lang='less'></style>