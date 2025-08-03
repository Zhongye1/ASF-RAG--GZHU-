<template>
  <main class="max-w-7xl mx-auto px-6 py-8">
    <!-- 欢迎区域 -->
    <div class="flex flex-col md:flex-row justify-between mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800">Welcome back, mmk</h1>
        <p class="text-gray-600 mt-1">Which knowledge bases will you use today?</p>
      </div>

      <div class="flex space-x-4 mt-4 md:mt-0">
        <!-- 搜索框 -->
        <search @search="handleSearch" class="h-[40px]" />
        <!-- 创建知识库按钮 -->
        <t-button theme="primary" class="h-[40px]" @click="toggleUploadModal">
          <template #icon><add-icon /></template>
          新建知识库
        </t-button>
      </div>
    </div>
    <!-- 创建知识库弹出界面 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">创建知识库</h3>
          <form @submit.prevent="createKnowledgeBase">
            <div class="mb-4">
              <label for="kbName" class="block text-sm font-medium text-gray-700">知识库名称</label>
              <input type="text" id="kbName" v-model="kbName" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mt-6 flex justify-end">
              <button type="button" @click="showCreateModal = false"
                class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium mr-3 hover:bg-gray-50">
                取消
              </button>
              <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                创建
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 知识库卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 width-200px">
      <!-- 知识库卡片示例 -->

      <knowledge-cards id="knowledge-cards" v-for="card in filteredCards" :key="card.id" :card="card"
        :go-to-detail="goToDetail" @click="goToDetail(card.id)" />
      <!-- 这里的key不是唯一的数据渲染有问题 -->
      <!-- 更多卡片占位符 -->
      <div id="knowledge-cards-ends"
        class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center w-370 min-h-[150px]">
        <p class="text-gray-500">That's all. Nothing more.</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { AddIcon } from "tdesign-icons-vue-next";
import knowledgeCards from "@/components/knowledge-unit/knowledge-cards.vue";
import { ref } from "vue";
import search from "@/components/search-unit/search.vue";
import { useCardDataStore } from "../../store";
import { storeToRefs } from 'pinia';
import { MessagePlugin } from 'tdesign-vue-next';
import axios from 'axios';

const router = useRouter();
const cardDataStore = useCardDataStore();
const goToDetail = (id: string) => {
  router.push(`/knowledge/knowledgeDetail/${id}`);
};

const handleSearch = (keyword: string) => {
  console.log("搜索关键词:", keyword);
  // 执行搜索逻辑，比如调用接口、过滤列表等
};

const { filteredCards } = storeToRefs(cardDataStore);


//创建知识库的界面
// 添加模态框显示状态和表单数据
const showCreateModal = ref(false);
const kbName = ref('');
const kbCover = ref('');

//模态框的显示和隐藏
const toggleUploadModal = () => {
  showCreateModal.value = !showCreateModal.value;
};
// 处理表单提交的方法
const createKnowledgeBase = async () => {
  try {
    // 发送 POST 请求到后端接口
    console.log("创建知识库:", kbName.value);
    const formData = new FormData();
    formData.append('kbName', kbName.value);

    await axios.post('/api/create-knowledgebase/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // 处理成功响应
    console.log("创建知识库:", kbName.value);
    MessagePlugin.success('创建知识库：' + kbName.value + '  成功');

    // 清空表单数据并关闭模态框
    kbName.value = '';
    kbCover.value = '';
    showCreateModal.value = false;

    // 重新获取卡片数据，更新界面
    await cardDataStore.fetchCards();
  } catch (error:any) {
    if (error.response) {
      // 处理后端返回的错误
      if (error.response.status === 400) {
        MessagePlugin.error('知识库已存在');
      } else {
        MessagePlugin.error('创建知识库失败，请稍后重试');
      }
    } else {
      // 处理网络错误
      MessagePlugin.error('网络错误，请检查网络连接');
    }
    console.error('创建知识库失败:', error);
  }
};

import { onMounted } from 'vue';

// 组件挂载时获取数据
onMounted(async () => {
  await cardDataStore.fetchCards(); // 组件挂载时获取数据
});
</script>
<style scoped>
#knowledge-cards {
  height: 380px;
  width: 370px !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

#knowledge-cards:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

#knowledge-cards-ends {
  width: 370px !important;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

main {
  max-width: 100wv;
  /* 根据需要调整最大宽度 */

  overflow-x: hidden;
}

::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}
</style>
