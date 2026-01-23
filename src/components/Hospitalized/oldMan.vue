<template>
    <div class="old-man-info">
        <div class="info-container">
            <!-- 老人头像 -->
            <div class="avatar-section">
                <img v-if="oldManData.photo" :src="VITE_IMG_URL + oldManData.photo" alt="老人头像" class="avatar-img" />
                <div v-else class="avatar-placeholder">
                    <el-icon>
                        <User />
                    </el-icon>
                </div>
            </div>

            <!-- 老人信息 -->
            <div class="info-section">
                <div class="info-item">
                    <span class="label">老人姓名：</span>
                    <span class="value">{{ oldManData.name || '未知' }}</span>
                </div>
                <div class="info-item">
                    <span class="label">身份证号：</span>
                    <span class="value">{{ oldManData.idCard || '未知' }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElIcon } from 'element-plus';
import { User } from '@element-plus/icons-vue';
import { watch } from 'vue';

const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;

// 老人信息数据
interface OldMan {
    name: string;
    idCard: string;
    photo: string;
}

// 接收父组件传来的老人信息
const props = defineProps({
    oldManData: {
        type: Object as () => OldMan,
        default: () => ({
            name: '',
            idCard: '',
            photo: ''
        })
    }
});
watch(()=>props.oldManData, (newVal, oldVal) => {
    
        // 图片变化时，触发重新加载
        console.log(props.oldManData);

})
</script>

<style scoped lang="less">
.old-man-info {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
}

.info-container {
    display: flex;
    align-items: center;
    gap: 20px;
}

.avatar-section {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;

    .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f7fa;
        border: 1px solid #e4e7ed;

        .el-icon {
            font-size: 40px;
            color: #909399;
        }
    }
}

.info-section {
    flex: 1;

    .info-item {
        margin-bottom: 10px;

        .label {
            font-size: 14px;
            color: #606266;
            margin-right: 10px;
        }

        .value {
            font-size: 14px;
            color: #303133;
        }
    }
}
</style>