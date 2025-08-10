<template>
  <div class="p-6">
    <!-- 基本信息 -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        基本信息
      </h2>

      <div class="flex flex-col md:flex-row items-start gap-8">
        <!-- 头像区域 -->
        <div class="flex flex-col items-center w-48 md:w-64">
          <t-avatar :image="userInfo.avatar" :hide-on-load-failed="false" size="x-large"
            class="w-32 h-32 md:w-48 md:h-48" />
          <t-button class="mt-3" variant="outline" size="small">
            <template #icon>
              <t-icon name="edit" />
            </template>
            更改头像
          </t-button>
        </div>

        <!-- 基础信息 -->
        <div class="flex-1 w-full">
          <t-form label-align="left" :data="userInfo" @submit="onSubmit">
            <t-form-item label="姓名">
              <t-input v-model="userInfo.name" placeholder="请输入您的姓名" />
            </t-form-item>
            <t-form-item label="公开邮箱">
              <t-select v-model="userInfo.publicEmail" placeholder="请选择要显示的已验证邮箱">
                <t-option v-for="email in emails" :value="email" :label="email"></t-option>
              </t-select>
            </t-form-item>
            <t-form-item label="个人简介">
              <t-textarea v-model="userInfo.bio" placeholder="简单介绍一下自己" />
            </t-form-item>

            <t-form-item label="个人网站">
              <t-input v-model="userInfo.url" placeholder="请输入您的网站地址" />
            </t-form-item>
            <t-form-item>
              <t-button theme="primary" type="submit">保存</t-button>
            </t-form-item>
          </t-form>
        </div>
      </div>
    </section>

    <!-- 用户体验改进 -->
    <section class="mb-8 p-5 bg-blue-50 rounded-lg border border-blue-100">
      <div class="flex items-start">
        <div class="flex-shrink-0 mt-0.5">
          <div class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">用户体验改善计划</h3>
          <p class="text-sm text-blue-700 mt-1">
            加入我们的用户体验改善计划，帮助我们提供更好的产品体验。您的反馈对我们非常重要。
          </p>
          <div class="mt-3 flex items-center">
            <t-switch v-model="uxImprovement" size="small" />
            <span class="ml-2 text-sm text-blue-700">加入用户体验改善计划</span>
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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 class="text-gray-900 font-medium">开发模式</h3>
            <p class="text-gray-500 text-sm mt-1">选择您的开发工作流程</p>
          </div>
          <div class="mt-2 sm:mt-0 w-full sm:w-auto">
            <t-select v-model="userInfo.devMode" :options="devModeOptions" class="w-full sm:w-64" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 class="text-gray-900 font-medium">默认语言</h3>
            <p class="text-gray-500 text-sm mt-1">设置界面显示语言</p>
          </div>
          <div class="mt-2 sm:mt-0 w-full sm:w-auto">
            <t-select v-model="userInfo.language" :options="languageOptions" class="w-full sm:w-64" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100">
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
      <h2 class="text-xl font-semibold text-gray-900 mb-6">危险操作</h2>

      <div class="border border-red-200 rounded-lg p-5 bg-red-50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h3 class="text-gray-900 font-medium">账号注销</h3>
            <p class="text-gray-600 text-sm mt-1">
              注销后所有数据将被永久删除，请谨慎操作。
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
  name: 'mmk',
  publicEmail: '',
  bio: '',
  url: 'https://zhongye1.github.io/',
  devMode: 'default',
  language: 'zh-CN'
});

const emails = ref(['example@example.com', 'test@test.com']);

const devModeOptions = [
  { label: '默认', value: 'default' },
  { label: '高级', value: 'advanced' }
];

const languageOptions = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
];

const onSubmit = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    console.log('表单提交成功');
  } else {
    console.error('表单验证失败:', firstError);
  }
};
</script>