<p style="display:flex; justify-content: center">

</p>
<p align="center">
  <a href="https://tdesign.tencent.com/vue-next/overview" target="_blank">
   <img alt="TDesign Logo" width="200" src="./public/tdesign-logo.svg"/>
  </a>
</p>

<p align="center">
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatility"></a>
  <a href="https://github.com/Tencent/tdesign-react-starter/blob/develop/LICENSE">
    <img src="https://img.shields.io/npm/l/tdesign-react.svg?sanitize=true" alt="License">
  </a>
</p>


# RAGF-01 项目开发文档

本文档描述了RAGF-01项目的架构、页面和功能实现。

## 项目概述

RAGF-01是一个基于Vue 3和TDesign组件库开发的RAG（检索增强生成）前端框架，主要提供知识库管理、文档检索和AI对话等功能。

## 技术栈

- **前端框架**：Vue 3
- **UI组件库**：TDesign Vue Next
- **路由管理**：Vue Router
- **构建工具**：Vite
- **CSS框架**：Tailwind CSS
- **TypeScript**：用于类型检查

## 项目结构

 复制 插入 新文件

```
├── src
│   ├── App.vue           # 应用入口组件
│   ├── assets            # 静态资源
│   ├── components        # 通用组件
│   ├── router            # 路由配置
│   ├── views             # 页面视图
│   └── main.ts           # 入口文件
```

## 已实现页面及功能

### 1. 导航栏 (T-HeadBar.vue)

导航栏提供应用内主要功能的快速访问入口：

- 知识库（Knowledge Base）
- 聊天（Chat）
- 搜索（Search）
- 智能代理（Agent）
- 文件管理（Files Manager）
- 开发文档（DOC）
- 右侧工具菜单（GitHub链接、帮助、设置、首页和用户）

### 2. 知识库列表页 (KnowledgeBase.vue)

显示所有可用的知识库集合：

- 欢迎区域显示用户信息
- 搜索功能用于过滤知识库
- 创建新知识库的按钮

### 3. 知识库详情页 (KnowledgeDetail.vue)

提供对单个知识库的管理功能：

- **数据集管理**：
  - 文件列表显示（支持名称、分块数、上传日期等信息）
  - 文件操作（选择、启用/禁用、删除）
  - 文件搜索和批量操作
  - 文件上传功能（支持PDF、DOCX和TXT格式）
  - 分页功能
- **检索测试**：
  - 跨语言搜索（支持多种语言）
  - 测试查询输入框
  - 文件选择器（用于选择要测试的特定文件）
  - 测试结果显示（包括相似度分数和匹配内容）
- **知识库设置**：
  - 知识库名称和描述的编辑
  - 删除知识库的功能
  - 保存设置的功能

### 4. 聊天页面 (Chat.vue)

提供与AI对话的界面：

- 左侧对话历史栏：
  - 显示所有对话会话
  - 创建新对话的功能
  - 会话选择功能
- 主聊天区域 (chat-main-unit.vue)：
  - 聊天消息展示
  - 消息输入框
  - 模型选择功能（GPT、Deepseek、混元）
  - "深度思考"开关（控制是否显示推理过程）
  - 停止生成功能
  - 文件上传和附件功能

### 5. 文档页面 (DOC.vue)

显示项目文档：

- Markdown格式的文档渲染
- 代码高亮显示
- 文档加载错误处理

### 6. 搜索页面 (Search.vue)

提供全局搜索功能，允许用户搜索整个知识库集合。

### 7. 文件管理页面 (FileManagement.vue)

提供对上传文件的集中管理功能。

### 8. 智能代理页面 (Agent.vue)

提供智能代理功能，可能用于自动执行特定任务。

## 特色功能

1. **流式对话响应**：使用SSE（Server-Sent Events）模拟实现流式响应，在chat-main-unit中提供实时的对话反馈。
2. **推理过程展示**：通过"深度思考"开关，可以查看AI的推理过程，增强透明度和可解释性。
3. **知识库管理**：完整的知识库CRUD操作，支持文件上传、管理和检索测试。
4. **跨语言搜索**：支持多语言环境下的文档检索，包括自动语言检测。
5. **分页和批量操作**：针对大量文档提供高效的管理界面。

## 开发指南

### 安装和启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 后续开发建议

1. 实现用户认证和权限管理
2. 添加更多模型支持和参数配置
3. 增强文件处理能力，支持更多格式
4. 实现文档协作功能
5. 优化移动端适配
