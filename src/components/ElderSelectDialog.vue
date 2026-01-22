<!-- src/components/ElderSelectDialog.vue -->
<template>
  <el-dialog v-model="visible" title="选择老人" width="800px" :before-close="handleClose" @open="onOpen">
    <div class="elder-select-container">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-form :inline="true" size="small">
          <el-form-item label="姓名">
            <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @clear="handleSearch"
              style="width: 200px; height: 30px;" />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="queryParams.idCard" placeholder="请输入身份证号" clearable @clear="handleSearch"
              style="width: 200px;height: 30px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="height: 30px;" @click="handleSearch">查询</el-button>
            <el-button @click="resetForm" style="height: 30px;">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格区域 -->
      <div class="table-section">
        <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick">
          <el-table-column prop="name" label="姓名" />
          <el-table-column label="头像">
            <template #default="{ row }">
              <img v-if="row?.photo" :src="API_BASE_URL + row.photo" alt="头像" class="avatar-img" />
              <div v-else class="avatar-placeholder">暂无头像</div>
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别">
            <template #default="{ row }">
              <span>{{ row?.sex == 0 ? "女" : "男" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleSelect(row)">
                选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区域 -->
      <div class="pagination-section">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { goOutGetElderly } from '../api/OutboundRegistration/Outbound'
import { ElMessage } from 'element-plus'
// 声明环境变量
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://123.57.237.81:8080/caresystem/";
// 组件属性
interface Props {
  modelValue?: boolean
  onConfirm?: (data: any) => void
}
// 分页参数类型
interface PaginationParams {
  page: number;
  pageSize: number;
}
const dataType = ref<PaginationParams>({
  page: 1,
  pageSize: 10
})
// 组件事件
const emit = defineEmits(['update:modelValue', 'confirm'])

// 接收父组件传递的值
const props = defineProps<Props>()

// 对话框控制
const visible = ref(false)

// 查询参数
const queryParams = reactive({
  name: '',
  idCard: ''
})

// 表格数据
const tableData = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
  visible.value = val || false
})

// 打开对话框时触发
const onOpen = async () => {
  try {
    // 这里可以添加初始化逻辑
    let res = await goOutGetElderly(dataType.value)
    if (res && res.data && res.data.list) {
      tableData.value = res.data.list.filter((item: any) => item.state == 3)
      total.value = res.data.total || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取老人列表失败:', error)
    ElMessage.error('获取老人列表失败，请稍后重试')
    tableData.value = []
    total.value = 0
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
}  

// 查询
const handleSearch = () => {
  // 这里可以添加实际的查询逻辑
  console.log('查询:', queryParams)
}

// 重置表单
const resetForm = () => {
  queryParams.name = ''
  queryParams.idCard = ''
  handleSearch()
}

// 选择老人
const handleSelect = (row: any) => {
  if (props.onConfirm) {
    props.onConfirm(row)
  }
  visible.value = false
  emit('update:modelValue', false)
}

// 行点击事件
const handleRowClick = (row: any) => {
  handleSelect(row)
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // 这里可以重新加载数据
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // 这里可以重新加载数据
}
</script>

<style scoped lang='less'>
.elder-select-container {
  padding: 20px;

  .search-section {
    margin-bottom: 20px;

    .el-form-item {
      margin-right: 20px;
    }
  }

  .table-section {
    margin-bottom: 20px;

    .avatar-img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .pagination-section {
    text-align: center;
    padding-top: 20px;

  }

  .el-table {
    background-color: #fff;
    border-radius: 4px;
  }

  .el-table th {
    background-color: #f5f7fa;
    font-weight: bold;
    color: #333;
  }

  .el-table td {
    padding: 12px 0;
  }

  .el-button--primary {
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>