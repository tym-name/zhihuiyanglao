<template>
    <el-select v-model="value" placeholder="请选择" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
<script lang="ts" setup>
const value = defineModel({ default: "" })
const options = [
    {
        value: '汉族',
        label: '汉族',
    },
    {
        value: '蒙古族',
        label: '蒙古族',
    },
    {
        value: '回族',
        label: '回族',
    },
    {
        value: '藏族',
        label: '藏族',
    },
    {
        value: '维吾尔族',
        label: '维吾尔族',
    },
    {
        value: '苗族',
        label: '苗族',
    },
    {
        value: '彝族',
        label: '彝族',
    },
    {
        value: '壮族',
        label: '壮族',
    },
    {
        value: '布依族',
        label: '布依族',
    },
    {
        value: '朝鲜族',
        label: '朝鲜族',
    },
    {
        value: '满族',
        label: '满族',
    },
    {
        value: '侗族',
        label: '侗族',
    },
    {
        value: '瑶族',
        label: '瑶族',
    },
    {
        value: '白族',
        label: '白族',
    },
    {
        value: '土家族',
        label: '土家族',
    },
    {
        value: '哈尼族',
        label: '哈尼族',
    },
    {
        value: '哈萨克族',
        label: '哈萨克族',
    },
    {
        value: '傣族',
        label: '傣族',
    },
    {
        value: '黎族',
        label: '黎族',
    },
    {
        value: '傈僳族',
        label: '傈僳族',
    },
    {
        value: '佤族',
        label: '佤族',
    },
    {
        value: '畲族',
        label: '畲族',
    },
    {
        value: '高山族',
        label: '高山族',
    },
    {
        value: '拉祜族',
        label: '拉祜族',
    },
    {
        value: '水族',
        label: '水族',
    },
]
</script>

<style scoped lang='less'>
    /deep/.el-select__wrapper {
    width: 300px !important;
    height: 40px;
}
</style>