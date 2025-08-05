<template>
  <div class="bg-gray-50 min-h-screen p-4">
    <div class="max-w-6xl max-h-[80vh] mx-auto">
      <!-- 主要内容区域 -->
      <div class="flex lg:flex-row gap-2 mt-8">
        <!-- 左侧导航栏 -->
        <nav
          class="lg:w-64 bg-white h-[80vh] rounded-xl shadow-sm border border-gray-100 p-4"
        >
          <ul class="space-y-1">
            <h1 class="uppercase text-t-primary font-bold text-sm">账号设置</h1>

            <!-- 分隔线 -->
            <li class="pt-4 border-t border-gray-100 mt-2">
              <ul class="space-y-1">
                <li v-for="subItem in mainNav" :key="subItem.label">
                  <a
                    href="#"
                    @click.prevent="setActive(subItem.path||'')"
                    :class="[
                      ' px-4 py-3 text-sm rounded-lg transition-all duration-200 flex items-center',
                      isItemActive(subItem.path||'').value
                        ? 'text-t-primary bg-t-primary/10 font-medium'
                        : 'text-gray-600 hover:bg-gray-50',
                    ]"
                  >
                    <t-icon :name="subItem.icon" class="mr-3 text-lg" />
                    {{ subItem.label }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        <!-- 右侧内容区域 -->
        <main
          class="flex-1 bg-white overflow-auto max-h-[80vh] rounded-xl shadow-sm border border-gray-100"
        >
          <!-- 路由区域 -->
          <router-view v-slot="{ Component }">
            <transition name="fade">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,computed, onMounted } from "vue";
import { useRouter,useRoute } from "vue-router";
import { Icon as TIcon } from "tdesign-icons-vue-next";



const router = useRouter();
// 当前激活的导航项
const activeSection = ref<Record<string, boolean>>({});
const isItemActive = (path:string) => {
  return computed(() => {
    // 当前路由匹配 OR 手动激活状态
    return router.currentRoute.value.path === path ||activeSection.value[path]
  })
}

// 点击处理函数
const setActive = (path:string) => {
  // 重置所有激活状态
  Object.keys(activeSection.value).forEach(key => {
    activeSection.value[key] = false
  })
  // 设置当前项为激活
  activeSection.value[path] = true
  console.log("点击了:", path);
  router.push(path)
}

// 导航配置
const mainNav = ref([
  { label: "基本设置", icon: "user" ,path:'/user/userInfo'},
  { label: "外观(待定)", icon: "palette" , path:'/user/appearance' },
  { label: "第三方账号绑定(上线后)", icon: "link", path:'/user/link' },
  { label: "实验性功能(上线后)", icon: "sitemap" , path:"/user/experimental" },
  { label: "反馈与建议", icon: "chat", path:'/user/feedback' },
  { label: "隐私政策", icon: "certificate", path:'/user/privacy' },
  { label: "关于本项目(设为跳转文档页)", icon: "info-circle" ,path:"/user/about"  },
]);
</script>

<style scoped>
/* T-design 主色和危险色 */
:root {
  --t-primary: #0052d9;
  --t-danger: #e34d59;
}

.text-t-primary {
  color: var(--t-primary);
}

.bg-t-primary\/10 {
  background-color: rgba(0, 82, 217, 0.1);
}

.text-t-danger {
  color: var(--t-danger);
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 82, 217, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 82, 217, 0.4);
}


</style>
