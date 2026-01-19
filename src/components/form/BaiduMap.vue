<template>
    <div>
        百度地图
        <div id="container"></div>
    </div>
</template>
<script setup lang='ts'>
import { onMounted } from 'vue';

let BMapGL: any = null;
let map: any = null;

(window as any).initMap = () => {
    console.log('加载完js');


    loadMap();
}

const loadMap = () => {

    BMapGL = (window as any).BMapGL;

    map = new BMapGL.Map("container");
    map.centerAndZoom(new BMapGL.Point(116.404, 39.928), 15);
    map.enableScrollWheelZoom(true);
    map.setHeading(64.5);
    map.setTilt(73);

    // 创建点标记
    var marker1 = new BMapGL.Marker(new BMapGL.Point(116.404, 39.925));

    map.addOverlay(marker1);

}


onMounted(() => {

    // 防重复加载：已经加载过就不再执行
    if (document.querySelector('script[src*="api.map.baidu.com"]')) {
        (window as any).initBMap()
        return
    }

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://api.map.baidu.com/api?v=1.0&type=webgl&ak=Imkr15YxdnCUcNMZtaaDAGORvn5wRRoi&callback=initMap";
    document.body.appendChild(script);


})

</script>
<style scoped>
#container {
    width: 100%;
    height: 100vh;
}
</style>