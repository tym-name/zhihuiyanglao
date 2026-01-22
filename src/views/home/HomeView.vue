<template>
    <div>
        <el-card>
            <Summary></Summary>
        </el-card>

        <div class="echarts">
            <el-card class="left">
                <Institution></Institution>
            </el-card>
            <el-card class="right">
                <initPieChart></initPieChart>
            </el-card>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Summary from '../../components/homeView/summary.vue';
import Institution from '../../components/homeView/institution.vue';
import initPieChart from '@/components/homeView/initPieChart.vue';
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