<template>
    <div>
        <el-card>
            <div class="top">
                <el-form label-width="auto" style="max-width: 600px">
                    <el-form-item label="创建时间:">
                        {{ purchaseData?.addTime }}
                    </el-form-item>
                    <el-form-item label="申请人:">
                        {{ purchaseData?.addAccountName }}
                    </el-form-item>
                    <el-form-item label="品种数:">
                        {{ purchaseData?.counts }}
                    </el-form-item>
                    <el-form-item label="实际采购成本:">
                        {{ purchaseData?.purchasePrice }}
                    </el-form-item>
                </el-form>

                <span>
                    {{ purchaseData?.state }}
                </span>
            </div>

            <el-table style="width: 100%" :data="purchaseFoodsData">
                <el-table-column prop="id" label="序号" width="100" />
                <el-table-column prop="foodName" label="物料名称" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="supplierName" label="供应商" />
                <el-table-column prop="wholePrice" label="批发价" />
                <el-table-column prop="sellPrice" label="零售价" />
                <el-table-column prop="purchasePrice" label="采购价" />
                <el-table-column prop="purchaseCounts" label="采购数量" />
                <el-table-column prop="receiveCounts" label="实际到货数量" />
            </el-table>

            <div class="photo">
                <p>到货凭证</p>
                <el-image v-if="purchaseData?.picture !== ''" style="width: 100px; height: 100px"
                    :src="VITE_IMG_URL + purchaseData?.picture" />
                <el-image style="width: 100px; height: 100px" />
            </div>
        </el-card>
        <div class="bts">
            
        </div>
    </div>
</template>

<script setup lang='ts'>
import { getPurchaseById, getPurchaseFoods } from '@/api/logistics/purchase/purchase';
import type { PurchaseFoodListItem, purchaseGetResponse } from '@/api/logistics/purchase/purchaseType';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const route = useRoute();
const id = ref<number>(Number(route.params.id));
console.log(id.value);

//根据id获取单条采购申请信息
const purchaseData = ref<purchaseGetResponse>();
const getPurchaseDetail = async () => {
    let res = await getPurchaseById(id.value);
    console.log('单条采购申请信息', res);
    purchaseData.value = res.data;
};
getPurchaseDetail()

//根据采购id获取采购物品
const purchaseFoodsData = ref<PurchaseFoodListItem[]>([

]);
const getPurchaseFoodsList = async () => {
    let res = await getPurchaseFoods(id.value);
    console.log('采购商品列表', res);
    purchaseFoodsData.value = res.data.list;
};
getPurchaseFoodsList()


</script>

<style scoped lang='less'>
.top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
        font-size: 24px;
        font-weight: bold;
    }
}
</style>