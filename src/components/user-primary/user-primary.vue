<template>
  <div class="p-6">
    <div v-if="isLoading" class="loading-overlay">
      <t-loading text="数据加载中..." size="large"></t-loading>
    </div>

    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
        基本信息
      </h2>

      <div class="flex flex-col md:flex-row items-start gap-8">
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

        <div class="flex-1 w-full">
          <t-form ref="formRef" label-align="left" :data="userInfo" @submit="onSubmit">
            <t-form-item label="姓名" name="name">
              <t-input v-model="userInfo.name" placeholder="请输入您的姓名" />
            </t-form-item>
            <t-form-item label="公开邮箱" name="publicEmail">
              <t-input v-model="userInfo.publicEmail" placeholder="公开的邮箱地址" :disabled="true" />
            </t-form-item>
            <t-form-item label="个人简介" name="bio">
              <t-textarea v-model="userInfo.bio" placeholder="简单介绍一下自己" />
            </t-form-item>
            <t-form-item label="社交账号" name="url">
              <t-input v-model="userInfo.url" placeholder="社交账号地址" />
            </t-form-item>
            <t-form-item>
              <t-button theme="primary" type="submit">保存</t-button>
            </t-form-item>
          </t-form>
        </div>
      </div>
    </section>

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
            <t-switch v-model="uxImprovement" size="small" @change="onUxImprovementChange" />
            <span class="ml-2 text-sm text-blue-700">加入用户体验改善计划</span>
          </div>
        </div>
      </div>
    </section>

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
            <t-select v-model="userInfo.devMode" :options="devModeOptions" class="w-full sm:w-64"
              @change="onDevModeChange" />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 class="text-gray-900 font-medium">默认语言</h3>
            <p class="text-gray-500 text-sm mt-1">设置界面显示语言</p>
          </div>
          <div class="mt-2 sm:mt-0 w-full sm:w-auto">
            <t-select v-model="userInfo.language" :options="languageOptions" class="w-full sm:w-64"
              @change="onLanguageChange" />
          </div>
        </div>
      </div>
    </section>

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
            <t-button theme="danger" variant="outline" size="small" @click="onDeleteAccount">注销账号</t-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useDataUserStore } from '@/store/modules/useDataUser';
import { storeToRefs } from 'pinia';
import { Icon as TIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, Dialog } from 'tdesign-vue-next';
import type { SubmitContext, FormInstanceFunctions } from 'tdesign-vue-next';
import { get, put, del, post } from '@/utils/ASFaxios';

const userStore = useDataUserStore();
const { profile, email, isLoading } = storeToRefs(userStore);


const userInfo = reactive({
  avatar: '',
  name: '',
  publicEmail: '',
  bio: '',
  url: '', // 注意: `url` 字段目前只存在于前端
  devMode: 'default',
  language: 'zh-CN'
});


const formRef = ref<FormInstanceFunctions | null>(null);


watch(
  // 监听多个源
  [profile, email],
  ([newProfile, newEmail]) => {
    userInfo.name = newProfile.name;
    userInfo.avatar = newProfile.avatar;
    userInfo.bio = newProfile.signature; 
    userInfo.publicEmail = newEmail;
  },
  {
    deep: true,
    immediate: true,
  }
);


onMounted(async() => {
  // 如果 store 中还没有用户数据，则去获取
  if (!userStore.profile.user_id) {
    userStore.fetchUserData().catch(error => {
      MessagePlugin.error(`获取用户数据失败: ${error.message || '请检查网络或重新登录'}`);
    });
  }
  userInfo.publicEmail = localStorage.getItem("email")!;
  const token = localStorage.getItem('jwt');
  
  // 创建表单数据
  const formData = new FormData();
  formData.append('name', '未知');
  formData.append('signature', '未知');
  formData.append('avatar', "");
  formData.append('social_media', 'https://github.com/ourcx');
  try {
    const response = await post('/api/user/api/init', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    
    console.log('资料创建成功:', response);
  } catch (error) {
      console.error('错误:', error);
  }
});


// 表单提交事件
const onSubmit = async ({ validateResult }: SubmitContext) => {
  if (validateResult === true) {
    try {
      await userStore.updateUserData(
        userInfo.name,
        userInfo.bio, // 传递本地的 bio
        userInfo.avatar
      );
      MessagePlugin.success('保存成功');
    } catch (error: any) {
      MessagePlugin.error(`保存失败: ${error.message || '未知错误'}`);
    }
  } else {
    MessagePlugin.warning('请检查表单填写是否正确');
  }
};

// 注销账号事件
const onDeleteAccount = () => {
  Dialog.confirm({
    header: '确认注销',
    body: '确定要注销账号吗？注销后所有数据将被永久删除，无法恢复。',
    confirmBtn: { theme: 'danger', content: '确认注销' },
    onConfirm: async () => {
      try {
        await userStore.deleteAccount();
        MessagePlugin.success('账号注销成功，即将跳转到登录页面');
      } catch (error: any) {
        MessagePlugin.error(`注销失败: ${error.message || '未知错误'}`);
      }
    },
  });
};


const uxImprovement = ref(true);
const devModeOptions = [{ label: '默认', value: 'default' }, { label: '高级', value: 'advanced' }];
const languageOptions = [{ label: '中文', value: 'zh-CN' }, { label: 'English', value: 'en-US' }];

const onUxImprovementChange = (value: boolean) => {
  MessagePlugin.success(`已${value ? '加入' : '退出'}用户体验改善计划`);
};
const onDevModeChange = (value: string) => {
  MessagePlugin.success(`开发模式已更新为: ${value === 'default' ? '默认' : '高级'}`);
};
const onLanguageChange = (value: string) => {
  MessagePlugin.success(`语言已切换为: ${value === 'zh-CN' ? '中文' : 'English'}`);
};
</script>

