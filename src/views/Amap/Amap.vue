<template>
    <!-- 高德地图 -->
    <div id="container"></div>
</template>
<script setup lang='ts'>
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, ref } from 'vue';
import { shanghai } from './shanghai';

(window as any)._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
};

const map = ref<any>(null);

onMounted(() => {
    initMap();
})

const initMap = async () => {
    const AMap = await AMapLoader.load({
        key: import.meta.env.VITE_KEY_URL, // 申请好的Web端开发者Key
        version: "2.0", // JSAPI版本
        // 新增AMap.InfoWindow插件，用于创建信息窗口
        plugins: ["AMap.ToolBar", "AMap.Scale", "AMap.ControlBar", "AMap.Marker", "AMap.InfoWindow", "AMap.Polygon"]
    });

    // 挂载地图
    map.value = new AMap.Map("container", {
        viewMode: "3D", // 3D地图模式
        zoom: 11, // 初始化地图级别
        center: [116.654472, 40.060439], // 初始化地图中心点位置
    });

    // 缩放工具
    let toolBar = new AMap.ToolBar({
        position: {
            top: "10px",
            left: "10px",
        },
    });
    map.value.addControl(toolBar);

    // 比例尺
    let scale = new AMap.Scale({
        position: {
            top: "10px",
            right: "10px",
        },
    });
    map.value.addControl(scale);

    // HawkEye鹰眼（鸟瞰图）
    let hawkEye = new AMap.ControlBar({
        position: {
            top: "10px",
            right: "10px",
        },
    });
    map.value.addControl(hawkEye);

    // 标记点自定义内容
    const content = `
<div class="custom-content-marker">
   <img src="img/logo.png" >
</div>`;

    // 创建标记点
    let marker = new AMap.Marker({
        position: [116.654472, 40.060439],
        title: 'AAAAAA',
        content: content,
    });
    map.value.add(marker);

    // ========== 核心功能：创建并绑定信息窗口 ==========
    // 1. 创建信息窗口
    const infoWindow = new AMap.InfoWindow({
        content: `
            <div style="padding: 10px;">
                白青云
            </div>
        `, // 信息窗口内的HTML内容，可自定义
        offset: new AMap.Pixel(0, -30), // 信息窗口相对于标记点的偏移量，避免遮挡标记
        closeWhenClickMap: true // 点击地图其他区域关闭信息窗口
    });

    // 2. 给标记点绑定点击事件，点击时打开信息窗口
    marker.on('click', function () {
        infoWindow.open(map.value, marker.getPosition()); // 在标记点位置打开信息窗口
    });

    const polygon = new AMap.Polygon({
        map: map.value,
        path: shanghai,
        strokeOpacity: 1,
        fillOpacity: 0.5, //填充透明度
        strokeColor: '#2b8cbe', // 线条颜色
    })
    map.value.add(polygon);

    polygon.on('mousemove',  () => {
        polygon.setOptions({
            strokeColor: '#ff0000',
            fillOpacity: 0.2, //填充透明度
        });
    });

    polygon.on('mouseout',  () => {
        polygon.setOptions({
            strokeColor: '#2b8cbe',
            fillOpacity: 0.5, //填充透明度
        });
    });


}
</script>
<style scoped lang="less">
#container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100vh;
}
</style>
<style lang="less">
.custom-content-marker img {
    width: 20px;
    height: 20px;
}
</style>