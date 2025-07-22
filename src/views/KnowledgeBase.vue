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
        <div class="relative flex-1">
          <input type="text" placeholder="Search"
            class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- 创建知识库按钮 -->
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium whitespace-nowrap flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create knowledge base
        </button>
      </div>
    </div>

    <!-- 知识库卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 知识库卡片示例 -->
      <div
        class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        @click="goToDetail('asf-m')">
        <!-- 卡片顶部区域 -->
        <div class="border-b border-gray-100 bg-blue-50 px-6 py-4">
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
              <span class="text-gray-700 font-bold">ASF</span>
            </div>
            <div class="ml-4">
              <h3 class="font-semibold text-gray-800">ASF-M</h3>
              <p class="text-sm text-gray-600">ASF</p>
            </div>
          </div>
        </div>

        <!-- 卡片底部信息 -->
        <div class="px-6 py-4 flex justify-between items-center">
          <div>
            <span class="text-sm text-gray-600">1 Docs</span>
          </div>
          <div>
            <span class="text-xs text-gray-500">17/07/2025 10:47:32</span>
          </div>
        </div>
      </div>

      <knowledge-cards
      id = "knowledge-cards"
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :go-to-detail="goToDetail"
        @click="goToDetail(card.id)"
      />

      <!-- 更多卡片占位符 -->
      <div
        class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[150px]">
        <p class="text-gray-500">That's all. Nothing more.</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import knowledgeCards from '../components/knowledge-unit/knowledge-cards.vue';
import { ref } from 'vue';

const router = useRouter();

const goToDetail = (id: string) => {
  router.push(`/knowledge/${id}`);
};

const cards = ref([
  {
    id: 'asf-m',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '卡片内容',
    cover: 'https://picx.zhimg.com/80/v2-381cc3f4ba85f62cdc483136e5fa4f47_720w.webp?source=d16d100b',
  },
  {
    id: 'asf-m',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '卡片内容',
    cover: 'https://picx.zhimg.com/80/v2-169845f4c08de8134b312c3986eace33_720w.webp?source=d16d100b',
  },
  {
    id: 'asf-m',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '卡片内容',
    cover: 'https://pic3.zhimg.com/80/v2-9fe27c8996ec8773b72ebad72e97ac62_720w.webp',
  },
  // 其他卡片数据
]);

</script>
<style scoped>
#knowledge-cards {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

#knowledge-cards:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
