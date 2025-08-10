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
      <template #content="{ item, index }">
        <t-chat-reasoning v-if="item.reasoning?.length > 0" expand-icon-placement="right">
          <template #header>
            <t-chat-loading
              v-if="isStreamLoad && item.content.length === 0"
              text="思考中...按Ctrl+C停止"
            />
            <div v-else style="display: flex; align-items: center">
              <CheckCircleIcon
                style="
                  color: var(--td-success-color-5);
                  font-size: 20px;
                  margin-right: 8px;
                "
              />
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
        <div>
          <t-space size="medium">
            <t-image
              v-for="item in imgDatas"
              :key="item"
              :src="item"
              alt="上传失败"
              :style="{ width: '60px', height: '60px' }"
            />
          </t-space>
        </div>
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
            <component
              :is="renderPresets([{ name: 'uploadImage' }, { name: 'uploadAttachment' }])"
            />
          </template>

          <template #prefix>
            <div class="model-select">
              <t-tooltip v-model:visible="allowToolTip" trigger="hover">
                <t-select
                  v-model="selectValue"
                  :options="selectOptions"
                  value-type="object"
                  @focus="allowToolTip = false"
                  @change="handleModelChange"
                ></t-select>
              </t-tooltip>
              <t-button
                class="check-box"
                :class="{ 'is-active': isChecked }"
                variant="text"
                @click="checkClick"
              >
                <SystemSumIcon />
                <span>深度思考</span>
              </t-button>
            </div>
          </template>
        </t-chat-sender>
      </template>
    </t-chat>

    <t-button
      v-show="isShowToBottom"
      variant="text"
      class="bottomBtn"
      @click="backBottom"
    >
      <div class="to-bottom">
        <ArrowDownIcon />
      </div>
    </t-button>
  </div>
</template>

<script setup lang="jsx">
import {
  ref,
  reactive,
  toRefs,
  onMounted,
  onBeforeUnmount,
  nextTick,
  defineProps,
  computed,
} from "vue";
//import { MockSSEResponse } from './sseRequest-reasoning';
import { ArrowDownIcon, CheckCircleIcon, SystemSumIcon } from "tdesign-icons-vue-next";
import {
  Chat as TChat,
  ChatAction as TChatAction,
  ChatContent as TChatContent,
  ChatInput as TChatInput,
  ChatItem as TChatItem,
  ChatReasoning as TChatReasoning,
  ChatLoading as TChatLoading,
} from "@tdesign-vue-next/chat";
import { fetchOllamaStream } from "./sseRequest-reasoning";
import { MessagePlugin } from "tdesign-vue-next";
import { useChatImgtore } from "@/store";

const useChatImg = useChatImgtore();
// 基础状态
const fetchCancel = ref(null);
const loading = ref(false);
const isStreamLoad = ref(false);
const chatRef = ref(null);
const chatSenderRef = ref(null);
const inputValue = ref("");
const isShowToBottom = ref(false);
const allowToolTip = ref(false);

//定义props
// 定义 MessageRecord 类型
const MessageRecord = {
  avatar: String,
  name: String,
  datetime: String,
  content: String,
  role: String,
  reasoning: String,
  duration: Number,
};

// 定义 props
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  lastMessage: {
    type: String,
    default: "",
  },
  history: {
    type: Array,
    default: () => [],
  },
});

// 模型选择相关
const selectOptions = ref([]);
const selectValue = ref({});
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
//[Vue warn] toRefs() expects a reactive object but received a plain one.
// 解决方法：这里要使用toRefs()将reactive对象转换为响应式对象
const state = reactive({
  chatList: props.history,
});

const { chatList } = toRefs(state);

// 滚动相关
const backBottom = () => {
  chatRef.value.scrollToBottom({
    behavior: "smooth",
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
  console.log("handleOperation", type, options);
};

// 文件选择处理
const fileSelect = async function (files) {
  const getFileUrlByFileRaw = (file) => {
    if (!file || !(file instanceof Blob)) {
      throw new Error("无效的文件对象");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(new Error("文件读取失败: " + e));
      reader.readAsDataURL(file);
    });
  };
  try {
    if (!files.files || files.files.length === 0) {
      throw new Error("没有选择文件");
    }

    const fileObj = files.files[0];
    if (!fileObj.type.startsWith("image/")) {
      //如果上传的不是图片，进入其他操作
      //如果是txt文本
      if (fileObj.type === "text/plain") {
        //直接读取文件添加到对话框
        const text = await readFileAsText(fileObj);
        inputValue.value += text;
      }
      //不进行中断
    }

    if (!(fileObj instanceof Blob)) {
      if (fileObj.name && fileObj.type && fileObj.size) {
        const reconstructedFile = new File([], fileObj.name, {
          type: fileObj.type,
          lastModified: fileObj.lastModified || Date.now(),
        });
        const dataUrl = await getFileUrlByFileRaw(reconstructedFile);
        useChatImg.addImage(dataUrl);
        return;
      }
      throw new Error("无效的文件类型");
    }
    const dataUrl = await getFileUrlByFileRaw(fileObj);

    // 存储到 Pinia
    useChatImg.addImage(dataUrl);
  } catch (error) {
    console.error("文件处理失败:", error);
  }
};

// 添加中断状态标识
const isUserAborted = ref(false);

const onStop = () => {
  if (fetchCancel.value?.controller) {
    // 标记为用户主动中断
    isUserAborted.value = true;

    // 使用 abort() 中断请求
    fetchCancel.value.controller.abort();

    // 清理状态
    fetchCancel.value = null;
    loading.value = false;
    isStreamLoad.value = false;

    console.log("用户主动停止流式响应");
    MessagePlugin.info("已停止生成");
  }
};

// 消息发送处理 - 修复后的版本
const inputEnter = function (messageContent) {
  // 防止重复发送
  if (isStreamLoad.value) {
    console.log("正在处理中，忽略重复发送");
    return;
  }

  console.log("发送的消息:", messageContent);

  // 添加用户消息
  const userMessage = {
    avatar: "https://tdesign.gtimg.com/site/avatar.jpg",
    name: "自己",
    datetime: new Date().toLocaleString(),
    content: messageContent,
    role: "user",
  };

  // 添加AI占位消息
  const aiMessage = {
    avatar: "https://tdesign.gtimg.com/site/chat-avatar.png",
    name: "TDesignAI",
    datetime: new Date().toLocaleString(),
    content: "",
    reasoning: "",
    role: "assistant",
  };

  chatList.value.unshift(userMessage);
  chatList.value.unshift(aiMessage);

  // 启动流式加载状态
  isStreamLoad.value = true;
  //loading.value = true;

  // 清空输入框 - 正确的方式
  inputValue.value = "";

  // 如果组件提供了清空方法，也调用一下
  nextTick(() => {
    if (chatSenderRef.value && typeof chatSenderRef.value.clear === "function") {
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
      complete?.(false, "无法获取数据流");
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
        console.error("解析数据出错:", error);
      }

      return reader.read().then(processText);
    };

    reader.read().then(processText);
  } catch (error) {
    console.error("fetchSSE 出错:", error);
    options.complete?.(false, error.message);
  }
};

// 数据处理
// src/components/chat-main-unit/chat-main-unit.vue

// 修改数据处理函数
const emit = defineEmits(["chat-updated"]);

// 修改数据处理函数
const handleData = async (messageContent) => {
  console.log("开始处理数据:", messageContent);

  isUserAborted.value = false;
  const lastItem = chatList.value[0];
  const selectedModel = selectValue.value.value;

  // 用于追踪思考过程状态
  let isInThinking = false;
  let thinkingStarted = false;
  let accumulatedResponse = ""; // 累积所有响应内容

  try {
    const { response, controller } = await fetchOllamaStream(
      messageContent,
      selectedModel
    );
    fetchCancel.value = { controller };

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
        const lines = chunk.trim().split("\n");

        for (const line of lines) {
          if (!line.trim()) continue;

          const data = JSON.parse(line);

          if (data.response) {
            accumulatedResponse += data.response;

            // 检测 <think> 标签开始
            if (!thinkingStarted && accumulatedResponse.includes("<think>")) {
              isInThinking = true;
              thinkingStarted = true;
              console.log("开始思考过程");

              // 提取 <think> 之前的内容作为正式回答
              const beforeThink = accumulatedResponse.split("<think>")[0];
              if (beforeThink.trim()) {
                lastItem.content = beforeThink;
              }

              // 提取 <think> 之后的内容作为思考过程开始
              const afterThink = accumulatedResponse.split("<think>")[1];
              if (afterThink) {
                lastItem.reasoning = afterThink;
              }
            }
            // 检测 </think> 标签结束
            else if (isInThinking && accumulatedResponse.includes("</think>")) {
              isInThinking = false;
              console.log("结束思考过程");

              // 分割思考内容和后续回答
              const thinkContent = accumulatedResponse
                .split("<think>")[1]
                .split("</think>")[0];
              const afterThink = accumulatedResponse.split("</think>")[1];

              // 更新思考内容（去掉标签）
              lastItem.reasoning = thinkContent;

              // 添加 </think> 后的内容到正式回答
              if (afterThink) {
                lastItem.content += afterThink;
              }
            }
            // 在思考过程中
            else if (isInThinking) {
              // 更新思考内容（去掉 <think> 标签）
              const currentThinking = accumulatedResponse.split("<think>")[1];
              if (currentThinking && !currentThinking.includes("</think>")) {
                lastItem.reasoning = currentThinking;
              }
            }
            // 正常回答过程（不在思考中）
            else if (!isInThinking) {
              // 如果还没开始思考，或者思考已结束
              if (!thinkingStarted) {
                // 还没遇到 <think> 标签，正常添加到内容
                lastItem.content += data.response;
              } else {
                // 思考已结束，继续添加到内容（排除 </think> 标签）
                const cleanResponse = data.response.replace("</think>", "");
                if (cleanResponse) {
                  lastItem.content += cleanResponse;
                }
              }
            }
          }

          // 检查是否完成
          if (data.done) {
            // 最终清理：确保移除所有标签
            lastItem.content = lastItem.content.replace(/<\/?think>/g, "");
            lastItem.reasoning = lastItem.reasoning.replace(/<\/?think>/g, "");

            lastItem.duration = data.total_duration
              ? Math.round(data.total_duration / 1000000)
              : 20;

            console.log("最终内容:", {
              reasoning: lastItem.reasoning,
              content: lastItem.content,
            });

            // 完成处理
            isStreamLoad.value = false;
            loading.value = false;
            fetchCancel.value = null;

            // **发送保存信号给父组件**
            emit("chat-updated");
          }
        }
      } catch (error) {
        console.error("解析数据出错:", error, chunk);
      }
    }

    // 完成处理
    isStreamLoad.value = false;
    loading.value = false;
    fetchCancel.value = null;
  } catch (error) {
    console.log("用户主动中断:", error);

    // 区分用户主动中断和真正的连接错误
    if (isUserAborted.value || error.name === "AbortError") {
      // 用户主动中断，不显示错误消息
      console.log("流式响应被用户中断");
      if (lastItem) {
        // 保持当前内容，不覆盖为错误消息
        lastItem.content = lastItem.content || "响应已停止";
      }
    } else {
      // 真正的连接或其他错误
      console.error("Ollama连接错误:", error);
      if (lastItem) {
        lastItem.role = "error";
        lastItem.content = `连接Ollama服务失败: ${error.message}`;
        lastItem.reasoning = "";
      }
    }

    // 清理状态
    isStreamLoad.value = false;
    loading.value = false;
    fetchCancel.value = null;
  }
};

// 键盘事件处理
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === "c") {
    event.preventDefault();
    onStop();
  }
};

//图片展示相关
const imgDatas = computed(() => {
  console.log(useChatImg.images);
  return useChatImg.images;
});

// 生命周期
onMounted(async () => {
  window.addEventListener("keydown", handleKeyDown);
  // 获取模型列表
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    const data = await response.json();
    data.models.forEach((model) => {
      selectOptions.value.push({ label: model.name, value: model.model });
    });
    selectValue.value = selectOptions.value[0];
  } catch (error) {
    console.error("获取模型列表失败:", error);
    MessagePlugin.error("获取模型列表失败");
    return [];
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
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
    box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08),
      0px 16px 24px 2px rgba(0, 0, 0, 0.04), 0px 6px 30px 5px rgba(0, 0, 0, 0.05);
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
  bottom: 10px;
  /* 距离底部20px */
  left: 0;
  right: 0;
  margin: auto;
  /* 水平居中 */
  width: 100%;
  /* 可根据需要调整宽度 */
}

.custom-chat-dialog {
  /* 添加背景颜色 */
  background-color: #dbeafe59;
  /* 添加边框圆角 */
  border-radius: 8px;
  margin-top: 10px;
  padding-right: 20px !important;
}

.chat-sender {
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-top: 1px solid var(--td-border-level-1-color);
  padding: 16px;
  box-sizing: border-box;
}

/* 确保聊天内容区域有足够的底部间距，避免被输入框遮挡 */
.chat-box .t-chat {
  padding-bottom: 50px;
  /* 根据输入框高度调整 */
}

/* 移动端适配 */
@media (max-width: 768px) {
  .chat-sender {
    padding: 12px;
  }

  .chat-box .t-chat {
    padding-bottom: 100px;
  }
}
</style>
