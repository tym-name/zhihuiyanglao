<template>
        <Table ref="tableRef" :columns="columns" :fetch-data="getDrugsList" :init-params="searchForm">
            <template #search>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="老人:">
                        <el-input v-model="searchForm.name" placeholder="请输入老人姓名" clearable />
                    </el-form-item>
                    <el-form-item label="登记时间:">
                        <el-date-picker v-model="searchForm.beginDate" type="daterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px;" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template #buttons>
                <el-button type="success">用药登记</el-button>
                <el-button type="danger">批量删除</el-button>
            </template>

            <template #operate="{ row }">
                <el-button link type="primary">
                    <i class="iconfont icon-xiangqing"></i>
                    查看详情
                </el-button>
                <el-button link type="primary">
                    <i class="iconfont icon-xiangqing"></i>
                    用药计划
                </el-button>
            </template>
        </Table>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Table, { type TableColumn } from '../../components/table.vue'
import { getDrugsList } from '../../api/medicalcare/medicineLogs/medicineLogs';
import type { drugsListParams } from '../../api/medicalcare/medicineLogs/medicineLogsType';

//表格
const tableRef = ref<any>(null);
//刷新页面
const refresh = () => {
    tableRef.value.refresh()
}

const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50",
    },
    {
        label: "序号",
        prop: "id",
    },
    {
        label: "老人姓名",
        prop: "elderlyName",
    },
    {
        label: "用药品种类",
        prop
        : "counts",
    },
    {
        label: "登记人",
        prop: "addAccountName",
    },
    {
        label: "最新登记时间",
        prop: "addTime",
    },
    {
        label: "操作",
        width: 200,
        slot: "operate",
        fixed: "right",
    }
]

//查询
const searchForm = ref<drugsListParams>({
    name: '',
    beginDate: '',
})

//搜索
const handleSearch = () => {
    refresh()
}
//重置
const handleReset = () => {
    searchForm.value = {
        name: '',
        beginDate: '',
    }
    refresh()
}
</script>

<style scoped lang='less'></style>