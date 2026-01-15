<template>
    <el-drawer v-model="props.drawer" title="查看详情">
        <div class="content">
            <div class="item">
                <div class="title">活动名称:</div>
                <div class="content"></div>
            </div>
            <div class="item">
                <div class="title">分类:</div>
                <div class="content"></div>
            </div>
            <div class="item">
                <div class="title">参与老人:</div>
                <div class="content"></div>
            </div>
            <div class="item">
                <div class="title">活动内容:</div>
                <div class="content"></div>
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue';
import type { playListItem } from '../../api/care/activity/activityType';
const props = defineProps<{
    drawer: boolean
    id: number
}>()

const id = ref<number | null>(null)

watch(() => props.id, (val) => {
    id.value = val
})


</script>

<style scoped lang='less'></style>