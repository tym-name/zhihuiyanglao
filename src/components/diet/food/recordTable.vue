<template>
    <div>
        <el-table :data="FoodPriceListData" style="width: 100%">
            <el-table-column prop="updateTime" label="价格更新日期" />
            <el-table-column prop="wholePrice" label="批发价" />
            <el-table-column prop="sellPrice" label="零售价" />
            <el-table-column prop="purchasePrice" label="采购价" />
            <el-table-column prop="addAccountName" label="更新人" />
            <el-table-column label="操作" width="100" fixed="right">
                <template #default="scope">
                    <el-button link type="primary" @click="update(scope.row)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Priceupdate :is-show="showPriceDialog" :close="closePriceDialog" :id="priceid" :foodPrice="foodPriceDetails"
            @refreshList="refreshListData">
        </Priceupdate>

    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
import type { FoodPriceListItem } from '../../../api/diet/food/foodType';
import { FoodPriceList } from '../../../api/diet/food/food';
import { number } from 'echarts';
import Priceupdate from './priceupdate.vue';

const FoodPriceListData = ref<FoodPriceListItem[]>([]);
const props = defineProps<{ id: number }>();
const priceid = ref<number>(0);
const foodPriceDetails = ref<FoodPriceListItem>({
    id: 0,
    foodId: 0,
    wholePrice: null,
    sellPrice: null,
    purchasePrice: null,
    updateTime: '',
    addAccountId: 0,
    addAccountName: ''
})
const getFoodPriceList = async () => {
    let res = await FoodPriceList(props.id)
    console.log(res);
    FoodPriceListData.value = res.data.list

}
getFoodPriceList()

const refreshListData = () => {
    // 处理刷新列表的逻辑
    getFoodPriceList()
}

//编辑弹框
const showPriceDialog = ref(false)
const closePriceDialog = () => {
    showPriceDialog.value = false
}

const update = (row: FoodPriceListItem) => {
    priceid.value = row.id
    showPriceDialog.value = true
    foodPriceDetails.value = row
}
</script>

<style scoped lang='less'></style>