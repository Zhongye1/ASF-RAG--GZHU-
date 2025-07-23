<template>
  <div class="chat-box">
    <t-chat
      ref="chatRef"
      :clear-history="chatList.length > 0 && !isStreamLoad"
      :data="chatList"
      :text-loading="loading"
      :is-stream-load="isStreamLoad"
      style="height: 100%"
      @scroll="handleChatScroll"
      @clear="clearConfirm"
    >
      <!-- eslint-disable vue/no-unused-vars -->
      <template #content="{ item, index }">
        <t-chat-reasoning v-if="item.reasoning?.length > 0" expand-icon-placement="right">
          <template #header>
            <t-chat-loading v-if="isStreamLoad && item.content.length === 0" text="思考中...按Ctrl+C停止" />
            <div v-else style="display: flex; align-items: center">
              <CheckCircleIcon style="color: var(--td-success-color-5); font-size: 20px; margin-right: 8px" />
              <span>已深度思考</span>
            </div>
          </template>
          <t-chat-content v-if="item.reasoning.length > 0" :content="item.reasoning" />
        </t-chat-reasoning>
          <t-chat-content 
            v-if="item.content.length > 0" 
            :content="item.content"
            class="custom-chat-dialog"
          />
      </template>
      
      <template #actions="{ item, index }">
        <t-chat-action
          :content="item.content"
          :operation-btn="['good', 'bad', 'replay', 'copy']"
          @operation="handleOperation"
        />
      </template>
      
      <template #footer>
        <t-chat-sender
        id="chatSender"
          ref="chatSenderRef"
          v-model="inputValue"
          class="chat-sender"
          :textarea-props="{
            placeholder: '请输入消息...',
          }"
          :loading="isStreamLoad"
          @send="inputEnter"
          @file-select="fileSelect"
          @stop="onStop"
        >
          <template #suffix="{ renderPresets }">
            <component :is="renderPresets([{ name: 'uploadImage' }, { name: 'uploadAttachment' }])" />
          </template>
          
          <template #prefix>
            <div class="model-select">
              <t-tooltip v-model:visible="allowToolTip" content="切换模型" trigger="hover">
                <t-select
                  v-model="selectValue"
                  :options="selectOptions"
                  value-type="object"
                  @focus="allowToolTip = false"
                  @change="handleModelChange"
                ></t-select>
              </t-tooltip>
              <t-button class="check-box" :class="{ 'is-active': isChecked }" variant="text" @click="checkClick">
                <SystemSumIcon />
                <span>深度思考</span>
              </t-button>
            </div>
          </template>
        </t-chat-sender>
      </template>
    </t-chat>
    
    <t-button v-show="isShowToBottom" variant="text" class="bottomBtn" @click="backBottom">
      <div class="to-bottom">
        <ArrowDownIcon />
      </div>
    </t-button>
  </div>
</template>

<script setup lang="jsx">
import { ref, reactive, toRefs, onMounted, onBeforeUnmount, nextTick } from 'vue';
//import { MockSSEResponse } from './sseRequest-reasoning';
import { ArrowDownIcon, CheckCircleIcon, SystemSumIcon } from 'tdesign-icons-vue-next';
import {
  Chat as TChat,
  ChatAction as TChatAction,
  ChatContent as TChatContent,
  ChatInput as TChatInput,
  ChatItem as TChatItem,
  ChatReasoning as TChatReasoning,
  ChatLoading as TChatLoading,
} from '@tdesign-vue-next/chat';
import { fetchOllamaStream } from './sseRequest-reasoning';
import { MessagePlugin } from 'tdesign-vue-next';

// 基础状态
const fetchCancel = ref(null);
const loading = ref(false);
const isStreamLoad = ref(false);
const chatRef = ref(null);
const chatSenderRef = ref(null);
const inputValue = ref('');
const isShowToBottom = ref(false);
const allowToolTip = ref(false);

// 模型选择相关
const selectOptions = ref([
  { label: 'qwen3:0.6b', value: 'qwen3:0.6b' },
  { label: 'Deepseek', value: 'deepseek-r1' },
]);
const selectValue = ref({ label: '默认模型', value: 'qwen3:0.6b' });
const isChecked = ref(false);

// 处理模型选择事件
const handleModelChange = (value) => {
  MessagePlugin.success(`已选择模型：${value.label}`);
};
// 深度思考开关
const checkClick = () => {
  isChecked.value = !isChecked.value;
};

// 聊天数据
const state = reactive({
  chatList: [
    {
      avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
      name: 'TDesignAI',
      datetime: '今天16:38',
      reasoning: '',
      content: '它叫 McMurdo Station ATM，是美国富国银行安装在南极洲最大科学中心麦克默多站的一台自动提款机。',
      role: 'assistant',
      duration: 10,
    },
    {
      avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
      name: '自己',
      datetime: '今天16:38',
      content: '南极的自动提款机叫什么名字？',
      role: 'user',
      reasoning: '',
    },
  ],
});

const { chatList } = toRefs(state);

// 滚动相关
const backBottom = () => {
  chatRef.value.scrollToBottom({
    behavior: 'smooth',
  });
};

const handleChatScroll = function ({ e }) {
  const scrollTop = e.target.scrollTop;
  isShowToBottom.value = scrollTop < 0;
};

// 清空消息
const clearConfirm = function () {
  chatList.value = [];
};

// 操作处理
const handleOperation = function (type, options) {
  console.log('handleOperation', type, options);
};

// 文件选择处理
const fileSelect = function (files) {
  console.log('选择的文件:', files);
};

// 停止按钮处理
const onStop = function () {
  console.log('onStop - 用户主动停止');
  
  if (fetchCancel.value) {
    fetchCancel.value.controller.close();
    fetchCancel.value = null;
  }
  
  // 用户主动停止时立即恢复按钮状态
  isStreamLoad.value = false;
  loading.value = false;
};

// 消息发送处理 - 修复后的版本
const inputEnter = function (messageContent) {
  // 防止重复发送
  if (isStreamLoad.value) {
    console.log('正在处理中，忽略重复发送');
    return;
  }

  console.log('发送的消息:', messageContent);
  
  // 添加用户消息
  const userMessage = {
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    name: '自己',
    datetime: new Date().toLocaleString(),
    content: messageContent,
    role: 'user',
  };
  
  // 添加AI占位消息
  const aiMessage = {
    avatar: 'https://tdesign.gtimg.com/site/chat-avatar.png',
    name: 'TDesignAI',
    datetime: new Date().toLocaleString(),
    content: '',
    reasoning: '',
    role: 'assistant',
  };

  chatList.value.unshift(userMessage);
  chatList.value.unshift(aiMessage);

  // 启动流式加载状态
  isStreamLoad.value = true;
  //loading.value = true;
  
  
  // 清空输入框 - 正确的方式
  inputValue.value = '';
  
  // 如果组件提供了清空方法，也调用一下
  nextTick(() => {
    if (chatSenderRef.value && typeof chatSenderRef.value.clear === 'function') {
      chatSenderRef.value.clear();
    }
  });

  // 开始处理数据
  handleData(messageContent);
};

// SSE 处理
const fetchSSE = async (fetchFn, options) => {
  try {
    const response = await fetchFn();
    const { success, fail, complete } = options;
    
    if (!response.ok) {
      complete?.(false, response.statusText);
      fail?.();
      return;
    }
    
    const reader = response?.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      complete?.(false, '无法获取数据流');
      return;
    }

    const processText = async ({ done, value }) => {
      if (done) {
        complete?.(true);
        return;
      }
      
      try {
        const chunk = decoder.decode(value, { stream: true });
        const buffers = chunk.toString().split(/\r?\n/);
        const jsonData = JSON.parse(buffers);
        success(jsonData);
      } catch (error) {
        console.error('解析数据出错:', error);
      }
      
      return reader.read().then(processText);
    };

    reader.read().then(processText);
    
  } catch (error) {
    console.error('fetchSSE 出错:', error);
    options.complete?.(false, error.message);
  }
};

// 数据处理
// src/components/chat-main-unit/chat-main-unit.vue

// 修改数据处理函数
const handleData = async (messageContent) => {
  console.log("开始处理数据:", messageContent);
  
  const lastItem = chatList.value[0];
  const selectedModel = selectValue.value.value; // 获取用户选择的模型
  
  try {
    // 使用Ollama API获取响应
    const { response, controller } = await fetchOllamaStream(messageContent, selectedModel);
    fetchCancel.value = { controller }; // 保存控制器以便可以停止请求
    
    if (!response.ok) {
      throw new Error(`Ollama API responded with status: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // 处理流式响应
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      try {
        // Ollama API返回的是换行符分隔的JSON对象
        const lines = chunk.trim().split('\n');
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          const data = JSON.parse(line);
          
          // 如果是深度思考模式，将前面部分的输出放到reasoning中
          if (isChecked.value && !data.done && lastItem.reasoning.length < 200) {
            lastItem.reasoning += data.response;
          } else {
            // 正常添加到内容中
            lastItem.content += data.response;
          }
          
          // 检查是否完成
          if (data.done) {
            lastItem.duration = data.total_duration ? 
              Math.round(data.total_duration / 1000000) : // 转换为毫秒
              20; // 默认值
          }
        }
      } catch (error) {
        console.error('解析数据出错:', error, chunk);
      }
    }
    
    // 完成处理
    isStreamLoad.value = false;
    loading.value = false;
    fetchCancel.value = null;
    
  } catch (error) {
    console.error('处理数据时出错:', error);
    if (lastItem) {
      lastItem.role = 'error';
      lastItem.content = `连接Ollama服务失败: ${error.message}`;
      lastItem.reasoning = '';
    }
    
    isStreamLoad.value = false;
    loading.value = false;
    fetchCancel.value = null;
  }
};


// 键盘事件处理
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'c') {
    event.preventDefault();
    onStop();
  }
};

// 生命周期
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (fetchCancel.value) {
    fetchCancel.value.controller.close();
  }
});
</script>


<style lang="less">
/* 应用滚动条样式 */
::-webkit-scrollbar-thumb {
  background-color: var(--td-scrollbar-color);
}
::-webkit-scrollbar-thumb:horizontal:hover {
  background-color: var(--td-scrollbar-hover-color);
}
::-webkit-scrollbar-track {
  background-color: var(--td-scroll-track-color);
}
.chat-box {
  position: relative;
  height: 100%;
  .bottomBtn {
    position: absolute;
    left: 50%;
    margin-left: -20px;
    bottom: 210px;
    padding: 0;
    border: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08), 0px 16px 24px 2px rgba(0, 0, 0, 0.04),
      0px 6px 30px 5px rgba(0, 0, 0, 0.05);
  }

  .to-bottom {
    width: 40px;
    height: 40px;
    border: 1px solid #dcdcdc;
    box-sizing: border-box;
    background: var(--td-bg-color-container);
    border-radius: 50%;
    font-size: 24px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    .t-icon {
      font-size: 24px;
    }
  }
}

.model-select {
  display: flex;
  align-items: center;
  .t-select {
    width: 112px;
    height: 32px;
    margin-right: 8px;
    .t-input {
      border-radius: 32px;
      padding: 0 15px;
    }
  }
  .check-box {
    width: 112px;
    height: 32px;
    border-radius: 32px;
    border: 0;
    background: #e7e7e7;
    color: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    flex: 0 0 auto;
    .t-button__text {
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        margin-left: 4px;
      }
    }
  }
  .check-box.is-active {
    border: 1px solid #d9e1ff;
    background: #f2f3ff;
    color: var(--td-brand-color);
  }
}

.t-chat-input.position-absolute {
  position: absolute;
  bottom: 10px; /* 距离底部20px */
  left: 0;
  right: 0;
  margin: auto; /* 水平居中 */
  width: 100%; /* 可根据需要调整宽度 */
}


.custom-chat-dialog {
  /* 添加背景颜色 */
  background-color: #dbeafe59;
  /* 添加边框圆角 */
  border-radius: 8px;
      margin-top: 10px;
      padding-right: 20px !important;
}
</style>
