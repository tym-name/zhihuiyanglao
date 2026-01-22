<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>各年龄段数量统计</h3>
    </div>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { getAgeGroup } from '@/api/home/home'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 预设颜色映射（保证不同年龄段颜色固定）
const colorMap = {
  '60以下': '#316bf3',
  '60-70': '#47d99b',
  '70-80': '#f0c343',
  '90以上': '#ef6366'
}

// 图表数据（初始为模拟数据，后续被接口数据替换）
const chartData =reactive<any>({
  ageData: [
    { name: '60以下', value: 45, color: '#316bf3' },
    { name: '60-70', value: 25, color: '#47d99b' },
    { name: '70-80', value: 15, color: '#f0c343' },
    { name: '90以上', value: 15, color: '#ef6366' }
  ]
})

// 获取接口数据并适配格式
const fetchAgeGroupData = async () => {
  try {
    // 调用接口获取数据
    const res = await getAgeGroup()
    console.log('接口返回数据：', res)

    // 假设接口返回数组：[{name: '60以下', value: xxx}, ...]
    if (Array.isArray(res)) {
      chartData.ageData = res.map(item => ({
        ...item,
        color: colorMap[item.name as keyof typeof colorMap] || '#999' // 绑定预设颜色
      }))
    } else if (res?.data && Array.isArray(res.data)) {
      // 若接口返回包裹层（如{code:200, data:[]}），则取res.data
      chartData.ageData = res.data.map(item => ({
        ...item,
        color: colorMap[item.name as keyof typeof colorMap] || '#999'
      }))
    }

    // 数据更新后重新渲染图表
    if (chartInstance) {
      chartInstance.setOption(getChartOption(), true) // true表示重置配置，避免样式错乱
    }
  } catch (error) {
    console.log('获取年龄段数据失败：', error);
  }
}

// 抽离图表配置项，方便复用和更新
const getChartOption = (): echarts.EChartsOption => {
  return {
    padding: [20, 20, 40, 20],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      textStyle: { fontSize: 14 }
    },
    legend: {
      orient: 'horizontal',
      bottom: -5,
      left: 'center',
      type: 'plain',
      itemGap: 25,
      itemWidth: 14,
      itemHeight: 14,
      textStyle: { fontSize: 14, color: '#333', padding: [0, 0, 0, 5] },
      data: chartData.ageData.map((item: { name: any; }) => item.name) // 动态从数据取图例，避免硬编码
    },
    series: [
      {
        name: '年龄分布',
        type: 'pie',
        radius: ['40%', '60%'],
        center: ['50%', '45%'],
        startAngle: 90,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}',
          fontSize: 14,
          color: '#333'
        },
        labelLine: {
          show: true,
          length: 50,
          length2: 60,
          lineStyle: { width: 1 }
        },
        itemStyle: {
          borderRadius: 0,
          borderColor: '#fff',
          borderWidth: 3,
          // 动态绑定颜色
          color: (params: any) => params.data.color || '#999'
        },
        data: chartData.ageData
      }
    ]
  }
}

// 响应式处理
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(async () => {
  if (!chartRef.value) return

  // 1. 初始化图表实例
  chartInstance = echarts.init(chartRef.value)
  // 2. 先渲染初始（模拟）数据
  chartInstance.setOption(getChartOption())
  // 3. 异步获取接口数据并更新图表
  await fetchAgeGroupData()

  // 绑定窗口resize事件
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理资源，防止内存泄漏
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="less">
.chart-container {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .chart-header {
    margin-bottom: 50px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  }

  .chart {
    width: 100%;
    height: 70%;
    min-height: 300px;
  }
}
</style>