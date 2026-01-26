import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base:'/dist',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server:{
    host: "0.0.0.0",
    port:80,
    allowedHosts: [
      'web.quanjiu.net', // 添加你的域名
      // 可以添加更多域名
      // 'example.com',
      // 'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://123.57.237.81:8080/caresystem-server/',
        changeOrigin: true
        // 不再去掉/api前缀，因为后端API路径中包含/api
      }
    }
  }
})
