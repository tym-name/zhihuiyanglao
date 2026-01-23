<template>
    <div>
        <el-card>
            <Summary></Summary>
        </el-card>

        <div class="echarts">
            <el-card class="left">
                <Institution v-if="model.username==='cpglyzh'"></Institution>
                <Institution v-if="model.username==='cstext'"></Institution>
                <getCompanyCount v-if="model.username==='admin'"></getCompanyCount>
            </el-card>
            <el-card class="right">
                <initPieChart v-if="model.username==='cpglyzh'"></initPieChart>
                <initPieChart v-if="model.username==='cstext'"></initPieChart>
                <getElderlyCount v-if="model.username==='admin'"></getElderlyCount>
            </el-card>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Summary from '../../components/homeView/summary.vue';
import Institution from '../../components/homeView/institution.vue';
import initPieChart from '@/components/homeView/initPieChart.vue';
import { useAuthStore } from '@/stores/auth';
import getCompanyCount from '@/components/homeView/getCompanyCount.vue'
import getElderlyCount from '@/components/homeView/getElderlyCount.vue'
// 初始化authStore
const authStore = useAuthStore();
const model = authStore.model;

</script>

<style scoped lang='less'>

.echarts {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}

/deep/.el-card__header {
    height: 60px !important;

}

.card-header {
    span {
        font-size: 16px;
    }
}

.left {
    width: 49.5%;
}

.right {
    width: 49.5%;
}
</style>