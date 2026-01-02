<template>
<div class="common-layout">
    <el-container>
      <el-aside><IeftAside></IeftAside></el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main style="background-color: #f2f3f5;"><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import IeftAside from '../../components/home/leftAside.vue'
</script>

<style scoped lang='less'>
    /deep/.el-aside{
        width: 200px;
        min-height: 100vh;
        background-color: #304156;
    }
</style>