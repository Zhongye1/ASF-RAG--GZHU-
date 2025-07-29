<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div class="flex items-center mb-6">
      <button @click="$router.back()" class="mr-3 text-gray-600 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-2xl font-semibold text-gray-800">知识库: {{ id }}</h1>
    </div>

    <!-- 数据集管理部分 -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-medium">数据集</h2>
        <p class="text-sm text-gray-500">解析成功后才能问答哦。</p>
      </div>

      <!-- 操作工具栏 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <div class="relative">
            <select
              class="border bg-gray-50 text-gray-700 py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              v-model="filterStatus">
              <option>全部</option>
              <option>启用</option>
              <option>禁用</option>
            </select>
          </div>
          <div class="relative ml-3">
            <input type="text" placeholder="搜索文件"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              v-model="searchQuery" />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <!-- 添加上传按钮 -->
        <button @click="showUploadModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
          上传文件
        </button>
      </div>

      <!-- 文档列表 -->
      <div class="border rounded-lg overflow-hidden">
        <div class="grid grid-cols-12 gap-4 bg-gray-50 p-4 font-medium text-gray-600 border-b">
          <div class="col-span-1 flex justify-center">

          </div>
          <div class="col-span-4">名称</div>
          <div class="col-span-2">分块数</div>
          <div class="col-span-2">上传日期</div>
          <div class="col-span-2">切片方法</div>
          <div class="col-span-1">启用</div>
        </div>


        <div v-if="displayedDocuments.length > 0">
          <div v-for="(doc, index) in displayedDocuments" :key="doc.id"
            class="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 border-b">
            <div class="col-span-1 flex justify-center">
              <button @click="deleteSelectedDocuments(doc.id)" class="text-gray-400 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="col-span-4 flex items-center">
              <div class="flex-shrink-0 mr-3">
                <template v-if="doc.fileType === 'pdf'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </template>
                <template v-else-if="doc.fileType === 'docx'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </template>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </template>
              </div>
              <div>
                <div class="font-medium text-gray-800">{{ doc.name }}</div>
                <div class="text-sm text-gray-500">{{ doc.fileType.toUpperCase() }}</div>
              </div>
            </div>
            <div class="col-span-2 text-gray-600">{{ doc.chunks }}</div>
            <div class="col-span-2 text-gray-600">{{ formatDate(doc.uploadDate) }}</div>
            <div class="col-span-2 text-gray-600">{{ doc.slicingMethod }}</div>
            <div class="col-span-1 flex justify-center">
              <button @click="toggleDocumentStatus(doc)" :class="[
                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none',
                doc.enabled ? 'bg-blue-600' : 'bg-gray-200'
              ]" role="switch" aria-checked="false">
                <span :class="[
                  'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                  doc.enabled ? 'translate-x-5' : 'translate-x-0'
                ]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>


        <div v-else class="p-8 text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mb-1 font-medium">暂无文件</p>
          <p>请上传文件以建立知识库</p>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="flex items-center justify-between border-t px-4 py-3 sm:px-6 mt-4">
        <div class="flex flex-1 justify-between sm:hidden">
          <button :disabled="currentPage === 1" :class="[
            'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium',
            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
          ]">
            上一页
          </button>
          <button :disabled="currentPage === totalPages" :class="[
            'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium',
            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
          ]">
            下一页
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              至
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredDocuments.length) }}</span>
              条， 共
              <span class="font-medium">{{ filteredDocuments.length }}</span>
              条
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button @click="currentPage = currentPage - 1" :disabled="currentPage === 1" :class="[
                'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
              ]">
                <span class="sr-only">上一页</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <template v-for="page in visiblePages" :key="page">
                <button @click="currentPage = page" :aria-current="currentPage === page ? 'page' : undefined" :class="[
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                  currentPage === page
                    ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                ]">
                  {{ page }}
                </button>
              </template>
              <button @click="currentPage = currentPage + 1" :disabled="currentPage === totalPages" :class="[
                'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
              ]">
                <span class="sr-only">下一页</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 检索测试部分 -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-medium">检索测试</h2>
        <button @click="isHelpVisible = !isHelpVisible" class="text-gray-500 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      <div v-if="isHelpVisible" class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p class="text-sm text-blue-700">
          请完成召回测试：确保你的配置可以从数据库召回正确的文本块。如果你调整了这里的默认设置，比如关键词相似度权重，请注意这里的改动不会被自动保存。请务必在聊天助手设置或者召回算子设置处同步更新相关设置。
        </p>
      </div>

      <!-- 检索参数设置 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            相似度阈值: {{ similarityThreshold.toFixed(2) }}
          </label>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">0.0</span>
            <input type="range" min="0" max="1" step="0.01" v-model="similarityThreshold"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <span class="text-sm text-gray-500">1.0</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            关键字相似度权重: {{ keywordWeight }}%
          </label>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">0%</span>
            <input type="range" min="0" max="100" step="1" v-model="keywordWeight"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <span class="text-sm text-gray-500">100%</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rerank模型</label>
          <select v-model="selectedRerankModel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option disabled value="">请选择模型</option>
            <option v-for="model in rerankModels" :key="model.value" :value="model.value">
              {{ model.label }}
            </option>
          </select>
        </div>

        <div>
          <div class="flex items-center">
            <label class="block text-sm font-medium text-gray-700 mb-2 mr-4">使用知识图谱</label>
            <button @click="useKnowledgeGraph = !useKnowledgeGraph" :class="[
              'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              useKnowledgeGraph ? 'bg-blue-600' : 'bg-gray-200'
            ]" role="switch">
              <span :class="[
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                useKnowledgeGraph ? 'translate-x-5' : 'translate-x-0'
              ]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <!-- 跨语言搜索 -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">跨语言搜索</label>
        <select v-model="selectedLanguage"
          class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="auto">自动检测</option>
          <option value="en">English</option>
          <option value="zh-CN">简体中文</option>
          <option value="zh-TW">繁體中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
        </select>
      </div>

      <!-- 测试文本和文件选择 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">测试文本</label>
          <textarea v-model="testQuery" rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="输入测试文本以执行检索..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">选定的文件</label>
          <div class="border border-gray-300 rounded-md p-4 min-h-[150px]">
            <div v-if="selectedFilesForTest.length === 0"
              class="flex flex-col items-center justify-center h-full text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span class="text-center">暂未选择文件<br>在数据集中选择要测试的文件</span>
            </div>
            <div v-else>
              <div v-for="file in selectedFilesForTest" :key="file.id" class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="truncate max-w-xs">{{ file.name }}</span>
                </div>
                <button @click="removeFileFromTest(file.id)" class="text-gray-400 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-3 text-sm text-gray-500">
              已选 {{ selectedFilesForTest.length }}/{{ documents.length }} 个文件
            </div>
          </div>
        </div>
      </div>

      <!-- 测试按钮和结果 -->
      <div class="flex justify-end mb-4">
        <button @click="runSearchTest" :disabled="testQuery.trim() === '' || isTesting" :class="[
          'bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center',
          (testQuery.trim() === '' || isTesting) ? 'opacity-50 cursor-not-allowed' : ''
        ]">
          <svg v-if="isTesting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ isTesting ? '测试中...' : '执行测试' }}
        </button>
      </div>

      <!-- 测试结果展示 -->
      <div class="border rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b">
          <h3 class="text-lg font-medium text-gray-700">检索结果</h3>
        </div>

        <div v-if="searchResults.length > 0" class="divide-y">
          <div v-for="(result, index) in searchResults" :key="index" class="p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium text-blue-600 mb-1">{{ result.source }}</h4>
                <p class="text-gray-700">{{ result.content }}</p>
              </div>
              <div class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                相似度: {{ (result.score * 100).toFixed(1) }}%
              </div>
            </div>
            <div class="mt-2 text-sm text-gray-500">
              <span>文件: {{ result.file }}</span>
              <span class="mx-2">|</span>
              <span>分块: #{{ result.chunk }}</span>
            </div>
          </div>
        </div>

        <div v-else class="p-8 text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mb-1 font-medium">暂无数据</p>
          <p>请输入测试文本并执行检索测试</p>
        </div>
      </div>
    </div>

     <!-- 知识库设置部分 -->
  <knowledge-settings
    :kb-name="kbName"
    :kb-description="kbDescription"
    @save="saveKnowledgeBaseSettings"
    @delete="showDeleteConfirmation = true"
  />

    <!-- 上传文件模态框 -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6">
          <div class="flex justify-between items-center pb-4 border-b">
            <h3 class="text-xl font-semibold text-gray-800">上传文件</h3>
            <button @click="showUploadModal = false" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-6">
            <div @click="$refs.fileInput.click()"
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
              @dragover.prevent="dragover = true" @dragleave="dragover = false" @drop.prevent="handleFileDrop">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="mt-4 text-lg font-medium text-gray-700">将文件拖到此处或点击上传</p>
              <p class="mt-1 text-sm text-gray-500">支持 PDF、DOCX、TXT 文件 (最大 50MB)</p>
              <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden" multiple
                accept=".pdf,.docx,.txt">
              <button class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium">
                选择文件
              </button>
            </div>

            <div v-if="uploadedFiles.length > 0" class="mt-6">
              <h4 class="text-lg font-medium text-gray-700 mb-4">待上传的文件</h4>
              <ul class="divide-y divide-gray-200">
                <li v-for="(file, index) in uploadedFiles" :key="index" class="py-4 flex items-center">
                  <div class="flex-shrink-0 mr-4">
                    <svg v-if="file.name.endsWith('.pdf')" class="h-10 w-10 text-red-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <svg v-else-if="file.name.endsWith('.docx')" class="h-10 w-10 text-blue-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <svg v-else class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
                    <p class="text-sm text-gray-500">{{ (file.size / 1024).toFixed(2) }} KB</p>
                  </div>
                  <button @click="removeUploadedFile(index)" class="ml-4 text-gray-400 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>

            <!-- 上传进度条 -->
            <div v-if="isUploading" class="mt-6">
              <div class="bg-gray-200 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <p class="mt-2 text-sm text-gray-500">{{ uploadProgress }}%</p>
            </div>

            <div class="mt-6 flex justify-end">
              <button @click="showUploadModal = false"
                class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium mr-3 hover:bg-gray-50">
                取消
              </button>
              <button @click="processFileUpload" :disabled="uploadedFiles.length === 0 || isUploading" :class="[
                'bg-blue-600 text-white px-4 py-2 rounded-md font-medium',
                uploadedFiles.length === 0 || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              ]">
                <svg v-if="isUploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ isUploading ? '上传中...' : '上传文件' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除知识库确认模态框 -->
    <div v-if="showDeleteConfirmation"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-center pb-4 border-b">
            <h3 class="text-xl font-semibold text-gray-800">删除知识库</h3>
            <button @click="showDeleteConfirmation = false" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>


          <div class="mt-4">
            <p class="text-gray-700 mb-6">
              确定要删除这个知识库吗？此操作不可恢复。
            </p>


            <div class="flex justify-end">
              <button @click="showDeleteConfirmation = false"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium mr-3 hover:bg-gray-300">
                取消
              </button>
              <button @click="deleteKnowledgeBase"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium">
                确认删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'; // 假设你使用 axios 作为 HTTP 客户端

import knowledgeSettings from '@/components/knowledge-unit/knowledge-setting-card.vue';
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id || 'ASF');
const kbName = ref('ASF Technical Documentation');
const kbDescription = ref('Apache Software Foundation 技术文档库');

// 数据集管理功能
const searchQuery = ref('');
const showUploadModal = ref(false);
const uploadedFiles = ref<File[]>([]);
const isUploading = ref(false);
const dragover = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(5);
const showDeleteConfirmation = ref(false);
const selectedDocuments = ref<number[]>([]); // 选中的文档ID


// 检索测试功能
const filterStatus = ref('全部');

const isHelpVisible = ref(true);
const similarityThreshold = ref(0.75);
const keywordWeight = ref(50);
const rerankModels = ref([
  { label: 'bge-reranker-base', value: 'bge-base' },
  { label: 'bge-reranker-large', value: 'bge-large' },
  { label: '没有 Rerank 模型', value: 'none' }
]);
const selectedRerankModel = ref('bge-large');
const useKnowledgeGraph = ref(false);
const selectedLanguage = ref('auto');
const testQuery = ref('');
const isTesting = ref(false);
const selectedFilesForTest = ref<Document[]>([]);
const searchResults = ref<SearchResult[]>([]);

// 文件上传进度
const uploadProgress = ref(0);


// 文件类型映射
const fileTypeIcons = {
  pdf: 'text-red-500',
  docx: 'text-blue-500',
  txt: 'text-gray-500'
};

// 文档数据结构
interface Document {
  id: number;
  name: string;
  fileType: string;
  chunks: number;
  uploadDate: string;
  slicingMethod: string;
  enabled: boolean;
  file_size: number;
  file_hash: string;
}

const documents = ref<Document[]>([]);
let intervalId: number | null = null; // 用于存储定时器 ID

const displayedDocuments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredDocuments.value.slice(start, end);
});





// 检索结果结构
interface SearchResult {
  source: string;
  content: string;
  file: string;
  chunk: number;
  score: number;
}



const filteredDocuments = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  let filteredDocs = documents.value;

  // 根据搜索关键词过滤
  if (query) {
    filteredDocs = filteredDocs.filter(doc =>
      doc.name.toLowerCase().includes(query) ||
      doc.fileType.toLowerCase().includes(query) ||
      doc.slicingMethod.toLowerCase().includes(query)
    );
  }

  // 根据启用状态过滤
  if (filterStatus.value === '启用') {
    filteredDocs = filteredDocs.filter(doc => doc.enabled);
  } else if (filterStatus.value === '禁用') {
    filteredDocs = filteredDocs.filter(doc => !doc.enabled);
  }

  return filteredDocs;
});

//删除文档的逻辑


const deleteSelectedDocuments = async (documentId: number) => {
  try {
    console.log('要删除的文档ID:', documentId);
    console.log('知识库ID:', KLB_id);
    
    // 发送请求到后端，同时传入知识库ID和文档ID
    await axios.post(`/api/delete-documents/`, { 
      documentIds: [documentId]
    }, {
      params: {
        KLB_id: KLB_id
      }
    });
    
    // 从本地列表中移除已删除的文档
    const index = documents.value.findIndex(doc => doc.id === documentId);
    if (index > -1) {
      documents.value.splice(index, 1);
    }
  } catch (error) {
    console.error('删除文档失败:', error);
    // 可以在这里添加错误提示，例如：
    // MessagePlugin.error('删除文档失败，请重试');
  }
};


// 分页计算
const totalPages = computed(() =>
  Math.ceil(filteredDocuments.value.length / itemsPerPage.value)
);

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// 格式日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN');
};

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      uploadedFiles.value.push(file);
    }
  }
};

// 处理拖放上传
const handleFileDrop = (event: DragEvent) => {
  dragover.value = false;
  if (event.dataTransfer?.files) {
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      uploadedFiles.value.push(event.dataTransfer.files[i]);
    }
  }
};

// 删除已上传文件
const removeUploadedFile = (index: number) => {
  uploadedFiles.value.splice(index, 1);
};

// 实验代码，大文件上传

import { uploadFiles } from './file-upload';

// 处理文件上传

const KLB_id = route.params.id as string; // 获取URL的最后一项作为id
const processFileUpload = async () => {
  await uploadFiles(uploadedFiles, isUploading, uploadProgress, KLB_id);
  // 上传完成后刷新文档列表
  try {
    const response = await axios.get<Document[]>('http://localhost:8000/api/documents-list/' + KLB_id + '/', {
      headers: {
        'accept': 'application/json'
      }
    });
    documents.value = response.data;
    uploadedFiles.value = []; // 清空待上传文件列表
  } catch (error) {
    console.error('刷新文档列表失败:', error);
  }
};




// 切换文档启用状态
const toggleDocumentStatus = async (doc: Document) => {
  try {
    // 调用后端接口发送文档启用状态
    const response = await axios.post('/api/update-document-status', {
      documentId: doc.id,
      enabled: !doc.enabled
    });

    // 处理接口响应
    if (response.status === 200) {
      doc.enabled = !doc.enabled;
      console.log('文档状态已更新', doc.enabled);
    } else {
      console.error('更新文档状态失败:', response.statusText);
      // 处理错误，例如显示错误消息
    }
  } catch (error) {
    console.error('更新文档状态失败:', error);
    // 处理错误，例如显示错误消息
  }
};

/**
// 全选/取消全选
const toggleAllSelection = (event: Event) => {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    selectedDocuments.value = documents.value.map(doc => doc.id);
  } else {
    selectedDocuments.value = [];
  }
};
*/

/**  运行搜索测试
const runSearchTest = () => {
  if (testQuery.value.trim() === '') return;

  isTesting.value = true;
  searchResults.value = [];

  // 模拟搜索延迟
  setTimeout(() => {
    // 生成模拟结果
    searchResults.value = [
      {
        source: "ASF技术文档.pdf",
        content: "Apache Software Foundation (ASF) 是一个非营利组织，通过提供开源软件产品支持多个开源软件项目。",
        file: "ASF技术文档.pdf",
        chunk: 5,
        score: 0.92
      },
      {
        source: "开发指南.txt",
        content: "在进行开发工作时，请遵循ASF的编码规范和技术标准，确保代码质量和一致性。",
        file: "开发指南.txt",
        chunk: 15,
        score: 0.84
      },
      {
        source: "API参考.pdf",
        content: "ASF REST API 提供了一组端点，允许开发者管理和监控项目资源。",
        file: "API参考.pdf",
        chunk: 12,
        score: 0.78
      },
      {
        source: "安全规范.pdf",
        content: "在部署任何ASF项目时，务必遵守安全最佳实践，包括输入验证和权限控制。",
        file: "安全规范.pdf",
        chunk: 8,
        score: 0.73
      },
      {
        source: "部署手册.docx",
        content: "部署ASF应用的标准流程包括环境准备、配置管理和部署后测试。",
        file: "部署手册.docx",
        chunk: 3,
        score: 0.65
      }
    ];

    isTesting.value = false;
  }, 1500);
};
*/



// 保存知识库设置
const saveKnowledgeBaseSettings = (settings: { name: string; description: string }) => {
  // 更新本地状态
  kbName.value = settings.name;
  kbDescription.value = settings.description;
  
  // 调用API保存设置到后端
  axios.post(`/api/update-knowledgebase-config/${id.value}`, {
    name: settings.name,
    description: settings.description
  })
  .then(response => {
    console.log('知识库设置已保存成功', response.data);
    // 可以添加成功提示
  })
  .catch(error => {
    console.error('保存知识库设置失败:', error);
    // 可以添加错误提示
  });
};


// 删除知识库
const deleteKnowledgeBase = async () => {
  try {

          // 跳转到知识库列表页
      router.push('/knowledge');
    // 调用API删除知识库
    const response = await axios.delete(`/api/delete-knowledgebase/${id.value}`);
    
    if (response.status === 200) {
      console.log('知识库已成功删除', id.value);
      
      // 隐藏确认框
      showDeleteConfirmation.value = false;
      

    } else {
      console.error('删除知识库失败:', response.data);
      // 可以在这里添加错误提示
    }
  } catch (error) {
    console.error('删除知识库请求失败:', error);
    // 可以在这里添加错误提示
  }
};


// 从测试列表中移除文件
const removeFileFromTest = (id: number) => {
  const index = selectedFilesForTest.value.findIndex(file => file.id === id);
  if (index !== -1) {
    selectedFilesForTest.value.splice(index, 1);
  }
};

onMounted(() => {
  // 立即调用一次接口获取数据
  const fetchDocuments = async () => {
    try {
      // 调用接口获取文档数据
      const response = await axios.get<Document[]>('http://localhost:8000/api/documents-list/' + KLB_id + '/', {
        headers: {
          'accept': 'application/json'
        }
      });
      // 将接口返回的数据赋值给 documents
      documents.value = response.data;
    } catch (error) {
      console.error('获取文档数据失败:', error);
      // 处理错误，例如显示错误消息
    }
  };

  fetchDocuments();

  // 每 20 秒调用一次接口
  //intervalId = window.setInterval(fetchDocuments, 20000);
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }
});
</script>

<style scoped>
.dragover {
  @apply border-blue-500 bg-blue-50;
}

.app-container {
  background-color: #f9fafb;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: -1;
  overflow-x: hidden;
}
</style>