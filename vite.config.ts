import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // ============ 核心跨域配置 开始 ============
  server: {
    open: true, // 启动项目自动打开浏览器
    port: 5173, // 前端本地端口
    proxy: {
      // 1. 配置接口的【统一前缀】，比如后端接口都是 /api/xxx 开头
      '/api': {
        target: 'http://123.57.237.81:8080/caresystem', // ✅ 你的真实后端接口地址（必填，改这个）
        changeOrigin: true, // ✅ 必须开启，允许跨域（核心配置）
        secure: false, // 如果是 https 接口，需要配置这个参数
        rewrite: (path) => path.replace(/^\/api/, '') // 可选，根据后端接口决定是否加
      }
    }
  }
})