<template>
    <el-card style="margin-bottom: 10px;">
        <el-form :model="form" label-width="auto" inline>
            <el-form-item label="机构名称：">
                <el-select v-model="form.companyId" placeholder="请选择" style="width: 180px" clearable>
                    <el-option v-for="item in paramsData" :label="item.name" :value="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item label="期待到货日期：">
                <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
                    style="width: 350px" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable />
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="form.state" placeholder="请选择" style="width: 180px" clearable>
                    <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <Table ref="tableRef" :columns="columns" :fetch-data="purchaseList">
        <template #operate="{ row }">
            <el-button link type="primary" @click="goToDetail(row.id)">查看详情</el-button>
        </template>
    </Table>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
import Table, { type TableColumn } from '../../components/table.vue'
import { purchaseList } from '../../api/purchase/purchase';
import type { purchaseParams } from '../../api/purchase/purchaseType';
import { companyList } from '../../api/company/company';
import type { HomeType } from '../../api/company/companyType';
import router from '../../router';

const form = ref<purchaseParams>({
    pageSize: 10,
    page: 1,
    companyId: '',
    state: '',
    beginDate: '',
    endDate: '',
})
// 表格
const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50",
    },
    {
        label: "序号",
        prop: "id",
        width: "100px",
    },
    {
        label: "创建时间",
        prop: "addTime",
    },
    {
        label: "申请人",
        prop: "addAccountName",
    },
    {
        label: "机构名称",
        prop: "companyName",
    },
    {
        label: "品种数",
        prop: "counts",
    },
    {
        label: "期望到货日期",
        prop: "receiveTime",
    },
    {
        label: "状态",
        prop: "state",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
];
// 状态
const state = [
    {
        value: '已经发货',
        label: '已经发货',
    },
    {
        value: '待提交',
        label: '待提交',
    },
]
// 机构列表
const paramsData = ref<HomeType[]>([])
const params = reactive<HomeType>({
    name: '',
})
const getcompanyList = async () => {
    const res = await companyList(params)
    console.log('机构列表', res);
    paramsData.value = res.data.list
}
getcompanyList()
// 日期
const dateRange = ref<string[]>([])

// 重置
const reset = async () => {
    form.value.companyId = ''
    dateRange.value = []
    form.value.state = ''
    form.value.beginDate = '',
        form.value.endDate = ''
    // 触发表格重新加载
    if (tableRef.value) {
        tableRef.value.refresh()
    }
}
// 查询
const tableRef = ref()

// 
const goToDetail = (id: string | number) => {
    router.push({
        name: 'PurchaseDetail',
        params: { id }
    })
}

</script>

<style scoped lang='less'>
.search- {
    margin-bottom: 20px;
}
</style>