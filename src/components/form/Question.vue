<template>
    <el-select v-model="value" placeholder="请选择" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
<script lang="ts" setup>
const value = defineModel({ default: "" })
const options = [
    {
        value: '线上咨询',
        label: '线上咨询',
    },
    {
        value: '线下咨询',
        label: '线下咨询',
    },
]
</script>

<style scoped lang='less'>
    /deep/.el-select__wrapper {
    width: 300px !important;
    height: 40px;
}
</style>