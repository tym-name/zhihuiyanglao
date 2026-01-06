<template>
    <div class="logo">
        <img src="../../assets/image/login/logo.png" alt="">
        <div class="title">乐康智慧养老系统</div>
    </div>
    <div class="text">
        <div>首页</div>
        <div @click=" router.push('/company')">机构列表</div>
        <div>账号管理</div>
        <div @click=" router.push('/accountList')">账号列表</div>
    </div>
</template>

<script setup lang='ts'>
import router from '../../router';

</script>

<style scoped lang='less'>
.logo {
    width: 100%;
    min-height: 50px;
    background-color: #2d3748;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 20px;
        height: 20px;
    }

    .title {
        margin-left: 5px;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
    }
}

.text {
    width: 100%;
    color: #fff;

    div {
        min-height: 56px;
        text-align: center;
        line-height: 56px;
    }
}
</style>