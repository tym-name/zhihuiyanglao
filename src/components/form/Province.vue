<template>
    <!-- 级联选择器：绑定value，触发change事件 -->
    <el-cascader 
        v-model="cascaderValue"
        :options="options" 
        @change="handleChange" 
        placeholder="请选择省市"
        clearable
        style="width: 428px;"
    />
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';

// 核心：双向绑定省市数据（格式：{ province: string, city: string }）
const modelValue = defineModel<{
    province: string;
    city: string;
}>({ 
    default: () => ({})
});

// 级联选择器的原始值（数组：[省, 市]）
const cascaderValue = ref<string[]>([]);

// 初始化：从modelValue同步到级联选择器（编辑场景回显）
watch(() => modelValue.value, (val) => {
    if (val.province && val.city) {
        cascaderValue.value = [val.province, val.city];
    } else {
        cascaderValue.value = [];
    }
}, { immediate: true, deep: true });

// 选择变化：解析省/市并同步到modelValue
const handleChange = (value: string[]) => {
    const province = value[0] || '';
    const city = value[1] || '';
    // 更新双向绑定值
    modelValue.value = { province, city };
};

// 省市数据源
const options = [
    {
        value: '北京',
        label: '北京',
        children: [{ value: '北京市', label: '北京市' }]
    },
    {
        value: '上海',
        label: '上海',
        children: [{ value: '上海市', label: '上海市' }]
    },
    {
        value: '天津',
        label: '天津',
        children: [{ value: '天津市', label: '天津市' }]
    },
    {
        value: '重庆',
        label: '重庆',
        children: [{ value: '重庆市', label: '重庆市' }]
    },
    {
        value: '黑龙江',
        label: '黑龙江',
        children: [
            { value: '哈尔滨市', label: '哈尔滨市' },
            { value: '齐齐哈尔市', label: '齐齐哈尔市' },
            { value: '鹤岗市', label: '鹤岗市' },
            { value: '鸡西市', label: '鸡西市' },
            { value: '大庆市', label: '大庆市' }
        ]
    }
];
</script>

<style scoped lang='less'>
:deep(.el-cascader__input) {
    height: 40px;
    line-height: 40px;
}
</style>