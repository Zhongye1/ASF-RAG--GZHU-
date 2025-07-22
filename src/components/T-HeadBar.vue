<template>
  <t-header>
    <t-head-menu theme="light" :value="currentMenuItem" height="80px">
      <template #logo>
        <p class="text-xl font-bold text-blue-600">RAGF-01</p>
      </template>
      <t-menu-item value="item1" @click="navigateTo('/knowledge')" :class="$route.path === '/knowledge'">
        Knowledge Base
      </t-menu-item>
      <t-menu-item value="item2" @click="navigateTo('/chat')" :class="$route.path === '/chat'">
        Chat
      </t-menu-item>
      <t-menu-item value="item3" @click="navigateTo('/search')" :class="$route.path === '/search'">
        Search
      </t-menu-item>
      <t-menu-item value="item4" @click="navigateTo('/agent')" :class="$route.path === '/agent'">
        Agent
      </t-menu-item>
      <t-menu-item value="item5" @click="navigateTo('/files')" :class="$route.path === '/files'">
        Files Manager
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
          <t-button theme="default" shape="square" variant="text" @click="toggleSettingPanel">
            <setting-icon />
          </t-button>
        </t-tooltip>
        <t-tooltip placement="bottom">
          <t-button theme="default" shape="square" variant="text" @click="navigateTo('/knowledge')">
            <t-icon name="home" />
          </t-button>
        </t-tooltip>
        <t-tooltip placement="bottom">
          <t-button theme="default" shape="square" variant="text" @click="navToHelper">
            <t-icon name="user" />
          </t-button>
        </t-tooltip>
      </template>




    </t-head-menu>
  </t-header>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SettingIcon } from 'tdesign-icons-vue-next';
const route = useRoute();
const router = useRouter();

const currentMenuItem = computed(() => {
  switch (route.path) {
    case '/knowledge':
      return 'item1';
    case '/chat':
      return 'item2';
    case '/search':
      return 'item3';
    case '/agent':
      return 'item4';
    case '/files':
      return 'item5';
    default:
      return 'item1';
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

//const toggleSettingPanel = () => {
//  settingStore.updateConfig({
//    showSettingPanel: !settingStore.showSettingPanel,
//  });
//};

</script>
