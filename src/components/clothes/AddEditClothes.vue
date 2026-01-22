<template>
    <el-dialog @close="handleClose" v-model="addeditclothes" :title="isEdit ? '编辑洗衣错衣' : '新增洗衣错 '" width=" 700">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="老人姓名" prop="elderlyName">
                <el-button> {{ ruleForm.elderlyName || '选择老人' }}</el-button>
            </el-form-item>
            <el-form-item label="标题" prop="title" clearable style="width: 425px">
                <el-input v-model="ruleForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="类型" prop="type" clearable style="width: 425px">
                <el-select v-model="ruleForm.type" placeholder="请选择类型">
                    <el-option v-for="item in typeItem" :key="item" :label="item.value" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="state" clearable style="width: 425px">
                <el-select v-model="ruleForm.state" placeholder="请选择状态">
                    <el-option v-for="item in stateItem" :key="item" :label="item.value" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="content" clearable style="width: 425px">
                <el-input type="textarea" v-model="ruleForm.content" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="图片" prop="pictures">
                <el-upload v-model:file-list="fileList" class="upload-demo"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :on-preview="handlePreview"
                    :on-remove="handleRemove" list-type="picture">
                    <el-button type="primary">选择照片</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="addeditclothes = false">取消</el-button>
            <el-button type="primary" @click="submitForm">
                提交
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadProps, type UploadUserFile } from 'element-plus'
import type { ClothesList } from '../../api/clothes/clothesType'
import { clothesUpdate } from '../../api/clothes/clothes'
// 
interface Props {
    modelValue: boolean
    detailData?: ClothesList
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'success'])

const addeditclothes = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
})
// 判断是否为编辑模式
const isEdit = computed(() => {
    return !!(props.detailData && props.detailData.id)
})
// 状态
const stateItem = [
    { value: '未解决', }, { value: '已解决', }
]
// 类型
const typeItem = [
    { value: '错衣', }, { value: '缺衣', }
]
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<ClothesList>({
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

const rules = reactive<FormRules<ClothesList>>({
    elderlyName: { required: true, message: '请选择老人', trigger: 'blur' },
    title: { required: true, message: '标题不能为空', trigger: 'blur' },
    type: { required: true, message: '请选择分类', trigger: 'blur' },
    state: { required: true, message: '请选择状态', trigger: 'blur' },
    content: { required: true, message: '请填写活动内容', trigger: 'blur' },
    pictures: { required: true, message: '请上传活动图片', trigger: 'blur' },
})
// 监听对话框显示
watch(() => props.modelValue, (val) => {
    if (val) {
        // 显示对话框时初始化数据
        if (props.detailData && props.detailData.id) {
            // 编辑模式：回显数据
            Object.assign(ruleForm, props.detailData)
        } else {
            // 新增模式：重置表单
            resetForm()
        }
    }
}, { immediate: true })

const submitForm = async () => {
    if (!ruleFormRef.value) return
    await ruleFormRef.value.validate()
    if (isEdit.value) {
        // 编辑模式
        await clothesUpdate(ruleForm)
        ElMessage.success('编辑成功')
        addeditclothes.value = false
    }
    // else {
    // 新增模式
    // await clothesAdd(ruleForm)
    // ElMessage.success('新增成功')
    // }

    // 触发成功事件
    emit('success')

}

// 重置表单
const resetForm = () => {
    ruleFormRef.value?.resetFields()
    Object.keys(ruleForm).forEach(key => {
        if (key === 'id') {
            ruleForm.id = 0
        } else if (key === 'pictures') {
            ruleForm.pictures = []
        } else if (typeof ruleForm[key as keyof ClothesList] === 'string') {
            (ruleForm[key as keyof ClothesList] as any) = ''
        } else if (typeof ruleForm[key as keyof ClothesList] === 'number') {
            (ruleForm[key as keyof ClothesList] as any) = 0
        } else {
            (ruleForm[key as keyof ClothesList] as any) = null
        }
    })
}
// 上传图片
const fileList = ref<UploadUserFile[]>([
    {
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
    {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
])

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
    console.log(file)
}

// 关闭对话框
const handleClose = () => {
    resetForm()
}

</script>