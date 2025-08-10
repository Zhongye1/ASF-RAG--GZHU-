<template>
  <t-header>
    <t-head-menu theme="light" :value="currentMenuItem" height="80px">
      <template #logo>
        <!-- <p class="text-xl font-bold text-blue-600">RAGF-01</p> -->
        <h2 class="logo-title font-bold text-blue-500 text-xl">{{ 'RAGF-01' }}</h2>
      </template>
      <t-menu-item value="item1" @click="navigateTo('/knowledge')" :class="$route.path === '/knowledge'">
        知识库
      </t-menu-item>
      <t-menu-item value="item2" @click="navigateTo('/chat')" :class="$route.path === '/chat'">
        对话
      </t-menu-item>
      <t-menu-item value="item3" @click="navigateTo('/service')" :class="$route.path === '/service'">
        模型管理
      </t-menu-item>
      <t-menu-item value="item5" @click="navigateTo('/files')" :class="$route.path === '/files'">
        文件管理
      </t-menu-item>
      <t-menu-item value="item4" @click="navigateTo('/user')" :class="$route.path.startsWith('/user')">
        个人主页
      </t-menu-item>
      <t-menu-item value="item6" @click="navigateTo('/DOC')" :class="$route.path === '/DOC'">
        开发文档
      </t-menu-item>
      <template #operations>
        <t-tooltip placement="bottom">
          <t-button theme="default" shape="square" variant="text" @click="navToGitHub">
            <t-icon name="logo-github" />
          </t-button>
        </t-tooltip>
        <t-tooltip placement="bottom">
          <t-button theme="default" shape="square" variant="text" @click="navToHelper">
            <t-icon name="help-circle" />
          </t-button>
        </t-tooltip>

        <t-tooltip placement="bottom">
          <t-button theme="default" shape="square" variant="text" @click="navigateTo('/knowledge')">
            <t-icon name="home" />
          </t-button>
        </t-tooltip>
        <t-tooltip placement="bottom">
          <t-button theme="default" shape="square" variant="text" @click="navToUser">
            <t-icon name="user" />
          </t-button>
        </t-tooltip>
        <t-tooltip placement="bottom">
          <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
            <setting-icon />
          </t-button>
        </t-tooltip>
      </template>
    </t-head-menu>
  </t-header>
  <t-drawer v-model:visible="drawerVisible" :header="'设置面板'" :footer="null" size="400px">
    <!-- 在这里挂载你的子组件 -->
    <your-child-component />
    <p>滚滚长江东逝水</p>
    <div class="text-center py-12">
      <t-icon name="info-circle" class="text-5xl text-blue-500 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">功能即将上线</h3>
      <p class="text-gray-500 max-w-md mx-auto">
        我们正在努力开发中，请耐心等待！
      </p>
    </div>
    <div class="grid grid-rows-1 md:grid-rows-3 gap-6 mt-8">
      <div class="border border-gray-200 rounded-lg p-5 text-center">
        <t-icon name="color-invert" class="text-3xl text-blue-500 mx-auto mb-3" />
        <h4 class="font-medium text-gray-900 mb-2">主题颜色</h4>
        <p class="text-sm text-gray-500">自定义界面主题颜色</p>
      </div>

      <div class="border border-gray-200 rounded-lg p-5 text-center">
        <t-icon name="layout" class="text-3xl text-blue-500 mx-auto mb-3" />
        <h4 class="font-medium text-gray-900 mb-2">布局选项</h4>
        <p class="text-sm text-gray-500">选择不同的界面布局</p>
      </div>

      <div class="border border-gray-200 rounded-lg p-5 text-center">
        <t-icon name="contrast" class="text-3xl text-blue-500 mx-auto mb-3" />
        <h4 class="font-medium text-gray-900 mb-2">深色模式</h4>
        <p class="text-sm text-gray-500">启用深色或浅色主题</p>
      </div>
    </div>
  </t-drawer>
</template>

<script setup lang="ts">
//import CanvasPoint from './canvas-point-unit/CanvasPoint.vue';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SettingIcon } from 'tdesign-icons-vue-next';
import { Drawer } from 'tdesign-vue-next';
const route = useRoute();
const router = useRouter();

const currentMenuItem = computed(() => {
  const path = route.path;

  if (path.startsWith('/chat')) {
    return 'item2';
  }
  //匹配特殊路由，因为类型问题把它拿出来了

  switch (path) {
    case '/knowledge':
      return 'item1';
    case '/service':
      return 'item3';
    case '/files':
      return 'item5';
    case '/DOC':
      return 'item6';
    default:
      // 处理所有以 /user 开头的路径
      if (path.startsWith('/user')) {
        return 'item4';
      }
      return '';
  }
});

const navigateTo = (path: string) => {
  router.push(path);
};

//import { useSettingStore } from '@/store';

//const settingStore = useSettingStore();

const navToGitHub = () => {
  window.open('https://github.com/Zhongye1');
};

const navToHelper = () => {
  window.open('https://tdesign.tencent.com/vue-next/overview');
  // 你的帮助页面链接
};
const navToUser = () => {
  router.push('/user/userInfo')
}


// 新增 toggleSettingPanel 方法
const drawerVisible = ref(false);
const toggleSettingPanel = () => {
  drawerVisible.value = !drawerVisible.value;
};

</script>