<template>
    <el-container>
        <el-header>
            <Header></Header>
        </el-header>
        <el-main>
            <Main></Main>
        </el-main>
        <el-footer>
            <Footer></Footer>
        </el-footer>
    </el-container>
</template>

<script setup lang='ts'>
import Header from '../../components/login/header.vue';
import Footer from '../../components/login/footer.vue';
import Main from '../../components/login/main.vue';
</script>

<style lang='less' scoped>
@import url('../../assets/less/login/login.less');
</style>