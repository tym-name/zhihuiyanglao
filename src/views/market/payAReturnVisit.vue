<template>
    <div>
        <div class="consult-form-container">
            <h1 class="page-title">回访记录</h1>
            <el-form label-position="right" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="咨询类型:">
                            <span>{{ visitData.type || '线上咨询' }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登记日期:">
                            <span>{{ visitData.addTime || '2026-01-21 09:50' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="咨询渠道:">
                            <span>{{ visitData.source || '来访登记' }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登记人:">
                            <span>{{ visitData.addAccountName || '昌平社会管理员' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="咨询人:">
                            <span>{{ visitData.name || '1111' }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划回访日期:">
                            <span>{{ visitData.visitTime || '2026-01-29 00:00' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="联系方式:">
                            <span>{{ visitData.mobile || '13000000000' }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="回访状态:">
                            <span>{{ visitData.stateName || '待回访' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="与老人关系:">
                            <span>{{ visitData.relation || '父子关系' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const visitData = ref < any > ({});

onMounted(() => {
    // 接收从 Question 页面传来的数据
    if (route.query && route.query.id) {
        try {
            // 解析传来的 row 数据
            const rowData = typeof route.query.id === 'string' ? JSON.parse(route.query.id) : route.query.id;
            visitData.value = rowData;
        } catch (error) {
            console.error('解析数据失败:', error); 
        }
    }
});
</script>

<style scoped>
.consult-form-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
}
</style>