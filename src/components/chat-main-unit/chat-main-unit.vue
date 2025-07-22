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
        <t-chat-content v-if="item.content.length > 0" :content="item.content" />
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
import { MockSSEResponse } from './sseRequest-reasoning';
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
  { label: 'GPT', value: 'default' },
  { label: 'Deepseek', value: 'deepseek-r1' },
  { label: '混元', value: 'hunyuan' },
]);
const selectValue = ref({ label: '默认模型', value: 'default' });
const isChecked = ref(false);

// 深度思考开关
const checkClick = () => {
  isChecked.value = !isChecked.value;
};

// 聊天数据
const state = reactive({
  chatList: [
    {
      content: `模型由<span>hunyuan</span>变为<span>GPT4</span>`,
      role: 'model-change',
      reasoning: '',
    },
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
const handleData = async (messageContent) => {
  console.log("开始处理数据:", messageContent);
  
  const lastItem = chatList.value[0];
  const mockedData = {
    reasoning: `嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容。牛顿第一定律，也就是惯性定律，说物体在没有外力作用时会保持静止或匀速直线运动。也就是说，保持原来的运动状态。

那问题来了，这个定律是否适用于所有参考系呢？记得以前学过的参考系分惯性系和非惯性系。惯性系里，牛顿定律成立；非惯性系里，可能需要引入惯性力之类的修正。所以牛顿第一定律应该只在惯性参考系中成立，而在非惯性系中不适用，比如加速的电梯或者旋转的参考系，这时候物体会有看似无外力下的加速度，所以必须引入假想的力来解释。`,
    content: `牛顿第一定律（惯性定律）**并不适用于所有参考系**，它只在**惯性参考系**中成立。

这个目前是硬编码的测试输出，实际要接后端api输出正确回答

---`,
  };
  
  const mockResponse = new MockSSEResponse(mockedData);
  fetchCancel.value = mockResponse;
  
  await fetchSSE(
    () => mockResponse.getResponse(),
    {
      success(result) {
        if (lastItem) {
          lastItem.reasoning += result.delta.reasoning_content || '';
          lastItem.content += result.delta.content || '';
        }
      },
      complete(isOk, msg) {
        if (!isOk && lastItem) {
          lastItem.role = 'error';
          lastItem.content = msg || '处理出错';
          lastItem.reasoning = '';
        }
        
        if (lastItem) {
          lastItem.duration = 20; // 显示用时
        }
        
        // 完成时恢复状态
        console.log('数据处理完成');
        isStreamLoad.value = false;
        loading.value = false;
        fetchCancel.value = null;
      },
      fail() {
        console.log('数据处理失败');
        isStreamLoad.value = false;
        loading.value = false;
        fetchCancel.value = null;
      }
    }
  );
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

.t-chat-input {
  position: absolute;
  bottom: 30px; /* 距离底部30px */
  left: 0;
  right: 0;
  margin: auto; /* 水平居中 */
  width: 100%; /* 可根据需要调整宽度 */
  
  .t-input__inner {
    padding-right: 100px; /* 为发送按钮留出空间 */
  }
  
  .t-button {
    position: absolute;
    right: 10px; /* 距离输入框右边10px */
    top: 50%;
  }
}
</style>
