<template>
  <div class="user-profile-container">
    <t-card :bordered="true" hover-shadow class="user-profile-card">
      <t-space direction="vertical" size="large" style="width: 100%">
        <t-space align="center" size="large">
          <t-avatar size="100px">W</t-avatar>
          <t-space direction="vertical" size="small">
            <div class="user-profile-name">Wang</div>
            <div class="user-profile-username">@wang_dev</div>
            <div class="user-profile-description">我是一个sb</div>
          </t-space>
        </t-space>

        <t-divider />

        <t-descriptions bordered column="1" title="个人信息">
          <t-descriptions-item label="邮箱">wang.dev@example.com</t-descriptions-item>
          <t-descriptions-item label="电话">188-8888-8888</t-descriptions-item>
          <t-descriptions-item label="地区">中国，北京</t-descriptions-item>
          <t-descriptions-item label="头像">输入头像url</t-descriptions-item>
          <t-descriptions-item label="简介">
            <t-tag>Vue Developer</t-tag>
            <t-tag>TDesign Enthusiast</t-tag>
          </t-descriptions-item>
        </t-descriptions>

        <t-space>
          <t-button theme="primary">编辑资料</t-button>
          <t-button variant="outline">更多操作</t-button>
        </t-space>
      </t-space>
    </t-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.user-profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f0f2f5;
  min-height: 100vh;
  margin-top: 10px;
}

.user-profile-card {
  width: 100%;
  max-width: 600px;
  height: 100%;
}

.user-profile-name{
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: center;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: normal;
    word-break: break-all;
    overflow: hidden;
}

.user-profile-username{
    font-size: 16px;
    color: #666;
    text-align: center;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: normal;
    word-break: break-all;
    overflow: hidden;
}

.user-profile-description{
    font-size: 14px;
    color: #999;
    text-align: center;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: normal;
    word-break: break-all;
    overflow: hidden;
    margin-bottom: 10px;
}
</style>
