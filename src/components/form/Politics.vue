<template>
    <el-select v-model="value" placeholder="请选择政治面貌" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
<script lang="ts" setup>
const value = defineModel({ default: "" })
const options = [
    {
        value: '党员',
        label: '党员',
    },
    {
        value: '共青团员',
        label: '共青团员',
    },
    {
        value: '群众民主党派成员',
        label: '群众民主党派成员',
    },
    {
        value: '无党派人士',
        label: '无党派人士',
    },
]
</script>

<style scoped lang='less'>
    /deep/.el-select__wrapper {
    width: 300px !important;
    height: 40px;
}
</style>