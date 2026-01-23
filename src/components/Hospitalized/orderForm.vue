<template>
    <div class="step-container">
        <!-- 进度线 -->
        <div class="progress-line">
            <div class="progress-fill"></div>
        </div>

        <!-- 步骤节点与文字 -->
        <div class="step-items">
            <!-- 选择服务 -->
            <div class="step-item">
                <div class="step-node completed">
                    <span class="check-icon">✓</span>
                </div>
                <div class="step-text completed">选择服务</div>
            </div>

            <!-- 订单确定 -->
            <div class="step-item">
                <div class="step-node">2</div>
                <div class="step-text">订单确定</div>
            </div>
        </div>
    </div>
</template>

<script setup>
// 如需动态控制步骤，可在此处添加 props
// 例如：const props = defineProps({ currentStep: { type: Number, default: 0 } })
</script>

<style scoped>
.step-container {
    margin: 0 auto;
    position: relative;
    width: 100%;
    max-width: 800px;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 进度线 */
.progress-line {
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #e5e7eb;
    z-index: 1;
}

.progress-fill {
    width: 0%;
    /* 当前步骤为第1步，进度为0 */
    height: 100%;
    background-color: #10b981;
    transition: width 0.3s ease;
}

/* 步骤项容器 */
.step-items {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    z-index: 2;
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 节点样式 */
.step-node {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    color: #374151;
    transition: all 0.3s ease;
}

.step-node.completed {
    background-color: #10b981;
    border-color: #10b981;
    color: #ffffff;
}

.check-icon {
    font-size: 16px;
}

/* 文字样式 */
.step-text {
    margin-top: 8px;
    font-size: 14px;
    color: #374151;
}

.step-text.completed {
    color: #10b981;
}
</style>