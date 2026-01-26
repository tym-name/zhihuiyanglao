<template>
    <div>
        <el-card>
            <Summary></Summary>
        </el-card>

        <div class="echarts">
            <el-card class="left">
                <getCompanyCount v-if="model.username==='admin'"></getCompanyCount>
                <Institution v-else></Institution>
            </el-card>
            <el-card class="right">
                <getElderlyCount v-if="model.username==='admin'"></getElderlyCount>
                <initPieChart v-else></initPieChart>
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