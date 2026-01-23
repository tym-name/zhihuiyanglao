<template>
  <div class="china-map-container">
    <div class="chart-section map-section">
      <div class="section-title">机构分布地图</div>
      <div ref="mapChartRef" class="chart-canvas"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

const mapChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)
const mapChart = shallowRef<echarts.ECharts | null>(null)
const barChart = shallowRef<echarts.ECharts | null>(null)

const dialogVisible = ref(false)
const loading = ref(false)
const selectedProvince = ref('')
const cityData = ref<{ name: string; count: number }[]>([])
let rawMapData: any[] = []

const filterCityDetails = (provinceName: string) => {
  loading.value = true
  const pureName = provinceName.replace(/省|市|自治区|特别行政区/g, '')
  const filtered = rawMapData.filter((item: any) => {
    return item.name.includes(pureName) || (item.province && item.province.includes(pureName))
  })
  cityData.value = filtered.map(item => ({ name: item.name, count: item.count }))
  loading.value = false
}

const fetchChartData = async () => {
  try {
    const [mapRes, barRes] = await Promise.all([
      fetch('http://123.57.237.81:8080/caresystem-server/api/count/getCompanyCount'),
      fetch('http://123.57.237.81:8080/caresystem-server/api/count/getElderlyCount')
    ])
    const mapResult = await mapRes.json()
    const barResult = await barRes.json()
    
    if (mapResult.code === 10000) {
      rawMapData = mapResult.data
      const processedMapData = mapResult.data
        .map((item: any) => {
          if (!item.lngLat) return null
          const [lng, lat] = item.lngLat.split(',').map(Number)
          return { name: item.name, value: [lng, lat, item.count] }
        }).filter(Boolean)
      renderCharts(processedMapData, barResult.data || [])
    }
  } catch (err) {
    ElMessage.error('数据加载失败')
  }
}

const renderCharts = (mapData: any[], barData: any[]) => {
  mapChart.value?.setOption({
    tooltip: { 
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value[2] || 0} 个`
    },
    geo: {
      map: 'china',
      roam: true,
      // --- 核心修改：放大地图 ---
      zoom: 1.2,              // 初始缩放比例，默认是 1，调大可以放大地图
      layoutCenter: ['50%', '66%'], // 将地图中心稍微下移，给标题留出空间
      layoutSize: '90%',     // 地图占满容器的比例，默认会比较小
      itemStyle: { areaColor: '#4A9EFF', borderColor: '#fff' },
      emphasis: { itemStyle: { areaColor: '#FFD700' } }
    },
    series: [
      {
        name: '城市机构',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: mapData,
        symbolSize: 10,
        itemStyle: { color: '#F56C6C' },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: '#333',
          fontSize: 10,
          fontWeight: 'bold',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: [2, 4],
          borderRadius: 3
        },
        emphasis: {
            label: { show: true, fontSize: 14 }
        }
      }
    ]
  })

  mapChart.value?.off('click')
  mapChart.value?.on('click', (params: any) => {
    if (params.name) {
      selectedProvince.value = params.name
      dialogVisible.value = true
      filterCityDetails(params.name)
    }
  })

  barChart.value?.setOption({
    xAxis: { type: 'category', data: barData.slice(0, 10).map((d: any) => d.name) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: barData.slice(0, 10).map((d: any) => d.count), itemStyle: { color: '#4A9EFF' } }]
  })
}

const handleResize = () => {
  mapChart.value?.resize()
  barChart.value?.resize()
}

onMounted(async () => {
  const mapResponse = await fetch('china.json')
  const geoJson = await mapResponse.json()
  echarts.registerMap('china', geoJson)
  if (mapChartRef.value) mapChart.value = echarts.init(mapChartRef.value)
  if (barChartRef.value) barChart.value = echarts.init(barChartRef.value)
  await fetchChartData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  mapChart.value?.dispose()
  barChart.value?.dispose()
})
</script>

<style scoped lang="less">
.china-map-container {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 70vh;
  box-sizing: border-box;
  .chart-section {
    flex: 1;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    
    .section-title {
      font-size: 18px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding-bottom: 20px;
    }

    .chart-canvas {
      flex: 1;
    }
  }
}
</style>