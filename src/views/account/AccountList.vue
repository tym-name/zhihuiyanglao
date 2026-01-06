<template>
    <div>
        <Table ref="tableRef" :columns="columns" :fetch-data="accountList" @selection-change="handleSelectionChange">
            <template #buttons>
                <el-button type="success" @click="showDialogAdd">添加账号</el-button>
                <el-button type="danger" :disabled="selectedIds.length === 0"
                    @click="handleBatchDelete">批量删除</el-button>
            </template>

            <template #operate="{ row }">
                <el-button link type="primary">重置密码</el-button>
                <el-button link type="primary">修改</el-button>
                <el-button link type="danger" @click="deleteAccount(row.id)">删除</el-button>
            </template>
        </Table>
        <AccountDialog v-model="showDialog"></AccountDialog>
    </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { accountList, deleteAccountList, accountDeleteAll } from "../../api/account";
import Table, { type TableColumn } from "../../components/table.vue";
import type { AccountResult } from "../../api/accountType";
import { ElMessage, ElMessageBox } from "element-plus";
import AccountDialog from "../../components/account/AccountDialog.vue"

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
        label: "姓名",
        prop: "name",
    },
    {
        label: "手机号",
        prop: "mobile",
    },
    {
        label: "账号",
        prop: "username",
    },
    {
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
];

// 选中的行数据
const selectedRows = ref<AccountResult[]>([]);
// 选中的ID数组
const selectedIds = ref<number[]>([]);

// 处理表格选中变化
const handleSelectionChange = (rows: AccountResult[]) => {
    selectedRows.value = rows;
    selectedIds.value = rows.map(row => row.id);
};

// 单个删除
const tableRef = ref<any>(null)
const deleteAccount = (id: number) => {
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
            await deleteAccountList(id)
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
const handleBatchDelete = () => {
    if (selectedIds.value.length === 0) {
        ElMessage.warning('请至少选择一条记录');
        return;
    }

    ElMessageBox.confirm(
        `确定要删除选中的 ${selectedIds.value.length} 条记录吗？`,
        '批量删除确认',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            try {
                // 调用批量删除API
                await accountDeleteAll(selectedIds.value);

                ElMessage({
                    type: 'success',
                    message: `成功删除 ${selectedIds.value.length} 条记录`,
                });

                // 清空选中状态
                selectedRows.value = [];
                selectedIds.value = [];

                // 刷新表格
                tableRef.value?.refresh();
            } catch (error) {
                ElMessage.error('删除失败，请重试');
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '已取消批量删除',
            });
        });
};
// 显示添加弹窗
const showDialog = ref(false)
const showDialogAdd = () => {
    showDialog.value = true;
};

</script>

<style scoped lang='less'></style>