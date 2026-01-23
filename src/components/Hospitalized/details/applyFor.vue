<template>
  <div class="application-info-container">
    <!-- 标题 -->
    <div class="section-title">
      <div class="title-bar"></div>
      <h3>申请信息</h3>
    </div>

    <!-- 信息列表 -->
    <div class="info-list">
      <div class="info-item">
        <span class="label">申请人：</span>
        <span class="value">{{ applyData.addAccountName || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">申请时间：</span>
        <span class="value">{{ applyData.addTime || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">申请状态：</span>
        <span class="value">{{ applyData.stateName || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// 接收父组件传递的 applyData
const props = defineProps({
  applyData: {
    type: Object,
    default: () => ({})
  }
})

onMounted(() => {
  console.log('applyData:', props.applyData);
})

</script>
<style scoped>
.application-info-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
}

/* 标题样式 */
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
}

.title-bar {
  width: 4px;
  height: 20px;
  background-color: #2563eb;
  margin-right: 8px;
  border-radius: 2px;
}

.section-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

/* 信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.label {
  width: 100px;
  color: #6b7280;
  text-align: right;
  margin-right: 16px;
}

.value {
  color: #374151;
  font-weight: 400;
}
</style>