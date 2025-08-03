import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import KnowledgeBase from '../views/KnowledgePages/KnowledgeBase.vue';
import NotFound from '../components/ERS-Pages/404.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/knowledge'
  },
  {
    path: '/knowledge',
    name: 'KnowledgeBase',
    component: KnowledgeBase
  },
  {
    path: '/knowledge/knowledgeDetail/:id',
    name: 'KnowledgeDetail',
    component: () => import('../views/KnowledgePages/KnowledgeDetail.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/Chat.vue')
  },
  {
    path: '/chat/:id',
    name: 'chatID',
    component: () => import('../views/Chat.vue')
  },
  {
    path: '/service',
    name: 'Search',
    component: () => import('../views/Ollama_Pages/ollama_basic_pages.vue')
  },
  {
    path: '/agent',
    name: 'Agent',
    component: () => import('../views/Agent.vue')
  },
  {
    path: '/files',
    name: 'FileManagement',
    component: () => import('../views/FileManagement.vue')
  },
  {
    path: '/DOC',
    name: '开发文档',
    component: () => import('../views/DOC.vue')
  },
  // 添加专门的404页面路由
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '页面未找到'
    }
  },

  // 捕获所有未匹配的路由并重定向到404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

