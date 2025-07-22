<template>
  <nav class="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50 ">
    <!-- 左侧: Logo + 主要功能菜单 -->
    <div class="flex items-center space-x-6">
      <!-- Logo -->
      <div class="flex items-center text-blue-600 font-bold text-xl">
        RAGFlow
      </div>
      
      <!-- 主要功能菜单 -->
      <div class="hidden md:flex space-x-4">
        <router-link 
          to="/knowledge" 
          class="px-4 py-1 rounded-md text-sm font-medium"
          :class="$route.path.includes('/knowledge') ? 'text-white bg-blue-600' : 'text-gray-600 hover:text-blue-600'"
        >
          Knowledge Base
        </router-link>
        <router-link 
          to="/chat"
          class="px-3 py-1 text-sm font-medium"
          :class="$route.path === '/chat' ? 'text-white bg-blue-600 rounded-md' : 'text-gray-600 hover:text-blue-600'"
        >
          Chat
        </router-link>
        <router-link 
          to="/search"
          class="px-3 py-1 text-sm font-medium"
          :class="$route.path === '/search' ? 'text-white bg-blue-600 rounded-md' : 'text-gray-600 hover:text-blue-600'"
        >
          Search
        </router-link>
        <router-link 
          to="/agent"
          class="px-3 py-1 text-sm font-medium"
          :class="$route.path === '/agent' ? 'text-white bg-blue-600 rounded-md' : 'text-gray-600 hover:text-blue-600'"
        >
          Agent
        </router-link>
        <router-link 
          to="/files"
          class="px-3 py-1 text-sm font-medium"
          :class="$route.path === '/files' ? 'text-white bg-blue-600 rounded-md' : 'text-gray-600 hover:text-blue-600'"
        >
          File Management
        </router-link>
      </div>
    </div>
    
    <!-- 右侧: 用户功能 -->
    <div class="flex items-center space-x-4">
      <!-- 语言选择 -->
      <div class="relative">
        <button class="flex items-center text-gray-600 hover:text-blue-600 text-sm">
          English
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <!-- 通知图标 -->
      <button class="text-gray-600 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
      
      <!-- 帮助图标 -->
      <button class="text-gray-600 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      <!-- 用户头像 (简化版) -->
      <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
        mmk
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 无需额外脚本
</script>
