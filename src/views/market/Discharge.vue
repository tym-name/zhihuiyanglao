<template>
    <el-card style="margin-bottom: 10px;">
        <el-form :model="form" label-width="auto" inline>
            <el-form-item label="老人姓名:">
                <el-input v-model="form.elderlyName" clearable placeholder="请输入老人姓名" style="width: 180px" />
            </el-form-item>
            <el-form-item label="身份证号码:">
                <el-input v-model="form.elderlyIdCard" clearable placeholder="请输入身份证号码" style="width: 180px" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>

    <Table ref="tableRef" :columns="columns" :fetch-data="dischargeListFunc" @selection-change="handleSelectionChange"
        :show-selection-column="true">
        <template #buttons>
            <el-button type="success" @click="dischargeeAdd"><i class="iconfont icon-jia"></i>新增</el-button>
            <el-button type="danger" @click="delAll" :disabled="selectedIds.length === 0"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
        </template>
        <template #elderlyGender="{ row }">
            {{ row.elderlyGender == 0 ? '女' : '男' }}
        </template>
        <template #state="{ row }">
            {{ row.state == 1 ? '未出院' : '已出院' }}
        </template>
        <template #operate="{ row }">
            <el-button link type="primary" @click="dischargeEdit(row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button link type="danger" @click="dischargdele(row.id)"><i class="iconfont icon-shanchu"></i>删除</el-button>
        </template>
    </Table>
    <DischargeDialog v-model="dialogFormVisible" :editRow="currentEditRow" @refresh="handleRefresh" />
</template>

<script setup lang='ts'>
import DischargeDialog from './DischargeDialog.vue'
import { reactive, ref, } from 'vue'
import Table from '../../components/table.vue'
import type { TableColumn } from '../../components/table.vue';
import { dischargeDelete, dischargeDeleteAll, dischargeListFunc } from '../../api/market/discharge';
import type { dischargeList } from '../../api/market/dischargeType';
import { ElMessage, ElMessageBox } from 'element-plus';

// 表单
const form = reactive<dischargeList>({
    id: 0,
    companyId: 0,
    elderlyId: 0,
    expectDate: '',
    reason: '',
    state: 0,
    addTime: '',
    addAccountId: 0,
    begId: 0,
    begName: '',
    addAccountName: '',
    elderlyName: '',
    elderlyPhoto: '',
    elderlyGender: '',
    elderlyIdCard: '',
    houseName: '',
    buildingName: '',
})
// 表格
const columns: TableColumn[] = [
    {
        label: "序号",
        prop: "id",
        width: "100px",
    },
    {
        label: "老人姓名",
        prop: "elderlyName",
    },
    {
        label: "性别",
        slot: "elderlyGender",
    },
    {
        label: "身份证号",
        prop: "elderlyIdCard",
    },
    {
        label: "原床位",
        prop: "begName",
    },
    {
        label: "申请人",
        prop: "elderlyName",
    },
    {
        label: "申请日期",
        prop: "addTime",
    },
    {
        label: "状态",
        slot: "state",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
];
// 单删
const tableRef = ref<any>()
const dischargdele = async (id: number) => {
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
            await dischargeDelete(id)
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
const handleSelectionChange = (selection: dischargeList[]) => {
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
    await dischargeDeleteAll(selectedIds.value)
    // 清空选中的ID
    selectedIds.value = []
    // 刷新表格数据
    tableRef.value?.refresh();

    ElMessage.success('删除成功')
}
// 新增编辑
const dialogFormVisible = ref(false)
const currentEditRow = ref<dischargeList | null>(null)
// 新增
const dischargeeAdd = () => {
    currentEditRow.value = null
    dialogFormVisible.value = true
}
// 编辑
const dischargeEdit = async (row: dischargeList) => {
    currentEditRow.value = { ...row }
    dialogFormVisible.value = true
}
// 刷新表格
const handleRefresh = () => {
    tableRef.value?.refresh()
    currentEditRow.value = null
}
// 重置
const resetForm = () => {
    // 清空查询表单
    form.elderlyName = ''
    form.elderlyIdCard = ''

    // 刷新表格数据（显示全部数据）
    if (tableRef.value) {
        tableRef.value.refresh({
            elderlyName: '',
            elderlyIdCard: ''
        })
    }
    // 清空选中项
    selectedIds.value = []
}
// 查询
const handleSearch = () => {
    // 调用表格的refresh方法，传递查询参数
    if (tableRef.value) {
        tableRef.value.refresh({
            elderlyName: form.elderlyName,
            elderlyIdCard: form.elderlyIdCard
        })
    }
}
</script>

<style scoped lang="less">
    .iconfont{
        margin-right: 5px;
    }
</style>