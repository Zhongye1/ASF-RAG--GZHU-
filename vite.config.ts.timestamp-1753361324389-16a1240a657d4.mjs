// vite.config.ts
import { defineConfig } from "file:///C:/Users/zxh/Desktop/%E5%89%8D%E7%AB%AF/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/%E5%BA%86%E5%9B%AD%E6%9D%AF/ASF-RAG--GZHU-/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/zxh/Desktop/%E5%89%8D%E7%AB%AF/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/%E5%BA%86%E5%9B%AD%E6%9D%AF/ASF-RAG--GZHU-/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import svgLoader from "file:///C:/Users/zxh/Desktop/%E5%89%8D%E7%AB%AF/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/%E5%BA%86%E5%9B%AD%E6%9D%AF/ASF-RAG--GZHU-/node_modules/vite-svg-loader/index.js";
import vueDevTools from "file:///C:/Users/zxh/Desktop/%E5%89%8D%E7%AB%AF/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/%E5%BA%86%E5%9B%AD%E6%9D%AF/ASF-RAG--GZHU-/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/zxh/Desktop/%E5%89%8D%E7%AB%AF/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/%E5%BA%86%E5%9B%AD%E6%9D%AF/ASF-RAG--GZHU-/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [vue(), svgLoader(), vueDevTools()],
  server: {
    // 确保开发服务器配置正确
    hmr: true
  },
  resolve: {
    alias: {
      // 使用新的方式来设置别名
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx6eGhcXFxcRGVza3RvcFxcXFxcdTUyNERcdTdBRUZcXFxcXHU1RjAwXHU2RTkwXHU5ODc5XHU3NkVFXFxcXFx1NUU4Nlx1NTZFRFx1Njc2RlxcXFxBU0YtUkFHLS1HWkhVLVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcenhoXFxcXERlc2t0b3BcXFxcXHU1MjREXHU3QUVGXFxcXFx1NUYwMFx1NkU5MFx1OTg3OVx1NzZFRVxcXFxcdTVFODZcdTU2RURcdTY3NkZcXFxcQVNGLVJBRy0tR1pIVS1cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3p4aC9EZXNrdG9wLyVFNSU4OSU4RCVFNyVBQiVBRi8lRTUlQkMlODAlRTYlQkElOTAlRTklQTElQjklRTclOUIlQUUvJUU1JUJBJTg2JUU1JTlCJUFEJUU2JTlEJUFGL0FTRi1SQUctLUdaSFUtL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSAndml0ZS1zdmctbG9hZGVyJ1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbdnVlKCksIHN2Z0xvYWRlcigpLCB2dWVEZXZUb29scygpXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIC8vIFx1Nzg2RVx1NEZERFx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1OTE0RFx1N0Y2RVx1NkI2M1x1Nzg2RVxyXG4gICAgaG1yOiB0cnVlXHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTY1QjBcdTc2ODRcdTY1QjlcdTVGMEZcdTY3NjVcdThCQkVcdTdGNkVcdTUyMkJcdTU0MERcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVosU0FBUyxvQkFBb0I7QUFDcGIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZUFBZTtBQUN0QixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLGVBQWUsV0FBVztBQUprTCxJQUFNLDJDQUEyQztBQUt0USxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRyxZQUFZLENBQUM7QUFBQSxFQUMzQyxRQUFRO0FBQUE7QUFBQSxJQUVOLEtBQUs7QUFBQSxFQUNQO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUE7QUFBQSxNQUVMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
