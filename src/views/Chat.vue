<template>
  <div class="height-full flex">
    <!-- 侧边栏：对话历史记录 -->
    <div class="w-64 border-r border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex flex-col">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="font-medium text-gray-900 dark:text-white">对话历史</h2>
        <button class="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            @click="createNewSession">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <div v-for="(chat, idx) in chatSessions" :key="idx" @click="selectSession(idx)" :class="[
          'px-3 py-2 rounded-md cursor-pointer flex items-center',
          currentSessionIndex === idx
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'hover:bg-gray-100 text-gray-800 dark:hover:bg-gray-700 dark:text-gray-200',
        ]">
          <div
            class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3 flex-shrink-0">
            <span class="text-xs font-medium">{{ idx + 1 }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium truncate">{{ chat.title || "新对话" }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ chat.lastMessage || "开始新对话..." }}
            </div>
          </div>
        </div>
      </div>

      <div class="p-3 border-t border-gray-200 dark:border-gray-700">
        <button @click="createNewSession"
          class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新对话
        </button>
        <button @click="downloadChat"
                class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载对话
        </button>
      </div>
    </div>

    <!-- 主聊天区域 -->
    <div id="chat-container" class="flex height-full">
      <chatMainUnit :history="currentSession.history" :title="currentSession.title"
        :lastMessage="currentSession.lastMessage" :key="currentSession.id"></chatMainUnit>
      <!-- 为每个对话框发分配一个路由键要后端的功能 -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import chatSender from "../components/chat-main-unit/chat-sender.vue";
import chatMainUnit from "../components/chat-main-unit/chat-main-unit.vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const loading = ref(false);
const isStreamLoad = ref(false);
const chatHistoryRef = ref(null);
const currentSessionIndex = ref(0);

const currentSession = computed(() => {
  return chatSessions.value[currentSessionIndex.value];
});
// 定义聊天会话列表
const chatSessions = ref([
  {
    id: "0",
    title: "南极的ATM",
    lastMessage: "南极的自动提款机",
    history: [
      {
        avatar: "https://tdesign.gtimg.com/site/chat-avatar.png",
        name: "ASF助手",
        datetime: "今天16:38",
        content:
          "McMurdo Station ATM，美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。",
        role: "assistant",
        reasoning: "",
        duration: 10,
      },
      {
        avatar: "https://tdesign.gtimg.com/site/avatar.jpg",
        name: "您",
        datetime: "今天16:38",
        content: "南极的自动提款机叫什么名字？",
        role: "user",
        reasoning: "",
        duration: 10,
      },
    ],
  },
]);

// 计算当前会话的聊天历史
const currentChatHistory = computed(() => {
  return chatSessions.value[currentSessionIndex.value]?.history || [];
});

// 创建新会话
const createNewSession = () => {
  // 使用展开语法创建新数组触发响应性
  chatSessions.value = [
    {
      //  uuidv4(),
      id: generateNumericUUID(),
      title: "新对话",
      lastMessage: "",
      history: [],
    },
    ...chatSessions.value
  ]

  // 确保在下一次 DOM 更新后重置索引
  nextTick(() => {
    currentSessionIndex.value = 0
    router.push(`/chat/${chatSessions.value[0].id}`);
  })
}

// 选择会话
const selectSession = (index: number) => {
  currentSessionIndex.value = index;
  router.push(`/chat/${chatSessions.value[index].id}`);
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
    avatar: "https://tdesign.gtimg.com/site/avatar.jpg",
    name: "您",
    datetime: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    content: inputValue,
    role: "user",
    reasoning: "",
    duration: 10,
  };

  // 添加到当前会话
  chatSessions.value[currentSessionIndex.value].history.push(userMessage);
  chatSessions.value[currentSessionIndex.value].lastMessage = inputValue;

  // 如果是新会话，更新标题
  if (
    !chatSessions.value[currentSessionIndex.value].title ||
    chatSessions.value[currentSessionIndex.value].title === "新对话"
  ) {
    chatSessions.value[currentSessionIndex.value].title =
      inputValue.length > 20 ? inputValue.substring(0, 20) + "..." : inputValue;
  }

  // 设置加载状态
  isStreamLoad.value = true;
  loading.value = true;

  // 模拟响应
  setTimeout(() => {
    loading.value = false;

    // 添加助手响应
    const assistantMessage = {
      avatar: "https://tdesign.gtimg.com/site/chat-avatar.png",
      name: "ASF助手",
      datetime: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: `您好，这是对"${inputValue}"的回复。我是ASF智能助手，有什么可以帮助您的？`,
      role: "assistant",
      reasoning: "",
      duration: 10,
    };

    // 添加到当前会话
    chatSessions.value[currentSessionIndex.value].history.push(assistantMessage);

    isStreamLoad.value = false;
  }, 2000);
};

// 新增下载函数
const downloadChat = async () => {
  try {
    // 准备下载数据
    const downloadData = {
      chat_sessions: {
        [currentSession.value.id]: {
          ...currentSession.value,
          downloadTime: new Date().toISOString()
        }
      }
    };

    // 发送下载请求
    const response = await fetch('/api/download-chat-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(downloadData)
    });

    if (!response.ok) {
      throw new Error('下载失败');
    }

    // 获取文件名
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]
      : `chat_session_${new Date().getTime()}.json`;

    // 创建下载链接
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('对话下载成功');
  } catch (error) {
    console.error('下载对话失败:', error);
    alert('下载对话失败，请重试');
  }
};

function generateNumericUUID(length = 16) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}
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

/* src/index.css */
/* 全局淡入动画：所有元素加载时淡入 */
* {
  @apply animate-fade-in;
  /* 应用自定义的淡入动画 */
  /* 可选：初始透明度设为 0（若元素默认可见，需配合动画覆盖） */
  /* opacity: 0; */
}

/* 排除不需要动画的元素（按需调整） */
* :not(html):not(body):not(script):not(style):not(link):not(meta):not(title) {
  /* 保留其他元素的默认行为，仅对可见内容应用动画 */
}

/* 特殊场景：动态添加的元素（如 AJAX 加载的内容）需要重新触发动画 */
/* 可通过 JavaScript 添加 `animate-fade-in` 类，或使用 MutationObserver */
</style>
