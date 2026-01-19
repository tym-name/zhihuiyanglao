<template>
    <div>
        <Table ref="tableRef" @selection-change="handleSelectionChange" :columns="columns" :fetch-data="housetypeList">
            <template #buttons>
                <el-button type="success" @click="add"><i class="iconfont icon-jia"></i>新增护理服务</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled">
                    <i class="iconfont icon-shanchu"></i>批量删除
                </el-button>
            </template>
            <template #operate="{ row }">
                <el-button link type="primary" @click="handleEdit(row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
                <el-button link type="danger" @click="deleteCompany(row.id)">
                    <i class="iconfont icon-shanchu"></i>删除
                </el-button>
            </template>
        </Table>
        <HouseTypeAdd @save-success="handleSaveSuccess" :edit-data="currentEditData" v-if="roleDialogVisible" v-model="roleDialogVisible"></HouseTypeAdd>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Table, { type TableColumn } from '../../components/table.vue';
import type { CareServiceItem } from '../../api/nursingService/nursingServiceType';
import { ElMessage, ElMessageBox } from 'element-plus';
import { housetypeDelete, housetypeDeleteAll, housetypeList } from '../../api/houseType/house';
import HouseTypeAdd from './HouseTypeAdd.vue'
import type { House } from '@/api/houseType/houseType';

const isBatchDelDisabled = ref(true)
const roleDialogVisible=ref(false);
const tableRef = ref<any>(null)
const currentEditData = ref<House | undefined>(undefined);

const add=() => {
  currentEditData.value = undefined;
  roleDialogVisible.value = true;
};

const handleEdit = (row: House) => {
    currentEditData.value = row; // 直接从列表中获取完整详情（无需接口）
    roleDialogVisible.value = true; // 打开弹窗
};

const handleSaveSuccess = () => {
  tableRef.value?.refresh();
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
      await housetypeDelete(id); // 先执行删除接口
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

// 监听表格选中数据变化
const handleSelectionChange = (rows: CareServiceItem[]) => {
  console.log("选中的数据：", rows);
  selectionData.value = rows;
  isBatchDelDisabled.value = rows.length === 0;
}

// 选中的数据
const selectionData = ref<CareServiceItem[]>([])
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
      await housetypeDeleteAll(ids); // 执行批量删除接口
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
        label: "操作",
        slot: "operate",
        width: 180,
        fixed: "right",
    }
];
</script>

<style scoped lang='less'>
.iconfont {
    margin: 5px;
}
</style>