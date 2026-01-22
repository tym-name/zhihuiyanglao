<template>
    <Table ref="tableRef" :columns="columns" :fetch-data="roleListFun" @selection-change="handleSelectionChange">
        <template #buttons>
            <el-button type="success" @click="Addposition">添加岗位</el-button>
            <el-button type="danger" @click="delAll" :disabled="selectedIds.length === 0">批量删除</el-button>
        </template>

        <template #operate="{ row }">
            <el-button link type="primary" @click="modify(row)">修改</el-button>
            <el-button link type="danger" @click="roledel(row.id)">删除</el-button>
        </template>
    </Table>
</template>

<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus';
import { roleDelete, roleDeleteAll, roleListFun } from '../../api/position/position';
import Table from '../../components/table.vue';
import type { TableColumn } from '../../components/table.vue';
import { ref } from 'vue';
import type { roleList } from '../../api/position/positionType';
import router from '../../router';

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
        label: "角色名称",
        prop: "name",
    },
    {
        label: "关联账号",
        prop: "accountCounts",
    },
    {
        label: "创建人",
        prop: "addAccountName",
    },
    {
        label: "创建时间",
        prop: "addTime",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
];
// 单删
const tableRef = ref<any>(null)
const roledel = async (id: number) => {
    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    )
        .then(async () => {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            await roleDelete(id)
            tableRef.value?.refresh();
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消删除',
            })
        })
}
// 批量删除
const selectedIds = ref<number[]>([])
//表格选择变化事件
const handleSelectionChange = (selection: roleList[]) => {
    selectedIds.value = selection.map(item => item.id)
}
const delAll = async () => {
    if (selectedIds.value.length === 0) return

    await ElMessageBox.confirm(
        `确定删除这${selectedIds.value.length}项数据吗? 删除后无法恢复`,
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    // 传递选中的ID数组给后端
    await roleDeleteAll(selectedIds.value)
    // 清空选中的ID
    selectedIds.value = []
    // 刷新表格数据
    tableRef.value?.refresh();

    ElMessage.success('删除成功')
}
// 新增
const Addposition = async () => {
    router.push('/position-add')
}
// 修改
const modify = (row: roleList) => {
    router.push(`/position-edit/${row.id}`)
}

</script>

<style scoped lang='less'></style>