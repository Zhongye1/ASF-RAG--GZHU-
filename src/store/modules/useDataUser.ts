import { defineStore } from 'pinia'
import { get, post } from '@/utils/ASFaxios'
import { Dialog, MessagePlugin } from 'tdesign-vue-next'

export const useDataUserStore = defineStore('dataUser', {
  state: () => {
    return {
      userData: {
        name: '未知',
        avatar: 'https://s2.loli.net/2025/02/02/ELbK6urJqYvgBPj.jpg',
        signatur: '未知'
      },

    }
  },

  actions: {
    async fetchUserData() {
      try {
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
