<template>
    <div class="summary_box">
        <div class="left">
            <img :src="VITE_IMG_URL+model.photo" alt="" class="header">
            <div class="tips_box">
                <p class="username">{{ getTimePeriod(Prototype.reportTime) }}，{{ model.username }}</p>
                <div class="tips">
                    <p class="weather">{{ Prototype.city }} {{ Prototype.weather }} 当前温度:{{Prototype.temperature}}℃</p>
                    <p class="quotation">{{ getGreetingByDay(Prototype.reportTime) }}</p>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="item">
                <div class="item_name">
                    <i class="iconfont icon-bangong-jigou"></i>
                    <span>机构数</span>
                </div>
                <p class="number">
                    {{ CountList.companyCounts }}
                </p>
            </div>
            <div class="item">
                <div class="item_name">
                    <i style="color: #d81e06;" class="iconfont icon-bed"></i>
                    <span>床位数</span>
                </div>
                <p class="number">
                    {{ CountList.bedCounts }}
                </p>
            </div>
            <div class="item">
                <div class="item_name">
                    <i style="color: #47d99b;" class="iconfont icon-oldy"></i>
                    <span>老人数</span>
                </div>
                <p class="number">
                    {{ CountList.elderlyCounts }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { countList } from '@/api/home/home'
import type { homeType } from '@/api/home/homeType'
import { onMounted, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader';
import { useAuthStore } from '@/stores/auth';

const CountList = ref<homeType>({
    bedCounts: 0,
    companyCounts: 0,
    elderlyCounts: 0
})
const getcountList = async () => {
    const res = await countList()
    CountList.value = res.data
}

(window as any)._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_SECURITY_CODE,
};
const authStore = useAuthStore();
const model = authStore.model;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const Prototype=ref<any>({})

// 根据时间判断当前时段
const getTimePeriod = (timeStr: string) => {
  if (!timeStr) return '';
  
  try {
    // 解析时间字符串，假设格式为 "YYYY-MM-DD HH:MM:SS"
    const time = new Date(timeStr);
    const hour = time.getHours();
    
    if (hour >= 6 && hour < 9) {
      return '早上好';
    } else if (hour >= 9 && hour < 12) {
      return '上午好';
    } else if (hour >= 12 && hour < 14) {
      return '中午好';
    } else if (hour >= 14 && hour < 18) {
      return '下午好';
    } else if (hour >= 18 && hour < 22) {
      return '晚上好';
    } else {
      return '夜深了';
    }
  } catch (error) {
    console.error('时间解析错误:', error);
    return '';
  }
};

// 根据星期几获取祝福语
const getGreetingByDay = (timeStr: string) => {
  if (!timeStr) return '今天也是充满希望的一天!';
  
  try {
    const time = new Date(timeStr);
    const day = time.getDay(); // 0-6，0表示周日
    
    switch (day) {
      case 0:
        return '周日是新的开始，放松自己，准备迎接新的一周吧!';
      case 1:
        return '周一早上好!新的一周，新的挑战，加油!';
      case 2:
        return '周二了，工作状态渐入佳境，继续努力!';
      case 3:
        return '周三是一周的中点，坚持就是胜利!';
      case 4:
        return '周四了，周末就在眼前，再坚持一下!';
      case 5:
        return '周五啦!工作收尾，准备享受周末时光!';
      case 6:
        return '周六愉快!好好休息，充充电吧!';
      default:
        return '今天也是充满希望的一天!';
    }
  } catch (error) {
    console.error('星期解析错误:', error);
    return '今天也是充满希望的一天!';
  }
};

onMounted(async () => {
    getcountList()

    const AMap = await AMapLoader.load({
        key: import.meta.env.VITE_AMAP_KEY,
        version: "2.0",
        plugins: ["AMap.Weather"],
    });
    //加载天气查询插件
    AMap.plugin("AMap.Weather", function () {
        //创建天气查询实例
        var weather = new AMap.Weather();
        //执行实时天气信息查询
        weather.getLive(authStore.ipAddress, function (_err: any, data: any) {
            console.log("实时天气数据", data);
            Prototype.value=data;

        });
    });
})
</script>

<style scoped lang='less'>
.summary_box {
    height: 104px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .left {
        height: 104px;
        display: flex;
        align-items: center;

        .header {
            width: 80px;
            height: 80px;
            border-radius: 50px;
            margin-right: 20px;
        }

        .tips_box {
            .username {
                font-size: 16px;
                margin: 16px 0;
            }

            .tips {
                display: flex;

                p {
                    margin: 14px 0;
                    color: #9ca3af;
                    font-size: 14px;
                }

                .quotation {
                    margin-left: 20px;
                }

            }
        }
    }

    .right {
        height: 100%;
        display: flex;
        align-items: center;
        width: 290px;
        justify-content: space-around;

        .item {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            p {
                margin: 0;
                font-size: 20px;
            }

            .item_name {
                .name {
                    font-size: 16px;

                }

                .iconfont {
                    font-size: 20px;
                    margin-right: 4px;
                }

                .icon-bangong-jigou {
                    color: #409eff;
                    margin-right: 0px;
                }

                .icon-chuangwei {
                    color: #ff6b6b;
                }

                .icon-laoren {
                    color: #87e8de;
                }
            }
        }
    }
}
</style>