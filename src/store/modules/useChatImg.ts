import { defineStore } from 'pinia'
import { get, post } from '@/utils/ASFaxios'
import { Dialog, MessagePlugin } from 'tdesign-vue-next'

export const useChatImgtore = defineStore('chatImg', {
  state: () => ({
    uploadedImage: null, // 存储上传的图片 Data URL
    images: [] as any // 存储多张图片（如果需要）
  }),

  actions: {
    // 添加新图片
    addImage (dataUrl: any) {
      this.uploadedImage = dataUrl
      this.images.push(dataUrl)
    },

    // 清除图片
    clearImage () {
      this.uploadedImage = null
    }
  }
})
