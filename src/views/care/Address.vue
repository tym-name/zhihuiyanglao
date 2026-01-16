<template>
    <div>
        <Table ref="tableRef" @selection-change="handleSelectionChange" :columns="columns" :fetch-data="addressList">
            <template #buttons>
                <el-button type="success" @click="add"><i class="iconfont icon-jia"></i>新增地址</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled">
                    <i class="iconfont icon-shanchu"></i>批量删除
                </el-button>
            </template>
            <template #operate="{ row }">
                <el-button link type="primary" @click="edit(row)"><i class="iconfont icon-bianji"></i>修改</el-button>
                <el-button link type="danger" @click="deleteCompany(row.id)">
                    <i class="iconfont icon-shanchu"></i>删除
                </el-button>
            </template>
        </Table>
        <AddressAdd v-if="roleDialogVisible"
      v-model="roleDialogVisible"
       :edit-row="currentEditRow" 
      @save-success="handleSaveSuccess"></AddressAdd>
    </div>
</template>

<script setup lang='ts'>
import { ElMessage, ElMessageBox } from "element-plus";
import { addressDelete, addressDeleteAll, addressList } from "../../api/address/address";
import Table, { type TableColumn } from "../../components/table.vue";
import { ref } from "vue";
import type { EntityItem } from "../../api/address/addressType";
import AddressAdd from "./AddressAdd.vue";

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)
const roleDialogVisible=ref(false);
const currentEditRow = ref<EntityItem | undefined>(undefined);

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
        label: "巡检地点",
        prop: "name",
    },
    {
        label: "二维码",
        image: "qrcode",
    },
    {
        label: "操作",
        slot: "operate",
        width: 360,
        fixed: "right",
    }
];

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
      await addressDelete(id); // 先执行删除接口
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

// 新增功能
const add=() => {
  currentEditRow.value = undefined; // 重置编辑行数据，确保进入新增模式
  roleDialogVisible.value = true;
};

// 编辑功能
const edit = (row: EntityItem) => {
 currentEditRow.value = row; // 传入完整行数据
  roleDialogVisible.value = true; // 打开弹窗
};

// 保存成功回调
const handleSaveSuccess = () => {
    tableRef.value?.refresh();
};

// 选中的数据
const selectionData = ref<EntityItem[]>([])
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
      await addressDeleteAll(ids); // 执行批量删除接口
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
const handleSelectionChange = (rows: EntityItem[]) => {
  console.log("选中的数据：", rows);
  selectionData.value = rows;
  isBatchDelDisabled.value = rows.length === 0;
}
</script>

<style scoped lang='less'>
.iconfont {
    margin: 5px;
}
</style>