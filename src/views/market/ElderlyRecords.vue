<template>
    <div>
        <el-card style="margin-bottom: 10px;">
            <!-- 头像部分 -->
            <img :src="VITE_IMG_URL + elderlyInfo.photo"
                style="width: 60px; height: 60px; border-radius: 4px; object-fit: cover; margin-right: 30px;">
            <!-- 信息部分：用 Flex 实现 label 和内容的左右分布 -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; align-items: center;margin-bottom: 10px;">
                    <span style="width: 120px; text-align: left; margin-right: 80px;">老人姓名:</span>
                    <span>{{ elderlyInfo.name }}</span>
                </div>
                <div style="display: flex; align-items: center;margin-bottom: 10px;">
                    <span style="width: 120px; text-align: left; margin-right: 80px;">身份证/护照号:</span>
                    <span>{{ elderlyInfo.idCard }}</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <span style="width: 120px; text-align: left; margin-right: 80px;">床位号:</span>
                    <span>{{ elderlyInfo.bedNo || '无' }}</span>
                </div>
            </div>
        </el-card>
        <div style="background-color: #fff;">
            <el-table :data="fileList" border style="width: 100%;">
                <!-- 序号列 -->
                <el-table-column label="序号" type="index" width="80" align="center" />
                <!-- 项目列 -->
                <el-table-column label="项目" prop="name" align="center" />
                <!-- 文件列 -->
                <el-table-column label="文件" prop="fileName" align="center">
                    <!-- 可点击文件名（如果需要预览） -->
                    <template #default="scope">
                        <span v-if="scope.row.fileName" style="color: #409EFF; cursor: pointer;">
                            {{ scope.row.fileName }}
                        </span>
                        <span v-else>暂无文件</span>
                    </template>
                </el-table-column>
                <!-- 操作列 -->
                <el-table-column label="操作" align="center" width="120">
                  <template #default="scope"> <!-- 关键：接收 scope，获取当前行 scope.row -->
        <uploads 
            v-model="Image"
            :baseUrl="VITE_IMG_URL"
            :uploadUrl="imageUrl"
            :isText="true"
        >
            <template #upload-text>
                <!-- 关键：点击上传时，传递当前行数据 scope.row 给事件处理函数 -->
                <el-button type="primary" size="small" @click="getelderlyFilesAdd(scope.row)">上传图片</el-button>
            </template>
        </uploads>
    </template>
                </el-table-column>
            </el-table>
            <!-- 返回按钮 -->
            <div style="text-align: center;padding: 20px;">
                <el-button type="primary" @click="$router.push('/elderly')">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { elderlyFilesAdd, elderlyGet, fileitemsList } from '../../api/market/elderly';
import type { FileItemDetail, FormItem } from '../../api/market/elderlyType';
import uploads from '../../components/upload/Uploads.vue';

const elderlyInfo = ref<any>({});
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';
const route = useRoute();
const elderlyId = ref<number>(0);
const fileList = ref<FormItem[]>([]);
const Image = ref<string>('');

onMounted(async () => {
    const id = route.query.id || route.params.id;
    elderlyId.value = Number(id);
    const res = await elderlyGet(elderlyId.value)
    console.log('老人详情', res);
    elderlyInfo.value = res.data;
    const fileitems = await fileitemsList()
    console.log('申请表', fileitems);
    fileList.value = fileitems.data.list;
});

// 修改：接收当前表格行参数 currentRow
const getelderlyFilesAdd = async (currentRow: FormItem) => {
    // 2. 提取所需参数（核心：收集 elderlyId、currentRow.name、fileName）
    // 提取 fileName：从 Image.value（完整文件路径）中截取文件名（也可根据实际上传结果调整）
    const fileName = Image.value.substring(Image.value.lastIndexOf('/') + 1);
    // 构造接口请求参数
    const uploadParams: FileItemDetail = {
        elderlyId: elderlyId.value, // 当前老人ID
        name: currentRow.name, // 本条的项目名称（如“申请表”）
        fileName: fileName, // 上传后的文件名称
        id: 0
    };

    try {
        // 3. 调用上传接口，提交参数
        const res = await elderlyFilesAdd(uploadParams);
        console.log('文件上传关联成功', res);

        // 4. 更新表格对应行的 fileName（视图实时刷新）
        const rowIndex = fileList.value.findIndex(item => item.id === currentRow.id);
        if (rowIndex !== -1) {
            fileList.value[rowIndex].fileName = fileName;
        }

        // 5. 清空上传缓存（可选，避免下次上传携带旧文件）
        Image.value = '';
    } catch (error) {
        console.error('文件上传关联失败', error);
    }
};
</script>

<style scoped lang="less">
    /deep/.el-card__body {
        display: flex;
    }
</style>