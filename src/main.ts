import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import TDesign from 'tdesign-vue-next';
import TDesignChat from '@tdesign-vue-next/chat';
import 'tdesign-vue-next/es/style/index.css';
import './assets/tailwind.css';




const app = createApp(App);

// 启用Devtools (在开发和生产环境中)
//app.config.devtools = true
app.config.performance = true


app.use(TDesign);
app.use(router);
app.mount('#app');
