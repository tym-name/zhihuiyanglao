<template>
  <div>
    <Table ref="tableRef" @handleSelectionChange="handleSelectionChange" :columns="columns" :init-params="params"
      :fetch-data="roleList">
      <template #buttons>
        <el-button type="success" @click="router.push('/roleAdd')">添加</el-button>
        <el-button type="danger" @click="delAll">批量删除</el-button>
      </template>

      <template #operate="{ row }">
        <el-button link type="primary"> <span style="font-size: 14px; margin-right: 5px;"
            class="iconfont icon-bianji"></span>修改</el-button>
        <el-button link type="danger" @click="roleDel(row.id)"><span style="font-size: 14px; margin-right: 5px;"
            class="iconfont icon-shanchu"></span>删除</el-button>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { roleDelete, roleDeleteAll, roleList } from "../../api/role.ts";
import Table, { type TableColumn } from "../../components/table.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ItemList, roleData } from "../../api/roleList.ts";
import router from "../../router/index.ts";
const params = ref<roleData>({
  page: 1,
  pageSize: 15
})

const tableRef = ref<any>(null)

const roleDel = (id: number) => {
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
    }
    )
}

//要删除选中的数据
const selectionData = ref<ItemList[]>([])
const handleSelectionChange = (rows: ItemList[]) => {
  console.log("rows", rows);
  selectionData.value = rows;
}

const delAll = async () => {

  let ids: number[] = selectionData.value.map((item) => item.id);

  await roleDeleteAll(ids)

  tableRef.value?.getData();

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
</script>

<style scoped lang="less">
.demo-form-inline {
  height: 35px;
}
</style>
