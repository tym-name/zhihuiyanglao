<template>
    <div class="details-page" style="background: #f5f5f5; min-height: 100vh; padding: 20px;">
        <!-- 详情卡片 -->
        <el-card style="max-width: 900px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 20px; font-size: 20px; font-weight: 600;">外出记录详情</h2>
            
            <!-- 老人信息 -->
            <div class="section">
                <h3 class="section-title">老人信息</h3>
                <div class="elderly-info">
                    <div class="info-left">
                        <div class="info-item">
                            <span class="label">姓名:</span>
                            <span class="value">{{ elderlyInfo.name || '孟北初' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">性别:</span>
                            <span class="value">{{ elderlyInfo.gender || '男' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">身份证号:</span>
                            <span class="value">{{ elderlyInfo.idCard || '145236198002162354' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">联系电话:</span>
                            <span class="value">{{ elderlyInfo.mobile || '15000000000' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">家庭地址:</span>
                            <span class="value">{{ elderlyInfo.address || '沙河' }}</span>
                        </div>
                    </div>
                    <div class="info-right">
                        <div class="info-item">
                            <span class="label">房间号:</span>
                            <span class="value">{{ elderlyInfo.roomNumber || '21101' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">床位号:</span>
                            <span class="value">{{ elderlyInfo.bedNumber || '21101-04' }}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 陪同人信息 -->
            <div class="section">
                <div class="info-item">
                    <span class="label">陪同人类型:</span>
                    <span class="value">{{ accompanyInfo.type || '父子' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">陪同人姓名:</span>
                    <span class="value">{{ accompanyInfo.name || '孙111222' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">陪同人电话:</span>
                    <span class="value">{{ accompanyInfo.mobile || '15000000000' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">陪同人地址:</span>
                    <span class="value">{{ accompanyInfo.address || '沙河' }}</span>
                </div>
            </div>
            
            <!-- 外出信息 -->
            <div class="section">
                <div class="info-item">
                    <span class="label">外出时间:</span>
                    <span class="value">{{ outingInfo.startTime || '2025-02-14 19:22:22' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">计划返回时间:</span>
                    <span class="value">{{ outingInfo.endTime || '2025-02-15 19:22:22' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">外出原因:</span>
                    <span class="value">{{ outingInfo.reason || 'wangyuhao' }}</span>
                </div>
            </div>
            
            <!-- 日志 -->
            <div class="section">
                <h3 class="section-title">日志</h3>
                <div class="logs">
                    <div v-for="(log, index) in logs" :key="index" class="log-item">
                        <div class="log-time">{{ log.time || '2020-01-20 19:58:42' }}</div>
                        <div class="log-content">{{ log.content || '孟北初出了广州\n老人的状态不错，可以外出' }}</div>
                    </div>
                </div>
            </div>
            
            <!-- 返回按钮 -->
            <div style="text-align: center; margin-top: 30px;">
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

// 老人信息
const elderlyInfo = reactive({
    name: '',
    gender: '',
    idCard: '',
    mobile: '',
    address: '',
    roomNumber: '',
    bedNumber: ''
});

// 陪同人信息
const accompanyInfo = reactive({
    type: '',
    name: '',
    mobile: '',
    address: ''
});

// 外出信息
const outingInfo = reactive({
    startTime: '',
    endTime: '',
    reason: ''
});

// 日志
const logs = reactive([
    {
        time: '',
        content: ''
    }
]);

onMounted(() => {
    const recordId = route.query.id as string | null;
    if (recordId) {
        id.value = Number(recordId);
        getDetail();
    } else {
        // 模拟数据，实际项目中会从接口获取
        console.log('使用模拟数据');
    }
});

// 接收GoOut页面传来的数据
const params = route.query;

// 获取详情
const getDetail = async () => {
    const recordId = params.id as string | null;
    if (!recordId) return;
    try {
        console.log('获取外出记录详情，ID:', recordId);
        
        // 注意：这里应该调用获取外出记录详情的接口
        // 由于当前没有专门的外出记录详情接口，我们使用模拟数据
        // 模拟从 GoOut 页面传来的数据
        const mockData = {
            // 老人信息
            elderlyName: '孟北初',
            gender: '男',
            idCard: '145236198002162354',
            mobile: '15000000000',
            address: '沙河',
            roomNumber: '21101',
            bedNumber: '21101-04',
            
            // 陪同人信息
            accompanyType: '父子',
            accompanyName: '孙111222',
            accompanyMobile: '15000000000',
            accompanyAddress: '沙河',
            
            // 外出信息
            startTime: '2025-02-14 19:22:22',
            endTime: '2025-02-15 19:22:22',
            content: 'wangyuhao',
            
            // 日志
            logs: [
                {
                    time: '2020-01-20 19:58:42',
                    content: '孟北初出了广州\n老人的状态不错，可以外出'
                }
            ]
        };
        
        console.log('模拟详情数据:', mockData);
        
        // 赋值老人信息
        elderlyInfo.name = mockData.elderlyName || '';
        elderlyInfo.gender = mockData.gender || '';
        elderlyInfo.idCard = mockData.idCard || '';
        elderlyInfo.mobile = mockData.mobile || '';
        elderlyInfo.address = mockData.address || '';
        elderlyInfo.roomNumber = mockData.roomNumber || '';
        elderlyInfo.bedNumber = mockData.bedNumber || '';
        
        // 赋值陪同人信息
        accompanyInfo.type = mockData.accompanyType || '';
        accompanyInfo.name = mockData.accompanyName || '';
        accompanyInfo.mobile = mockData.accompanyMobile || '';
        accompanyInfo.address = mockData.accompanyAddress || '';
        
        // 赋值外出信息
        outingInfo.startTime = mockData.startTime || '';
        outingInfo.endTime = mockData.endTime || '';
        outingInfo.reason = mockData.content || '';
        
        // 赋值日志
        if (mockData.logs) {
            logs.splice(0, logs.length, ...mockData.logs);
        }
        
        console.log('数据赋值完成');
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

.section {
    margin: 20px 0;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 5px;
}

.elderly-info {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.info-left {
    flex: 2;
    min-width: 300px;
}

.info-right {
    flex: 1;
    min-width: 200px;
}

.info-item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.label {
    font-weight: 500;
    margin-right: 10px;
    color: #606266;
    min-width: 80px;
}

.value {
    color: #303133;
    flex: 1;
}

.logs {
    margin-top: 10px;
}

.log-item {
    margin-bottom: 15px;
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    border-left: 3px solid #409eff;
}

.log-time {
    font-size: 14px;
    color: #909399;
    margin-bottom: 5px;
}

.log-content {
    font-size: 14px;
    color: #303133;
    white-space: pre-wrap;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .elderly-info {
        flex-direction: column;
    }
    
    .info-left,
    .info-right {
        width: 100%;
    }
}
</style>