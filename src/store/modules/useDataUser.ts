import { defineStore } from 'pinia'
import { get, post } from '@/utils/ASFaxios'
import { Dialog, MessagePlugin } from 'tdesign-vue-next'

export const useDataUserStore = defineStore('dataUser', {
  state: () => {
    return {
      userData: {
        name: '未知',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?s=400&u=90eecb2edb0caf7cea2cd073d75270cbaa155cdf&v=4',
        signatur: '未知',
        email: '' // 添加 email 字段
      },

    }
  },

  actions: {
    async fetchUserData() {
      try {
        const response = await get<any>('/api/user/GetUserData')
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
        const response = await post<any>('/api/user/UpdateUserData', data)
        MessagePlugin.success('更新用户数据成功！')
        this.userData = response.data
        console.log('API Response:', response.data)
      } catch (error) {
        MessagePlugin.error('更新用户数据失败！')

      }
    }
  }
})