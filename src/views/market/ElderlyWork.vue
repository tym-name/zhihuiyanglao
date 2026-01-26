<template>
    <div>
        <el-card style="margin-bottom: 10px;">
            <!-- 头像部分 -->
            <img :src="VITE_IMG_URL + elderlyInfo.photo"
                style="width: 60px; height: 60px; border-radius: 4px; object-fit: cover; margin-right: 30px;">
            <!-- 信息部分：用 Flex 实现 label 和内容的左右分布 -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; align-items: center;margin-bottom: 10px;">
                    <span style="width: 120px; text-align: left; margin-right: 80px;">老人姓名:</span>
                    <span>{{ elderlyInfo.name }}</span>
                </div>
                <div style="display: flex; align-items: center;margin-bottom: 10px;">
                    <span style="width: 120px; text-align: left; margin-right: 80px;">身份证/护照号:</span>
                    <span>{{ elderlyInfo.idCard }}</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="width: 120px; text-align: left; margin-right: 80px;">床位号:</span>
                    <span>{{ elderlyInfo.bedNo || '无' }}</span>
                </div>
            </div>
        </el-card>
        <!-- 排班管理 -->
        <ElderlySchedule v-if="elderlyId" :id="elderlyId" :key="elderlyId"></ElderlySchedule>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { elderlyGet } from '../../api/market/elderly';
import ElderlySchedule from '@/components/elderly/ElderlySchedule.vue'

const elderlyInfo = ref<any>({});
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const route = useRoute();
const elderlyId = ref<number | null>(null);

onMounted(async () => {
    const id = route.query.id || route.params.id;
    elderlyId.value = Number(id);
    const res = await elderlyGet(elderlyId.value)
    console.log('老人详情', res);
    elderlyInfo.value = res.data;
});
</script>

<style scoped lang="less">
    /deep/.el-card__body {
        display: flex;
    }
    .schedule-container {
  padding: 16px;
  background: #fff;
  border-radius: 4px;

  .schedule-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 500;
  }

  // 表头样式
  .schedule-header {
    display: flex;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e5e7eb;
    .header-item {
      flex: 1;
      text-align: left;
      font-size: 14px;
      color: #6b7280;
    }
  }

  // 内容行样式
  .schedule-row {
    display: flex;
    height: 48px;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    .row-label {
      width: 80px; // 行头宽度
      text-align: center;
      font-size: 14px;
      color: #374151;
    }

    .row-content {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>