<template>
  <div class="simple-step-bar">
    <!-- 步骤1 -->
    <div class="step-item">
      <div class="step-number" :class="{ active: currentStep >= 0 }">1</div>
      <div class="step-text" :class="{ active: currentStep >= 0 }">选择服务</div>
    </div>

    <!-- 连接线 -->
    <div class="step-line"></div>

    <!-- 步骤2 -->
    <div class="step-item">
      <div class="step-number" :class="{ active: currentStep >= 1 }">2</div>
      <div class="step-text" :class="{ active: currentStep >= 1 }">订单确定</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件属性
const props = defineProps({
  // 当前步骤，0=选择服务，1=订单确定
  currentStep: {
    type: Number,
    default: 0
  }
});
console.log(props);
</script>

<style scoped lang="less">
.simple-step-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 2;
}

.step-number {
  width: 24px;
  height: 24px;
  border: 1px solid #C0C4CC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #C0C4CC;
  transition: all 0.3s ease;

  &.active {
    border-color: #000;
    background-color: #fff;
    color: #000;
  }
}

.step-text {
  font-size: 14px;
  color: #C0C4CC;
  transition: all 0.3s ease;

  &.active {
    color: #000;
  }
}

.step-line {
  flex: 1;
  height: 1px;
  background: #C0C4CC;
  margin: 0 8px;
}
</style>