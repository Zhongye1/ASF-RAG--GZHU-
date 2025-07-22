<template>
  <div class="search-box">
    <input
      v-model="searchKeyword"
      type="text"
      placeholder="请输入搜索关键词"
      class="search-input"
      @keyup.enter="handleSearch"
    />
    <button class="search-button" @click="handleSearch">搜索</button>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

// 搜索关键词
const searchKeyword = ref('');

// 搜索处理函数
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    MessagePlugin.warning('请输入搜索关键词');
    return;
  }

  // 执行搜索逻辑，比如调用接口、过滤列表等
  console.log('搜索关键词:', searchKeyword.value);
  MessagePlugin.success(`正在搜索：“${searchKeyword.value}”`);
  
  // 实际项目里搜索接口是异步的，所以这里使用 await 等待接口返回结果，实际项目里的形式为：
  // await searchKnowledge(searchKeyword.value);
  // 过滤本地列表数据
};
</script>
<style scoped>
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  width: 300px;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  height: 100%;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #007bff;
}

.search-button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
    height: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #0056b3;
}
</style>
