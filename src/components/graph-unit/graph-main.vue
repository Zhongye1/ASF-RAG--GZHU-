<template>
    <div class="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200">
        <!-- 图谱头部控制栏 -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center space-x-4">
                <h3 class="text-lg font-semibold text-gray-800">知识图谱</h3>
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        节点: {{ graphData.metadata?.total_nodes || 0 }}
                    </span>
                    <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        边: {{ graphData.metadata?.total_edges || 0 }}
                    </span>
                </div>
            </div>

            <!-- 控制按钮组 -->
            <div class="flex items-center space-x-2">
                <button @click="resetLayout"
                    class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    重置布局
                </button>
                <button @click="toggleLayout"
                    class="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                    {{ isForceLayout ? '环形布局' : '力导向布局' }}
                </button>
                <button @click="refreshGraph" :disabled="loading"
                    class="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50">
                    <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    <span v-else>刷新</span>
                </button>
            </div>
        </div>

        <!-- 图谱主体区域 -->
        <div class="relative flex-1">
            <!-- 加载状态 -->
            <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p class="text-gray-600">加载图谱数据中...</p>
                </div>
            </div>

            <!-- Sigma图谱容器 -->
            <div ref="sigmaContainer" class="w-full h-screen bg-white" :class="{ 'opacity-30': loading }">
        </div>

        <!-- 图例 -->
        <div class="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 border border-gray-200">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">图例</h4>
            <div class="space-y-1 text-xs">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span class="text-gray-600">人物角色</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <span class="text-gray-600">情感状态</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span class="text-gray-600">其他概念</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 节点详情面板 -->
    <div v-if="selectedNode" class="border-t border-gray-200 bg-gray-50 p-4">
        <div class="flex items-start justify-between">
            <div class="flex-1">
                <h4 class="text-lg font-semibold text-gray-800">{{ selectedNode.label }}</h4>
                <p class="text-sm text-gray-600 mt-1">类型: {{ getNodeTypeLabel(selectedNode.type) }}</p>
                <div v-if="selectedNode.attributes" class="mt-2">
                    <p class="text-sm font-medium text-gray-700">属性:</p>
                    <div class="mt-1 space-y-1">
                        <span v-for="(value, key) in selectedNode.attributes" :key="key"
                            class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full mr-1">
                            {{ key }}: {{ value }}
                        </span>
                    </div>
                </div>
                <p class="text-xs text-gray-500 mt-2">文档ID: {{ selectedNode.document_id }}</p>
            </div>
            <button @click="selectedNode = null" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import Sigma from 'sigma'
import Graph from 'graphology'
import { circular } from 'graphology-layout'
import forceAtlas2 from 'graphology-layout-forceatlas2'


import axios from 'axios'

// 类型定义
interface GraphNode {
    id: string
    label: string
    type: string
    attributes?: Record<string, any>
    document_id: string
}

interface GraphEdge {
    source: string
    target: string
    type: string
    weight: number
}

interface GraphData {
    nodes: GraphNode[]
    edges: GraphEdge[]
    metadata: {
        total_nodes: number
        total_edges: number
    }
}

// 响应式数据
const sigmaContainer = ref<HTMLElement | null>(null)
const loading = ref(false)
const selectedNode = ref<GraphNode | null>(null)
const isForceLayout = ref(true)
const graphData = ref<GraphData>({
    nodes: [],
    edges: [],
    metadata: { total_nodes: 0, total_edges: 0 }
})

// Sigma实例
let sigmaInstance: Sigma | null = null
let graph: Graph | null = null


// 获取边颜色
const getEdgeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
        'has_emotion': '#EF4444',     // 红色
        'related_to': '#10B981',      // 绿色
        'belongs_to': '#3B82F6',      // 蓝色
        'interact_with': '#F59E0B',   // 黄色
        'default': '#D1D5DB'          // 灰色
    }
    return colorMap[type] || colorMap.default
}

// 获取边标签
const getEdgeLabel = (type: string): string => {
    const labelMap: Record<string, string> = {
        'has_emotion': '具有情感',
        'related_to': '相关',
        'belongs_to': '属于',
        'interact_with': '交互',
        'default': '关联'
    }
    return labelMap[type] || labelMap.default
}

// 节点颜色映射
const getNodeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
        'character': '#3B82F6', // 蓝色
        'emotion': '#EF4444',   // 红色
        'concept': '#10B981',   // 绿色
        'default': '#6B7280'    // 灰色
    }
    return colorMap[type] || colorMap.default
}

// 获取节点类型标签
const getNodeTypeLabel = (type: string): string => {
    const labelMap: Record<string, string> = {
        'character': '人物角色',
        'emotion': '情感状态',
        'concept': '概念',
        'default': '其他'
    }
    return labelMap[type] || labelMap.default
}

// 获取图谱数据
const fetchGraphData = async (): Promise<void> => {
    try {
        loading.value = true
        console.log('开始获取图谱数据...')

        const response = await axios.get<GraphData>('/api/graph/graph-data')
        graphData.value = response.data

        console.log('图谱数据获取成功:', response.data)

        if (sigmaInstance && graph) {
            updateGraph()
        }
    } catch (error) {
        console.error('获取图谱数据失败:', error)
        // 这里可以添加错误提示
    } finally {
        loading.value = false
    }
}


// 更新图谱数据
const updateGraph = (): void => {
    if (!graph) return

    // 清空现有图数据
    graph.clear()

    // 添加节点
    graphData.value.nodes.forEach(node => {
        const normalizedType = normalizeNodeType(node.type)

        graph!.addNode(node.id, {
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: 8 + (Object.keys(node.attributes || {}).length * 2),
            label: node.label,
            color: getNodeColor(node.type),
            nodeType: normalizedType,
            attributes: node.attributes,
            document_id: node.document_id
        })
    })

    // 添加边
    // 添加边
    graphData.value.edges.forEach(edge => {
        graph!.addEdge(edge.source, edge.target, {
            type: 'arrow',  // 统一使用 'arrow' 或 'line' 类型
            weight: edge.weight,
            color: getEdgeColor(edge.type),  // 根据原始类型设置颜色
            originalType: edge.type,  // 保存原始类型用于显示
            label: getEdgeLabel(edge.type)  // 可选：添加边标签
        })
    })


    // 应用布局
    applyLayout()
}
// 初始化Sigma图谱
const initSigma = (): void => {
    if (!sigmaContainer.value) return

    // 创建图对象
    graph = new Graph()

    // 创建Sigma实例
    sigmaInstance = new Sigma(graph, sigmaContainer.value, {
        renderLabels: true,
        renderEdgeLabels: false,
        defaultNodeColor: '#6B7280',
        defaultEdgeColor: '#D1D5DB',
        labelThreshold: 0,
        labelSize: 12,
        labelFont: 'Arial, sans-serif',
        labelWeight: 'bold',
        enableEdgeHoverEvents: true,
        enableNodeHoverEvents: true
    })

    // 添加事件监听器
    setupEventListeners()

    // 初始加载数据
    updateGraph()
}





// 转换节点类型为Sigma可识别的类型
const normalizeNodeType = (type: string): string => {
    const validTypes = ['default', 'image', 'circle']
    if (validTypes.includes(type)) return type
    return 'default'
}





// 添加节点
graphData.value.nodes.forEach(node => {
    const normalizedType = normalizeNodeType(node.type)

    graph!.addNode(node.id, {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 8 + (Object.keys(node.attributes || {}).length * 2),
        label: node.label,
        color: getNodeColor(node.type),
        nodeType: normalizedType,
        attributes: node.attributes,
        document_id: node.document_id
    })
})


// 应用布局算法
const applyLayout = (): void => {
    if (!graph) return

    if (isForceLayout.value) {
        // 力导向布局
        const settings = forceAtlas2.inferSettings(graph)
        forceAtlas2.assign(graph, {
            settings,
            iterations: 50,
            worker: false,
            timeout: 0
        })
    } else {
        // 环形布局
        circular.assign(graph)
    }

    // 刷新渲染
    if (sigmaInstance) {
        sigmaInstance.refresh()
    }
}


// 设置事件监听器
const setupEventListeners = (): void => {
    if (!sigmaInstance) return

    // 节点点击事件
    sigmaInstance.on('clickNode', (event) => {
        const nodeId = event.node
        const nodeData = graph!.getNodeAttributes(nodeId)

        selectedNode.value = {
            id: nodeId,
            label: nodeData.label,
            type: nodeData.type,
            attributes: nodeData.attributes,
            document_id: nodeData.document_id
        }
    })

    // 点击空白处取消选择
    sigmaInstance.on('clickStage', () => {
        selectedNode.value = null
    })

    // 节点悬停效果
    sigmaInstance.on('enterNode', (event) => {
        sigmaInstance!.getGraph().setNodeAttribute(event.node, 'highlighted', true)
        sigmaInstance!.refresh()
    })

    sigmaInstance.on('leaveNode', (event) => {
        sigmaInstance!.getGraph().setNodeAttribute(event.node, 'highlighted', false)
        sigmaInstance!.refresh()
    })
}

// 重置布局
const resetLayout = (): void => {
    applyLayout()
}

// 切换布局
const toggleLayout = (): void => {
    isForceLayout.value = !isForceLayout.value
    applyLayout()
}

// 刷新图谱
const refreshGraph = async (): Promise<void> => {
    await fetchGraphData()
}

// 组件挂载时初始化
onMounted(async () => {
    await nextTick()
    await fetchGraphData()
    initSigma()
})

// 组件卸载时清理
onUnmounted(() => {
    if (sigmaInstance) {
        sigmaInstance.kill()
        sigmaInstance = null
    }
    graph = null
})
</script>

<style scoped>
/* Sigma容器样式调整 */
.sigma-container {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* 动画效果 */
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
