<template>
  <div style="width: 100%;">
    <!-- 搜索 -->
    <el-card v-if="propData.isSelect" style="margin-bottom:10px;display: flex;" shadow="hover">
      <slot name="searchCard" :Params="Params" :reset="reset" :search="search"></slot>
    </el-card>
    <el-card style="max-width: 100%;height: 100%;" shadow="hover">
      <!-- 添加多次删除 -->
      <slot name="delCard" :addTableListDataItme="addTableListDataItme" :checkLength="multipleSelection.length"
        :delAll="delAll"></slot>
      <!-- 列表 -->
      <el-table :border="propData.isBorder ? true : false" v-loading="loading" ref="multipleTableRef"
        :data="tableListData" style="width: 100%;height: 100%; " @selection-change="handleSelectionChange">
        <el-table-column v-if="ischeck" type="selection" :selectable="isSelectable" width="42" />

        <el-table-column v-for="(item) in column" :prop=item.prop :label=item.label style="color: black;"
          :width=item.width>
          <!-- 删除 -->
          <template v-if="item.slot" #default="scope">
            <slot :name="item.prop" :delListOne="delListOne" :row="scope.row"></slot>
          </template>
        </el-table-column>
        <slot v-if="isBottom" name="isBottom"></slot>
      </el-table>
      <!-- 分页 -->
      <div v-if="propData.isPage" class="pagination">
        <el-pagination v-model:current-page="Params.page" v-model:page-size="Params.pageSize"
          :page-sizes="[10, 20, 30, 50]" :small="small" :disabled="disabled" background
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import emitter from './emitter';
import { ElMessage, ElMessageBox } from 'element-plus';
import { inject, onMounted } from 'vue';
import { ref, reactive } from 'vue';
export interface CheckData<T> {
  ids: string[],
  checkLength: number,
  tabData: T
}
const loading = ref(true)
interface ColumnType {
  prop: string,
  label: string,
  width?: string,
  slot?: boolean,
  isPhoto?: boolean,
  isState?: boolean,
  isSex?: boolean,
  isRoles?: boolean,
  isEnable?: boolean
}
export interface propDataType {
  DelListAll?: Function
  getList: Function
  delListOne?: Function
  column: Array<ColumnType>
  isSelect?: boolean,
  isPage?: boolean,
  ischeck?: boolean,
  oneListUpdataParam?: any,
  isBorder?: boolean,
  apiId?: number,
  isBottom?: boolean
}

const propData = withDefaults(defineProps<propDataType>(), {
  delListOne: () => () => { },
  DelListAll: () => () => { },
  getList: () => () => { },
  columns: () => [],
  isSelect: true,
  isPage: true,
  ischeck: true,
  apiId: 0,
  isBottom: false,
  oneListUpdataParam: () => { }
})

let Params = reactive<any>({
  page: 1,
  pageSize: 10

})

const tableListData = ref<any>([])
const total = ref(0)
const getData = async () => {
  if (propData.oneListUpdataParam) {
    Params = propData.oneListUpdataParam
  }

  const res = await propData.getList(propData.apiId == 0 ? Params : propData.apiId)
  console.log(res.data, 213123);
  tableListData.value = res.data.list;



  total.value = res.data.counts
  loading.value = false
};
// 重置
const reset = () => {
  Params.value = {
    pageSize: 10,
    page: 1
  }
  getData()
}
// 添加列表项
const addTableListDataItme = (data: any) => {
  tableListData.value.push(data)

}
onMounted(() => {
  getData()
})
emitter.on('addTableListDataItme', (data: any) => {
  addTableListDataItme(data)
})

emitter.on('getList', () => {
  getData()
})

// 搜索方法

const search = () => {

  Params.page = 1

  getData()
}

// 单个删除
const delListOne = (id: number) => {
  ElMessageBox.confirm('确定要删除这个数据吗')
    .then(async () => {
      console.log(id);

      let res = await propData.delListOne(id)
      if (res.code == 10000) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getData()
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
      }
    })
    .catch(() => {
      // catch error
    })

}
let ischecked = ref(false)
//批量删除数据
const delAll = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error("请选择要删除的数据");
    return;
  }
  ElMessageBox.confirm("确定要删除选中的数据吗?")
    .then(async () => {
      //得到选中数据的id
      let ids = multipleSelection.value.map((item: any) => item.id);
      let res = await propData.DelListAll(ids);

      if (res.code == 10000) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getData()
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
      }
      getData();
    })
    .catch(() => {
      // catch error
    });
};


const small = ref(false)
const disabled = ref(false)
const multipleSelection = ref<any[]>([])
const handleSizeChange = (val: number) => {
  Params.pageSize = val.toString()
  console.log(val, 'pageSize');
  getData()
}
const handleCurrentChange = (val: number) => {
  Params.page = val.toString()
  console.log(val, 'page');
  getData()
}

let checkData = ref(inject<CheckData<any>>('checkData'))
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
  if (checkData.value) {
    checkData.value.checkLength = val.length
    checkData.value.ids = val.map((item: any) => item.id);
    checkData.value.tabData = val
  }
  val.length > 0 ? ischecked.value = true : ischecked.value = false
}


const isSelectable = (row: any) => {
  // 返回 false 表示禁用该行的 checkbox
  return row.checkName == '请假' ? false : true
}

const getdata = () => {
  Params.page = 1
  getData()
}

defineExpose({ getdata, Params })
</script>

<style scoped lang='less'>
.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
}


:deep(.cell) {
  font-size: 14px;

}

:deep(.el-table__header th) {
  // background-color: #f5f7fa; // 设置表头背景色以实现高亮
  font-weight: bold; // 加粗
  color: #333; // 设置文字颜色
  font-size: 25px;
}
</style>
