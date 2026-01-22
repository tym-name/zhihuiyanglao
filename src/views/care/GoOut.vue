<template>
      <Etabs v-bind="tableListData">
         <template #Delete="{ row, delListOne }">
            <el-button type="primary" link @click="GoOutDetails(row)"><el-icon>
                  <Tickets />
               </el-icon>查看详情</el-button>
            <el-button type="primary" link @click="edit(row)"><el-icon>
                  <Edit />
               </el-icon>编辑</el-button>
            <el-button type="danger" link @click="delListOne(row.id)"><el-icon>
                  <Delete />
               </el-icon>删除</el-button>
         </template>
         <template #delCard="{ delAll, checkLength }">
            <div style="margin-bottom:20px">
               <el-button type="success" @click="openSelectDialog"><el-icon>
                     <Plus />
                  </el-icon>新增</el-button>
               <el-button type="danger" :disabled="checkLength === 0" @click="delAll"><el-icon>
                     <Delete />
                  </el-icon>批量删除</el-button>
            </div>

         </template>
         <template #searchCard="{ Params, search }">
            <el-form :inline="true" class="demo-form-inline">
               <el-form-item label="老人姓名:">
                  <el-input v-model="Params.name" placeholder="请输入老人姓名" clearable style="width: 195px" />
               </el-form-item>
               <el-form-item label="审批状态:">
                  <el-select v-model="Params.state" placeholder="请选择审批状态" style="width: 240px">
                     <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
               </el-form-item>
               <el-form-item label="外出时间:">
                  <el-date-picker v-model="Params.date" type="daterange" value-format="YYYY-MM-DD" range-separator="-"
                     start-placeholder="开始日期" end-placeholder="结束日期" style="width: 250px;" size="default"
                     @change="(val: string[]) => dateChange(val, Params)" />
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" @click="search"><el-icon>
                        <Search />
                     </el-icon>查询</el-button>
                  <el-button @click="reset(search, Params)"><el-icon>
                        <Refresh />
                     </el-icon>重置</el-button>
               </el-form-item>
            </el-form>
         </template>
      </Etabs>
       <ElderSelectDialog
      v-model="dialogVisible"
      @confirm="handleConfirm"
    />
</template>

<script setup lang="ts">
import Etabs from '../../utils/Etabs.vue';
import { ref, reactive } from 'vue';
import type { propDataType } from '../../utils/Etabs.vue';
import { goOutDelete,  goOutlist } from '../../api/goout/goout';
import { Delete, Search, Refresh } from '@element-plus/icons-vue';
import { Plus, Tickets, Edit } from '@element-plus/icons-vue'
import ElderSelectDialog from '../../components/ElderSelectDialog.vue'
import router from '../../router';

// 定义插槽数据类型
interface SlotData {
  row: any;
  delListOne: (id: number | string) => void;
}

interface DelCardSlotData {
  delAll: () => void;
  checkLength: number;
}

interface SearchCardSlotData {
  Params: any;
  search: () => void;
}

const dialogVisible = ref(false)

// 使用泛型或扩展类型来解决类型问题
let tableListData: propDataType & {
  slots?: {
    Delete?: SlotData;
    delCard?: DelCardSlotData;
    searchCard?: SearchCardSlotData;
  }
} = reactive({
   column: [
      {
         label: "序号",
         prop: "id"
      },
      {
         label: "老人姓名",
         prop: "elderlyName"
      },
      {
         label: "床位号",
         prop: "begName"
      },
      {
         label: "陪同人员姓名",
         prop: "name"
      },
      {
         label: "陪同人员手机号",
         prop: "mobile",
         width: "155"
      },
      {
         label: "外出时间",
         prop: "startTime",
         width: "155"
      },

      {
         label: "上报人",
         prop: "addAccountName"
      },
      {
         label: "上报时间",
         prop: "addTime",
         width: "155"
      },
      {
         label: "审批状态",
         prop: "stateName",

      },
      {
         label: "操作",
         prop: 'Delete',
         slot: true,
         width: "240"
      }
   ],
   getList: goOutlist,
   delListOne: goOutDelete,

   isPage: true
})

// 搜索选择器结果
const options = [
   {
      value: '0',
      label: '未返回',
   },
   {
      value: '1',
      label: '已返回',
   },
   {
      value: '2',
      label: '逾期未返回',
   },
]

const reset = (search: Function, Params: any) => {
   Params.name = ''
   Params.state = ''

   search()
}

const dateChange = (val: string[], Params: any) => {
   if (!Params.date) Params.date = [];
   Params.date[0] = val[0]
   Params.date[1] = val[1]
   Params.startTime = val[0];
   Params.beginDate = val[0];
   Params.endDate = val[1];
};

const GoOutDetails = (row: any) => {
   router.push({ path: `/care/care/details/${row.id}` })

}

const edit = (row: any) => {
   router.push({ path: `/care/care/edit/${row.id}` })

}

const openSelectDialog = () => {
  dialogVisible.value = true 
}

const handleConfirm = (data: any) => {
   console.log(data,"2222");
   console.log(data.name);
   
router.push({ 
  path: '/care/care/add',
  query: { 
    oldId: encodeURIComponent(data.id), 
  } 
})
}
</script>

<style scoped lang='less'></style>