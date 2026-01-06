<template>
  <!-- 必须设置明确的宽高，否则地图无法渲染 -->
  <div ref="chartRef" style="width: 800px; height: 600px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  if (!chartRef.value) return
  
  // 初始化 ECharts 实例
  chartInstance = echarts.init(chartRef.value)
  
  // 配置图表选项
  const option: echarts.EChartsOption = {
    title: {
      text: '示例图表'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['A', 'B', 'C', 'D', 'E']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 80, 70],
      type: 'bar'
    }]
  }
  
  // 渲染图表
  chartInstance.setOption(option)
  
  // 响应式处理
  window.addEventListener('resize', handleResize)
})

const handleResize = () => {
  chartInstance?.resize()
}

onUnmounted(() => {
  // 清理资源
  chartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>