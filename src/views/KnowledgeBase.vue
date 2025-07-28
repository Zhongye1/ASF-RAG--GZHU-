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
        <t-button theme="primary" class="h-[40px]" @click="handleCreateKnowledgeBase">
          <template #icon><add-icon /></template>
          新建知识库
        </t-button>
      </div>
    </div>

    <!-- 知识库卡片网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 width-200px">
      <!-- 知识库卡片示例 -->

      <knowledge-cards
        id="knowledge-cards"
        v-for="card in filteredCards"
        :key="card.id"
        :card="card"
        :go-to-detail="goToDetail"
        @click="goToDetail(card.id)"
      />
      <!-- 这里的key不是唯一的数据渲染有问题 -->
      <!-- 更多卡片占位符 -->
      <div
        class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[150px]"
      >
        <p class="text-gray-500">That's all. Nothing more.</p>
      </div>
    </div>
  </main>
    <t-dialog
      v-if="visible"
      v-model:visible="visible"
      header="创建新知识库"
      :on-close="resetForm"
      :close-on-overlay-click="false"
      destroy-on-close
    >
      <!-- 表单区域 -->
      <t-form :data="newCard" label-align="top" style="overflow-x: hidden;">
        <t-form-item label="知识库名称" name="title" required>
          <t-input v-model="newCard.title" placeholder="请输入知识库名称" clearable />
        </t-form-item>

        <t-form-item label="描述信息" name="description">
          <t-textarea
            v-model="newCard.description"
            placeholder="请输入描述信息"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </t-form-item>

        <t-row :gutter="16">
          <t-col :span="12">
            <t-form-item label="头像URL" name="avatar">
              <t-input v-model="newCard.avatar" placeholder="请输入头像URL" clearable>
              </t-input>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="封面URL" name="cover">
              <t-input v-model="newCard.cover" placeholder="请输入封面URL" clearable>
              </t-input>
            </t-form-item>
          </t-col>
        </t-row>

        <!-- 图片预览 -->
        <t-row :gutter="16" v-if="newCard.avatar || newCard.cover">
          <t-col :span="12" v-if="newCard.avatar">
            <div class="preview-container">
              <p class="preview-label">头像预览</p>
              <img :src="newCard.avatar" class="preview-image" alt="头像预览" />
            </div>
          </t-col>
          <t-col :span="12" v-if="newCard.cover">
            <div class="preview-container">
              <p class="preview-label">封面预览</p>
              <img :src="newCard.cover" class="preview-image" alt="封面预览" />
            </div>
          </t-col>
        </t-row>
      </t-form>

      <template #footer>
        <t-button variant="outline" @click="visible = false">取消</t-button>
        <t-button theme="primary" @click="createCard" :disabled="!newCard.title.trim()">
          创建
        </t-button>
      </template>
    </t-dialog>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { AddIcon } from "tdesign-icons-vue-next";
import knowledgeCards from "../components/knowledge-unit/knowledge-cards.vue";
import { ref } from "vue";
import search from "../components/search-unit/search.vue";
import { useCardDataStore, CardDataType } from "../store";
import { storeToRefs } from "pinia";

const visible = ref(false);
const newCard = ref({
  id: '',
  title: '',
  description: '',
  avatar: '',
  cover: '',
  createdTime: '',
});
const router = useRouter();
const cardDataStore = useCardDataStore();
const goToDetail = (id: string) => {
  router.push(`/knowledge/knowledgeDetail/${id}`);
};

const handleSearch = (keyword: string) => {
  console.log("搜索关键词:", keyword);
  // 执行搜索逻辑，比如调用接口、过滤列表等
};

const handleCreateKnowledgeBase = () => {
  console.log("创建知识库");
  visible.value = true;
};

const createCard = () => {
  newCard.value.id = Date.now().toString();
  newCard.value.createdTime = new Date().toLocaleDateString();
  cardDataStore.addCard(newCard.value);
  visible.value = false;
  resetForm();
};

const resetForm = () => {
  newCard.value = {
    id: '',
    title: '',
    description: '',
    avatar: '',
    cover: '',
    createdTime: '',
  };
};

const { filteredCards } = storeToRefs(cardDataStore);
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

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
