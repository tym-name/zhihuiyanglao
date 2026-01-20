<template>

    <div style="display: flex;">
        <div style="width: 20%;">
            <BedLeft style="height: 100%;" />
        </div>

        <div style="margin-left: 20px;width: 80%;">
            <Table @selection-change="handleSelectionChange" ref="tableRef" :columns="columns" :fetch-data="fetchBedData" :init-params="listParams">
                <template #buttons>
                <el-button type="success" @click="openDialog"><i class="iconfont icon-jia"></i>新增房间</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled">
                    <i class="iconfont icon-shanchu"></i>批量删除
                </el-button>
            </template>
                <template #state="{ row }">
                    <div>
                        {{ row.state === 0 ? '未入住' : '已入住' }}
                    </div>
                </template>
                <template #operate="{ row }">
                <el-button link type="primary" @click="openDialog(row)"><i class="iconfont icon-bianji"></i>编辑</el-button>
                <el-button link type="danger" @click="deleteCompany(row.id)">
                    <i class="iconfont icon-shanchu"></i>删除
                </el-button>
            </template>
            </Table>
        </div>

    </div>
    <BedDialog @save-success="handleSaveSuccess" v-if="dialogVisible" v-bind="DialogData" />
</template>

<script setup lang='ts'>
import { ElMessage, ElMessageBox } from 'element-plus';
import { defineAsyncComponent, provide, ref, watch } from 'vue';
import Table, { type TableColumn } from '@/components/table.vue'
import { bedsDelete, bedsDeleteAll, bedsList } from '@/api/bed/bed';
import BedDialog from '@/views/config/BedDialog.vue'
import type { HouseAccountInfo } from '@/api/bed/bedType';
const BedLeft = defineAsyncComponent(() =>
    import('@/views/config/BedLeft.vue')
)

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)
let dialogVisible = ref(false)
provide('dialogVisible', dialogVisible)
let closeDialog = () => {
    dialogVisible.value = false
}
const DialogData = ref<any>({
    id: 0,
    closeDialog: closeDialog,
    houseName: '',
    houseId: 0,
    name: '',
    price: 0
})

provide('DialogData', DialogData)
const openDialog = (row: any) => {
    if (!DialogData.value.houseName && !listParams.value.houseId) return ElMessage.info('请选择房间')
    DialogData.value.id = row.id || 0
    DialogData.value.name = row.name
    DialogData.value.price = row.price || undefined
    dialogVisible.value = true
}

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
      await bedsDelete(id); // 先执行删除接口
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
const handleSelectionChange = (rows: HouseAccountInfo[]) => {
  console.log("选中的数据：", rows);
  selectionData.value = rows;
  isBatchDelDisabled.value = rows.length === 0;
}

// 选中的数据
const selectionData = ref<HouseAccountInfo[]>([])
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
      await bedsDeleteAll(ids); // 执行批量删除接口
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

const listParams = ref<any>(
    {
        page: 1,
        pageSize: 10,
        houseId: 0
    }
)
provide('listParams', listParams)

// 自定义fetchBedData函数，确保houseId参数正确传递
const fetchBedData = async (params: any) => {
    // 合并参数，确保houseId被包含
    const mergedParams = {
        ...params,
        houseId: listParams.value.houseId
    };
    return await bedsList(mergedParams);
};

// 监听房间ID变化，刷新表格数据
watch(() => listParams.value.houseId, () => {
    tableRef.value?.refresh()
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
        label: "床位号",
        prop: "name",
    },
        {
        label: "价格",
        prop: "price",
    },
        {
        label: "创建人",
        prop: "addAccountName",
    },
        {
        label: "创建日期",
        prop: "addTime",
        formatTime: 'YYYY-MM-DD HH:mm',
    },
        {
        label: "状态",
        prop: "state",
        slot: 'state',
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
</style>.
