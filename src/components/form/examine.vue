<template>
    <el-select v-model="value" placeholder="请选择状态" style="width: 300px" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
<script lang="ts" setup>
const value = defineModel({ default: "" })
const options = [
    {
        value: '未返回',
        label: '未返回',
    },
    {
        value: '已返回',
        label: '已返回',
    },
    {
        value: '逾期未返回',
        label: '逾期未返回',
    },

]
</script>
<style scoped lang='less'>
    /deep/.el-select__wrapper {
    width: 300px !important;
    height: 40px;
}
</style>