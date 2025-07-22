<template>
  <div class="height-full flex"> 
    <!-- 侧边栏：对话历史记录 -->
    <div class="w-64 border-r border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex flex-col">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="font-medium text-gray-900 dark:text-white">对话历史</h2>
        <button class="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div 
          v-for="(chat, idx) in chatSessions" 
          :key="idx"
          @click="selectSession(idx)"
          :class="[
            'px-3 py-2 rounded-md cursor-pointer flex items-center',
            currentSessionIndex === idx 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
              : 'hover:bg-gray-100 text-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
          ]"
        >
          <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3 flex-shrink-0">
            <span class="text-xs font-medium">{{ idx + 1 }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">{{ chat.title || '新对话' }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ chat.lastMessage || '开始新对话...' }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <button 
          @click="createNewSession"
          class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新对话
        </button>
      </div>
    </div>
    
    <!-- 主聊天区域 -->
    <div id="chat-container" class="flex-1 flex flex-col">
      <!-- 聊天历史区域 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="chatHistoryRef">
        <template v-for="(item, index) in currentChatHistory" :key="index">
          <!-- 助手消息 -->
          <div v-if="item.role === 'assistant'" class="flex items-start mb-4">
            <t-avatar size="large" shape="circle" :image="item.avatar" class="flex-shrink-0 mr-3" />
            <div class="flex-1">
              <div class="flex items-center mb-1">
                <span class="font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
                <span class="ml-2 text-xs text-gray-500">{{ item.datetime }}</span>
              </div>
              <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <t-chat-content :content="item.content" class="text-gray-800 dark:text-gray-200" />
              </div>
            </div>
          </div>
          
          <!-- 用户消息 -->
          <div v-else class="flex items-start justify-end mb-4">
            <div class="flex-1 max-w-[80%]">
              <div class="flex items-center justify-end mb-1">
                <span class="text-xs text-gray-500">{{ item.datetime }}</span>
                <span class="ml-2 font-medium text-gray-900 dark:text-white">{{ item.name }}</span>
              </div>
              <div class="p-3 bg-slate-200 rounded-lg">
                <t-chat-content :content="item.content" class="text-white" />
              </div>
            </div>
            <t-avatar size="large" shape="circle" :image="item.avatar" class="flex-shrink-0 ml-3" />
          </div>
        </template>
        
        <!-- 加载状态指示器 -->
        <div v-if="loading" class="flex items-center justify-center py-3">
          <t-loading theme="dots" size="medium" />
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <t-chat-input 
          class="rounded-full shadow-sm"
          :stop-disabled="isStreamLoad" 
          @send="inputEnter" 
          @stop="handleStop"
          placeholder="请输入您的问题..."
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Chat as TChat,
  ChatAction as TChatAction,
  ChatContent as TChatContent,
  ChatInput as TChatInput,
  ChatItem as TChatItem,
  //Avatar as TAvatar,
  //Loading as TLoading
} from '@tdesign-vue-next/chat';

const loading = ref(false);
const isStreamLoad = ref(false);
const chatHistoryRef = ref(null);
const currentSessionIndex = ref(0);

// 定义聊天会话列表
const chatSessions = ref([
  {
    title: '南极的ATM',
    lastMessage: '南极的自动提款机叫什么名字？',
    history: [
      {
        avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
        name: 'ASF助手',
        datetime: '今天16:38',
        content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
        role: 'assistant',
      },
      {
        avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: '您',
        datetime: '今天16:38',
        content: '南极的自动提款机叫什么名字？',
        role: 'user',
      },
    ]
  }
]);

// 计算当前会话的聊天历史
const currentChatHistory = computed(() => {
  return chatSessions.value[currentSessionIndex.value]?.history || [];
});

// 创建新会话
const createNewSession = () => {
  chatSessions.value.unshift({
    title: '新对话',
    lastMessage: '',
    history: []
  });
  currentSessionIndex.value = 0;
};

// 选择会话
const selectSession = (index: number) => {
  currentSessionIndex.value = index;
};

// 停止流式响应
const handleStop = function () {
  isStreamLoad.value = false;
};

// 发送消息
const inputEnter = function (inputValue: string) {
  if (isStreamLoad.value || !inputValue) return;
  
  // 添加用户消息
  const userMessage = {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '您',
    datetime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    content: inputValue,
    role: 'user',
  };
  
  // 添加到当前会话
  chatSessions.value[currentSessionIndex.value].history.push(userMessage);
  chatSessions.value[currentSessionIndex.value].lastMessage = inputValue;
  
  // 如果是新会话，更新标题
  if (!chatSessions.value[currentSessionIndex.value].title || 
      chatSessions.value[currentSessionIndex.value].title === '新对话') {
    chatSessions.value[currentSessionIndex.value].title = inputValue.length > 20 
      ? inputValue.substring(0, 20) + '...' 
      : inputValue;
  }
  
  // 设置加载状态
  isStreamLoad.value = true;
  loading.value = true;
  
  // 滚动到底部
  setTimeout(() => {
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
    }
  }, 0);
  
  // 模拟响应
  setTimeout(() => {
    loading.value = false;
    
    // 添加助手响应
    const assistantMessage = {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: 'ASF助手',
      datetime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      content: `您好，这是对"${inputValue}"的回复。我是ASF智能助手，有什么可以帮助您的？`,
      role: 'assistant',
    };
    
    // 添加到当前会话
    chatSessions.value[currentSessionIndex.value].history.push(assistantMessage);
    
    // 滚动到底部
    setTimeout(() => {
      if (chatHistoryRef.value) {
        chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight;
      }
    }, 0);
    
    isStreamLoad.value = false;
  }, 2000);
};
</script>
<style scoped>
#chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  min-height: calc(100vh - var(--header-height));
}


:deep(.t-chat-input) {
  border-radius: 24px !important;
  padding: 12px 16px !important;
  background-color: #f5f5f5 !important;
}

:deep(.t-chat-input:focus) {
  box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2) !important;
}

:deep(.t-button--theme-primary) {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}

:deep(.t-loading__dots) {
  color: #2563eb !important;
}

/* 滚动条样式 */
:deep(*::-webkit-scrollbar) {
  width: 6px;
}

:deep(*::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(*::-webkit-scrollbar-thumb) {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  :deep(.t-chat-input) {
    background-color: #374151 !important;
    color: white !important;
  }
}

main {
  /* 计算内容高度，减去导航栏高度 */
 
}
</style>