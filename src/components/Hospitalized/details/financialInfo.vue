<template>
  <div class="finance-info-container">
    <!-- 标题 -->
    <div class="section-title">
      <div class="title-bar"></div>
      <h3>财务信息</h3>
    </div>

    <!-- 费用明细列表 -->
    <div class="finance-list">
      <div class="finance-item">
        <div class="label"> 床位费: <span class="value">{{ financialData.begPrice }}</span></div>
        <div class="label"> 护理费:<span class="value">{{ financialData.servicePrice }}</span></div>
        <div class="label"> 膳食费:<span class="value">{{ financialData.foodPrice }}</span></div>
        <div class="label"> 押金:<span class="value">{{ financialData.cashPledge }}</span></div>
        <div class="label"> 一次性生活费:<span class="value">{{ financialData.livingPrice }}</span></div>
        <div class="label"> 合计:<span class="value">{{ financialData.begPrice + financialData.servicePrice + financialData.foodPrice + financialData.cashPledge + financialData.livingPrice}}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'




// 接收父组件传递的 defineProps
defineProps({
  financialData: {
    type: Object,
    default: () => ({})
  }
})




</script>

<style scoped>
.finance-info-container {
  width: 100%;
  padding: 20px;
  /* box-sizing: border-box; */
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

/* 费用明细列表 */
.finance-list {
  width: 100px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.finance-item {
  line-height: 40px;
  align-items: center;
  font-size: 14px;
}

.label {
  width: 100px;
  color: #6b7280;
  margin-right: 16px;
  text-align: right;
  min-width: 120px;
}

.value {
  color: #374151;
  font-weight: 400;
}
</style>