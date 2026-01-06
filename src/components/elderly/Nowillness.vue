<template>
    <div>
        <div class="Nowiln">
            <div class="left"></div>
            <div class="title">{{ title }}</div>
        </div>
        <el-checkbox-group @change="handleChange" v-model="checkList">
            <!-- 优化：添加key避免v-for警告，label和value统一用item.name -->
            <el-checkbox v-for="item in list" :key="item.id" :label="item.name" :value="item.name" />
        </el-checkbox-group>
    </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import type { IllnessItem } from '../../api/market/elderlyType'
import { DiseaseList } from '../../api/market/elderly'

// 1. 定义双向绑定值，默认空字符串
const value = defineModel({ default: "" })

defineProps({
    title: {
        type: String,
        default: ""
    }
})

const checkList = ref<string[]>([])
const list = ref<IllnessItem[]>([])

// 2. 优化：获取疾病列表，添加异常处理
const getData = async () => {
    try {
        const res = await DiseaseList();
        list.value = res.data.list || []; // 兜底空数组
    } catch (error) {
        console.error('获取疾病列表失败：', error);
        list.value = [];
    }
}
getData();

// 3. 核心修复：处理空值split的问题（避免得到[""]）
watchEffect(() => {
    // 只有当value非空且不是纯逗号时，才split；否则置为空数组
    if (value.value && value.value.trim() !== "") {
        checkList.value = value.value.split(",").filter(Boolean); // filter(Boolean)过滤空字符串
    } else {
        checkList.value = []; // 空值时直接置为空数组
    }
})

// 4. 核心修复：处理空选中时的value赋值
const handleChange = (val: string[]) => { // 修正类型：val是string[]而非IllnessItem[]
    // 选中项为空时，赋值空字符串；否则用逗号拼接
    value.value = val.length > 0 ? val.join(",") : "";
}
</script>

<style scoped lang="less">
    .Nowiln{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
.left{
    width: 8px;
    height: 16px;
    background-color: #529bfd;
    margin-right: 10px;
}
.title {
    font-size: 16px;
    font-weight: bold;
}
    }
    /deep/.el-checkbox-group{
        margin-bottom: 20px;
    }

</style>