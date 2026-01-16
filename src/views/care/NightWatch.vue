<template>
    <div>
        <Table ref="tableRef" @selection-change="handleSelectionChange" :columns="columns" :init-params="params" :fetch-data="patrolList">
            <template #buttons>
                <el-button type="success" @click="add"><i class="iconfont icon-jia"></i>添加</el-button>
                <el-button @click="router.push('address')"><i class="iconfont icon-dizhiguanli"></i>地址管理</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled">
                    <i class="iconfont icon-shanchu"></i>批量删除
                </el-button>
            </template>
            <template #search>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="上报人:">
                        <el-input placeholder="请输入上报人" v-model="params.name"/>
                    </el-form-item>
                    <el-form-item label="巡检地址:">
                        <el-input placeholder="请输入巡检地址" v-model="params.address"/>
                    </el-form-item>
                    <el-form-item label="巡检时间:">
                        <el-date-picker style="width: 200px;" v-model="params.dateRange" type="daterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" :size="size" />
                    </el-form-item>
                    <el-form-item label="巡检状态:">
                        <el-select placeholder="请选择" v-model="params.state" style="width: 200px">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">查询</el-button>
                        <el-button>重置</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template #operate="{ row }">
                <el-button link type="danger" @click="deleteCompany(row.id)">
                    <i class="iconfont icon-shanchu"></i>删除
                </el-button>
            </template>
        </Table>
        <NightWatchAdd @save-success="handleSaveSuccess" v-if="roleDialogVisible" v-model="roleDialogVisible"></NightWatchAdd>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { patrolDelete, patrolDeleteAll, patrolList } from '../../api/nightwatch/nightwatch';
import Table, { type TableColumn } from '../../components/table.vue'
import NightWatchAdd from './NightWatchAdd.vue'
import type { NightType, PatrolItem } from '../../api/nightwatch/nightwatchType';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '../../router';

const size = ref<'default' | 'large' | 'small'>('default')
const roleDialogVisible=ref(false);
const tableRef = ref<any>(null)

const add=() => {
  roleDialogVisible.value = true;
};

const params = ref<NightType>({
  name: '',
  address: '',
  state: '',
  beginDate: '',
  endDate: ''
})

// 搜索方法（完善日期参数拆分）
const search = () => {
  handleDateSplit(); // 拆分日期范围
  tableRef.value?.refresh();
};

// 添加成功刷新（同样需要拆分日期）
const handleSaveSuccess = () => {
  handleDateSplit(); // 拆分日期范围
  tableRef.value?.refresh();
};

// 批量删除按钮禁用状态
const isBatchDelDisabled = ref(true)

// 单独提取日期拆分逻辑（复用性更强）
const handleDateSplit = () => {
  if (params.value.dateRange && params.value.dateRange.length === 2) {
    // 拆分数组：第一个元素为开始日期，第二个为结束日期
    params.value.beginDate = params.value.dateRange[0];
    params.value.endDate = params.value.dateRange[1];
  } else {
    // 清空日期（未选择或格式异常时）
    params.value.beginDate = '';
    params.value.endDate = '';
  }
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
      await patrolDelete(id); // 先执行删除接口
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
const handleSelectionChange = (rows: PatrolItem[]) => {
  console.log("选中的数据：", rows);
  selectionData.value = rows;
  isBatchDelDisabled.value = rows.length === 0;
}

// 选中的数据
const selectionData = ref<PatrolItem[]>([])
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
      await patrolDeleteAll(ids); // 执行批量删除接口
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
        label: "巡检地点",
        prop: "address",
    },
    {
        label: "巡检上报时间",
        prop: "addTime",
    },
    {
        label: "上报人",
        prop: "staffName",
    },
    {
        label: "巡检状态",
        prop: "state",
    },
    {
        label: "巡检记录",
        prop: "comment",
    },
    {
        label: "操作",
        slot: "operate",
        width: 120,
        fixed: "right",
    }
];

const options = [
    {
        value: '正常',
        label: '正常',
    },
    {
        value: '异常',
        label: '异常',
    },
    {
        value: '未巡查',
        label: '未巡查',
    }
]
</script>

<style scoped lang='less'>
.iconfont {
    margin: 5px;
}
</style>