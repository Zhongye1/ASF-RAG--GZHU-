<template>
  <t-dialog
    header="编辑用户信息"
    :visible="visible"
    mode="modal"
    draggable
    :onConfirm="handleSubmit"
    :onCancel="closeDialog"
  >
    <div slot="body">
      <t-form-item label="用户名">
        <t-input v-model="formData.name" placeholder="请输入用户名" />
      </t-form-item>

      <t-form-item label="签名">
        <t-input v-model="formData.signatur" placeholder="请输入个人签名" />
      </t-form-item>

      <t-form-item label="头像">
        <t-input v-model="formData.avatar" placeholde="请输入头像地址" />
      </t-form-item>
      <div v-if="previewUrl" class="preview">
        <img :src="previewUrl" alt="头像预览" class="preview-img" />
      </div>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { defineStore } from 'pinia'
import { get, post } from '@/utils/ASFaxios'
import { Dialog, MessagePlugin } from 'tdesign-vue-next'

export const useDataUserStore = defineStore('dataUser', {
  state: () => {
    return {
      userData: {
        name: '未知',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?s=400&u=90eecb2edb0caf7cea2cd073d75270cbaa155cdf&v=4',
        signatur: '未知'
      },

    }
  },

  actions: {
    async fetchUserData() {
      try {
        // 先获取当前用户信息
        const userResponse = await get<any>('/api/users/me');
        if (userResponse.status === "success") {
          // 可以根据需要获取更多用户信息
          // 这里暂时使用默认数据，后续可以根据需要扩展
          console.log('User info:', userResponse.user);
        }
        // 保持现有逻辑，但可以添加更多用户信息
        const response = await get<any>('/api/GetUserData')
        this.userData = response.data
        console.log('API Response:', response.data)
      } catch (error) {
        MessagePlugin.error('获取用户数据失败！')
      }
    },
    async updateUserData(name: string, avatar: string, signatur: string) {
      try {
        const data = new FormData()
        data.append('name', name)
        data.append('avatar', avatar)
        data.append('signatur', signatur)
        const response = await post<any>('/api/UpdateUserData', data)
        MessagePlugin.success('更新用户数据成功！')
        this.userData = response.data
        console.log('API Response:', response.data)
      } catch (error) {
        MessagePlugin.error('更新用户数据失败！')

      }
    }
  }
})
</script>

<style scoped>
.preview {
  margin-top: 10px;
}
.preview-img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 50%;
}
</style>
