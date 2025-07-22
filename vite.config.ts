import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), svgLoader(), vueDevTools() ],
  server: {
    // 确保开发服务器配置正确
    hmr: true,
  }
})
