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
                <el-table-column label="实际到货数量">
                    <template #default="{ row }">
                        <el-input-number v-model="row.receiveCounts" :min="0" :max="row.purchaseCounts" />
                    </template>
                </el-table-column>
            </el-table>

            <div class="photo">
                <p>到货凭证</p>
                <el-upload class="upload-demo" :action="imageUrl" :headers="uploadHeaders" :file-list="fileList"
                    list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                    :on-success="handleUploadSuccess" :before-upload="beforeUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <template #tip>
                        <div class="el-upload__tip">支持上传jpg/png/gif格式，单张不超过5MB</div>
                    </template>
                </el-upload>

                <el-dialog v-model="dialogVisible" title="图片预览" width="80%">
                    <img class="w-full" :src="dialogImageUrl" alt="Preview Image" />
                </el-dialog>
            </div>
        </el-card>
        <div class="bts">
            <el-button @click="handleBack">返回</el-button>
            <el-button type="primary" @click="handleConfirm">确认验收</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { getPurchaseById, getPurchaseFoods, purchaseReceive } from '@/api/logistics/purchase/purchase';
import type { PurchaseFoodListItem, purchaseGetResponse, PurchaseCheckParams } from '@/api/logistics/purchase/purchaseType';
import { ElMessage, type UploadFile } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Plus } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
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
const purchaseFoodsData = ref<PurchaseFoodListItem[]>([]);
const getPurchaseFoodsList = async () => {
    let res = await getPurchaseFoods(id.value);
    console.log('采购商品列表', res);
    purchaseFoodsData.value = res.data.list.map(item => ({
        ...item,
        receiveCounts: item.purchaseCounts // 默认实际到货数量等于采购数量
    }));
};
getPurchaseFoodsList()

//收货验收
const handleConfirm = async () => {
    try {
        const params: PurchaseCheckParams = {
            id: id.value,
            picture: '', // 默认空字符串，实际应该是上传图片后的URL
            foods: purchaseFoodsData.value.map(item => ({
                id: item.id,
                receiveCounts: item.receiveCounts || 0
            }))
        };

        await purchaseReceive(params);
        ElMessage.success('确认验收成功');
        handleBack();
    } catch (error) {
        ElMessage.error('确认验收失败');
        console.error('确认验收失败:', error);
    }
};

// 返回父组件页面
const handleBack = () => {
    router.go(-1); // 返回上一页，即父组件页面
};

// 环境变量
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';

// 上传配置
const uploadHeaders = { 'Authorization': 'Bearer token123' };
const fileList = ref<UploadFile[]>([]);

// 预览对话框
const dialogVisible = ref(false);
const dialogImageUrl = ref('');

// 图片处理相关
const handlePictureCardPreview = (uploadFile: UploadFile) => {
    dialogImageUrl.value = uploadFile.url as string;
    dialogVisible.value = true;
};

const handleRemove = (uploadFile: UploadFile) => {
    const index = fileList.value.findIndex(item => item.uid === uploadFile.uid);
    if (index !== -1) {
        fileList.value.splice(index, 1);
        ElMessage.success('图片删除成功');
    }
};

const handleUploadSuccess = (response: any) => {
    if (response?.code === 10000 && response.data?.url) {
        ElMessage.success('图片上传成功');
    } else {
        ElMessage.error(response?.msg || '上传失败');
    }
};

const beforeUpload = (rawFile: File) => {
    const isImage = rawFile.type.startsWith('image/');
    const isLt5M = rawFile.size / 1024 / 1024 <= 5;

    if (!isImage) {
        ElMessage.error('只允许上传图片文件');
        return false;
    }
    if (!isLt5M) {
        ElMessage.error('单张图片大小不能超过5MB');
        return false;
    }
    return true;
};

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

.bts {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>