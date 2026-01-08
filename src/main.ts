import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/iconfont/iconfont.css";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { zhCn } from 'element-plus/es/locales.mjs'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn,
})
createApp(App).use(ElementPlus).use(pinia).use(router).mount("#app");