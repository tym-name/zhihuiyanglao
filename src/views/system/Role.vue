<template>
  <div>
    <Table ref="tableRef" @selection-change="handleSelectionChange" :columns="columns" :init-params="params"
      :fetch-data="roleList">
      <template #buttons>
        <el-button type="success" @click="addRole">添加</el-button>
        <el-button type="danger" @click="delAll">批量删除</el-button>
        <el-button type="success" @click="router.push('/role-add')"><i class="iconfont icon-jia"></i>添加角色</el-button>
        <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
      </template>

      <template #operate="{ row }">
        <el-button link type="primary" @click="edit(row)"> <span style="font-size: 14px; margin-right: 5px;"
            class="iconfont icon-bianji"></span>修改</el-button>
        <el-button link type="danger" @click="roleDel(row.id)"><span style="font-size: 14px; margin-right: 5px;"
            class="iconfont icon-shanchu"></span>删除</el-button>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { roleDelete, roleDeleteAll, roleList } from "../../api/role/role.ts";
import Table, { type TableColumn } from "../../components/table.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ItemList, roleData } from "../../api/role/roleType.ts";
import router from "../../router/index.ts";
const params = ref<roleData>({
  page: 1,
  pageSize: 10
})

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)

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

<<<<<<< HEAD
// 添加角色
const addRole = () => {
  router.push({
    name: "RoleEdit"
  })
}
=======
const edit = (row: ItemList) => {
  router.push(`/role-add?id=${row.id}`)
};

>>>>>>> fd19cf0726ae102779924fc4613ba0f53bd90294

//要删除选中的数据
const selectionData = ref<ItemList[]>([])
const handleSelectionChange = (rows: ItemList[]) => {
  console.log("rows", rows);
  selectionData.value = rows;
  isBatchDelDisabled.value = rows.length === 0;
}

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
      await roleDeleteAll(ids); // 执行批量删除接口
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
.iconfont{
  margin: 5px;
}
</style>
