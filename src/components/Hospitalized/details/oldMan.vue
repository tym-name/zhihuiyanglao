orderData<template>
  <div class="elder-info-container">
    <!-- 标题 -->
    <div class="section-title">
      <div class="title-bar"></div>
      <h3>老人信息</h3>
    </div>

    <!-- 基础信息列表 -->
    <div class="basic-info-list">
      <div class="info-item">
        <span class="label">老人姓名：</span>
        <span class="value">{{ oldManData.name }}</span>
      </div>
      <div class="info-item">
        <span class="label">身份证号：</span>
        <span class="value">{{ oldManData.idCard }}</span>
      </div>
      <div class="info-item">
        <span class="label">护理等级：</span>
        <span class="value">1</span>
      </div>
    </div>

    <!-- 家属信息表格 -->
    <div class="family-info-section">
      <div class="info-item">
        <span class="label">家属信息：</span>
      </div>

      <table class="family-table">
        <thead>
          <tr>
            <th>家属姓名</th>
            <th>与老人关系</th>
            <th>联系方式</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="familyList.length === 0">
            <td colspan="3" class="empty-data">暂无数据</td>
          </tr>
          <tr v-for="(family, index) in familyList" :key="index">
            <td>{{ family.name }}</td>
            <td>{{ family.relation }}</td>
            <td>{{ family.contact }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 接收父组件传递的 applyData
const props = defineProps({
  oldManData: {
    type: Object,
    default: () => ({})
  }
})

// 模拟家属信息（为空时显示“暂无数据”）
const familyList = ref([])
</script>

<style scoped>
.elder-info-container {
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

/* 基础信息列表 */
.basic-info-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
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

/* 家属信息表格 */
.family-info-section {
  width: 500px;
  display: flex;
  margin-top: 16px;
}

.family-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 14px;
}

.family-table th {
  padding: 8px 16px;
  text-align: center;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 500;
}

.family-table td {
  padding: 16px;
  text-align: center;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.empty-data {
  color: #9ca3af;
  padding: 32px 0;
}
</style>