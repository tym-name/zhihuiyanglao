<template>
    <el-dialog v-model="dialogFormVisible" title="洗衣错衣详情" width="500">
        <el-form :model="form">
            <el-form-item label="老人姓名：" v-model="form.elderlyName">
                {{ form.elderlyName }}
            </el-form-item>
            <el-form-item label="标题：" v-model="form.title">
                {{ form.title }}
            </el-form-item>
            <el-form-item label="类型：" v-model="form.type">
                {{ form.type }}
            </el-form-item>
            <el-form-item label="状态：" v-model="form.state">
                {{ form.state }}
            </el-form-item>
            <el-form-item label="房间号：" v-model="form.houseName">
                {{ form.buildingName }}
            </el-form-item>
            <el-form-item label="发布时间：" v-model="form.addTime">
                {{ form.addTime }}
            </el-form-item>
            <el-form-item label="内容：" v-model="form.content">
                {{ form.content }}
            </el-form-item>
            <el-form-item label="图片：" v-model="form.pictures">
                
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogFormVisible = false">
                关闭
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { computed, reactive, ref, watch } from 'vue'
import type { ClothesList } from '../../api/clothes/clothesType';

const form = reactive<ClothesList>({
    id: 0,
    companyId: 0,
    elderlyId: 0,
    title: '',
    content: '',
    type: '',
    state: '',
    addTime: '',
    addAccountId: 0,
    addAccountName: '',
    begName: null,
    elderlyName: null,
    elderlyPhoto: null,
    elderlyGender: null,
    elderlyIdCard: null,
    houseName: null,
    buildingName: '',
    pictures: [],
})
const props = defineProps<{
    modelValue: boolean
    detailData?: ClothesList
}>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const dialogFormVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

// 监听详情数据变化
watch(() => props.detailData, (newData) => {
    if (newData) {
        Object.assign(form, newData)
    }
}, { immediate: true })
</script>