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
        <div class="schedule-container">
    <!-- 标题 -->
    <h3 class="schedule-title">排班管理</h3>
    <!-- 表格区域 -->
    <div class="schedule-table">
      <!-- 表头（星期） -->
      <div class="schedule-header">
        <div class="header-item"></div> <!-- 空列（对应“白班/夜班”行头） -->
        <div class="header-item" v-for="day in weekDays" :key="day">{{ day }}</div>
      </div>
      <!-- 内容行：白班 -->
      <div class="schedule-row">
        <div class="row-label">白班</div>
        <div class="row-content" v-for="day in weekDays" :key="`day-${day}`">
            <div style="color: #4080FF; font-size: 14px;"><i class="iconfont icon-jia"></i>请选择</div>
        </div>
      </div>
      <!-- 内容行：夜班 -->
      <div class="schedule-row">
        <div class="row-label">夜班</div>
        <div class="row-content" v-for="day in weekDays" :key="`night-${day}`">
            <div style="color: #4080FF; font-size: 14px;"><i class="iconfont icon-jia"></i>请选择</div>
        </div>
      </div>
    </div>
  </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { elderlyGet, } from '../../api/market/elderly';

const elderlyInfo = ref<any>({});
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const route = useRoute();
const elderlyId = ref<number>(0);

onMounted(async () => {
    const id = route.query.id || route.params.id;
    elderlyId.value = Number(id);
    const res = await elderlyGet(elderlyId.value)
    console.log('老人详情', res);
    elderlyInfo.value = res.data;
});

// 星期列表
const weekDays = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);

// 排班数据（可用于存储选择结果）
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