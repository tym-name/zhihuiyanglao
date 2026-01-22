<template>
    <div>
        <Table ref="tableRef" @selection-change="handleSelectionChange" :init-params="params"  :columns="columns" :fetch-data="houselist">
            <template #buttons>
                <el-button type="success" @click="add"><i class="iconfont icon-jia"></i>新增房间</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled">
                    <i class="iconfont icon-shanchu"></i>批量删除
                </el-button>
            </template>
             <template #search>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="房间号:">
            <el-input placeholder="请输入机构名称" v-model="params.name" clearable />
          </el-form-item>
          <el-form-item label="楼栋:">
            <CascaderBeg v-model="params.buildingId" @bedChange="bedChange" :type="'bed'" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </template>
            <template #operate="{ row }">
                <el-button link type="primary" @click="handleEdit(row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
                <el-button link type="danger" @click="deleteCompany(row.id)">
                    <i class="iconfont icon-shanchu"></i>删除
                </el-button>
            </template>
        </Table>
        <HouseAdd @save-success="handleSaveSuccess" :edit-data="currentEditData" v-if="roleDialogVisible" v-model="roleDialogVisible"></HouseAdd>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Table, { type TableColumn } from '../../components/table.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { houseDelete, houseDeleteAll, houselist } from '@/api/house/house';
import type { BuildingInfo, PageQueryParams, RoomInfo } from '@/api/house/houseType';
import HouseAdd from './HouseAdd.vue'
import CascaderBeg from '@/components/form/CascaderBeg.vue'

const params = ref<PageQueryParams>({
  name: '',
  buildingId:null
})
const isBatchDelDisabled = ref(true)
const roleDialogVisible=ref(false);
const tableRef = ref<any>(null)
const currentEditData = ref<BuildingInfo | undefined>(undefined);

const add=() => {
  currentEditData.value = undefined;
  roleDialogVisible.value = true;
};

let bedChange = (idArr: number[]) => {
    params.value.buildingId = idArr[idArr.length - 1]
}

const handleEdit = (row: BuildingInfo) => {
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
      await houseDelete(id); // 先执行删除接口
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
const handleSelectionChange = (rows: RoomInfo[]) => {
  console.log("选中的数据：", rows);
  selectionData.value = rows;
  isBatchDelDisabled.value = rows.length === 0;
}

// 选中的数据
const selectionData = ref<RoomInfo[]>([])
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
      await houseDeleteAll(ids); // 执行批量删除接口
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

// 搜索
const search = () => {
  tableRef.value?.refresh();
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
        label: "房间号",
        prop: "name",
    },
        {
        label: "楼层",
        prop: "buildingName",
    },
        {
        label: "床位",
        prop: "beds",
    },
        {
        label: "创建时间",
        prop: "addTime",
    },
        {
        label: "创建人",
        prop: "addAccountName",
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