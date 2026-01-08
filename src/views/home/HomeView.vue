<template>
    <div>
        <el-card>
            <Summary></Summary>
        </el-card>

        <div class="echarts">
            <el-card class="left">
                <template #header>
                    <div class="card-header">
                        <span>机构分布地图</span>
                    </div>
                    <div class="box"></div>
                </template>
                <Institution></Institution>
            </el-card>
            <el-card class="right">
                <template #header>
                    <div class="card-header">
                        <span>各地区老人柱状图</span>
                    </div>
                </template>
                <div class="box"></div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang='ts'>
import Summary from '../../components/homeView/summary.vue';
import Institution from '../../components/homeView/institution.vue';
</script>

<style scoped lang='less'>
@import url('../../assets/less/home/homeView/homeView.less');

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