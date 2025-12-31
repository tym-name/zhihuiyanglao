<template>
  <div id="header">
    <img src="../../assets/image/login/login_title.png" class="img_title" alt="" srcset="">
    <div class="right">
      <el-switch v-model="value2" class="mt-2" style="margin-left: 24px" inline-prompt :active-icon="Moon"
        :inactive-icon="Sunny" />
      <i class="icon iconfont icon-fanyi"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Moon, Sunny } from '@element-plus/icons-vue'

const value1 = ref(true)
const value2 = ref(false)
</script>

<style scoped lang="less">
#header {
  // width: 100% !important;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .img_title {
    width: 147px;
  }

  .right {
    width: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .iconfont {
      font-size: 14px;
      color: gray;
    }

    .el-switch__core {
      width: 30px;
    }
  }
}
</style>
