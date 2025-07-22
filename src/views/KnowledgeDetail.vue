<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div class="flex items-center mb-6">
      <button @click="$router.back()" class="mr-3 text-gray-600 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-2xl font-semibold text-gray-800">Knowledge Base: {{ id }}</h1>
    </div>
    
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-medium mb-4">Documents</h2>
      
      <!-- 文档操作按钮 -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-2">
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium whitespace-nowrap flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Upload Document
          </button>
        </div>
        
        <div class="relative">
          <input
            type="text"
            placeholder="Search documents"
            class="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- 示例文档列表 -->
      <div class="border rounded-lg overflow-hidden">
        <div class="grid grid-cols-12 gap-4 bg-gray-50 p-4 font-medium text-gray-600 border-b">
          <div class="col-span-6">Name</div>
          <div class="col-span-2">Type</div>
          <div class="col-span-2">Size</div>
          <div class="col-span-2">Actions</div>
        </div>
        
        <div v-if="documents.length > 0">
          <div 
            v-for="(doc, index) in documents" 
            :key="index"
            class="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 border-b"
          >
            <div class="col-span-6 flex items-center">
              <div class="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-800">{{ doc.name }}</div>
                <div class="text-sm text-gray-500">{{ doc.date }}</div>
              </div>
            </div>
            <div class="col-span-2 text-gray-600">{{ doc.type }}</div>
            <div class="col-span-2 text-gray-600">{{ doc.size }}</div>
            <div class="col-span-2 flex space-x-2">
              <button class="text-gray-600 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button class="text-gray-600 hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="p-8 text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mb-1 font-medium">No documents yet</p>
          <p>Upload a document to get started</p>
        </div>
      </div>
    </div>
    
    <!-- 知识库设置部分 -->
    <div class="bg-white shadow rounded-lg p-6 mt-6">
      <h2 class="text-xl font-medium mb-4">Knowledge Base Settings</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            :value="id"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value="ASF"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium mr-3">
          Delete Knowledge Base
        </button>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = ref(route.params.id || '');

// 示例文档数据
const documents = ref([
  {
    name: 'ASF Technical Documentation.pdf',
    type: 'PDF',
    size: '2.4 MB',
    date: '2023-10-15'
  },
  {
    name: 'Project Overview.docx',
    type: 'DOCX',
    size: '1.2 MB',
    date: '2023-10-10'
  }
]);
</script>

<style scoped>
/* 可添加特定样式 */
</style>
