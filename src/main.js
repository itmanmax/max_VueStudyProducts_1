import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入 Element Plus 图标
import * as ElIcons from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

const app = createApp(App)

// 全局注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.use(createPinia())
app.mount('#app')
