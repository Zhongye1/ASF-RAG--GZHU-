<template>
    <div class="flex-1 p-6 overflow-auto bg-gray-50">
        <div class="max-w-7xl mx-auto">
            <!-- 这里到时候搞一个搜索框 --><!-- 筛选按钮 -->
            <!-- 搜索和筛选栏 -->


            <!-- 下载进度提示 -->
            <div v-if="downloading" class="mb-6 p-4 translate-x-2 bg-blue-50 border border-blue-200 rounded-lg">
                <t-dialog v-model:visible="downloading" header="模型下载中" theme="info" :close-btn="false"
                    :close-on-overlay-click="false" :close-on-esc-keydown="false" width="500px" attach="body">

                    <div class="download-progress-content">
                        <div class="flex items-center gap-3 mb-4">
                            <div
                                class="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin">
                            </div>
                            <div class="flex-1">
                                <div class="font-medium text-gray-900 mb-1">正在下载模型</div>
                                <div class="text-sm text-gray-600">{{ currentDownloadModel }}</div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <t-progress :percentage="downloadProgress" theme="success" :label="true" size="medium" />
                        </div>

                        <div class="text-sm text-gray-600 mb-4">
                            {{ downloadStatus }}
                        </div>

                        <!-- 可选：显示下载速度和剩余时间 -->
                        <div v-if="downloadProgress > 0" class="text-xs text-gray-500 space-y-1">
                            <div>下载进度: {{ downloadProgress }}%</div>
                            <div v-if="downloadSpeed">下载速度: {{ downloadSpeed }}</div>
                        </div>
                    </div>

                    <template #footer>
                        <div class="flex justify-center">
                            <t-button variant="outline" @click="cancelDownload">
                                关闭窗口
                            </t-button>
                        </div>
                    </template>
                </t-dialog>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="flex justify-center items-center py-16">
                <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>

            <!-- 模型网格 -->

            <div v-else-if="models.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-[80vh] bg-slate-50  overflow-auto gap-4 mb-8">
                <div v-for="model in models" :key="model.name"
                    class="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group flex flex-col h-full">

                    <!-- 模型卡片内容 - 使用 flex 布局确保垂直对齐 -->
                    <div class="p-6 flex flex-col flex-1 h-[200px] ">
                        <!-- 头部信息 - 固定高度区域 -->
                        <div class="flex items-start justify-between mb-4 min-h-[30px]">
                            <h3
                                class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 mr-3">
                                {{ model.name }}
                            </h3>
                            <div class="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-8V7a3 3 0 00-6 0v4m2-2h4m-4 0a3 3 0 100 6h4a3 3 0 100-6H10z" />
                                </svg>
                                {{ model.pulls }}
                            </div>
                        </div>

                        <!-- 描述文本 - 固定高度 -->
                        <div class="mb-4 h-[30px] flex items-start">
                            <p class="text-gray-600 text-sm line-clamp-2">
                                {{ model.description || '暂无描述信息' }}
                            </p>
                        </div>

                        <!-- 能力标签 - 固定高度区域 -->
                        <div class="mb-4 min-h-[20px] flex items-start">
                            <div v-if="model.capabilities?.length" class="flex flex-wrap gap-2">
                                <span v-for="capability in model.capabilities.slice(0, 4)" :key="capability"
                                    class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                                    {{ capability }}
                                </span>
                                <span v-if="model.capabilities.length > 4"
                                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                                    +{{ model.capabilities.length - 4 }}
                                </span>
                            </div>
                            <div v-else class="text-sm text-gray-400">
                                暂无标签
                            </div>
                        </div>

                        <!-- 模型信息 -->
                        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div class="flex items-center gap-4">
                                <span>下载次数 {{ model.tags_count || 0 }} </span>
                                <span>更新 {{ model.updated || '未知' }}</span>
                            </div>
                        </div>

                        <!-- 模型大小选择 - 弹性区域 -->
                        <div class="flex-1 mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">选择模型大小:</label>
                            <div class="flex flex-wrap gap-2">
                                <button v-for="size in model.sizes" :key="size"
                                    @click="selectModelSize(model.name, size)" :class="[
                                        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                                        selectedSizes[model.name] === size
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    ]">
                                    {{ size.toUpperCase() }}
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div>
                                <t-button
                                    @click="downloadModelAction(model.name, selectedSizes[model.name] || model.sizes[0])"
                                    :loading="downloading && currentDownloadModel === getModelFullName(model.name, selectedSizes[model.name] || model.sizes[0])"
                                    :disabled="downloading" theme="primary" block
                                    class="group-hover:bg-blue-700 transition-colors">
                                    <template #icon>
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </template>
                                    下载模型
                                </t-button>
                            </div>
                        </div>
                    </div>

                    <!-- 下载按钮 - 固定在底部 -->

                </div>
            </div>

            <!-- 空状态 -->
            <div v-else-if="!loading" class="text-center py-16">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.82-5.708-2.137l-.914-.914A13.049 13.049 0 0112 1c7.058 0 12.792 5.627 12.966 12.654L21 14.5v.5a2 2 0 01-2 2h-1.382l-5.447 5.447a1 1 0 01-.707.293H9a2 2 0 01-2-2v-1.382l-5.447-5.447A1 1 0 011.293 12.707L9 5" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">未找到模型</h3>
                <p class="text-gray-600">尝试调整搜索条件或筛选器</p>
            </div>

            <!-- 分页 -->
            <div v-if="totalPages > 1" class="flex justify-center mt-8">
                <t-pagination v-model="currentPage" :total="totalCount" :page-size="pageSize" :show-jumper="true"
                    :show-page-size="false" @change="handlePageChange" class="justify-center" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import axios from 'axios'

// 注入共享的 API 服务
const ollamaApi = inject('ollamaApi')

// 组件状态
const loading = ref(false)
const downloading = ref(false)
const downloadProgress = ref(0)
const downloadStatus = ref('')
const currentDownloadModel = ref('')

// 搜索和筛选
//const searchQuery = ref('')
const sizeFilter = ref('')
const sortBy = ref('popular')

// 分页数据
const models = ref([])
const currentPage = ref(1)
const pageSize = ref(6)
const totalCount = ref(0)
const totalPages = ref(0)

// 模型大小选择
const selectedSizes = ref({})

// 获取模型列表
const fetchModels = async () => {
    loading.value = true
    try {
        console.log('调用 API:', `http://localhost:8000/api/ollama-models?page_id=${currentPage.value}`)
        console.log('分页数:', currentPage.value)
        const response = await axios.post('http://localhost:8000/api/ollama-models', {
            page_id: currentPage.value
        })

        const data = response.data
        models.value = data.models
        totalCount.value = data.total_count
        totalPages.value = data.total_pages

        // 初始化选择的模型大小
        models.value.forEach(model => {
            if (!selectedSizes.value[model.name] && model.sizes.length > 0) {
                selectedSizes.value[model.name] = model.sizes[0]
            }
        })
    } catch (error) {
        console.error('获取模型列表失败:', error)
        MessagePlugin.error('获取模型列表失败')
    } finally {
        loading.value = false
    }
}

// 选择模型大小
const selectModelSize = (modelName, size) => {
    selectedSizes.value[modelName] = size
}

// 获取完整模型名称
const getModelFullName = (name, size) => {
    return `${name}:${size}`
}



// 添加下载速度状态
const downloadSpeed = ref('')

// 取消下载功能
const cancelDownload = async () => {
    try {
        // 调用取消下载的API（如果支持）
        if (ollamaApi.cancelDownload) {
            await ollamaApi.cancelDownload(currentDownloadModel.value)
        }

        MessagePlugin.warning('下载已取消')
    } catch (error) {
        console.error('取消下载失败:', error)
        MessagePlugin.error('取消下载失败')
    } finally {
        // 重置下载状态
        downloading.value = false
        downloadProgress.value = 0
        downloadStatus.value = ''
        currentDownloadModel.value = ''
        downloadSpeed.value = ''
    }
}

// 优化下载进度处理
const downloadModelAction = async (modelName, size) => {
    const fullModelName = getModelFullName(modelName, size)

    downloading.value = true
    downloadProgress.value = 0
    downloadStatus.value = '准备下载...'
    currentDownloadModel.value = fullModelName
    downloadSpeed.value = ''

    try {
        await ollamaApi.downloadModel(fullModelName, (data) => {
            if (data.status) {
                downloadStatus.value = data.status
            }
            if (data.completed && data.total) {
                downloadProgress.value = Math.round((data.completed / data.total) * 100)
            }
            // 如果有速度信息
            if (data.speed) {
                downloadSpeed.value = data.speed
            }
        })

        MessagePlugin.success(`模型 ${fullModelName} 下载完成`)
        emit('model-downloaded')
    } catch (error) {
        console.error('下载失败:', error)
        MessagePlugin.error('下载失败')
    } finally {
        downloading.value = false
        downloadProgress.value = 0
        downloadStatus.value = ''
        currentDownloadModel.value = ''
        downloadSpeed.value = ''
    }
}


// 处理分页变化
const handlePageChange = (pageInfo) => {
    // 如果传入的是对象，提取 current 值；如果是数字，直接使用
    const newPage = typeof pageInfo === 'object' ? pageInfo.current : pageInfo
    currentPage.value = newPage
    fetchModels()
}


// 监听筛选条件变化
watch([sizeFilter, sortBy], () => {
    // 重置到第一页并重新获取数据
    currentPage.value = 1
    fetchModels()
})

// 事件发射
const emit = defineEmits(['model-downloaded'])

// 组件挂载时获取数据
onMounted(() => {
    fetchModels()
})
</script>

<style scoped>
.app-container {
    background-color: #f9fafb;
    height: 100vh;
    width: 100vw;
    position: fixed;
    z-index: -1;
    overflow: auto;
}

/* 文本截断 */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 卡片阴影动画 */
.group:hover {
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 滚动条样式 */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

/* 加载动画 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.group {
    animation: fadeIn 0.5s ease-out;
}


/* 文本截断样式 */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
}

/* 确保卡片等高 */
.grid>div {
    display: flex;
    flex-direction: column;
}

/* 优化卡片阴影和过渡效果 */
.group:hover {
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
}

/* 响应式网格调整 */
@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}


/* 下载进度弹窗样式 */
.download-progress-content {
    padding: 8px 0;
}

/* 进度条容器样式 */
:deep(.t-progress) {
    margin-bottom: 8px;
}

/* 弹窗按钮样式 */
:deep(.t-dialog__footer) {
    text-align: center;
    padding-top: 16px;
}

/* 优化加载动画 */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
