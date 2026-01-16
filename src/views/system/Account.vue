<template>
    <div>
        <Table ref="tableRef" :columns="columns" :fetch-data="accountList" @selection-change="handleSelectionChange">
            <template #buttons>
                <el-button type="success" @click="showDialogAdd"><i class="iconfont icon-jia"></i>添加账号</el-button>
                <el-button type="danger" :disabled="selectedIds.length === 0"
                    @click="handleBatchDelete"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
            </template>

            <template #operate="{ row }">
                <el-button link type="primary" @click="handleResetPassword(row)"><i class="iconfont icon-shuaxin"></i>重置密码</el-button>
                <el-button link type="primary" @click="showDialogAdd(row)"><i class="iconfont icon-bianji"></i>修改</el-button>
                <el-button link type="danger" @click="deleteAccount(row.id)"><i class="iconfont icon-shanchu"></i>删除</el-button>
            </template>
        </Table>
       <AccountDialog 
            ref="accountDialogRef" 
            @refreshAccountList="refreshAccountTable"
        ></AccountDialog>
           <ResetPasswordDialog  
      v-model:visible="resetPasswordVisible"
      :account-id="currentAccountId"
      :name="currentCompanyName"
      @reset-success="handleResetSuccess"
      @reset-fail="handleResetFail" 
    />
    </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { accountList, deleteAccountList, accountDeleteAll } from "../../api/account/account";
import Table, { type TableColumn } from "../../components/table.vue";
import type { accountAddData, AccountResult } from "../../api/account/accountType";
import { ElMessage, ElMessageBox } from "element-plus";
import AccountDialog from "../../components/account/AccountDialog.vue"
import ResetPasswordDialog from '../../components/form/ResetPasswordDialog.vue'

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
        width: 260  ,
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

// 重置密码弹窗相关
const resetPasswordVisible = ref(false);
const currentAccountId = ref(0);
const currentCompanyName = ref(""); // 新增：存储当前行的机构名称
// 重置密码：接收完整行数据，提取id和name
const handleResetPassword = (row: accountAddData) => {
  currentAccountId.value = row.id;        // 账号ID
  currentCompanyName.value = row.name;    // 核心：赋值机构名称
  resetPasswordVisible.value = true;      // 打开弹窗
  console.log("传递给弹窗的机构名称：", currentCompanyName.value);
};

// 处理密码重置成功
const handleResetSuccess = () => {
  resetPasswordVisible.value = false;
  // 可选：刷新表格数据
  tableRef.value?.refresh();
};

// 处理密码重置失败
const handleResetFail = (error: any) => {
  ElMessage.error(`密码重置失败：${error.msg || '未知错误'}`);
  console.error('重置密码失败:', error);
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
                message: '取消删除',
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
                message: '取消批量删除',
            });
        });
};
// 显示添加修改弹窗
const accountDialogRef = ref<InstanceType<typeof AccountDialog>>()
const showDialogAdd = (row: AccountResult) => {
    accountDialogRef.value?.openDialog(row);
};

const refreshAccountTable = async () => {
    try {
        if (tableRef.value) {
            tableRef.value.refresh();
        }
    } catch (error) {
        console.error('刷新账号列表失败：', error);
        ElMessage.error('刷新列表失败，请手动刷新');
    }
};

</script>
<style scoped lang="less">
.iconfont{
  margin: 5px;
}
</style>