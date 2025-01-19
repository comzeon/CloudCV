import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import ElementPlus from 'element-plus'
import {createPinia} from "pinia";
import 'element-plus/dist/index.css'
import locale from 'element-plus/dist/locale/zh-cn.js'

const app = createApp(App)
app.use(ElementPlus)
app.use(locale)
app.use(router)
app.use(createPinia())
app.mount('#app')
