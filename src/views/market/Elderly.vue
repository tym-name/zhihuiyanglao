<template>
    <Table ref="tableRef" @selection-change="handleSelectionChange" :columns="columns" :fetch-data="getCaptcha">
        <template #buttons>
            <el-button type="primary" @click="handleAdd">新增老人</el-button>
            <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled"><i class="iconfont icon-shanchu"></i>批量删除</el-button>
        </template>
        <template #gender="{ row }">
            {{ row.gender === 1 ? '男' : '女' }}
        </template>
        <template #search>
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="机构名称:">
                    <el-input placeholder="请输入机构名称" clearable />
                </el-form-item>
                <el-form-item label="管理员姓名:">
                    <el-input placeholder="请输入管理员姓名" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template #operate="{ row }">
            <el-button link type="primary"><i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button link type="primary"><i class="iconfont icon-file"></i>档案管理</el-button>
            <el-button link type="primary"><i class="iconfont icon-zixun"></i>排班管理</el-button>
            <el-button link type="primary"><i class="iconfont icon-xiangqing"></i>计划任务</el-button>
            <el-button link type="danger" @click="deleteCompany(row.id)"><i class="iconfont icon-shanchu"></i>删除</el-button>
        </template>
    </Table>
</template>

<script setup lang='ts'>
import Table, { type TableColumn } from "../../components/table.vue";
import { elderlyDelete, elderlyDeleteAll, getCaptcha } from "../../api/market/elderly";
import router from "../../router";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import type { PersonInfo } from "../../api/market/elderlyType";

const tableRef = ref<any>(null)
const isBatchDelDisabled = ref(true)

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
        label: "头像",
        image: "photo",
    },
    {
        label: "老人姓名",
        prop: "name",
    },
    {
        label: "性别",
        prop: "state",
        slot: "gender",
    },
    {
        label: "身份证号",
        prop: "idCard",
        width: 180,
    },
    {
        label: "床位",
        prop: "begName",
    },
    {
        label: "状态",
        prop: "stateName",
    },
    {
        label: "操作",
        slot: "operate",
        width: 520,
        fixed: "right",
    }
];

// 新增老人
const handleAdd = () => {
    router.push('/elderly-edit');
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
      await elderlyDelete(id); // 先执行删除接口
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
const selectionData = ref<PersonInfo[]>([])
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
      await elderlyDeleteAll(ids); // 执行批量删除接口
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
const handleSelectionChange = (rows: PersonInfo[]) => {
  console.log("选中的数据：", rows);
  selectionData.value = rows;
  isBatchDelDisabled.value = rows.length === 0;
}
</script>

<style scoped lang='less'>
.iconfont {
    margin: 5px;
}

.demo-form-inline {
    height: 35px;
}
</style>