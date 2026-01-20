<template>
  <div>
    <input type="text" id="input">
        <div id="container"></div>
    <div id="panel"></div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

(window as any)._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
};

const map = ref<any>(null);

onMounted(() => {
    initMap();
})
const initMap = async () => {
    const AMap = await AMapLoader.load({
        key: import.meta.env.VITE_AMAP_KEY,
        version: "2.0",
        plugins: ["AMap.AutoComplete","AMap.PlaceSearch","AMap.Polygon","AMap.InfoWindow","AMap.ToolBar", "AMap.Scale", "AMap.Geolocation", "AMap.HawkEye", "AMap.ControlBar","AMap.Marker","AMap.MassMarks"],
    });

    //挂载地图
    map.value = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 11,
        center: [116.290178, 40.143983],
    });

    //添加缩放工具
    let toolBar = new AMap.ToolBar({
        position: {
            top: "10px",
            left: "10px",
        },
    });
    map.value.addControl(toolBar);

    //比例尺
    let scale = new AMap.Scale();
    map.value.addControl(scale);

    //定位按钮
    let geolocation = new AMap.Geolocation();
    map.value.addControl(geolocation);

    //显示鹰眼
    let overView = new AMap.HawkEye({
        position: {
            top: "10px",
            right: "10px",
        },
    });
    map.value.addControl(overView);

    //工具条方向盘
    let controlBar = new AMap.ControlBar({
        position: {
            top: "300px",
            left: "10px",
        },
    });
    map.value.addControl(controlBar);

    // 点标记显示内容，HTML要素字符串
    const markerContent = `
<div class="custom-content-marker">
   <img src="${'/img/login.png'}" >
</div>`;

    let marker = new AMap.Marker({
        position: [116.290178, 40.143983], // 创建点标记
        title: "野鸡学校",
        content: markerContent,
    });
    map.value.add(marker);

    marker.on("click", function (e: any) {
        console.log(e);
    });

    //创建 infoWindow 实例
    let infoWindow = new AMap.InfoWindow({
        content: "", //传入字符串拼接的 DOM 元素
        anchor: "top-left",
    });
    
       marker.on("click", (e: { target: { getPosition: () => any; }; }) => {

            var html = [
                "<div><b>高德软件有限公司</b>",
                "电话 : 010-84107000   邮编 : 100102",
                "地址 : 北京市望京阜通东大街方恒国际中心A座16层</div>",
            ];

            infoWindow.setContent(html.join("<br>"));
            infoWindow.open(map, e.target.getPosition());
           
         })

    //海量 标记

    const style = [
        {
            url: "/img/logo.png", //图标地址
            anchor: new AMap.Pixel(10, 10), //图标显示位置偏移量，基准点为图标左上角
            size: new AMap.Size(20, 20), //图标的尺寸
            zIndex: 3, //每种样式图标的叠加顺序，数字越大越靠前
        }

    ];

    const data = [
        {
            lnglat: [116.288865, 40.148278], //经纬度
            name: "沙河地铁",
            id: 1,
            style: 0, //该数据的取值为样式数组对应的对象索引
        },
        {
            lnglat: [116.280465, 40.164666],
            name: "高教园地铁",
            id: 2,
            style: 0,
        },
    ];

    const massMarks = new AMap.MassMarks(data, {
        zIndex: 5, //海量点图层叠加的顺序
        zooms: [3, 19], //在指定地图缩放级别范围内展示海量点图层
        style: style,
    });
    massMarks.setMap(map.value);

    //信息窗口

    let infoWindows = new AMap.InfoWindow({
        content: "", //传入字符串拼接的 DOM 元素
        anchor: "top-left",
        isCustom: true //是否自定义弹窗样式，默认为 false

    });


    massMarks.on('click', function (event: any) {
        console.log('海量点点击事件', event);
        console.log('点击的点数据:', event.data);

        //修改窗口内容

        infoWindows.setContent(`
        <div class="info-window">
            <div class="info-window-title">${event.data.name}</div>
            <div class="info-window-content">${event.data.id}</div>
        </div>
        `);

        infoWindows.open(map.value, event.data.lnglat);
    });

    //多边形

    //上海多边形
    // shanghai数组是多个多边形的集合，需要遍历创建
    shanghai.forEach((polygonPath, index) => {
        let polygon = new AMap.Polygon({
            path: polygonPath[0], // 每个多边形是polygonPath[0]
            fillColor: '#ccebc5', // 多边形填充颜色
            fillOpacity: 0.5, // 填充透明度
            strokeOpacity: 1, // 线条透明度
            strokeColor: '#ffff00', // 线条颜色
            strokeWeight: 5, //线条宽度
            strokeStyle: 'dashed', // 线样式
            strokeDasharray: [5, 5], //轮廓的虚线和间隙的样式
        })

        // 将多边形添加到地图上
        map.value.add(polygon);

        polygon.on('click', function (e: any) {
            console.log("点击了多边形", index, e);
        })

        polygon.on('mouseover', () => { // 鼠标移入更改样式
            polygon.setOptions({
                fillOpacity: 0.7,
                fillColor: '#7bccc4'
            })
        })
        polygon.on('mouseout', () => { // 鼠标移出恢复样式
            polygon.setOptions({
                fillOpacity: 0.5,
                fillColor: '#ccebc5'
            })
        })
    });

let search = new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        city: "上海市", // 兴趣点城市
        citylimit: true, // 是否强制限制在设置的城市内搜索
        map: map.value, // 展现结果的地图实例
        panel: "panel", // 结果列表的HTML容器id
        autoFitView: true, // 是否自动调整地图视野使绘制的 Mark
    })
    const autocomplete = new AMap.AutoComplete({
      // 城市，默认全国
      city: "上海",
      // 使用联想输入的input的id
      input: "input",
    });

    autocomplete.on("select", function (e: any) {
      console.log("搜索结果", e.poi.name);



    search.search(e.poi.name, function (_status: any, result: any) {
        console.log("搜索结果", result);
    });

   
    });

    //路线规划
    let driving = new AMap.Driving({
        map: map.value,
        panel: "panel",
    });
    driving.search(
        [
        {keyword: '复旦大学(地铁站)',city:'上海'},
        {keyword: '南京路步行街',city:'上海'}
    ],
        function (_status: any, result: any) {
            console.log("路线规划结果", result);
        },
        {
            policy: AMap.DrivingPolicy.LEAST_TIME,
        }
    );
}
//添加多边形
  var shanghai = [
    [
        [
            [121.7789, 31.3102],
            [121.7279, 31.3548],
            [121.5723, 31.4361],
            [121.5093, 31.4898],
            [121.5624, 31.4864],
            [121.5856, 31.4547],
            [121.7694, 31.3907],
            [121.796, 31.3456],
            [121.7789, 31.3102],
        ],
    ],
    [
        [
            [121.627, 31.445],
            [121.5942, 31.4586],
            [121.5758, 31.4782],
            [121.6137, 31.4713],
            [121.635, 31.453],
            [121.627, 31.445],
        ],
    ],
    [
        [
            [121.8018, 31.357],
            [121.7939, 31.3805],
            [121.8759, 31.3642],
            [121.8882, 31.3227],
            [121.8725, 31.2968],
            [121.8406, 31.2954],
            [121.8038, 31.3284],
            [121.8018, 31.357],
        ],
    ],
    [
        [
            [121.9752, 31.617],
            [121.9917, 31.4768],
            [121.918, 31.4347],
            [121.8454, 31.4319],
            [121.6088, 31.5069],
            [121.4342, 31.5903],
            [121.3955, 31.5854],
            [121.3722, 31.5532],
            [121.1453, 31.7539],
            [121.1185, 31.7591],
            [121.2003, 31.8351],
            [121.3104, 31.8725],
            [121.385, 31.8335],
            [121.4315, 31.7693],
            [121.4986, 31.7533],
            [121.5933, 31.7046],
            [121.9752, 31.617],
        ],
    ],
    [
        [
            [121.1571, 31.4114],
            [121.1462, 31.4211],
            [121.1643, 31.4272],
            [121.1643, 31.4311],
            [121.1473, 31.4439],
            [121.2304, 31.4774],
            [121.2352, 31.4931],
            [121.2594, 31.4779],
            [121.3435, 31.5121],
            [121.4054, 31.4872],
            [121.5212, 31.3948],
            [121.5989, 31.3746],
            [121.7225, 31.3035],
            [121.9627, 31.0473],
            [121.9985, 30.9],
            [121.994, 30.8631],
            [121.9547, 30.8258],
            [121.9697, 30.7892],
            [121.9437, 30.7771],
            [121.9045, 30.8142],
            [121.6484, 30.8162],
            [121.5172, 30.7754],
            [121.3619, 30.6795],
            [121.2747, 30.6774],
            [121.2715, 30.7327],
            [121.2355, 30.7523],
            [121.218, 30.785],
            [121.1747, 30.772],
            [121.1178, 30.7848],
            [121.1376, 30.8262],
            [121.1177, 30.8353],
            [121.1217, 30.85],
            [121.067, 30.8488],
            [121.0379, 30.8139],
            [121.0144, 30.8358],
            [120.9909, 30.8227],
            [121.0219, 30.8752],
            [120.9904, 30.8956],
            [121.0046, 30.9093],
            [120.9904, 31.0138],
            [120.9522, 31.0303],
            [120.9398, 31.0094],
            [120.911, 31.0106],
            [120.8946, 31.0539],
            [120.9021, 31.0857],
            [120.8569, 31.105],
            [120.8813, 31.1347],
            [121.0185, 31.1341],
            [121.0408, 31.1376],
            [121.0454, 31.154],
            [121.0691, 31.1487],
            [121.0625, 31.2675],
            [121.0821, 31.2715],
            [121.0888, 31.2921],
            [121.0988, 31.2763],
            [121.1054, 31.2737],
            [121.1206, 31.287],
            [121.1616, 31.283],
            [121.1438, 31.3097],
            [121.1299, 31.3026],
            [121.1304, 31.3442],
            [121.1068, 31.3645],
            [121.1484, 31.3854],
            [121.1571, 31.4114],
        ],
    ],
    [
        [
            [121.9433, 31.2155],
            [121.9573, 31.2304],
            [122.0086, 31.221],
            [121.9957, 31.1608],
            [121.9596, 31.1593],
            [121.9433, 31.2155],
        ],
    ],
];
</script>

<style scoped lang='less'>
#container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100vh;
}
#panel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}
</style>