<template>
    <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
        end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

// 使用 defineModel 实现多个 v-model 双向绑定
const beginDate = defineModel<string | null>('beginDate', { default: null })
const endDate = defineModel<string | null>('endDate', { default: null })

// 定义 emit（用于 change 事件）
const emit = defineEmits<{
    'change': [value: { beginDate: string | null; endDate: string | null }]
}>()

// 将两个日期值合并成数组，用于 el-date-picker
const dateRange = computed({
    get: (): [string, string] | null => {
        if (beginDate.value && endDate.value) {
            return [beginDate.value, endDate.value] as [string, string]
        }
        return null
    },
    set: (value: [string, string] | null) => {
        beginDate.value = value?.[0] || null
        endDate.value = value?.[1] || null
    }
})

// 监听日期变化，触发 change 事件
watch([beginDate, endDate], ([newBeginDate, newEndDate]) => {
    emit('change', {
        beginDate: newBeginDate,
        endDate: newEndDate
    })
}, { deep: true })
</script>

<style scoped lang="less">
.el-range-editor.el-input__wrapper {
    padding: 0px;
}
</style>
