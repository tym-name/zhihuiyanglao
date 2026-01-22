<template>
    <div>
        <el-button style="margin-bottom: 10px;" type="primary" @click="add">新增家属</el-button>
        <el-table border :data="data" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="序号" />
            <el-table-column prop="name" label="姓名" />
            <!-- 优化：性别值转换为文字显示 -->
            <el-table-column label="性别">
                <template #default="scope">
                    {{ scope.row.gender === 1 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column prop="idCard" label="身份证号" />
            <el-table-column prop="mobile" label="联系电话" />
            <el-table-column prop="address" label="联系地址" />
            <el-table-column prop="relation" label="与老人的关系" />
        </el-table>
    </div>
</template>

<script setup lang='ts'>
import { inject, reactive, ref, nextTick, watch } from 'vue';
import type { FamilyMember } from '../../api/market/elderlyType';
import type { FormInstance } from 'element-plus';

let porp = defineProps({
    familylist: {
        type: Array,
        default: () => []
    }
})

watch(() => porp.familylist, (newval) => {
    if (!newval) return
    data.value = newval as FamilyMember[]
    console.log(fromData.value);
})
// 1. 初始化数据，兜底空数组避免undefined
const data = ref<FamilyMember[]>(inject<FamilyMember[]>('familyData') || []);
const loading = ref(false); // 加载状态
const roleDialogVisible = ref(false);
const isEdit = ref(false); // 标记是否为编辑状态
const ruleFormRef = ref<FormInstance>(); // 表单ref

// 2. 表单初始数据（新增默认值）
const initFormData: FamilyMember = reactive({
    id: 0,
    elderlyId: 0, // 可根据实际业务赋值（比如老人ID）
    name: '',
    mobile: '',
    idCard: '',
    relation: '',
    gender: 1, // 1-男，2-女
    address: ''
});
const fromData = ref<FamilyMember>({ ...initFormData });


// 4. 新增家属
const add = () => {
    isEdit.value = false; // 标记为新增
    roleDialogVisible.value = true;
    // 重置表单数据
    fromData.value = { ...initFormData };
    // 重置表单校验状态
    nextTick(() => {
        ruleFormRef.value?.clearValidate();
    });
};

// 暴露数据供父组件使用
defineExpose({
    data,
});
</script>

<style scoped lang='less'>
.dialog-footer {
    text-align: right;
}
</style>