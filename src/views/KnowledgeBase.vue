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
  <t-button theme="primary" class="h-[40px]">
    <template #icon><add-icon /></template>
    新建知识库
  </t-button>
</div>
    </div>

    <!-- 知识库卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 width-200px">
      <!-- 知识库卡片示例 -->


      <knowledge-cards id="knowledge-cards" v-for="card in cards" :key="card.id" :card="card" :go-to-detail="goToDetail"
        @click="goToDetail(card.id)" />

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
import search from '../components/search-unit/search.vue';

const router = useRouter();

const goToDetail = (id: string) => {
  router.push(`/knowledge/knowledgeDetail/${id}`);
};

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword);
  // 执行搜索逻辑，比如调用接口、过滤列表等
};


const cards = ref([
  {
    id: 'asf-m1',
    title: 'ASF-M1',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介1',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://picx.zhimg.com/80/v2-381cc3f4ba85f62cdc483136e5fa4f47_720w.webp?source=d16d100b',
  },
  {
    id: 'asf-m2',
    title: 'ASF-M2',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介2',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://picx.zhimg.com/80/v2-169845f4c08de8134b312c3986eace33_720w.webp?source=d16d100b',
  },
  {
    id: 'asf-m3',
    title: 'ASF-M3',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介3',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp',
  },
  {
    id: 'asf-m1',
    title: 'ASF-M1',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介1',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://picx.zhimg.com/80/v2-381cc3f4ba85f62cdc483136e5fa4f47_720w.webp?source=d16d100b',
  },
  {
    id: 'asf-m2',
    title: 'ASF-M2',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介2',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp',
  },
  {
    id: 'asf-m3',
    title: 'ASF-M3',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介3',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp',
  },
  {
    id: 'asf-m1',
    title: 'ASF-M1',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介1',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://picx.zhimg.com/80/v2-381cc3f4ba85f62cdc483136e5fa4f47_720w.webp?source=d16d100b',
  },
  {
    id: 'asf-m2',
    title: 'ASF-M2',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介2',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://picx.zhimg.com/80/v2-169845f4c08de8134b312c3986eace33_720w.webp?source=d16d100b',
  },
  {
    id: 'asf-m3',
    title: 'ASF-M3',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介3',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp',
  },
  {
    id: 'asf-m1',
    title: 'ASF-M1',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介1',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://picx.zhimg.com/80/v2-381cc3f4ba85f62cdc483136e5fa4f47_720w.webp?source=d16d100b',
  },
  {
    id: 'asf-m2',
    title: 'ASF-M2',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介2',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp',
  },
  {
    id: 'asf-m3',
    title: 'ASF-M3',
    avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
    description: '简介3',
    createdTime: '1970-01-01 00.00.00',
    cover: 'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp',
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

.grid {
  display: grid;

}

main {
  max-width: 100wv;
  /* 根据需要调整最大宽度 */

  overflow-x: hidden;
}
</style>
