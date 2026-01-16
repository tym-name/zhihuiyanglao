<template>
    <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>
<script lang="ts" setup>
const value = defineModel({ default: "" })
const options = [
    {
        value: '父子',
        label: '父子',
    },
    {
        value: '父女',
        label: '父女',
    },
    {
        value: '母子',
        label: '母子',
    },
    {
        value: '爷孙',
        label: '爷孙',
    },
        {
        value: '兄弟',
        label: '兄弟',
    },
        {
        value: '姐妹',
        label: '姐妹',
    },
        {
        value: '朋友',
        label: '朋友',
    },
        {
        value: '本人',
        label: '本人',
    },
        {
        value: '其他',
        label: '其他',
    },
]
</script>

<style scoped lang='less'>

</style>