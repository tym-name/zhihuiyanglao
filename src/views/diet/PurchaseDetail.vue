<template>
    <el-card>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form label-width="auto">
                    <el-form-item label="创建时间:">
                        {{ purchaseData.addTime }}
                    </el-form-item>
                    <el-form-item label="申请人:">
                        {{ purchaseData.addAccountName }}
                    </el-form-item>
                    <el-form-item label="品种数:">
                        {{ purchaseData.counts }}
                    </el-form-item>
                    <el-form-item label="实际采购时间:">
                        {{ purchaseData.receiveTime }}
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12" style="font-weight: bold;font-size: 25px;">
                {{ purchaseData.state }}
            </el-col>
        </el-row>
        <el-table :data="foodsData" style="width: 100%">
            <el-table-column prop="id" label="序号" />
            <el-table-column prop="foodName" label="物料名称" />
            <el-table-column prop="unit" label="单位" />
            <el-table-column prop="supplierName" label="供应商" />
            <el-table-column prop="wholePrice" label="批发价">
                <template #default="{ row }">
                    {{ formatPrice(row.wholePrice) }}
                </template>
            </el-table-column>
            <el-table-column prop="sellPrice" label="零售价">
                <template #default="{ row }">
                    {{ formatPrice(row.sellPrice) }}
                </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" label="采购价">
                <template #default="{ row }">
                    {{ formatPrice(row.purchasePrice) }}
                </template>
            </el-table-column>
            <el-table-column prop="purchaseCounts" label="采购数量" />
            <el-table-column prop="receiveCounts" label="实际到货数量" />
        </el-table>
        <img :src="getFullImageUrl(purchaseData.picture)" alt="到货凭证" style="max-width: 200px; max-height: 200px;" />
    </el-card>
    <div style="display: flex;justify-content:center;">
        <el-button @click=" router.back()">返回</el-button>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type { PurchaseFoodItem, purchaseParam } from '../../api/purchase/purchaseType';
import { useRoute } from 'vue-router';
import { purchaseFoodsList, purchaseGet } from '../../api/purchase/purchase';
import { ElMessage } from 'element-plus';
import router from '../../router';

// 采购单详情数据
const purchaseData = ref<purchaseParam>({
    id: 0,
    companyId: 0,
    receiveTime: '',
    addTime: '',
    addAccountId: 0,
    picture: '',
    remarks: '',
    state: '',
    addAccountName: '',
    companyName: '',
    counts: 0,
    purchasePrice: 0,
    foods: null,
});

// 获取采购单详情
const route = useRoute();
const getPurchaseDetail = async () => {
    const id = route.params.id
    if (!id) {
        ElMessage.error('ID参数缺失');
        return;
    }
    const res = await purchaseGet({ id: Number(id) });
    if (res && res.data) {
        purchaseData.value = res.data;
    }
    // 获取采购物品列表
    await getPurchaseFoodsList();
};
getPurchaseDetail()
// 根据采购id获取采购物品列表
const foodsData = ref<PurchaseFoodItem[]>([]);
// 格式化价格显示
const formatPrice = (price: number) => {
    if (!price && price !== 0) return '';
    return `${price.toFixed()}`;
};
const getPurchaseFoodsList = async () => {
    const id = route.params.id;
    if (!id) {
        return;
    }

    const res = await purchaseFoodsList({ id: Number(id) });
    console.log('采购物品列表响应:', res);
    const data = res.data as any;
    // 处理不同的数据结构
    if (data.list && Array.isArray(data.list)) {
        foodsData.value = data.list.map((item: any) => ({
            ...item,
            // 如果接口返回的数据没有id，可以添加序号作为id
            id: item.id
        }));
    }
    console.log('处理后的采购物品列表:', foodsData.value);
}
// 获取完整的图片URL
const VITE_IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL
const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return '';

    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http://')) {
        return imagePath;
    }

    // 如果是相对路径，拼接基础URL
    if (imagePath.startsWith('/')) {
        return `${VITE_IMG_BASE_URL}${imagePath}`;
    }
    // 其他情况，直接拼接
    return `${VITE_IMG_BASE_URL}/${imagePath}`;
};

</script>

<style scoped lang='less'>
.el-row {
    margin-bottom: 10px;
}

button {
    margin-top: 20px;
}
</style>