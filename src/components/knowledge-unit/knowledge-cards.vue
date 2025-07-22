<template>
  <t-card 
    title="标题" 
    :description="props.card.description" 
    :style="{ width: '400px' }"
    @click="handleClick"
  >
    <!-- 使用 cover 插槽来自定义封面 -->
    <template #cover>
      <img 
        :src="props.card.cover" 
        class="knowledge-card-image" 
      />
    </template>

    <template #avatar>
      <t-avatar :image="props.card.avatar" size="56px"></t-avatar>
    </template>

    <template #actions>
      <t-dropdown :options="options" :min-column-width="112" @click="clickHandler">
        <div class="tdesign-demo-dropdown-trigger">
          <t-button variant="text" shape="square"  @click.stop>
            <more-icon />
          </t-button>
        </div>
      </t-dropdown>
    </template>

    <template #footer>
      <div class="knowledge-card-footer-buttonlists" @click.stop>
        <t-button variant="text" shape="square" :style="{ 'margin-right': '8px' }">
          <heart-icon />
        </t-button>
        <t-button variant="text" shape="square" :style="{ 'margin-right': '8px' }">
          <chat-icon />
        </t-button>
        <t-button variant="text" shape="square">
          <share-icon />
        </t-button>
      </div>
    </template>
  </t-card>
</template>

<script lang="tsx" setup>
import { MessagePlugin, CardProps, DropdownProps } from 'tdesign-vue-next';
import { HeartIcon, ChatIcon, ShareIcon, MoreIcon } from 'tdesign-icons-vue-next';

const options: DropdownProps['options'] = [
  {
    content: '操作一',
    value: 1,
  },
  {
    content: '操作二',
    value: 2,
  },
];

const props = defineProps<{
  card: {
    avatar: string;
    description: string;
    cover: string;
  };
  goToDetail: Function;
}>();


const handleClick = () => {
  // 调用父组件传递的 goToDetail 方法
  MessagePlugin.success('点击了卡片');
};
const clickHandler: DropdownProps['onClick'] = (data) => {
  MessagePlugin.success(`选中【${data.content}】，这里到时候要实现的功能是增加或删除卡片`);
};
</script>
<style scoped>
.knowledge-card-footer-buttonlists {
  display: flex;
  justify-content: space-between;
  width: 30%;
  transition: background-color 0.3s ease;
  border-radius: 3px;
}

.knowledge-card-footer-buttonlists:hover {
  background-color: #d4d4d47e; /* 悬停时的背景色 */
}

.knowledge-card-image {
  width: 100%;
  height: 200px;
  object-fit: cover; /* 超出部分进行裁剪 */
}

</style>
