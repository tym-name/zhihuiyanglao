<template>
    <div class="summary_box">
        <div class="left">
            <img src="../../assets/image/login/imgCode.png" alt="" class="header">
            <div class="tips_box">
                <p class="username">晚上好! admin</p>
                <div class="tips">
                    <p class="weather">北京市 晴 当前温度:-1℃</p>
                    <p class="quotation">周日是新的开始，放松自己，准备迎接新的一周吧!</p>
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
                    927
                </p>
            </div>
            <div class="item">
                <div class="item_name">
                    <i class="iconfont icon-chuangwei"></i>
                    <span>床位数</span>
                </div>
                <p class="number">
                    1,281
                </p>
            </div>
            <div class="item">
                <div class="item_name">
                    <i class="iconfont icon-laoren"></i>
                    <span>老人数</span>
                </div>
                <p class="number">
                    1,070
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
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