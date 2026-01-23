<template>
    <div class="consult-form-container">
        <!-- 页面标题 -->

        <!-- 表单容器 -->
        <el-card class="form-card" shadow="hover">
            <h1 class="page-title">回访记录</h1>
            <el-form label-position="right" label-width="120px">
                <!-- 第一行 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="咨询类型:">
                            <el-tag size="small">{{ visitData.type || '线上咨询' }}</el-tag>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登记日期:">
                            <span>{{ visitData.addTime || '2026-01-21 09:50' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 第二行 -->
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

                <!-- 第三行 -->
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

                <!-- 第四行 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="联系方式:">
                            <span>{{ visitData.mobile || '13000000000' }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="回访状态:">
                            <el-tag :type="getStatusType(visitData.stateName)" size="small">
                                {{ visitData.stateName || '待回访' }}
                            </el-tag>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 第五行 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="与老人关系:">
                            <span>{{ visitData.relation || '父子关系' }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="老人姓名:">
                            <span>{{ visitData.elderlyName || '未知' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 第六行 -->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="咨询内容:">
                            <el-card class="content-card">
                                <span>{{ visitData.content || '无' }}</span>
                            </el-card>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 第七行 -->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-card class="content-card">
                                <span>{{ visitData.remark || '无' }}</span>
                            </el-card>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 操作按钮 -->
            <div class="action-buttons">
                <el-button type="primary" @click="handleBack">返回列表</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { questionGet } from "../../api/Question/Question";

const route = useRoute();
const router = useRouter();
const visitData = ref({});

// 根据回访状态获取标签类型
const getStatusType = (status) => {
    switch (status) {
        case '待回访':
            return 'warning';
        case '已回访':
            return 'success';
        case '已取消':
            return 'danger';
        default:
            return 'info';
    }
};

// 返回列表页
const handleBack = () => {
    router.back();
};

onMounted(() => {
    console.log('payAReturnVisit 页面加载');
    console.log('路由参数:', route.query);

    getQuestion();
});

const getQuestion = async () => {
    try {
        if (route.query && route.query.id) {
            // 将id转换为数字类型
            const id = Number(route.query.id);
            let res = await questionGet(id);
            console.log('单条数据:', res);
            // 将获取到的数据赋值给visitData
            if (res && res.data) {
                visitData.value = res.data;
            } else {
                // 没有数据时使用默认数据
                useDefaultData();
            }
        } else {
            // 没有id参数时使用默认数据
            useDefaultData();
        }
    } catch (error) {
        console.error('获取回访数据失败:', error);
        // 出错时使用默认数据
        useDefaultData();
    }
}

// 使用默认数据
const useDefaultData = () => {
    visitData.value = {
        type: '线上咨询',
        addTime: '2026-01-21 09:50',
        source: '来访登记',
        addAccountName: '昌平社会管理员',
        name: '1111',
        visitTime: '2026-01-29 00:00',
        mobile: '13000000000',
        stateName: '待回访',
        relation: '父子关系',
        elderlyName: '张三',
        content: '咨询养老院的收费标准和服务内容',
        remark: '需要进一步了解老人的健康状况'
    };
};
</script>

<style scoped>
.consult-form-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: 100vh;
}

.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
}

.form-card {
    margin-bottom: 20px;
}

.content-card {
    min-height: 80px;
    display: flex;
    align-items: center;
}

.action-buttons {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
}
</style>
