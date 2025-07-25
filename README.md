---

---

<p style="display:flex; justify-content: center">

## This is @RAGF-01

---

![img](https://picx.zhimg.com/v2-be2f934768146c9b1a020041e91ee5ad_r.jpg)

![img](https://pic2.zhimg.com/v2-d881ef1100a79c39cb648af9b9d6f529_r.jpg)

---

**栈：**（待补充）

[![My Skills](https://skillicons.dev/icons?i=python,nodejs,vue,tailwindcss,html,css,js,ts,fastapi,electron,mysql,docker,git,npm,eslint,anaconda,github,githubactions,figma,windows,ubuntu)](https://skillicons.dev)

### 目前实现的是前端功能，后端还在架构

有更好的建议可以找我

### Contributors 📋

这里补充代码仓库贡献者：

贴上自己信息

  <table>
    <tr>
      <td align="center">
        <a https://github.com/Zhongye1">
          <img src="https://avatars.githubusercontent.com/u/145737758?v=4" alt="Vaibhav" width="100" height="100" />
          <br />
          <strong>Gotoh Hitori</strong>
          <br />
          <em>GitHub: <a href="https://github.com/Zhongye1">@Zhongye1</a></em>
          <br />
          Contributions: Code 💻 <br>Documentation 📖
        </a>
      </td>
       <td align="center">
        <a https://github.com/ <ID>">
          <img src="https://avatars.githubusercontent.com/u/173872687?v=4" alt="GITHUB" width="100" height="100" />
          <br />
          <strong>褚喧</strong>
          <br />
          <em>GitHub: <a href="https://github.com/ourcx">褚喧</a></em>
          <br />
          Contributions: 正在贡献
        </a>
      </td>
      <td align="center">
        <a https://github.com/ <ID>">
          <img src="https://avatars.githubusercontent.com/u/222571036?s=400&u=254ac083b4d85e08dc7dee9d186624dfaa031614&v=4" alt="GITHUB" width="100" height="100" />
          <br />
          <strong>ZXT</strong>
          <br />
          <em>GitHub: <a href="https://github.com/haha-1205">ZXT</a></em>
          <br />
          Contributions: 贡献
        </a>
      </td>
      <td align="center">
        <a https://github.com/ <ID>">
          <img src="<Github头像url>" alt="GITHUB" width="100" height="100" />
          <br />
          <strong>GitHub-ID</strong>
          <br />
          <em>GitHub: <a href="https://github.com/<GITHUB-ID>">@GitHub-ID</a></em>
          <br />
          Contributions: 贡献
        </a>
      </td>
      <td align="center">
        <a https://github.com/ <ID>">
          <img src="https://avatars.githubusercontent.com/u/222624613?s=400&u=3778bd14e4e096302f3677074fe9c07545b18467&v=4" alt="GITHUB" width="100" height="100" />
          <br />
          <strong>A1r</strong>
          <br />
          <em>GitHub: <a href="https://github.com/z1pperexplorer">@z1pperexplorer</a></em>
          <br />
          Contributions: Contributing
        </a>
      </td>
    </tr>
  </table>



# RAGF-01 项目开发文档

本文档描述了 RAGF-01 项目的架构、页面和功能实现。

## 项目概述

RAGF-01 是一个基于 Vue 3 和 TDesign 组件库开发的 RAG（检索增强生成）前端框架，主要提供知识库管理、文档检索和 AI 对话等功能。

- **前端框架**：Vue 3
- **UI 组件库**：TDesign Vue Next
- **路由管理**：Vue Router
- **构建工具**：Vite
- **CSS 框架**：Tailwind CSS
- **TypeScript**

### 进行开发（前端）

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 提交指南

1. Fork 项目仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

### 就目前已有的页面而言，每个人在群里接龙领自己要做的模块，每天至少提交两次

## 项目结构

```
ASF-RAG/                         # 项目根目录
├── package.json                 # 项目依赖配置文件
├── postcss.config.js            # PostCSS 配置文件，用于CSS处理
├── public/                      # 静态资源目录
├── README.md                    # 项目说明文档
├── src/                         # 源代码目录
│   ├── App.vue                  # 应用程序主组件
│   ├── assets/                  # 静态资源目录
│   │   ├── styles/              # 样式文件目录
│   │   └── svg/                 # SVG 图标目录
│   ├── components/              # 组件目录
│   │   ├── chat-main-unit/      # 聊天主组件
│   │   │   ├── chat-main-unit.vue  # 聊天界面组件
│   │   │   └── sseRequest-reasoning.ts  # SSE请求与推理
│   │   ├── ERS-Pages/           # 错误页面组件
│   │   │   └── 404.vue          # 404错误页面
│   │   ├── knowledge-unit/      # 知识库组件
│   │   │   └── knowledge-cards.vue  # 知识卡片组件
│   │   ├── search-unit/         # 搜索组件
│   │   │   └── search.vue       # 搜索功能组件
│   │   └── T-HeadBar.vue        # 页面顶部导航栏组件
│   ├── main.ts                  # 应用程序入口文件
│   ├── router/                  # 路由配置目录
│   │   └── index.ts             # 路由配置文件
│   ├── views/                   # 视图页面目录
│   │   ├── Agent.vue            # 代理页面
│   │   ├── Chat.vue             # 聊天页面
│   │   ├── DOC.vue              # 文档页面，用于展示Markdown文档
│   │   ├── FileManagement.vue   # 文件管理页面
│   │   ├── KnowledgeBase.vue    # 知识库页面
│   │   ├── KnowledgeDetail.vue  # 知识库详情页面
│   │   └── Search.vue           # 搜索页面
│   ├── store/                   # 状态管理目录
│   │   ├── modules/             # 状态模块目录
│   │   └── index.ts             # 状态管理文件
│   └── vite-env.d.ts            # Vite环境类型声明文件
├── tailwind.config.js           # Tailwind CSS配置文件
├── tsconfig.json                # TypeScript配置文件
├── tsconfig.node.json           # Node环境下的TypeScript配置
└── vite.config.ts               # Vite构建工具配置文件

```

## 目前页面及功能 src/views

- ### 知识库（Knowledge Base）施工中 📋

  **目前实现了**

  1. **基础页面框架**

     - 知识库列表页面 (KnowledgeBase.vue) 的基本 UI 结构
     - 知识库详情页面 (KnowledgeDetail.vue) 的基本 UI 结构
     - 导航栏中的知识库入口

  2. **UI 组件**

     - 欢迎区域显示用户信息

     - 搜索框和创建知识库的选项

     - 知识卡片组件 (knowledge-cards.vue)

       ![img](https://pic2.zhimg.com/v2-b5e6163000d000cb7f01df92af8ed553_r.jpg)

  **未实现功能**

  1. **知识库列表页 (KnowledgeBase.vue)**

     - ~~搜索功能用于过滤知识库~~

     - 创建新知识库的功能，这里应该设计一个新的表单页，显示创建新知识库的各个选项

       ![img](https://picx.zhimg.com/80/v2-33ffc0b45685f29acdee4b0462597c51_720w.png)

  2. **知识库详情页 (KnowledgeDetail.vue)**

     - 数据集管理
       - ~~文件列表显示（名称、分块数、上传日期等信息）~~
       - 文件操作（选择、启用/禁用、删除）
       - 文件搜索和批量操作
       - 文件上传功能（支持 PDF、DOCX 和 TXT 格式）
       - 分页功能
     - 检索测试
       - 跨语言搜索（支持多种语言）
       - 测试查询输入框
       - ~~文件选择器（用于选择要测试的特定文件）~~
       - 测试结果显示（包括相似度分数和匹配内容）
     - 知识库设置
       - 知识库名称和描述的编辑
       - 删除知识库的功能
       - 保存设置的功能

  **这些功能目前只做了 UI，后端逻辑和数据交互尚未实现**

  ![img](https://picx.zhimg.com/80/v2-62e0c8025ff9d60e506fae3c59db615f_720w.png?source=d16d100b)

- ### 聊天（Chat）施工中 📋

  ![img](https://pica.zhimg.com/v2-b982906fb07aea6100b180c1c9689ba8_r.jpg)

### 目前的功能

1. 聊天功能
   - 聊天消息展示区域
   - 底部输入框组件
   - 模型选择下拉菜单
   - "深度思考"开关按钮
   - 回到底部按钮
2. **消息展示功能**
   - Markdown 渲染支持
   - 思考过程（推理过程）展示
   - 消息操作按钮（点赞、点踩、重新生成、复制）（这个具体逻辑还没做，只有 UI）
3. **基本交互功能**
   - 发送消息功能
   - 停止生成功能（通过按钮和 Ctrl+C 快捷键）
   - 清空聊天记录确认
   - 滚动到底部功能
   - 模型选择切换
4. **SSE 流式响应模拟**
   - 通过 `MockSSEResponse` 类实现的客户端模拟
   - 分阶段显示推理过程和内容
   - 模拟网络错误处理

目前要实现的功能：

![img](https://pic4.zhimg.com/v2-213b04b98eeac770e81800390145ce17_r.jpg)

1. **消息展示功能**
   - 消息操作按钮（点赞、点踩、重新生成、复制）（这个具体逻辑还没做，只有 UI）
2. ~~**基本交互功能**~~
   - ~~模型选择切换~~
   - ~~模型选择下拉菜单触发模型选择~~
   - ~~"深度思考"开关触发模型深度思考~~
3. ~~**SSE 流式响应**~~

~~目前要考虑接模型后端 API 进行对话，目前模型的回复为硬编码的预设结果~~

侧边栏对话历史管理，实现正确的新建对话功能

### 导航栏 (T-HeadBar.vue)

导航栏提供应用内主要功能的快速访问入口：

![img](https://pic2.zhimg.com/80/v2-c49b6d95809145a2e2e39ed97667aca7_720w.webp)

- 右侧工具菜单（GitHub 链接、帮助、设置、首页和用户的触发处理逻辑）（目前功能还在实现）
- 这一块要新增一个文档页面

![img](https://pica.zhimg.com/80/v2-886faf9509f6db51b747f7accef5a8aa_720w.webp)



### 搜索页面 (Search.vue) 施工中 📋

提供全局搜索功能，允许用户搜索整个知识库集合。

### 文件管理页面 (FileManagement.vue) 施工中 📋

提供对上传文件的集中管理功能。

### 智能代理页面 (Agent.vue) 施工中 📋

提供智能代理功能，可能用于自动执行特定任务。

## 特色功能

1. **流式对话响应**：使用 SSE（Server-Sent Events）模拟实现流式响应，在 chat-main-unit 中提供实时的对话反馈。
2. **推理过程展示**：通过"深度思考"开关，可以查看 AI 的推理过程，增强透明度和可解释性。

## # 后续开发

1. 实现用户认证和权限管理
2. 添加模型支持和参数配置
3. 实现文件处理能力，支持更多格式
4. 知识库管理：完整的知识库 CRUD 操作，支持文件上传、管理和检索测试。
5. 搜索功能：支持多语言环境下的文档检索，包括自动语言检测。
6. 分页和批量操作：针对大量文档提供高效的管理界面。
7. 群友们在这里写别的需求
8. 实现文档协作功能
9. 打包并支持 docker 部署或者封装为 electron 应用什么的
