<template>
    <div class="order-cost-container">
        <!-- 标题 -->
        <div class="section-title">
            <div class="title-bar"></div>
            <h3>订单总费用</h3>
        </div>

        <!-- 费用表格 -->
        <table class="cost-table">
            <thead>
                <tr>
                    <th>顺序</th>
                    <th>项目名称</th>
                    <th>小计（元）</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in costItems" :key="index">
                    <td>{{ item.order }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.amount.toFixed(2) }}</td>
                </tr>
                <!-- 合计行 -->
                <tr class="total-row">
                    <td></td>
                    <td>合计</td>
                    <td>{{ totalAmount.toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// 定义组件属性
const props = defineProps({
  // 床位费
  bedFee: {
    type: Number,
    default: 0
  },
  // 伙食费
  foodFee: {
    type: Number,
    default: 0
  },
  // 护理费
  nurseFee: {
    type: Number,
    default: 0
  },
  // 押金
  deposit: {
    type: Number,
    default: 0
  },
  // 一次性生活费
  livingExpense: {
    type: Number,
    default: 0
  }
})

// 费用数据
const costItems = computed(() => {
  return [
    { order: 1, name: '床位费', amount: props.bedFee },
    { order: 2, name: '护理费', amount: props.nurseFee },
    { order: 3, name: '膳食费', amount: props.foodFee },
    { order: 4, name: '押金', amount: props.deposit },
    { order: 5, name: '一次性生活费', amount: props.livingExpense }
  ]
})

// 计算合计金额
const totalAmount = computed(() => {
  return props.bedFee + props.foodFee + props.nurseFee + props.deposit + props.livingExpense
})
</script>

<style scoped>
.order-cost-container {
    width: 1000px;
    padding: 20px;
    box-sizing: border-box;
}

/* 标题样式 */
.section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.title-bar {
    width: 4px;
    height: 20px;
    background-color: #2563eb;
    margin-right: 8px;
}

.section-title h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
}

/* 表格样式 */
.cost-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    color: #374151;
}

.cost-table th,
.cost-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.cost-table th {
    background-color: #f9fafb;
    font-weight: 500;
    color: #6b7280;
}

/* 合计行样式 */
.total-row {
    font-weight: 600;
}
</style>