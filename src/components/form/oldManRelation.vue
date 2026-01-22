<template>
    <el-select v-model="value" placeholder="请选择" style="width: 240px">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
<script lang="ts" setup>
const value = defineModel({ default: "" })
const options = [
    {
        value: '父子关系',
        label: '父子关系',
    },
    {
        value: '父女关系',
        label: '父女关系',
    },
    {
        value: '母女关系',
        label: '母女关系',
    },
    {
        value: '母子关系',
        label: '母子关系',
    },
    {
        value: '其他',
        label: '其他',
    },
]
</script>

<style scoped lang='less'>
/deep/.el-select__wrapper {
    width: 300px !important;
    height: 40px;
}
</style>