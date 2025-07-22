<template>
  <t-config-provider :global-config="{ classPrefix: 't' }">
    <div class="app-container">
      <!-- 应用导航栏 -->
      <app-navbar class="navbar"/>
      
      <!-- 路由视图 -->
      <router-view class="router-view"/>
    </div>
  </t-config-provider>
</template>

<script setup lang="ts">
import AppNavbar from './components/AppNavbar.vue';

</script>

<style>
.app-container {
  background-color: #f9fafb;
}
.navbar {
  height: 8vh; /* 设置导航栏高度 */
}
.router-view {
  height: 92vh; /* 设置路由视图高度 */
}
</style>
