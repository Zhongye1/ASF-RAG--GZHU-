// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  publicDir: 'public',  // 确保public目录下的文件会被直接复制到构建目录的根目录
  build: {
    assetsDir: 'static', // 静态资源目录
  },
  plugins: [vue(), svgLoader(), vueDevTools()],
  server: {
    fs: {
      // 允许服务超出预设的目录
      strict: false
    },
    // 确保开发服务器配置正确
    hmr: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      // 使用新的方式来设置别名
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }

})
