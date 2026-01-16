<template>
    <div>
        <div class="Nowiln">
            <div class="left"></div>
            <div class="title">体检报告</div>
        </div>
        <el-table border :data="list" style="width: 100%" row-key="id"> <!-- 推荐添加 row-key 确保行数据唯一性 -->
            <el-table-column prop="name" label="体检项目" />
            <el-table-column prop="picture" label="资料">
                <!-- 展示已上传的图片地址（优化用户体验） -->
                <template #default="scope">
                    <span v-if="scope.row.picture">{{ scope.row.picture }}</span>
                    <span v-else>未上传</span>
                </template>
            </el-table-column>
            <el-table-column label="操作"> <!-- 移除多余的 prop="address"，操作列无需绑定字段 -->
                <template #default="scope"> <!-- 关键：通过 scope.row 获取当前行数据 -->
                    <uploads 
                        @change="(url: string) => changeHandle(url, scope.row)" 
                        v-model="scope.row.picture"
                        :baseUrl="VITE_IMG_URL"
                        :uploadUrl="imageUrl"
                        :isText="true"
                    >
                        <template #upload-text> <!-- 移除多余的 #default="scope"，模板插槽名称正确即可 -->
                            <el-button type="primary">上传图片</el-button>
                        </template>
                    </uploads>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Checkup, IllnessItem } from '../../api/market/elderlyType';
import { CheckupitemsList } from '../../api/market/elderly';
import uploads from '../upload/Uploads.vue';

// 1. 定义双向绑定值，默认空数组（确保类型正确，与返回数据格式匹配）
const values = defineModel<Checkup[]>({ default: () => [] })

// 2. 环境变量获取
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_API_BASE_URL; // 修正：图片预览地址通常与接口地址一致，可根据实际调整
const imageUrl = VITE_BASE_URL + '/upload/add';

// 3. 表格列表数据（确保 IllnessItem 类型包含 id、name、picture 字段）
const list = ref<IllnessItem[]>([])

// 4. 初始化获取体检项目列表
const getSelfCares = async () => {
    try {
        const res = await CheckupitemsList();
        // 初始化每行的 picture 字段（避免 undefined，确保双向绑定正常）
        list.value = res.data.list.map((item: IllnessItem) => ({
            ...item,
            picture: item.picture || '' // 给 picture 赋默认空字符串，确保双向绑定可用
        }));
        console.log('体检项目', res);
        // 初始化时整理一次 values 数据
        formatValues();
    } catch (error) {
        console.error('获取体检项目列表失败：', error);
    }
}

// 5. 上传成功回调（更新当前行 picture，整理 values）
const changeHandle = (url: string, row: IllnessItem) => {
    console.log("当前行上传结果：", url, row);
    // 关键：将上传结果同步到当前行的 picture 字段（双向绑定已自动同步，此处可做额外处理）
    row.picture = url;
    // 整理 values 数据（提取含 picture 的行，转换为目标格式）
    formatValues();
}

// 6. 统一整理 values 数据的方法（职责单一，便于复用）
const formatValues = () => {
    // 过滤出已上传 picture（非空）的行，转换为 SelfCare/Checkup 格式
    const formattedData = list.value
        .map(item => ({
            name: item.name,
            val: item.picture, // 按需求映射字段，val 对应上传的图片地址
            id: item.id || '' // 可选：携带行 id，便于后端关联
        })) as Checkup[]; // 类型断言，确保符合 values 的类型要求

    // 同步更新 values（双向绑定，父组件将接收该数据）
    values.value = formattedData;
    console.log("整理后的 values 数据：", values.value);
}

// 7. 可选：监听 list 数据变化，自动整理 values（增强健壮性）
watch(list, () => {
    formatValues();
}, { deep: true }) // deep: true 监听数组内对象字段的变化

// 初始化加载列表
getSelfCares();
</script>

<style scoped lang="less">
.Nowiln {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;

    .left {
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

/deep/.el-checkbox-group {
    margin-bottom: 20px;
}

.button {
    background-color: #529bfd;
    border: none;
    color: #fff;
}
</style>