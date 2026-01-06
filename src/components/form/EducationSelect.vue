<template>
    <el-select v-model="value" placeholder="请选择" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
<script lang="ts" setup>
const value = defineModel({ default: "" })
const options = [
    {
        value: '小学',
        label: '小学',
    },
    {
        value: '初中',
        label: '初中',
    },
    {
        value: '高中',
        label: '高中',
    },
    {
        value: '大专',
        label: '大专',
    },
    {
        value: '本科',
        label: '本科',
    },
    {
        value: '硕士',
        label: '硕士',
    },
    {
        value: '博士',
        label: '博士',
    }

]
</script>
<style scoped lang='less'>
    /deep/.el-select__wrapper {
    width: 300px !important;
    height: 40px;
}
</style>