<template>
  <div class="p-6">
    <!-- 头像与基本信息 -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        基本信息
      </h2>

      <div class="flex flex-col md:flex-row items-start gap-6">
        <!-- 头像区域 -->
        <div class="flex flex-col items-center">
          <div class="relative group">
            <img
              :src="userInfo.avatar"
              alt="用户头像"
              class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div
              class="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div
                class="w-11 h-11 bg-t-primary rounded-full flex items-center justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 基础信息 -->
        <div class="flex-1 w-full">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-sm text-gray-500">昵称</h3>
                  <p class="text-gray-900 font-medium mt-1">{{ userInfo.nickname }}</p>
                </div>
                <t-button theme="primary" variant="outline" size="small">编辑</t-button>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-sm text-gray-500">密码</h3>
                  <p class="text-gray-900 font-medium mt-1">{{ userInfo.password }}</p>
                </div>
                <t-button theme="primary" variant="outline" size="small">修改</t-button>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-sm text-gray-500">邮箱</h3>
                  <p class="text-gray-900 font-medium mt-1">{{ userInfo.email }}</p>
                </div>
                <t-button theme="primary" variant="outline" size="small">绑定</t-button>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-sm text-gray-500">手机号</h3>
                  <p class="text-gray-900 font-medium mt-1">{{ userInfo.phone }}</p>
                </div>
                <t-button theme="primary" variant="outline" size="small">绑定</t-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="mt-6 pt-6 border-t border-gray-100">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-medium text-gray-900">个人简介</h3>
        </div>
        <div class="border border-gray-200 rounded-lg p-4 min-h-[100px]">
          <p class="text-gray-500 text-sm" v-if="!userInfo.bio">暂无个人简介</p>
          <p class="text-gray-700 text-sm" v-else>{{ userInfo.bio }}</p>
        </div>
        <div class="flex justify-end mt-6">
          <t-button theme="primary" variant="outline">保存</t-button>
        </div>
      </div>
    </section>

    <!-- 用户体验改进 -->
    <section class="mb-8 p-5 bg-blue-50 rounded-lg border border-blue-100">
      <div class="flex items-start">
        <div class="flex-shrink-0 mt-0.5">
          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">用户体验改进计划</h3>
          <p class="text-sm text-blue-700 mt-1">
            加入我们的用户体验改进计划，帮助我们提供更好的产品体验。您的反馈对我们非常重要。
          </p>
          <div class="mt-3 flex items-center">
            <t-switch v-model="uxImprovement" size="small" />
            <span class="ml-2 text-sm text-blue-700">加入用户体验改进计划</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 其他设置 -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        偏好设置
      </h2>

      <div class="space-y-5">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100"
        >
          <div>
            <h3 class="text-gray-900 font-medium">开发模式</h3>
            <p class="text-gray-500 text-sm mt-1">选择您的开发工作流程</p>
          </div>
          <div class="mt-2 sm:mt-0 w-full sm:w-auto">
            <t-select
              v-model="userInfo.devMode"
              :options="devModeOptions"
              class="w-full sm:w-64"
            />
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100"
        >
          <div>
            <h3 class="text-gray-900 font-medium">默认语言</h3>
            <p class="text-gray-500 text-sm mt-1">设置界面显示语言</p>
          </div>
          <div class="mt-2 sm:mt-0 w-full sm:w-auto">
            <t-select
              v-model="userInfo.language"
              :options="languageOptions"
              class="w-full sm:w-64"
            />
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100"
        >
          <div>
            <h3 class="text-gray-900 font-medium">通知设置</h3>
            <p class="text-gray-500 text-sm mt-1">管理您接收的通知类型</p>
          </div>
          <div class="mt-2 sm:mt-0">
            <t-button theme="primary" variant="outline" size="small">配置</t-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 危险区域 -->
    <section class="pt-6 border-t border-gray-100">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Danger Zone</h2>

      <div class="border border-red-200 rounded-lg p-5 bg-red-50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h3 class="text-gray-900 font-medium">注销账号</h3>
            <p class="text-gray-600 text-sm mt-1">
              注销后所有数据将被永久删除，请谨慎操作
            </p>
          </div>
          <div class="mt-3 sm:mt-0">
            <t-button theme="danger" variant="outline" size="small">注销账号</t-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup lang="ts">

import { ref } from 'vue';
import { Icon as TIcon } from 'tdesign-icons-vue-next';
// 用户体验改进计划开关
const uxImprovement = ref(true);

// 用户信息（模拟数据）
const userInfo = ref({
  avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
  nickname: '柊野',
  password: '********',
  email: '未绑定',
  phone: '未绑定',
  role: '全栈工程师',
  devMode: '先写API文档，再写代码',
  language: '中文',
  bio: ''
});



const devModeOptions = [
  { label: '先写API文档，再写代码', value: '先写API文档，再写代码' },
  { label: '先写代码，再补文档', value: '先写代码，再补文档' },
];

const languageOptions = [
  { label: '中文', value: '中文' },
  { label: 'English', value: 'English' },
];

</script>