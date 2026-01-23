<template>
    <div class="order-info-container">
        <!-- 标题 -->
        <div class="section-title">
            <div class="title-icon"></div>
            <h3>订单信息</h3>
        </div>

        <!-- 订单详情 -->
        <div class="order-details">
            <!-- 基本信息 -->
            <div class="info-item">
                <span class="info-label">下单人：</span>
                <span class="info-value">{{ oldManData.begName }}</span>
            </div>

            <div class="info-item">
                <span class="info-label">入住床位：</span>
                <span class="info-value">{{ oldManData.begName }}</span>
            </div>

            <div class="info-item">
                <span class="info-label">下单时间：</span>
                <span class="info-value">{{ orderData.startDate }}</span>
            </div>

            <div class="info-item">
                <span class="info-label">入住时段：</span>
                <span class="info-value">{{ oldManData.addTime }}至{{ orderData.startDate }}</span>
            </div>

            <!-- 护理服务 -->
            <div class="service-section">
                <span class="info-label">护理服务：</span>
                <div class="service-table">
                    <div class="table-header">
                        <div class="table-cell service-name">服务名称</div>
                        <div class="table-cell service-desc">服务描述</div>
                        <div class="table-cell service-total">合计</div>
                    </div>
                    <div v-if="orderData.services && orderData.services.length > 0" class="table-body">
                        <div v-for="(service, index) in orderData.services" :key="index" class="table-row">
                            <div class="table-cell service-name">{{ service.name }}</div>
                            <div class="table-cell service-desc">{{ service.description }}</div>
                            <div class="table-cell service-total">{{ service.amount ? service.amount.toFixed(2) : '0.00'
                                }}</div>
                        </div>
                    </div>
                    <div v-else class="table-empty">
                        <span>暂无数据</span>
                    </div>
                </div>
            </div>

            <!-- 订单合同 -->
            <div class="contract-section">
                <span class="info-label">订单合同：</span>
                <div class="contract-image" v-if="orderData.contractImage">
                    <img :src="orderData.contractImage" alt="订单合同" class="contract-img">
                </div>
                <div class="contract-image" v-else>
                    <img v-for="(item,index) in props.orderData.files" :key="index" :src="VITE_IMG+item.file" alt="订单合同" class="contract-img">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const VITE_IMG = import.meta.env.VITE_IMG_URL

// 接收父组件传递的 orderData
const props = defineProps({
    orderData: {
        type: Object,
        default: () => ({})
    },
    oldManData: {
        type: Object,
        default: () => ({})
    },
})





</script>

<style scoped lang="less">
.order-info-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    margin-bottom: 20px;
}

.section-title {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .title-icon {
        width: 4px;
        height: 18px;
        background-color: #409eff;
        margin-right: 8px;
        border-radius: 2px;
    }

    h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
    }
}

.order-details {
    .info-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;

        .info-label {
            width: 100px;
            font-size: 14px;
            color: #606266;
            margin-right: 20px;
            flex-shrink: 0;
        }

        .info-value {
            flex: 1;
            font-size: 14px;
            color: #303133;
        }
    }

    .service-section {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;

        .info-label {
            width: 100px;
            font-size: 14px;
            color: #606266;
            margin-right: 20px;
            flex-shrink: 0;
        }

        .service-table {
            width: 400px;
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            overflow: hidden;

            .table-header {
                display: flex;
                background-color: #f9fafb;
                border-bottom: 1px solid #e4e7ed;

                .table-cell {
                    padding: 12px 16px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #303133;
                    text-align: center;
                }

                .service-name {
                    flex: 2;
                }

                .service-desc {
                    flex: 3;
                }

                .service-total {
                    flex: 1;
                }
            }

            .table-body {
                .table-row {
                    display: flex;
                    border-bottom: 1px solid #e4e7ed;

                    &:last-child {
                        border-bottom: none;
                    }

                    .table-cell {
                        padding: 12px 16px;
                        font-size: 14px;
                        color: #303133;
                        text-align: center;
                    }

                    .service-name {
                        flex: 2;
                    }

                    .service-desc {
                        flex: 3;
                    }

                    .service-total {
                        flex: 1;
                    }
                }
            }

            .table-empty {
                padding: 40px 0;
                text-align: center;
                color: #909399;
                font-size: 14px;
            }
        }
    }

    .contract-section {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;

        .info-label {
            width: 100px;
            font-size: 14px;
            color: #606266;
            margin-right: 20px;
            flex-shrink: 0;
        }

        .contract-image {
            flex: 1;
            max-width: 100px;

            .contract-img {
                width: 100%;
                height: auto;
                border-radius: 4px;
                border: 1px solid #e4e7ed;
            }
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .order-info-container {
        padding: 16px;
    }

    .order-details {
        .info-item {
            flex-direction: column;

            .info-label {
                width: 100%;
                margin-bottom: 8px;
            }
        }

        .service-section {
            flex-direction: column;

            .info-label {
                width: 100%;
                margin-bottom: 12px;
            }

            .service-table {
                width: 500px;

                .table-header,
                .table-row {
                    .table-cell {
                        padding: 8px 12px;
                        font-size: 12px;
                    }
                }
            }
        }

        .contract-section {
            flex-direction: column;

            .info-label {
                width: 500px;
                margin-bottom: 12px;
            }

            .contract-image {
                max-width: 200px;
            }
        }
    }
}
</style>