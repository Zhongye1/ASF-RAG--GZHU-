// store/modules/user.ts
import { defineStore } from 'pinia'

export interface CardDataType {
  id: string
  title: string
  avatar: string
  description: string
  createdTime: string
  cover: string
}



export const useCardDataStore = defineStore('CardData', {
  state: () => ({
    allCards: [
      {
        id: 'asf-m1',
        title: 'AAJ2-M1',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介1',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://picx.zhimg.com/80/v2-381cc3f4ba85f62cdc483136e5fa4f47_720w.webp?source=d16d100b'
      },
      {
        id: 'asf-m2',
        title: 'ADWASF-M2',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介2',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://picx.zhimg.com/80/v2-169845f4c08de8134b312c3986eace33_720w.webp?source=d16d100b'
      },
      {
        id: 'asf-m3',
        title: 'BSF-MWWA3',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介3',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp'
      },
      {
        id: 'asf-m1',
        title: 'XXAWASF-M1',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介1',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://picx.zhimg.com/80/v2-381cc3f4ba85f62cdc483136e5fa4f47_720w.webp?source=d16d100b'
      }, 
      {
        id: 'asf-m2',
        title: 'ASF-M2122',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介2',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp'
      },
      {
        id: 'asf-m2',
        title: 'ASF-M2',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介2',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://picx.zhimg.com/80/v2-169845f4c08de8134b312c3986eace33_720w.webp?source=d16d100b'
      },
      {
        id: 'asf-m3',
        title: '编译原理',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介3',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp'
      },
      {
        id: 'DFA-1',
        title: '支持向量机',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介1',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://picx.zhimg.com/80/v2-381cc3f4ba85f62cdc483136e5fa4f47_720w.webp?source=d16d100b'
      },
      {
        id: '213212',
        title: '有限自动机',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介2',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp'
      },
      {
        id: 'asf-m3',
        title: 'ASF-M3',
        avatar: 'https://avatars.githubusercontent.com/u/145737758?v=4',
        description: '简介3',
        createdTime: '1970-01-01 00.00.00',
        cover:
          'https://pic2.zhimg.com/80/v2-fe88022d1ddd727c237dec5cc1706e47_720w.webp'
      }
      // 其他卡片数据
    ],
    searchKeyword: ''
  }),
  actions: {
    //根据关键字筛选数组的内容
    filterCardData (keyword: string) {
      console.log(keyword)
      this.searchKeyword = keyword;
    },
    resetFilters() {
      this.searchKeyword = '';
    },
    // 添加新卡片
    addCard(card: CardDataType) {
      this.allCards.push(card);
    },
    // 删除卡片
    deleteCard(cardId: string) {
      this.allCards = this.allCards.filter(card => card.id !== cardId);
      //等待后端实现
    },
  },
  getters: {
    filteredCards(state): CardDataType[] {
      if (!state.searchKeyword.trim()) {
        return state.allCards;
      }
      const keyword = state.searchKeyword.toLowerCase();
      return state.allCards.filter(card =>
        card.title.toLowerCase().includes(keyword)
      );
    }
  }
})
