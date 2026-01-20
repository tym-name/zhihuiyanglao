<template>
    <div>
        <el-dialog v-model="props.open" :title="dialogTitle" :before-close="handleClose" width="1000px">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                <el-form-item label="标题" prop="title" style="width: 900px">
                    <el-input v-model="ruleForm.title" />
                </el-form-item>
                <el-form-item label="分类" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择分类" style="width: 240px">
                        <el-option v-for="item in props.options" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="老人" prop="elderly">
                    <div @click="openDialog">
                        <div v-if="elderlyData.length > 0" class="elderly-list">
                            <el-tooltip :content="elderlyData.map(e => e.name).join('、')" placement="top">
                                <span>{{elderlyData.map(e => e.name).join('、')}}</span>
                            </el-tooltip>
                        </div>
                        <el-button type="primary" v-else>选择老人</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="活动内容" prop="content" style="width: 900px">
                    <Ediort :height="400" v-model="ruleForm.content"></Ediort>
                </el-form-item>
                <el-form-item label="上传图片" prop="pictures">
                    <el-upload class="upload-demo" :action="imageUrl" :headers="uploadHeaders" :file-list="fileList"
                        list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                        :on-success="handleUploadSuccess" :before-upload="beforeUpload">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <template #tip>
                            <div class="el-upload__tip">支持上传jpg/png/gif格式，单张不超过5MB</div>
                        </template>
                    </el-upload>

                    <el-dialog v-model="dialogVisible" title="图片预览" width="80%">
                        <img w-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="props.close">取消</el-button>
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </div>
            </template>
            <ChoseElderly :open="openDialog" :close="closeDialog" :isShow="elderlyIsShow"
                @confirm="handleSelectedElderly"  />
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, computed } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules, UploadFile } from 'element-plus';
import Ediort from './Ediort.vue';
import ChoseElderly from './ChoseElderly.vue';

// API导入
import { addPlay, updatePlay } from '../../api/care/activity/activity';
import type {
    ActivityTypeItem,
    AddPlayParams,
    ElderlyDetailsData,
    ElderlyListItem
} from '../../api/care/activity/activityType';

// 环境变量
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';

// Props定义
const props = defineProps<{
    open: boolean;
    close: () => void;
    options: ActivityTypeItem[];
    id?: number | null; // 活动ID，用于判断是添加还是编辑
    palyDate: ElderlyDetailsData;
    Refresh: () => void; // 刷新页面的回调函数
}>();

watch(() => props.id, (newId) => {
    haha.value = newId
})
const haha = ref<null | number>();


// 对话框标题
const dialogTitle = computed(() => props.id ? '修改院内活动' : '增加院内活动');

// 表单相关
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref<AddPlayParams>({
    title: '',
    type: null,
    content: '',
    elderly: [],
    pictures: [],
});

const rules = reactive<FormRules<AddPlayParams>>({
    title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择活动分类', trigger: 'change' }],
    content: [{ required: true, message: '请输入活动内容', trigger: 'blur' }],
    elderly: [{ required: true, message: '请选择老人', trigger: 'change' }],
    pictures: [{ required: true, message: '请上传活动图片', trigger: 'change' }],
});

// 上传配置
const uploadHeaders = { 'Authorization': 'Bearer token123' };
const fileList = ref<UploadFile[]>([]);

// 预览对话框
const dialogVisible = ref(false);
const dialogImageUrl = ref('');

// 老人选择相关
const elderlyIsShow = ref(false);
const closeDialog = () => {
    elderlyIsShow.value = false;
};
const openDialog = () => {
    elderlyIsShow.value = true;
};

const elderlyData = ref<ElderlyListItem[]>([]);
const handleSelectedElderly = (selectedData: ElderlyListItem[]) => {
    elderlyData.value = selectedData;
    ruleForm.value.elderly = selectedData.map(item => ({ elderlyId: item.id }));
};

// 监听ruleForm.pictures变化，更新fileList
watch(() => ruleForm.value.pictures, (newPictures) => {
    if (newPictures) {
        fileList.value = newPictures.map((pic, index) => ({
            name: `图片${index + 1}`,
            url: VITE_IMG_URL + pic.picture,
            uid: Date.now() + index,
            status: 'success' as const
        }));
    } else {
        fileList.value = [];
    }
}, { immediate: true, deep: true });

// 监听palyDate变化，更新表单数据
watch(() => props.palyDate, (newDate) => {
    if (newDate) {
        ruleForm.value.title = newDate.title;
        ruleForm.value.type = newDate.type;
        ruleForm.value.content = newDate.content;
        ruleForm.value.elderly = newDate.elderly.map(item => ({ elderlyId: item.elderlyId }));
        ruleForm.value.pictures = newDate.pictures;
        // 转换老人数据用于显示
        elderlyData.value = newDate.elderly.map(item => ({
            id: item.elderlyId,
            companyId: 0,
            name: item.elderlyName || '',
            mobile: '',
            photo: item.elderlyPhoto || '',
            gender: 0,
            birthday: '',
            nativePlace: '',
            nation: '',
            idCard: '',
            politics: '',
            socialCard: '',
            marriage: '',
            eduLevel: '',
            education: '',
            resident: '',
            address: '',
            begId: 0,
            houseId: 0,
            state: 0,
            addTime: '',
            addAccountId: 0,
            stateName: '',
            begName: item.begName,
            addAccountName: '',
            houseName: item.houseName,
            buildingName: item.buildingName,
            health: null,
            selfCares: null,
            checkups: null,
            family: null
        }));
    } else {
        resetForm();
    }
}, { immediate: true });

// 图片处理相关
const handlePictureCardPreview = (uploadFile: UploadFile) => {
    dialogImageUrl.value = uploadFile.url as string;
    dialogVisible.value = true;
};

const handleRemove = (uploadFile: UploadFile) => {
    const index = fileList.value.findIndex(item => item.uid === uploadFile.uid);
    if (index !== -1) {
        fileList.value.splice(index, 1);
        ruleForm.value.pictures.splice(index, 1);
        ElMessage.success('图片删除成功');
    }
};

const handleUploadSuccess = (response: any) => {
    if (response?.code === 10000 && response.data?.url) {
        ruleForm.value.pictures.push({ picture: response.data.url });
        ElMessage.success('图片上传成功');
    } else {
        ElMessage.error(response?.msg || '上传失败');
    }
};

const beforeUpload = (rawFile: File) => {
    const isImage = rawFile.type.startsWith('image/');
    const isLt5M = rawFile.size / 1024 / 1024 <= 5;

    if (!isImage) {
        ElMessage.error('只允许上传图片文件');
        return false;
    }
    if (!isLt5M) {
        ElMessage.error('单张图片大小不能超过5MB');
        return false;
    }
    return true;
};

// 表单提交


const submitForm = async () => {

    // 第一步：先校验表单
    if (!ruleFormRef.value) return
    try {
        const valid = await ruleFormRef.value.validate()
        if (!valid) return
    } catch (error) {
        ElMessage.error('表单校验失败，请检查填写内容')
        return
    }

    if (haha.value) {
        try {
            // 修改操作需要包含id，将props.id合并到请求数据中
            const updateData = { ...ruleForm.value, id: props.id };
            let res = await updatePlay(updateData as any);
            console.log('修改', res);
            if (res.code === 10000) {
                ElMessage.success('修改成功');
                // 调用父组件刷新方法
                props.Refresh()
                // 关闭弹窗
                props.close();
                // 重置表单
                resetForm();
                // haha.value = 0

            } else {
                ElMessage.error('修改失败：' + (res.msg || '服务器异常'));
            }
        } catch (error) {
            ElMessage.error('修改失败：网络异常');
            console.error('修改活动报错：', error);
        }

    } else {
        // 第二步：提交新增请求
        try {
            let res = await addPlay(ruleForm.value);
            console.log('添加', res);
            if (res.code === 10000) {
                ElMessage.success('添加成功');
                // 调用父组件刷新方法
                props.Refresh()
                // 关闭弹窗
                props.close();
                // 重置表单
                resetForm();
                haha.value = 0
            } else {
                ElMessage.error('添加失败：' + (res.msg || '服务器异常'));
            }
        } catch (error) {
            ElMessage.error('添加失败：网络异常');
            console.error('新增活动报错：', error);
        }
    }

}

// 重置表单
const resetForm = () => {
    if (ruleFormRef.value) {
        ruleFormRef.value.clearValidate();
        ruleFormRef.value.resetFields();
    }
    ruleForm.value = {
        title: '',
        type: null,
        content: '',
        elderly: [],
        pictures: [],
    };
    elderlyData.value = [];
    fileList.value = [];
};

// 关闭对话框处理
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('您确定要关闭此对话框吗')
        .then(() => {
            resetForm();
            done();
        })
        .catch(() => {
            // 取消关闭
        });
};
</script>

<style scoped lang='less'>
// 预览图片样式
:deep(.el-dialog__body) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;

    img {
        max-width: 100%;
        max-height: 70vh;
        object-fit: contain;
    }
}

.elderly-list {
    cursor: pointer;
    padding: 8px 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #f5f7fa;
    width: fit-content;
}
</style>