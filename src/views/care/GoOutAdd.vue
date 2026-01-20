<template>
    <div>
        <el-dialog v-model="dialogVisible" title="选择老人" width="800" @close="resetForm">
            <div>
                <el-form ref="ruleFormRef" style="max-width: 600px" :model="searchRuleForm" :rules="rules"
                    label-width="auto">
                    <el-form-item label="姓名" prop="name" style="width: 300px;">
                        <el-input v-model="searchRuleForm.name" placeholder="请输入姓名" />
                    </el-form-item>
                    <el-form-item label="身份证号" prop="idCard" style="width: 300px;">
                        <el-input v-model="searchRuleForm.idCard" placeholder="请输入身份证号" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column label="头像" width="180">
                    <template #default="scope">
                        <el-avatar v-if="scope.row.photo" :src="scope.row.photo" />
                        <el-avatar v-else icon="el-icon-user" />
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="100" />
                <el-table-column prop="idCard" label="身份证号" width="180" />
                <el-table-column fixed="right" label="操作" min-width="120">
                    <template #default="scope">
                        <el-button type="primary" @click="selectElderly(scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { ElMessage, type FormRules, type FormInstance } from 'element-plus'
import type { ElderlyOutingItem, ElderlyOutingListResponse } from '../../api/goout/gooutType'; // 导入老人类型
import router from '../../router';

// 1. 弹窗显隐（v-model绑定）
const dialogVisible = defineModel()

// 2. 表单Ref
const ruleFormRef = ref<FormInstance>()

// 3. 搜索表单数据
const searchRuleForm = reactive({
    name: "",
    idCard: "",
})

// 4. 表单校验规则（简化，只保留必要的）
const rules = reactive<FormRules>({
    name: [{ required: false, message: '请输入姓名', trigger: 'blur' }],
    idCard: [{ required: false, message: '请输入身份证号', trigger: 'blur' }]
})

const tableData = ref<ElderlyOutingListResponse[]>([
   
])

// 6. 查询方法
const search = async () => {
    // 模拟接口请求
    ElMessage.info('查询功能待对接接口');
}

// 7. 重置查询条件
const reset = () => {
    searchRuleForm.name = "";
    searchRuleForm.idCard = "";
    // 清空表单校验
    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate();
    }
    // 重置后重新查询
    search();
}

// 8. 选择老人并跳转（核心修改）
const selectElderly = (row: ElderlyOutingItem) => {
    if (!row || !row.id) {
        ElMessage.error('请选择有效的老人信息');
        return;
    }

    console.log('选择的老人信息：', row);

    // 方式1：路由传参（推荐）
    router.push({
        path: '/addGoOut',
        query: {
            elderlyId: row.id,
            elderlyName: row.name
        }
    });

    // 方式2：本地存储（备用方案，防止路由传参丢失）
    localStorage.setItem('elderlyId', row.id.toString());
    localStorage.setItem('elderlyName', row.name || '');

    // 关闭弹窗
    dialogVisible.value = false;

    ElMessage.success(`已选择老人：${row.name}`);
}

// 9. 重置表单（弹窗关闭时调用）
const resetForm = () => {
    searchRuleForm.name = "";
    searchRuleForm.idCard = "";
    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate();
    }
}
</script>

<style scoped lang='less'>
.el-table {
    margin-top: 20px;
}

.el-form-item {
    display: inline-block;
    margin-right: 20px;
}
</style>