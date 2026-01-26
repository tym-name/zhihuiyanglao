<template>
  <!-- 外层容器：实现全屏居中、背景柔和美化 -->
  <div class="login-bind-wrapper" v-loading="loading" element-loading-text="处理中...">
    <!-- 内容容器：限定宽度、白色卡片、阴影悬浮效果 -->
    <div class="login-bind-content" v-if="loaded">
      <!-- 微信用户信息卡片：头像美化、文字排版优化 -->
      <div class="user-info-card" v-if="wechatUserInfo.headimgurl">
        <img 
          class="avatar" 
          :src="wechatUserInfo.headimgurl" 
          alt="微信头像" 
          lazy
        >
        <div class="user-desc">
          <h3 class="welcome-text">Hi，{{ wechatUserInfo?.nickname }}，欢迎来到智慧养老 PC 端</h3>
          <p class="tips-text">完成绑定后可以使用微信账号一键登录哦！</p>
        </div>
      </div>

      <!-- 表单容器：内边距优化、与上方信息卡片间距调整 -->
      <div class="form-container">
        <el-form 
          :model="ruleForm" 
          label-width="120px"
          class="bind-form"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="ruleForm.username" 
              placeholder="请输入绑定的用户名"
              size="default"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input 
              type="password" 
              v-model="ruleForm.pwd" 
              placeholder="请输入用户密码"
              size="default"
            ></el-input>
          </el-form-item>
          <el-form-item class="form-submit-item">
            <el-button 
              type="primary" 
              @click="submit" 
              class="submit-btn"
              size="default"
            >
              微信登录绑定
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { LoginWeChat, WechatUserInfo } from '@/api/index/indexType';
import { wechatLogin } from '@/api/index';
import { ElMessage, type FormRules } from 'element-plus';

const router = useRouter();
const store = useAuthStore();
const route = useRoute();

const wechatUserInfo = ref<WechatUserInfo>({})
const loaded = ref(false);
const loading = ref(false)
const ruleForm = reactive<LoginWeChat>({
    username: '',
    pwd: '',
    openId: ''
});

const submit = async () => {
    const res = await store.userLoginBindWechat({ ...ruleForm })
    if (res) {
        router.push("/");
    }
}

const code = ref('');

onMounted(() => {
    code.value = route.query.code as string;
    login(code.value);
})

const login = async (code: string) => {
    loaded.value = false;
    loading.value = true;
    const res = await wechatLogin({code}).catch(() => { });
    loading.value = false;
    if (!res) return;
    if ('token' in res.data) {
        console.log("已经绑定");
        store.token = res.data.token;
        store.refreshToken = res.data.refreshToken;
        router.push({
            path: '/',
            query: {}
        });
        ElMessage.success('微信登录成功')
    }
    else {
        loaded.value = true;
        console.log("未绑定");
        wechatUserInfo.value = res.data;
        ruleForm.openId = res.data.openid!;
        ElMessage.success('微信登录成功')
    }
}

const rules = reactive<FormRules<LoginWeChat>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
    pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})
</script>

<style scoped lang='less'>
// 外层全屏容器：实现垂直水平居中，柔和背景
.login-bind-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa; // 浅灰背景，提升页面质感
  padding: 20px; // 左右内边距，适配小屏幕PC
  box-sizing: border-box;
}

// 核心内容容器：卡片化设计，限定宽度，阴影效果
.login-bind-content {
  width: 100%;
  max-width: 600px; // 限定最大宽度，避免大屏下过宽
  background: #ffffff;
  border-radius: 12px; // 圆角设计，更柔和
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); // 轻微阴影，提升层次感
  padding: 40px 50px;
  box-sizing: border-box;
  transition: all 0.3s ease; // 过渡效果，悬浮时轻微上浮

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

// 微信用户信息卡片：Flex 布局，头像与文字对齐
.user-info-card {
  display: flex;
  align-items: center;
  margin-bottom: 30px; // 与表单保持间距
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f2f5; // 分割线，区分信息与表单
}

// 头像美化：圆形、边框、轻微阴影
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%; // 圆形头像
  object-fit: cover;
  border: 4px solid #f5f7fa; // 边框装饰
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  margin-right: 20px;
}

// 用户描述文字：排版分层，字号、颜色区分
.user-desc {
  flex: 1;
}

.welcome-text {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.tips-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

// 表单容器：间距优化
.form-container {
  margin-bottom: 30px;
}

// 表单样式：调整表单项间距
.bind-form {
  :deep(.el-form-item) { // 深度选择器，修改 Element Plus 内置样式
    margin-bottom: 24px;
  }
}

// 提交按钮容器：居中对齐
.form-submit-item {
  display: flex;
  justify-content: center;
  margin-bottom: 0 !important; // 覆盖 Element Plus 默认间距
}

// 提交按钮：加宽、美化
.submit-btn {
  width: 200px;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
}

// 底部提示文字：弱化、居中、字号调整
.bottom-tips {
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
  margin-top: 10px;
}
</style>