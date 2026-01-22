<template>
    <el-dialog v-model="dialogVisible" title="选择老人" width="1000px" :close-on-click-modal="false"
        @close="handleDialogClose">
        <Table ref="tableRef" @selection-change="handleSelectionChange" :init-params="params" :columns="columns"
            :fetch-data="getCaptcha">
            <template #gender="{ row }">
                {{ row.gender === 1 ? '男' : '女' }}
            </template>
            <template #search>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="老人姓名:">
                        <el-input placeholder="请输入老人姓名" v-model="params.name" clearable />
                    </el-form-item>
                    <el-form-item label="身份证号:">
                        <el-input placeholder="请输入身份证号" v-model="params.idCard" clearable />
                    </el-form-item>
                    <el-form-item style="width: 200px;">
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button @click="resetSearch">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template #operate="{ row }">
                <el-button type="primary" @click="selectReserve(row)">选择</el-button>
            </template>
        </Table>
    </el-dialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getCaptcha } from '../../api/market/elderly';
import type { ElderlyType } from '../../api/market/elderlyType';
import Table, { type TableColumn } from "../../components/table.vue";
import router from '../../router';

const isBatchDelDisabled = ref(true)

const tableRef = ref<any>(null)

// 查询参数
const params = ref<ElderlyType>({
    name: '',
    idCard: '',
    begId: 0,
    state: null
})
// 监听表格选中数据变化
const handleSelectionChange = (rows: any[]) => {
    console.log("选中的数据：", rows);
    isBatchDelDisabled.value = rows.length === 0;
}

// 弹窗显隐
const dialogVisible = defineModel<boolean>({ default: false });


const selectReserve = (row: any) => {
    // router.push(`/addHospitalized?id=${row.id}`)
    router.push({
        path: '/addHospitalized',
        query: {
            id: row.id,
            name: row.name,
            idCard: row.idCard,
            photo: row.photo
        }
    })
}





// 弹窗关闭时重置表单
const handleDialogClose = () => {

};

const search = () => {
    tableRef.value?.refresh();
}

const resetSearch = () => {
    params.value = {
        name: '',
        idCard: '',
        begId: 0,
        state: null
    }
    tableRef.value?.refresh();
}

const columns: TableColumn[] = [
    {
        label: "姓名",
        prop: "name",
    },
    {
        label: "头像",
        image: "photo",
    },
    {
        label: "性别",
        prop: "state",
        slot: "gender",
    },
    {
        label: "身份证号",
        prop: "idCard",
        width: 180,
    },
    {
        label: "操作",
        slot: "operate",
    }
]

</script>

<style scoped lang='less'>
.dialog-footer {
    text-align: right;
}

.el-form-item {
    margin-bottom: 18px;
}

// 适配选择老人区域样式
:deep(.el-button--text) {
    padding: 6px 12px;
}
</style>