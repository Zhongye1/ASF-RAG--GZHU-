<template>
  <div
    class="min-h-screen relative font-sans bg-cover bg-[url('https://pic3.zhimg.com/v2-59e4679ba11c333dde41264d44dc72e6_r.jpg')] ">
    <!-- 顶部标题区域 -->
    <div class="text-center py-10 relative z-10">
      <div class="text-5xl font-thin text-white mb-4 tracking-wider drop-shadow-lg">RAG-F01智能知识库系统</div>
      <div class="flex justify-center">
        <vue-typewriter-effect :strings="typewriterStrings" class="text-2xl text-white font-light" :loop="true">
        </vue-typewriter-effect>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-[1fr_1fr] gap-16 max-w-6xl mx-auto px-8 pb-16 relative z-10">


      <!-- 右侧Logo区域 -->
      <div class="relative flex flex-col h-full items-center gap-8">
        <div
          class="bg-black/20 backdrop-blur-xl h-[600px] border border-white/10 rounded-2xl p-8 sticky top-8 min-h-[400px] flex items-center justify-center">
          <div v-if="currentDisplayImage.src" class="relative w-full h-full">
            <transition class="mt-[100px]" name="image-fade" mode="out-in">
              <DynamicLogo :key="currentDisplayImage.src" :logo-src="currentDisplayImage.src"
                class="w-full  object-cover rounded-xl" />
            </transition>

            <!-- 图片标题覆盖层 -->
            <div class="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
              <transition name="text-fade" mode="out-in">
                <p :key="currentDisplayImage.alt" class="text-white text-sm font-light text-center">
                  {{ currentDisplayImage.alt }}
                </p>
              </transition>
            </div>
          </div>
          <div v-else class="text-white text-sm font-light">欢迎使用无痕加密系统</div>
        </div>

        <!-- 装饰性元素 -->
        <div class="absolute -top-8 -right-8 w-[100px] h-[100px] pointer-events-none">
          <div class="absolute w-[60px] h-[60px] border-2 border-cyan-400/30 rounded-full animate-spin-slow"></div>
          <div
            class="absolute top-1/2 left-1/2 w-[80px] h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
          </div>
        </div>
      </div>

      <!-- 左侧登录注册区域 -->
      <div class="grid grid-rows-[auto_1fr] gap-12">
        <!-- 登录注册表单 -->
        <div class="bg-black/20 backdrop-blur-xl border  border-white/10 rounded-xl p-8 min-h-[450px]">
          <LoginRegisterForm @image-change="handleImageChange" @form-submit="handleFormSubmit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import DynamicLogo from '@/components/canvas-point-unit/DynamicLogo.vue'
import LoginRegisterForm from './LoginRegisterForm.vue'

const currentImageKey = ref<string>('welcome')

// 图片映射
const imageMap: Record<string, { src: string; alt: string }> = {
  welcome: {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    alt: '欢迎使用RAG-F01'
  },
  login: {
    src: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    alt: '安全登录'
  },
  register: {
    src: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    alt: '注册账户'
  },
  forgot: {
    src: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400',
    alt: '找回密码'
  },
  success: {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    alt: '操作成功'
  }
}

// 计算当前应该显示的图片
const currentDisplayImage = computed(() => {
  return imageMap[currentImageKey.value] || imageMap.welcome
})

// 处理图片变化
const handleImageChange = (imageKey: string) => {
  currentImageKey.value = imageKey
}

// 处理表单提交
const handleFormSubmit = (data: any) => {
  console.log('Form submitted:', data)
  // 这里可以添加API调用逻辑
  currentImageKey.value = 'success'

  // 模拟成功后的操作
  setTimeout(() => {
    alert(`${data.type === 'login' ? '登录' : '注册'}成功！见src/views/LogonOrRegister/LogonOrRegister.vue 107行，没写逻辑`)
  }, 1000)
}


import VueTypewriterEffect from 'vue-typewriter-effect'

const typewriterStrings = computed(() => [
  `RAG-F01智能知识库系统`,
  `安全、便捷、智能的知识管理解决方案`,
])
</script>

<style scoped>
/* 保持原有样式 */
.image-fade-enter-active,
.image-fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.image-fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.image-fade-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-10px);
}

.text-fade-enter-active,
.text-fade-leave-active {
  transition: all 0.3s ease;
}

.text-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.text-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
</style>
