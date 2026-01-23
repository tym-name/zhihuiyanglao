<template>
  <div class="chart-container">
    <div class="chart-header">
      <div class="section-title">各地区老人柱状图</div>
    </div>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { getElderlyCount } from '@/api/home/home'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 图表数据
const chartData = reactive({
  regions: ['北京', '河北', '山东', '浙江', '黑龙江', '贵州', '湖北', '天津', '上海'],
  counts: [80, 38, 29, 28, 12, 11, 9, 4, 2]
})



// 抽离图表配置项
const getChartOption = (): echarts.EChartsOption => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: {c} 人',
      textStyle: { fontSize: 14 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.regions,
      axisLabel: {
        fontSize: 12,
        color: '#333'
      },
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLabel: {
        fontSize: 12,
        color: '#333'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [
      {
        name: '老人数量',
        type: 'bar',
        data: chartData.counts,
        itemStyle: {
          color: '#2196f3'
        },
        barWidth: '60%'
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

  // 初始化图表实例
  chartInstance = echarts.init(chartRef.value)
  
  // 先渲染初始图表（使用默认数据）
  chartInstance.setOption(getChartOption())

  // 异步获取接口数据并更新图表
  try {
    // 调用接口获取数据
    const res = await getElderlyCount()
    console.log('接口返回数据：', res)

    // 处理接口返回数据
    if (res?.data && Array.isArray(res.data)) {
      // 假设接口返回格式：[{name: '北京', value: 80}, ...]
      // 按value从高到低排序
      const sortedData = [...res.data].sort((a: any, b: any) => (b.value || b.count) - (a.value || a.count))
      chartData.regions = sortedData.map((item: any) => item.name)
      chartData.counts = sortedData.map((item: any) => item.value || item.count)
    } else if (Array.isArray(res)) {
      // 若接口直接返回数组
      // 按value从高到低排序
      const sortedData = [...res].sort((a: any, b: any) => (b.value || b.count) - (a.value || a.count))
      chartData.regions = sortedData.map((item: any) => item.name)
      chartData.counts = sortedData.map((item: any) => item.value || item.count)
    }

    // 数据更新后重新渲染图表
    if (chartInstance) {
      chartInstance.setOption(getChartOption())
    }
  } catch (error) {
    console.error('获取老人数量数据失败：', error)
    // 保持模拟数据作为 fallback
  }

  // 绑定窗口resize事件
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 清理资源
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
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  }

  .chart {
    width: 100%;
    height: 90%;
    min-height: 300px;
  }
}
    .section-title {
      font-size: 18px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding-bottom: 20px;
    }
</style>