<template>
    <el-dialog @close="handleClose" v-model="addeditclothes" :title="isEdit ? '编辑洗衣错衣' : '新增洗衣错 '" width=" 700">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
            <el-form-item label="老人姓名" prop="elderlyName">
                <el-button @click="openElderlySelect"> {{ ruleForm.elderlyName || '选择老人' }}</el-button>
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
                <el-upload v-model:file-list="fileList" class="upload-demo" :action="uploadUrl" :headers="uploadHeaders"
                    :on-success="handleUploadSuccess" :on-remove="handleRemove" :on-preview="handlePreview"
                    list-type="picture" :auto-upload="true">
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
    <!-- 老人选择组件 -->
    <ChoseOneElderly :is-show="isShowElderly" :open-elderly="openElderlySelect" :close-elderly="closeElderlySelect"
        @select-elderly="handleSelectElderly" />
</template>

<script setup lang='ts'>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules, type UploadProps, type UploadUserFile } from 'element-plus'
import type { ClothesList } from '../../api/clothes/clothesType'
import { clothesUpdate, clothesAdd } from '../../api/clothes/clothes'
import ChoseOneElderly from '../choseelderly/ChoseOneElderly.vue'
import type { ElderlyListItem } from '../../api/care/activity/activityType'
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

// 老人选择对话框状态
const isShowElderly = ref(false)

// 打开老人选择对话框
const openElderlySelect = () => {
    isShowElderly.value = true
}

// 关闭老人选择对话框
const closeElderlySelect = () => {
    isShowElderly.value = false
}

// 选择老人处理
const handleSelectElderly = (elderly: ElderlyListItem) => {
    ruleForm.elderlyId = elderly.id
    ruleForm.elderlyName = elderly.name
    ruleForm.elderlyPhoto = elderly.photo
    ruleForm.elderlyGender = elderly.gender
    ruleForm.elderlyIdCard = elderly.idCard
}
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

const rules = reactive({
    elderlyName: { required: true, message: '请选择老人', trigger: 'change' },
    title: { required: true, message: '标题不能为空', trigger: 'blur' },
    type: { required: true, message: '请选择分类', trigger: 'blur' },
    state: { required: true, message: '请选择状态', trigger: 'blur' },
    content: { required: true, message: '请填写活动内容', trigger: 'blur' },
    // 移除自定义验证器，使用计算属性结合watch来控制验证
})
// 监听对话框显示
watch(() => props.modelValue, (val) => {
    if (val) {
        // 显示对话框时初始化数据
        if (props.detailData && props.detailData.id) {
            // 编辑模式：回显数据
            Object.assign(ruleForm, props.detailData)
            // 初始化图片列表
            if (ruleForm.pictures && ruleForm.pictures.length > 0) {
                fileList.value = ruleForm.pictures.map(item => ({
                    name: item.file.split('/').pop() || '图片',
                    url: item.file,
                    status: 'success'
                }))
            } else {
                fileList.value = []
            }
        } else {
            // 新增模式：重置表单
            resetForm()
            fileList.value = []
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
        emit('success')
    } else {
        // 新增模式
        await clothesAdd(ruleForm)
        ElMessage.success('新增成功')
        addeditclothes.value = false
        emit('success')
    }
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
    // 重置上传图片列表
    fileList.value = []
}
// 上传图片配置
const uploadUrl = ref('/api/upload/add')
const uploadHeaders = ref({})

// 上传图片列表
const fileList = ref<UploadUserFile[]>([])

// 处理上传成功
const handleUploadSuccess = (response: any, uploadFile: UploadUserFile) => {
    if (response.code === 200) {
        // 上传成功，将图片信息添加到表单中
        ruleForm.pictures.push({
            id: 0,
            clotheId: 0,
            file: response.data.url
        })
        // 触发表单验证，更新图片字段的验证状态
        ruleFormRef.value?.validateField('pictures')
    }
}

// 处理删除图片
const handleRemove: UploadProps['onRemove'] = (uploadFile: UploadUserFile) => {
    // 从表单数据中移除对应的图片
    if (uploadFile.url) {
        const index = ruleForm.pictures.findIndex(item => item.file === uploadFile.url)
        if (index !== -1) {
            ruleForm.pictures.splice(index, 1)
            // 触发表单验证，更新图片字段的验证状态
            ruleFormRef.value?.validateField('pictures')
        }
    }
}

const handlePreview: UploadProps['onPreview'] = (file: UploadUserFile) => {
    console.log('预览图片:', file)
}

// 关闭对话框
const handleClose = () => {
    resetForm()
}

</script>