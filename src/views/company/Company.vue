<template>
  <div>
    <Table 
      ref="tableRef" 
      @selection-change="handleSelectionChange"  
      :columns="columns" 
      :init-params="params" 
      :fetch-data="companyList"
    >
      <template #buttons>
        <el-button type="success" @click="Companyadd"><i class="iconfont icon-jia"></i>添加</el-button>
        <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled">
          <i class="iconfont icon-shanchu"></i>批量删除
        </el-button>
      </template>

      <template #search>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="机构名称:">
            <el-input placeholder="请输入机构名称" v-model="params.name" clearable />
          </el-form-item>
          <el-form-item label="管理员姓名:">
            <el-input placeholder="请输入管理员姓名" v-model="params.adminName" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template #operate="{ row }">
        <!-- 点击重置密码时传递当前行的完整数据 -->
        <el-button link type="primary" @click="handleResetPassword(row)">
          <i class="iconfont icon-shuaxin"></i>重置密码
        </el-button>
        <el-button link type="primary" @click="edit(row)"><i class="iconfont icon-bianji"></i>修改</el-button>
        <el-button link type="danger" @click="deleteCompany(row.id)">
          <i class="iconfont icon-shanchu"></i>删除
        </el-button>
      </template>
    </Table>

    <!-- 核心修改：新增 :name="currentCompanyName" 传递机构名称 -->
    <ResetPasswordDialog  
      v-model:visible="resetPasswordVisible"
      :account-id="currentAccountId"
      :name="currentCompanyName"
      @reset-success="handleResetSuccess"
      @reset-fail="handleResetFail" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { companyDeleteAll, companyList, deleteAccount } from "../../api/company/company";
import Table, { type TableColumn } from "../../components/table.vue";
import type { CompanyInfo, HomeType, InstitutionItem } from "../../api/company/companyType";
import { ElMessage, ElMessageBox } from "element-plus";
import ResetPasswordDialog from '../../components/form/ResetPasswordDialog.vue'
import router from "../../router";

// 查询参数
const params = ref<HomeType>({
  name: "",
  adminName: ""
})

// 表格ref
const tableRef = ref<any>(null)
// 批量删除按钮禁用状态
const isBatchDelDisabled = ref(true)

// 重置密码弹窗相关
const resetPasswordVisible = ref(false);
const currentAccountId = ref(0);
const currentCompanyName = ref(""); // 新增：存储当前行的机构名称

// 重置密码：接收完整行数据，提取id和name
const handleResetPassword = (row: InstitutionItem) => {
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

// 搜索
const search = () => {
  tableRef.value?.refresh();
}

// 重置搜索条件
const resetSearch = () => {
  params.value = {
    name: "",
    adminName: ""
  };
  tableRef.value?.refresh();
}

// 添加
const Companyadd=()=>{
  router.push('/company-add')
}

const edit = (row: CompanyInfo) => {
  console.log('点击修改机构',row);
  router.push(`/company-add?id=${row.id}`)
};

// 单个删除
const deleteCompany = (id: number) => {
  ElMessageBox.confirm(
    '是否删除该条记录？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning"
    }
  )
    .then(async () => {
      await deleteAccount(id); // 先执行删除接口
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
      tableRef.value?.refresh();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

// 选中的数据
const selectionData = ref<InstitutionItem[]>([])
// 批量删除
const delAll = () => {
  if (selectionData.value.length === 0) return;
  
  ElMessageBox.confirm(
    `是否删除选中的 ${selectionData.value.length} 条记录？`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning"
    }
  )
    .then(async () => {
      const ids = selectionData.value.map((item) => item.id);
      await companyDeleteAll(ids); // 执行批量删除接口
      ElMessage({
        type: 'success',
        message: '批量删除成功',
      });
      tableRef.value?.getData();
      isBatchDelDisabled.value = true; // 重置禁用状态
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

// 监听表格选中数据变化
const handleSelectionChange = (rows: InstitutionItem[]) => {
  console.log("选中的数据：", rows);
  selectionData.value = rows;
  isBatchDelDisabled.value = rows.length === 0;
}

// 表格列配置
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
    label: "机构名称",
    prop: "name",
  },
  {
    label: "区域",
    prop: "address",
  },
  {
    label: "管理员姓名",
    prop: "adminName",
  },
  {
    label: "联系电话",
    prop: "telephone",
  },
  {
    label: "管理员账号",
    prop: "adminUserName",
  },
  {
    label: "操作",
    slot: "operate",
    width: 260,
    fixed: "right",
  }
];
</script>

<style scoped lang="less">
.demo-form-inline {
  height: 20px;
  margin-bottom: 16px;
}
.iconfont{
  margin: 5px;
}

// 按钮样式优化
:deep(.el-button--link) {
  padding: 0 8px;
}
</style>