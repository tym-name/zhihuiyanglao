<template>
    <div id="footer">
        <span>
            版权所有 ◎ 2021 -2024 youlai.tech 保留所有权利。皖ICP备20006496号-2
        </span>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue';
</script>

<style scoped lang='less'>
#footer {
    // width: 100% !important;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        font-size: 16px;
        line-height: 62px;
    }
}
</style>