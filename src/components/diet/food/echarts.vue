<template>
  <div ref="chartRef" style="width: 100%; height: 300px;"></div>
</template>

<script setup lang='ts'>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

// 定义 props 接收外部数据
interface Props {
  xAxisData?: string[];
  seriesData?: number[];
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  xAxisData: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  seriesData: () => [150, 230, 224, 218, 135, 147, 260],
  title: ''
});

const chartRef = ref<HTMLDivElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;
  
  // 销毁已存在的图表实例
  if (myChart) {
    myChart.dispose();
  }
  
  myChart = echarts.init(chartRef.value);
  
  const option = {
    title: props.title ? {
      text: props.title,
      left: 'center'
    } : undefined,
    xAxis: {
      type: 'category',
      data: props.xAxisData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: props.seriesData,
        type: 'line'
      }
    ]
  };
  
  myChart.setOption(option, true); // 设置 notMerge 为 true
};

// 更新图表数据
const updateChart = () => {
  if (!myChart) return;
  
  const option = {
    xAxis: {
      data: props.xAxisData
    },
    series: [
      {
        data: props.seriesData
      }
    ]
  };
  
  myChart.setOption(option, true);
};

// 组件挂载后初始化图表
onMounted(() => {
  initChart();
  
  // 监听窗口大小变化，自适应图表尺寸
  window.addEventListener('resize', () => {
    if (myChart) {
      myChart.resize();
    }
  });
});

// 监听 props 变化，更新图表
watch(
  () => [props.xAxisData, props.seriesData], 
  () => {
    nextTick(() => {
      updateChart();
    });
  },
  { deep: true }
);

// 组件卸载前清理资源
onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  
  // 移除事件监听器
  window.removeEventListener('resize', () => {});
});
</script>

<style scoped lang='less'>
</style>