<template>
    <el-drawer v-model="props.drawer" title="查看详情">
        <el-form label-width="auto">
            <el-form-item label="活动名称:">
                {{ details?.title }}
            </el-form-item>
            <el-form-item label="分类:">
                {{ typeName }}
            </el-form-item>
            <el-form-item label="参与老人:">
                <div class="content title_content" v-for="item in details?.elderly" :key="item.id">
                    {{ item.elderlyName }}
                </div>
            </el-form-item>
            <el-form-item label="活动内容:">
                {{ playContent }}
            </el-form-item>
            <el-form-item label="图片:" v-for="item in details?.pictures" :key="item">
                <img :src='VITE_IMG_URL + item.picture' alt="" class="image">
            </el-form-item>
            <el-form-item label="上报时间:">
                {{ details?.addTime }}
            </el-form-item>
            <el-form-item>
                <el-button @click="props.close">关闭</el-button>
            </el-form-item>
        </el-form>

    </el-drawer>
</template>

<script setup lang='ts'>
import { ref, reactive, watch } from 'vue';
import type { ActivityTypeItem, Elderly, ElderlyDetailsData } from '../../api/care/activity/activityType';
import { playget } from '../../api/care/activity/activity';

const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;


const props = defineProps<{
    drawer: boolean
    id: number
    typeList: ActivityTypeItem[]
    close: () => void
    
}>()


const Id = ref<number | null>(null)
watch(() => props.id, (val) => {
    Id.value = val
    getPlayItem()
})
const typeListData = ref<ActivityTypeItem[]>([])
watch(() => props.typeList, (val) => {
    typeListData.value = val
})

const details = ref<ElderlyDetailsData | null>(null)

const getPlayItem = async () => {
    if (Id.value) {  // 确保有值才请求
        try {
            let res = await playget(Id.value)
            console.log('单条院内活动信息', res);
            details.value = res.data
            if (res.data) {
                getTypeName(res.data)
            }
            removeHtmlTags(res.data.content)

        } catch (error) {
            console.error('获取活动详情失败:', error)
        }
    }

}

//根据typeid判断typeName
const typeName = ref<string>('')
const getTypeName = (details: ElderlyDetailsData) => {
    typeListData.value.forEach(element => {
        if (details.type === element.id) {
            typeName.value = element.name
        }
    });
}

const playContent = ref<string>('')
const removeHtmlTags = (content: string): string => {
    return playContent.value = content.replace(/<[^>]*>/g, '');
};




</script>

<style scoped lang='less'>
.image {
    width: 100px;
}
</style>