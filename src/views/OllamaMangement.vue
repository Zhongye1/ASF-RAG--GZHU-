<template>
  <div class="ollama-manager">
    <!-- 标题栏 -->
    <div class="title-bar">
      <div class="title">
        <span class="icon">📊</span>
        <span class="text">Ollama模型在线管理</span>
      </div>
    </div>

    <!-- 导航标签 -->
    <div class="nav-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- 模型列表页面 -->
    <div v-if="activeTab === 'models'" class="content">
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <t-button variant="outline" @click="refreshModels" :loading="loading">
          刷新模型列表
        </t-button>
        <t-button variant="outline" @click="deleteSelected" :disabled="selectedModels.length === 0">
          删除模型
        </t-button>
        <t-button variant="outline" @click="showRenameDialog = true" :disabled="selectedModels.length !== 1">
          模型改名
        </t-button>
      </div>

      <!-- 模型表格 -->
      <div class="model-table">
        <t-table
          :data="models"
          :columns="columns"
          :loading="loading"
          row-key="name"
          :selected-row-keys="selectedModels"
          @select-change="onSelectChange"
          :pagination="false"
          size="medium"
        >
          <template #size="{ row }">
            {{ formatSize(row.size) }}
          </template>
          <template #modified_at="{ row }">
            {{ formatTime(row.modified_at) }}
          </template>
          <template #digest="{ row }">
            <span class="digest">{{ row.digest?.slice(0, 8) }}</span>
          </template>
        </t-table>
      </div>
    </div>

    <!-- 下载模型页面 -->
    <div v-if="activeTab === 'download'" class="content">
      <div class="download-section">
        <div class="download-form">
          <t-input
            v-model="downloadModel"
            placeholder="请输入模型名称，如: llama2:7b"
            class="model-input"
          />
          <t-button 
            @click="downloadModelAction" 
            :loading="downloading"
            :disabled="!downloadModel.trim()"
          >
            下载模型
          </t-button>
        </div>
        
        <!-- 下载进度 -->
        <div v-if="downloading" class="download-progress">
          <t-progress :percentage="downloadProgress" />
          <div class="progress-text">{{ downloadStatus }}</div>
        </div>

        <!-- 推荐模型 -->
        <div class="recommended-models">
          <h3>推荐模型</h3>
          <div class="model-grid">
            <div 
              v-for="model in recommendedModels" 
              :key="model.name"
              class="model-card"
              @click="downloadModel = model.name"
            >
              <div class="model-name">{{ model.name }}</div>
              <div class="model-desc">{{ model.description }}</div>
              <div class="model-size">{{ model.size }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 重命名对话框 -->
    <t-dialog
      v-model:visible="showRenameDialog"
      title="模型改名"
      width="400px"
      @confirm="renameModel"
    >
      <t-input
        v-model="newModelName"
        placeholder="请输入新的模型名称"
        @keyup.enter="renameModel"
      />
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

// 响应式数据
const activeTab = ref('models')
const loading = ref(false)
const downloading = ref(false)
const downloadProgress = ref(0)
const downloadStatus = ref('')
const models = ref([])
const selectedModels = ref([])
const downloadModel = ref('')
const showRenameDialog = ref(false)
const newModelName = ref('')

// 标签配置
const tabs = [
  { key: 'models', label: '模型列表' },
  { key: 'download', label: '下载模型' },
  { key: 'chat', label: '对话' },
  { key: 'settings', label: '软件设置' }
]

// 表格列配置
const columns = [
  {
    colKey: 'select',
    type: 'multiple-select',
    width: 50
  },
  {
    title: '模型名称',
    colKey: 'name',
    width: 300
  },
  {
    title: '模型大小',
    colKey: 'size',
    width: 150
  },
  {
    title: 'ID',
    colKey: 'digest',
    width: 150
  },
  {
    title: '下载时间',
    colKey: 'modified_at',
    width: 150
  }
]

// 推荐模型
const recommendedModels = [
  {
    name: 'llama2:7b',
    description: '通用对话模型，性能均衡',
    size: '3.8GB'
  },
  {
    name: 'codellama:7b',
    description: '专业代码生成模型',
    size: '3.8GB'
  },
  {
    name: 'mistral:7b',
    description: '高效轻量级模型',
    size: '4.1GB'
  },
  {
    name: 'phi3:3b',
    description: '微软小型高效模型',
    size: '2.3GB'
  }
]

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

  // 复制模型（用于重命名）
  async copyModel(source, destination) {
    try {
      const response = await fetch('http://localhost:11434/api/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination })
      })
      return response.ok
    } catch (error) {
      console.error('复制模型失败:', error)
      return false
    }
  }
}

// 方法
const refreshModels = async () => {
  loading.value = true
  try {
    models.value = await ollamaApi.getModels()
  } finally {
    loading.value = false
  }
}

const onSelectChange = (selectedRowKeys) => {
  selectedModels.value = selectedRowKeys
}

const deleteSelected = async () => {
  if (selectedModels.value.length === 0) return

  const confirmed = await MessagePlugin.confirm('确定要删除选中的模型吗？')
  if (!confirmed) return

  loading.value = true
  try {
    for (const modelName of selectedModels.value) {
      await ollamaApi.deleteModel(modelName)
    }
    MessagePlugin.success('删除成功')
    selectedModels.value = []
    await refreshModels()
  } catch (error) {
    MessagePlugin.error('删除失败')
  } finally {
    loading.value = false
  }
}

const downloadModelAction = async () => {
  if (!downloadModel.value.trim()) return

  downloading.value = true
  downloadProgress.value = 0
  downloadStatus.value = '准备下载...'

  try {
    await ollamaApi.downloadModel(downloadModel.value, (data) => {
      if (data.status) {
        downloadStatus.value = data.status
      }
      if (data.completed && data.total) {
        downloadProgress.value = Math.round((data.completed / data.total) * 100)
      }
    })

    MessagePlugin.success('下载完成')
    downloadModel.value = ''
    await refreshModels()
  } catch (error) {
    MessagePlugin.error('下载失败')
  } finally {
    downloading.value = false
    downloadProgress.value = 0
    downloadStatus.value = ''
  }
}

const renameModel = async () => {
  if (!newModelName.value.trim()) return

  const oldName = selectedModels.value[0]
  loading.value = true

  try {
    const success = await ollamaApi.copyModel(oldName, newModelName.value)
    if (success) {
      await ollamaApi.deleteModel(oldName)
      MessagePlugin.success('重命名成功')
      showRenameDialog.value = false
      newModelName.value = ''
      selectedModels.value = []
      await refreshModels()
    } else {
      MessagePlugin.error('重命名失败')
    }
  } catch (error) {
    MessagePlugin.error('重命名失败')
  } finally {
    loading.value = false
  }
}

// 工具函数
const formatSize = (bytes) => {
  if (!bytes) return '未知'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + sizes[i]
}

const formatTime = (timestamp) => {
  if (!timestamp) return '未知'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  
  if (months > 0) return `${months} 个月前`
  if (days > 0) return `${days} 天前`
  return '今天'
}

// 生命周期
onMounted(() => {
  refreshModels()
})
</script>

<style scoped>
.ollama-manager {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.title .icon {
  width: 20px;
  height: 20px;
  background: #1976d2;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.window-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: #f0f0f0;
}

.close:hover {
  background: #e81123;
  color: white;
}

.nav-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #e5e5e5;
}

.tab {
  padding: 16px 32px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #666;
}

.tab.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
}

.tab:hover {
  background: #f8f9fa;
}

.content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.model-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.digest {
  font-family: monospace;
  color: #666;
}

.download-section {
  width: 100%;
}

.download-form {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.model-input {
  flex: 1;
}

.download-progress {
  margin-bottom: 32px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.progress-text {
  margin-top: 8px;
  color: #666;
  text-align: center;
}

.recommended-models h3 {
  margin-bottom: 16px;
  color: #333;
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.model-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.model-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.model-name {
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
}

.model-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.model-size {
  color: #999;
  font-size: 12px;
}
</style>
