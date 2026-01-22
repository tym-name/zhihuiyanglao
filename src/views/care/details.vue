<template>
    <div class="details-page" style="background: #f5f5f5; min-height: 100vh;">
        <!-- 详情卡片 -->
        <el-card style="max-width: 800px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 20px;">外出记录详情</h2>
            <el-form label-width="140px" style="padding: 20px;">
                <!-- 老人信息 -->
                <el-form-item label="外出老人">
                    <el-input v-model="form.elderlyName" disabled readonly />
                </el-form-item>

                <!-- 外出时间范围 -->
                <el-form-item label="外出时间">
                    <div>{{ form.startTime }} 至 {{ form.endTime }}</div>
                </el-form-item>

                <!-- 陪同人员类型 -->
                <el-form-item label="陪同人员类型">
                    <el-select v-model="form.accompanyType" disabled>
                        <el-option label="母女" value="0" />
                        <el-option label="兄弟" value="1" />
                        <el-option label="姐妹" value="2" />
                        <el-option label="朋友" value="3" />
                        <el-option label="其他" value="4" />
                        <el-option label="本人" value="5" />
                        <el-option label="护理人员" value="6" />
                    </el-select>
                </el-form-item>

                <!-- 陪同人员姓名 -->
                <el-form-item label="陪同人员姓名">
                    <el-input v-model="form.name" disabled readonly />
                </el-form-item>

                <!-- 陪同人员手机号 -->
                <el-form-item label="陪同人员电话">
                    <el-input v-model="form.mobile" disabled readonly />
                </el-form-item>

                <!-- 陪同人员地址 -->
                <el-form-item label="陪同人员地址">
                    <el-input v-model="form.address" disabled readonly />
                </el-form-item>

                <!-- 外出原因 -->
                <el-form-item label="外出原因">
                    <el-input type="textarea" v-model="form.content" disabled readonly />
                </el-form-item>
            </el-form>
            <div style="text-align: center; margin-top: 20px;">
                <el-button type="primary" @click="back">返回</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getOldManDetail } from '../../api/OutboundRegistration/Outbound';

const route = useRoute();
const router = useRouter();
const id = ref<number | null>(null);

// 表单数据
const form = reactive({
    elderlyName: '',
    startTime: '',
    endTime: '',
    accompanyType: '',
    name: '',
    mobile: '',
    address: '',
    content: ''
});

onMounted(() => {
    const recordId = route.query.id as string | null;
    if (recordId) {
        id.value = Number(recordId);
        getDetail();
    }
});

// 获取详情
const getDetail = async () => {
    if (!id.value) return;
    try {
        const res = await getOldManDetail(id.value);
        console.log('详情数据:', res);
        // 这里需要根据实际返回的字段进行赋值
        form.elderlyName = res.data.name || '';
        // form.startTime = res.data.startTime || '';
        // form.endTime = res.data.endTime || '';
        // form.accompanyType = res.data.accompanyType || '';
        // form.name = res.data.name || '';
        // form.mobile = res.data.mobile || '';
        // form.address = res.data.address || '';
        // form.content = res.data.content || '';
    } catch (error) {
        console.error('获取详情失败:', error);
        ElMessage.error('获取详情失败');
    }
};

// 返回按钮
const back = () => {
    router.push('/care/GoOut');
};
</script>

<style scoped>
.details-page {
    padding: 20px;
}
</style>