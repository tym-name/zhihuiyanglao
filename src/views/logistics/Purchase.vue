<template>
        <Table ref="tableRef" :columns="columns" :fetch-data="getPurchaseList">
            <template #buttons>
                <el-button type='success'>创建采购申请</el-button>
            </template>

            <template #operate="{ row }">
                <el-button link type="danger" @click="delById(row.id)">
                    <i class="iconfont icon-shanchu"></i>
                    删除
                </el-button>
                <el-button link type="primary">
                    <i class="iconfont icon-xiangqing"></i>
                    查看详情
                </el-button>
                <!-- <el-button link type="primary">
                    <i class="iconfont icon-bianji"></i>
                    编辑
                </el-button> -->
            </template>
        </Table>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Table from '../../components/table.vue';
import type { TableColumn } from '../../components/table.vue';
import { delPurChase, getPurchaseList } from '../../api/logistics/purchase/purchase';
import { ElMessage, ElMessageBox } from 'element-plus';
const tableRef = ref<any>(null);
const refresh = () => {
    tableRef.value.refresh();
};

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
        label: "创建时间",
        prop: "addTime",
    },
    {
        label: "申请人",
        prop: "addAccountName",
    },
    {
        label: "品种",
        prop: "counts",
    },
    {
        label: "实际采购成本",
        prop: "purchasePrice",
    },
    {
        label: "状态",
        prop: "state",
    },
    {
        label: "操作",
        width: 160,
        slot: "operate",
        fixed: "right",
    }
]

//删除
const delById = (id: number) => {
    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning"
        }
    )
        .then(async () => {
            await delPurChase(id); // 先执行删除接口
            ElMessage({
                type: 'success',
            })
            refresh()
        })
}
</script>

<style scoped lang='less'>
.iconfont {
    font-size: 14px;
}
</style>