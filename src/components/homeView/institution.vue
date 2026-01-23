<template>
  <!-- 出院、入院、预定统计图表 -->
  <div class="chart-container">
    <div class="chart-header">
      <h3>出院、入院、预定统计</h3>
      <span class="download-icon">↓</span>
    </div>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { getOrderCount } from '@/api/home/home'

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 存储图表数据
const chartData = reactive({
  months: [] as string[],
  admission: [] as number[],
  discharge: [] as number[],
  booking: [] as number[]
})

// 获取订单统计数据
const fetchOrderCount = async () => {
  try {
    const res = await getOrderCount()
    console.log('订单统计数据:', res)
    
    // 如果API返回的是不同的数据结构，请根据实际情况调整
    if (res.data && res.data.length > 0) {
      // 假设数据结构是三个数组，每个数组对应一个统计类型
      // 这里需要根据实际的API返回结构进行调整
      chartData.months = res.data.map((item: any) => item.name)
      // 这里暂时使用模拟数据，需要根据实际API返回结构调整
      chartData.admission = res.data.map((item: any) => item.count || Math.floor(Math.random() * 20))
      chartData.discharge = res.data.map(() => Math.floor(Math.random() * 15))
      chartData.booking = res.data.map(() => Math.floor(Math.random() * 10))
      
      // 更新图表
      updateChart()
    }
  } catch (error) {
    console.error('获取订单统计数据失败:', error)
  }
}

onMounted(async () => {
  if (!chartRef.value) return
  
  // 初始化 ECharts 实例
  chartInstance = echarts.init(chartRef.value)
  
  // 配置图表选项
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        let result = params[0].axisValue + '<br/>';
        params.forEach((item: any) => {
          result += `${item.marker}${item.seriesName} ${item.value}<br/>`;
        });
        return result;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.months.length > 0 ? chartData.months : ['2025年03月', '2025年04月', '2025年07月'],
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    legend: {
      data: ['入院', '出院', '预定'],
      bottom: '0%',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      },
      icon: 'circle'
    },
    series: [
      {
        name: '入院',
        type: 'line',
        data: chartData.admission.length > 0 ? chartData.admission : [10, 0, 6],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#91cc75',
          width: 2
        },
        itemStyle: {
          color: '#91cc75'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(145, 204, 117, 0.3)' },
            { offset: 1, color: 'rgba(145, 204, 117, 0.05)' }
          ])
        }
      },
      {
        name: '出院',
        type: 'line',
        data: chartData.discharge.length > 0 ? chartData.discharge : [2, 10, 3],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#fac858',
          width: 2
        },
        itemStyle: {
          color: '#fac858'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250, 200, 88, 0.3)' },
            { offset: 1, color: 'rgba(250, 200, 88, 0.05)' }
          ])
        }
      },
      {
        name: '预定',
        type: 'line',
        data: chartData.booking.length > 0 ? chartData.booking : [4, 1, 14],
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#ee6666',
          width: 2
        },
        itemStyle: {
          color: '#ee6666'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(238, 102, 102, 0.3)' },
            { offset: 1, color: 'rgba(238, 102, 102, 0.05)' }
          ])
        }
      }
    ]
  }
  
  // 渲染图表
  chartInstance.setOption(option)
  
  // 响应式处理
  window.addEventListener('resize', handleResize)
  
  // 获取API数据
  await fetchOrderCount()
})

// 更新图表数据
const updateChart = () => {
  if (!chartInstance) return
  
  // 更新图表选项
  chartInstance.setOption({
    xAxis: {
      data: chartData.months
    },
    series: [
      {
        name: '入院',
        data: chartData.admission
      },
      {
        name: '出院',
        data: chartData.discharge
      },
      {
        name: '预定',
        data: chartData.booking
      }
    ]
  })
}

const handleResize = () => {
  chartInstance?.resize()
}

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
  border-radius: 8px;
  box-sizing: border-box;
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
    
    .download-icon {
      font-size: 16px;
      color: #999;
      cursor: pointer;
      
      &:hover {
        color: #666;
      }
    }
  }
  
  .chart {
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>