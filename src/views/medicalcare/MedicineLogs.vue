<template>
        <Table ref="tableRef" :columns="columns" :fetch-data="getDrugsList" :init-params="searchForm"
            @selection-change="handleSelectionChange">
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
                <el-button type="danger" @click="delAll">批量删除</el-button>
            </template>

            <template #operate="">
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
import { delDrugsAllByIds, getDrugsList } from '../../api/medicalcare/medicineLogs/medicineLogs';
import type { drugsListItem, drugsListParams } from '../../api/medicalcare/medicineLogs/medicineLogsType';
import { ElMessage, ElMessageBox } from 'element-plus';

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

//批量删除
const isBatchDelDisabled = ref(true)
const selectionData = ref<drugsListItem[]>([])
const ids = ref<number[]>([])
const handleSelectionChange = (rows: drugsListItem[]) => {
    selectionData.value = rows;
    ids.value = rows.map(row => row.id);
    isBatchDelDisabled.value = rows.length === 0;//判断是否禁用
}

const delAll = async () => {
    ElMessageBox.confirm(
        '是否删除多条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let res = await delDrugsAllByIds(ids.value)
            console.log(res);
            if (res.code === 10000) {
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                refresh()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
</script>

<style scoped lang='less'></style>