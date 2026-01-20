<template>
    <div class="body">
        <el-card>
            <div class="date">
                <p>
                    <span class="title">食材名称:</span>
                    <span>{{ foodDetails?.name }}</span>
                </p>
                <p>
                    <span class="title">价格更新于:</span>
                    <span>{{ foodDetails?.updateTime }}</span>
                </p>
            </div>
            <p>
                <span class="title">供应商:</span>
                <span>{{ foodDetails?.supplierName }}</span>
            </p>
            <p>
                <span class="title">当前批发价:</span>
                <span>{{ foodDetails?.wholePrice }}</span>
            </p>
            <p>
                <span class="title">当前零售价:</span>
                <span>{{ foodDetails?.sellPrice }}</span>
            </p>
            <p>
                <span class="title">当前采购价:</span>
                <span>{{ foodDetails?.purchasePrice }}</span>
            </p>
        </el-card>

        <el-card>
            <p>价格趋势</p>
            <Echarts></Echarts>
        </el-card>
        <el-card v-if="foodDetails && foodDetails.id !== undefined">
            <p>价格更新记录</p>
            <RecordTable :id="foodDetails?.id"></RecordTable>
        </el-card>
        <div class="btn"><el-button>返回</el-button></div>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import type { FoodItem } from '../../api/diet/food/foodType';
import Echarts from '../../components/diet/food/echarts.vue';
import RecordTable from '../../components/diet/food/recordTable.vue';
const foodDetails = ref<FoodItem>()
onMounted(() => {
    const storedData = sessionStorage.getItem('foodDetails');
    if (storedData) {
        foodDetails.value = JSON.parse(storedData);
    }
})


</script>

<style scoped lang='less'>
.btn {
    width: 100%;
    display: flex;
    justify-content: center;
}

.el-button {
    margin-top: 10px;
}

.el-card {
    margin-bottom: 10px;
}

.date {
    display: flex;
    justify-content: space-between;
    margin: 0 0 -15px;
}

.title {
    display: inline-block;
    width: 120px;

}
</style>