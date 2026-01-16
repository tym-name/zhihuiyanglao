<template>
    <div>
        <Table ref="tableRef" :columns="columns" :fetch-data="foodList" @selection-change="handleSelectionChange">
            <template #buttons>
                <el-button type="success" @click="addfood">添加</el-button>
                <el-button type="danger" @click="delAll" :disabled="isBatchDelDisabled">批量删除</el-button>
            </template>

            <template #operate="{ row }">
                <el-button link type="primary" @click="updateFood(row)">
                    <i class="iconfont icon-bianji"></i>
                    编辑
                </el-button>
                <el-button link type="primary" @click="openPriceDialog(row.id)">
                    <i class="iconfont icon-xiangqing"></i>
                    价格更新
                </el-button>
                <el-button link type="primary" @click="goToPriceAnalysis(row)">
                    <i class="iconfont icon-fenxi"></i>
                    价格分析
                </el-button>
                <el-button link type="danger" @click="delFoodById(row.id)">
                    <i class="iconfont icon-shanchu"></i>
                    删除
                </el-button>
            </template>
        </Table>
        <Foodadd :isShow="showAddDialog" :close="closeDialog" @refreshList="getFoodList" :food="foodDetails"></Foodadd>
        <Priceupdate :isShow="showPriceDialog" :close="closePriceDialog" @refreshList="getFoodList" :id="id">
        </Priceupdate>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Table, { type TableColumn } from '../../components/table.vue';
import { delAllFood, deleteFood, foodList, FoodPriceList } from '../../api/diet/food/food';
import Foodadd from '../../components/diet/food/foodadd.vue';
import Priceupdate from '../../components/diet/food/priceupdate.vue';
import type { FoodItem } from '../../api/diet/food/foodType';
import { ElMessage, ElMessageBox } from 'element-plus';
import router from '../../router';

const tableRef = ref<any>(null)

//表格
const columns: TableColumn[] = [
    {
        type: "selection",
        width: "50",
    },
    {
        label: "序号",
        prop: "id",
    },
    {
        label: "物料名称",
        prop: "name",
    },
    {
        label: "单位",
        prop: "unit",
    },
    {
        label: "供应商",
        prop: "supplierName",
    },
    {
        label: "批发价",
        prop: "wholePrice",
    },
    {
        label: "零售价",
        prop: "sellPrice",
    },
    {
        label: "采购价",
        prop: "purchasePrice",
    },
    {
        label: "价格更新日期",
        prop: "updateTime",
    },
    {
        label: "操作",
        width: 320,
        slot: "operate",
        fixed: "right",
    }
];
const foodDetails = ref<FoodItem>({
    id: 0,
    companyId: 0,
    name: '',
    unit: '',
    supplierId: 0,
    wholePrice: null,
    sellPrice: null,
    purchasePrice: null,
    updateTime: null,
    supplierName: ''
})

const showAddDialog = ref(false);

const closeDialog = () => {
    showAddDialog.value = false;

};

const getFoodList = async () => {
    tableRef.value?.refresh();
}

// 初始化加载列表
getFoodList()


//修改时间
const showPriceDialog = ref(false)
const closePriceDialog = () => {
    showPriceDialog.value = false
}

const id = ref(0)
//根据食材id获取价格列表
const getFoodPriceList = async () => {
    let res = await FoodPriceList(id.value)
    console.log('价格列表', res);
}

const openPriceDialog = (Id: number) => {
    showPriceDialog.value = !showPriceDialog.value
    id.value = Id
    getFoodPriceList()
}

// 修改

const updateFood = (row: FoodItem) => {
    showAddDialog.value = !showAddDialog.value
    foodDetails.value = row
}

const addfood = () => {
    showAddDialog.value = !showAddDialog.value
    foodDetails.value = {
        id: 0,
        companyId: 0,
        name: '',
        unit: '',
        supplierId: 0,
        wholePrice: null,
        sellPrice: null,
        purchasePrice: null,
        updateTime: null,
        supplierName: ''
    }
}

//单删
const delFoodById = (id: number) => {


    ElMessageBox.confirm(
        '是否删除该条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let res = await deleteFood(id)
            console.log(res);
            if (res.code === 10000) {
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                getFoodList()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })

}

//批量删除
const isBatchDelDisabled = ref(true)
const selectionData = ref<FoodItem[]>([])
const ids = ref<number[]>([])
const handleSelectionChange = (rows: FoodItem[]) => {
    selectionData.value = rows;
    ids.value = rows.map(row => row.id);
    isBatchDelDisabled.value = rows.length === 0;//判断是否禁用
}

const delAll = async () => {
    ElMessageBox.confirm(
        '是否删除多条记录？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let res = await delAllFood(ids.value)
            console.log(res);
            if (res.code === 10000) {
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
                getFoodList()
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

const goToPriceAnalysis = (row: FoodItem) => {
    sessionStorage.setItem('foodDetails', JSON.stringify(row))
    router.push('/priceanalysis')
}

</script>

<style scoped lang='less'>
.iconfont {
    font-size: 13px;
    margin-right: 2px;
}
</style>