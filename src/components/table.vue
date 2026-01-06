<template>
  <div class="table-container">
    <!-- 搜索卡片 -->
    <el-card v-if="$slots.search" class="search-card" shadow="never">
      <slot name="search"></slot>
    </el-card>

    <!-- 表格卡片 -->
    <el-card class="table-card" shadow="never">
      <!-- 操作按钮区 -->
      <div class="table-actions" v-if="$slots.buttons">
        <slot name="buttons"></slot>
      </div>

      <!-- 表格主体 -->
      <el-table ref="tableRef" @selection-change="handleSelectionChange" :data="tableData"
        :style="{ width: tableWidth }" v-loading="isLoading" stripe>
        <!-- 选择列（通过配置控制显示） -->
        <el-table-column v-if="showSelectionColumn" type="selection" width="55" fixed="left" />

        <!-- 动态列渲染 -->
        <el-table-column v-for="column in columns" :key="column.prop || column.label" :type="column.type"
          :fixed="column.fixed" :prop="column.prop" :label="column.label" :width="column.width"
          :min-width="column.minWidth" :align="column.align || 'center'">
          <!-- 自定义插槽列 -->
          <template v-if="column.slot" #default="scope">
            <slot :name="column.slot" :row="scope.row" :index="scope.index"></slot>
          </template>

          <!-- 时间格式化列 -->
          <template v-else-if="column.formatTime" #default="scope">
            {{ formatTime(scope.row[column.prop!], column.formatTime) }}
          </template>

          <!-- 图片列 -->
          <template v-else-if="column.image" #default="scope">
            <el-image v-if="scope.row[column.image!]" preview-teleported class="table-image"
              :src="getImageUrl(scope.row[column.image!])" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
              :preview-src-list="[getImageUrl(scope.row[column.image!])]" show-progress fit="cover" />
            <span v-else>暂无图片</span>
          </template>


        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.currentPage" v-model:page-size="pagination.pageSize"
          :page-sizes="pageSizes" :total="total" background layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" :disabled="total === 0" />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { dayjs } from 'element-plus';
import {
  ref,
  reactive,
  computed,
  onMounted,
} from 'vue';

// ========== 类型定义 ==========
/** 表格列配置项 */
export interface TableColumn {
  type?: 'selection' | 'index' | 'expand';
  label?: string;
  prop?: string;
  width?: number | string;
  minWidth?: number | string; // 最小宽度（更灵活）
  slot?: string; // 自定义插槽名称
  fixed?: 'left' | 'right' | boolean;
  formatTime?: string; // 时间格式化格式
  image?: string; // 图片字段名
  align?: 'left' | 'center' | 'right'; // 对齐方式
}

/** 分页配置 */
interface Pagination {
  currentPage: number;
  pageSize: number;
}

/** 组件Props类型 */
interface TableProps {
  /** 列配置 */
  columns: TableColumn[];
  /** 是否显示搜索区 */
  hasSearch?: boolean;
  /** 表格宽度 */
  width?: string | number;
  /** 分页尺寸选项 */
  pageSizes?: number[];
  /** 初始请求参数 */
  initParams?: Record<string, any>;
  /** 数据请求方法 */
  fetchData: (params?: any) => Promise<any>;
  /** 是否显示选择列 */
  showSelectionColumn?: boolean;
  /** 是否自动初始化数据 */
  autoInit?: boolean;
}

/** 组件Emits类型 */
type TableEmits = {
  /** 选择项变化 */
  'selection-change': [val: any[]];
  /** 数据加载完成 */
  'load-success': [data: any[]];
  /** 数据加载失败 */
  'load-fail': [error: Error];
};

// ========== Props & Emits ==========
const props = withDefaults(defineProps<TableProps>(), {
  columns: () => [],
  pageSizes: () => [10, 20, 50, 100], // 更合理的默认分页尺寸
  hasSearch: true,
  width: '100%',
  initParams: () => ({}),
  showSelectionColumn: false,
  autoInit: true
});

const emits = defineEmits<TableEmits>();

// ========== 响应式数据 ==========
/** 表格实例 */
const tableRef = ref<InstanceType<typeof import('element-plus')['ElTable']>>();
/** 加载状态 */
const isLoading = ref(false);
/** 表格数据 */
const tableData = ref<any[]>([]);
/** 总条数 */
const total = ref(0);
/** 分页参数 */
const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: props.pageSizes[0] // 默认取第一个分页尺寸
});

// 计算属性
/** 表格宽度（统一处理） */
const tableWidth = computed(() => {
  return props.width === '100%' ? '100%' : `${props.width}px`;
});

/** 合并后的请求参数 */
const requestParams = computed(() => ({
  page: pagination.currentPage,
  pageSize: pagination.pageSize,
  ...props.initParams
}));

// ========== 工具方法 ==========
/**
 * 格式化时间
 * @param val 时间值
 * @param format 格式化格式
 */
const formatTime = (val: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!val) return '-';
  try {
    return dayjs(val).format(format);
  } catch (error) {
    console.warn('时间格式化失败:', error);
    return '-';
  }
};

/**
 * 获取完整图片URL
 * @param path 图片相对路径
 */
const getImageUrl = (path: string) => {
  if (!path) return '';
  // 处理绝对路径情况
  if (path.startsWith('http') || path.startsWith('//')) return path;
  return import.meta.env.VITE_IMG_URL + path;
};

// ========== 核心逻辑 ==========
/**
 * 获取表格数据
 * @param resetPage 是否重置页码到第一页
 */
const getData = async (resetPage = false) => {
  if (resetPage) {
    pagination.currentPage = 1;
  }

  isLoading.value = true;
  try {
    // 合并参数：初始参数 + 分页参数
    const res = await props.fetchData({ ...requestParams.value });

    tableData.value = res.data.list || [];
    total.value = res.data.counts || 0;

    emits('load-success', tableData.value);
  } catch (error) {
    console.error('表格数据加载失败:', error);
    tableData.value = [];
    total.value = 0;
    emits('load-fail', error as Error);
  } finally {
    isLoading.value = false;
  }
};

/** 刷新数据（重置页码） */
const refresh = () => getData(true);

/** 清空选择项 */
const clearSelection = () => {
  tableRef.value?.clearSelection();
};

/** 分页尺寸变化 */
const handleSizeChange = (val: number) => {
  pagination.pageSize = val;
  getData();
};

/** 当前页变化 */
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  getData();
};

/** 选择项变化 */
const handleSelectionChange = (val: any[]) => {
  emits('selection-change', val);
};

// 自动初始化数据
onMounted(() => {
  if (props.autoInit) {
    getData();
  }
});

// ========== 暴露方法 ==========
defineExpose({
  refresh,
  getData,
  clearSelection,
  tableRef
});
</script>

<style scoped>
.table-container {
  width: 100%;
  box-sizing: border-box;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  --el-card-padding: 20px;
}

.table-actions {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.table-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

/* 修复el-image预览样式穿透问题 */
:deep(.el-image-viewer__wrapper) {
  z-index: 9999 !important;
}
</style>