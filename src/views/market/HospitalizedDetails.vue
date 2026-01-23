<template>
    <div class="content">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            <span>正在加载数据...</span>
        </div>

        <!-- 内容区域 -->
        <div v-else>
            <!-- 申请信息 -->
            <applyFor :applyData="detailData.applyData" class="section-item"></applyFor>
            <!-- 老人信息 -->
            <oldMan :oldManData="detailData.oldManData" class="section-item"></oldMan>
            <!-- 订单信息 -->
            <orderInfo :orderData="detailData.orderData" :oldManData="detailData.oldManData" class="section-item"></orderInfo>
            <!-- 财务信息 -->
            <financialInfo :financialData="detailData.financialData" class="section-item"></financialInfo>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElIcon } from 'element-plus';
import { elderlyGet } from '@/api/market/elderly';
import { Loading } from '@element-plus/icons-vue';
import { orderGet } from '../../api/Hospitalized/Hospitalized';
import applyFor from '../../components/Hospitalized/details/applyFor.vue';
import oldMan from '../../components/Hospitalized/details/oldMan.vue';
import orderInfo from '../../components/Hospitalized/details/orderInfo.vue';
import financialInfo from '../../components/Hospitalized/details/financialInfo.vue';

// 获取路由实例
const route = useRoute();

// 详情数据
const detailData = reactive({
    /* 申请信息 */
    applyData: {},
    /* 老人信息 */
    oldManData: {},
    /* 订单信息 */
    orderData: {},
    /* 财务信息 */
    financialData: {}
});

// 加载状态
const loading = ref(false);

// 获取详情数据
const getDetailData = async () => {
    const id = route.query.id as string;
    console.log('获取详情数据id:', id);

    const res = await orderGet(Number(id));
    console.log('获取详情数据成功：', res);

    const red = await elderlyGet((res as any).data.elderlyId);
    console.log('获取老人详情数据成功：', red);

    /* 申请信息 */
    detailData.applyData = (red as any).data;
    /* 老人信息 */
    detailData.oldManData = (red as any).data;
    /* 订单信息 */
    detailData.orderData = (res as any).data;
    /* 财务信息 */
    detailData.financialData = (res as any).data;
}

// 组件挂载时获取数据
onMounted(() => {
    getDetailData();
});
</script>