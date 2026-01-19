<template>
    <el-card class="account-set-card">
        <div class="account-info">
            <!-- 头像设置 -->
            <div class="form-item">
                <label class="form-label">头像:</label>
                <div class="avatar-container">
                    <el-avatar :size="60" style="margin-right: 30px;" :src="VITE_IMG_URL+model.photo"></el-avatar>
                    <uploads v-model="model.photo" :baseUrl="VITE_IMG_URL" :uploadUrl="imageUrl" :isText="true">
                        <template #upload-text>
                            <el-button type="text" class="change-avatar-btn">更换头像</el-button>
                        </template>
                    </uploads>
                    
                </div>
            </div>

            <!-- 姓名 -->
            <div class="form-item">
                <label class="form-label">姓名:</label>
                <div>{{ model.name }}</div>
            </div>

            <!-- 手机号 -->
            <div class="form-item">
                <label class="form-label">手机号:</label>
                <div>{{ model.mobile }}</div>
            </div>

            <!-- 账号 -->
            <div class="form-item">
                <label class="form-label">账号:</label>
                <div>{{ model.username }}</div>
            </div>

            <!-- 密码 -->
            <div class="form-item">
                <label class="form-label">密码:</label>
                <div class="password-container">
                    <div>******</div>
                    <el-button type="text" @click="handleChangePassword" class="change-password-btn">修改密码</el-button>
                </div>
            </div>
        </div>
    <AccountSetAdd v-if="roleDialogVisible" v-model="roleDialogVisible"></AccountSetAdd>
    </el-card>
</template>

<script setup lang='ts'>
import { useAuthStore } from '@/stores/auth';
import uploads from '@/components/upload/Uploads.vue';
import AccountSetAdd from '@/views/system/AccountSetAdd.vue';
import { ref } from 'vue';

const authStore = useAuthStore();
const model = authStore.model;
console.log('login页面', model);
const VITE_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_IMG_URL = import.meta.env.VITE_IMG_URL;
const imageUrl = VITE_BASE_URL + '/upload/add';
const roleDialogVisible=ref(false);

// 修改密码
const handleChangePassword = () => {
      roleDialogVisible.value = true;
};

</script>

<style scoped lang='less'>
.form-item {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    &.submit-item {
        margin-top: 32px;
        justify-content: flex-start;
    }
}

.form-label {
    width: 80px;
    margin-right: 20px;
    text-align: right;
    font-weight: 500;
}

.avatar-container {
    display: flex;
    align-items: center;
    .change-avatar-btn {
        color: #4080ff;
    }
}

.password-container {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 300px;

    .change-password-btn {
        margin-left: 16px;
        color: #4080ff;
    }
}

.el-input {
    width: 100%;
    max-width: 300px;
}
</style>