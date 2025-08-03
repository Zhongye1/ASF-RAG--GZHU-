<template>
  <t-layout class="h-screen">
    <!-- 侧边导航 -->
    <t-aside width="232px" class="bg-white border-r border-gray-300">
      <div class="flex items-center gap-2 font-medium p-4 border-b border-gray-300">
        <span class="w-5 h-5 bg-blue-600 text-white rounded text-xs flex items-center justify-center">📊</span>
        <span class="text-gray-800">Ollama模型在线管理</span>
      </div>

      <t-menu theme="light" :value="activeTab" @change="activeTab = $event">
        <t-menu-item v-for="tab in tabs" :key="tab.key" :value="tab.key">
          {{ tab.label }}
        </t-menu-item>
      </t-menu>
    </t-aside>

    <!-- 内容区域 -->
    <t-layout>
      <t-content class="bg-gray-50">
        <!-- 动态组件渲染 -->
        <component :is="currentComponent" @model-downloaded="handleModelDownloaded" />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

//import ollama_model_pages from './Ollama_Pages/ollama_model_pages.vue'
import OllamaModelList from './Ollama_Pages/OllamaModelList.vue'
import OllamaModelDownload from './Ollama_Pages/OllamaModelDownload.vue'
import OllamaSettings from './Ollama_Pages/OllamaSettings.vue'

//import CanvasPoint from '@/components/canvas-point-unit/CanvasPoint.vue'


// 当前活动标签
const activeTab = ref('models')

// 标签配置
const tabs = [
  { key: 'models', label: '模型列表' },
  { key: 'download', label: '下载模型' },
  { key: 'settings', label: '设置' }
]

// 组件映射
const componentMap = {
  models: OllamaModelList,
  download: OllamaModelDownload,
  settings: OllamaSettings
}

// 计算当前组件
const currentComponent = computed(() => componentMap[activeTab.value])


const loading = ref(false)
const downloading = ref(false)
const downloadProgress = ref(0)
const downloadStatus = ref('')
const models = ref([])
const selectedModels = ref([])
const downloadModel = ref('')
const showRenameDialog = ref(false)
const newModelName = ref('')
const isAllSelected = ref(false)
const isIndeterminate = computed(() => {
  return selectedModels.value.length > 0 && selectedModels.value.length < models.value.length
})


// 事件处理
const handleModelDownloaded = () => {
  // 模型下载完成后，如果当前在模型列表页面，则刷新列表
  if (activeTab.value === 'models') {
    // 可以通过 ref 或事件总线通知模型列表组件刷新
  }
}

// API 函数
const ollamaApi = {
  // 获取模型列表
  async getModels() {
    try {
      const response = await fetch('http://localhost:11434/api/tags')
      const data = await response.json()
      return data.models || []
    } catch (error) {
      console.error('获取模型列表失败:', error)
      MessagePlugin.error('获取模型列表失败')
      return []
    }
  },

  // 删除模型
  async deleteModel(name) {
    try {
      const response = await fetch('http://localhost:11434/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      return response.ok
    } catch (error) {
      console.error('删除模型失败:', error)
      return false
    }
  },

  // 下载模型
  async downloadModel(name, onProgress) {
    try {
      const response = await fetch('http://localhost:11434/api/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            if (onProgress) onProgress(data)
          } catch (e) {
            console.warn('解析进度数据失败:', e)
          }
        }
      }
    } catch (error) {
      console.error('下载模型失败:', error)
      throw error
    }
  },
}


</script>

<style scoped>
.checkbox-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.t-table__row-select) {
  padding-left: 16px;
}
</style>