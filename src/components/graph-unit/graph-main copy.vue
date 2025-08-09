<template>
    <div class="graph-container w-[80vw] flex flex-col items-center">
        <!-- 知识图谱设置 -->
        <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">知识图谱设置</h3>

            <div class="mb-4">
                <label class="flex items-center">
                    <input type="checkbox" v-model="settings.extractKnowledgeGraph"
                        class="h-4 w-4 text-blue-600 rounded border-gray-300" />
                    <span class="ml-2 text-sm text-gray-700">启用知识图谱提取</span>
                </label>
                <p class="text-sm text-gray-500 mt-1 ml-6">提取文档中的实体和关系，构建知识图谱</p>
            </div>

            <div v-if="settings.extractKnowledgeGraph" class="pl-6 border-l-2 border-blue-100 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">图谱方法</label>
                    <t-select v-model="settings.kgMethod"
                        class="w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                        <t-option value="General">通用 (适用于大多数文档)</t-option>
                        <t-option value="Advanced">高级 (更精确的实体识别)</t-option>
                        <t-option value="Domain">领域专用 (特定领域优化)</t-option>
                    </t-select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">实体类型</label>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="entity in entityTypes" :key="entity.value" @click="toggleEntityType(entity.value)"
                            :class="[
                                'px-3 py-1 rounded-full text-sm cursor-pointer transition-colors',
                                settings.selectedEntityTypes.includes(entity.value)
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                            ]">
                            {{ entity.label }}
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <label class="flex items-center">
                        <input type="checkbox" v-model="settings.entityNormalization"
                            class="h-4 w-4 text-blue-600 rounded border-gray-300" />
                        <span class="ml-2 text-sm text-gray-700">实体标准化</span>
                    </label>

                    <label class="flex items-center">
                        <input type="checkbox" v-model="settings.communityReport"
                            class="h-4 w-4 text-blue-600 rounded border-gray-300" />
                        <span class="ml-2 text-sm text-gray-700">生成社区报告</span>
                    </label>

                    <label class="flex items-center">
                        <input type="checkbox" v-model="settings.relationExtraction"
                            class="h-4 w-4 text-blue-600 rounded border-gray-300" />
                        <span class="ml-2 text-sm text-gray-700">关系抽取</span>
                    </label>
                </div>
            </div>
        </div>

        <button @click="fetchGraphData"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition duration-200 ease-in-out"
            :disabled="isLoading">
            <span v-if="isLoading" class="flex items-center">
                <!-- 加载图标 -->
                生成中...
            </span>
            <span v-else>生成知识图谱</span>
        </button>

        <div id="sigma-container" class="w-full h-[600px] bg-white rounded-lg shadow-md"></div>
    </div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import chroma from "chroma-js";
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";
import { v4 as uuid } from "uuid";

// 类型定义
interface GraphNode {
    id: string;
    label?: string;
    type?: string;
    x?: number;
    y?: number;
    size?: number;
    color?: string;
}

interface GraphEdge {
    source: string;
    target: string;
    label?: string;
}

interface GraphData {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

interface ApiResponse {
    message: string;
    graph_data: GraphData;
}


interface KnowledgeGraphSettings {
    extractKnowledgeGraph: boolean;
    kgMethod: string;
    selectedEntityTypes: string[];
    entityNormalization: boolean;
    communityReport: boolean;
    relationExtraction: boolean;
}

// 实体类型选项
const entityTypes = ref([
    { value: 'PERSON', label: '人物' },
    { value: 'ORGANIZATION', label: '组织' },
    { value: 'LOCATION', label: '地点' },
    { value: 'EVENT', label: '事件' },
    { value: 'PRODUCT', label: '产品' },
    { value: 'CONCEPT', label: '概念' },
    { value: 'TIME', label: '时间' },
    { value: 'MONEY', label: '金额' }
]);


// 图谱设置
const settings = ref<KnowledgeGraphSettings>({
    extractKnowledgeGraph: true,
    kgMethod: 'General',
    selectedEntityTypes: ['PERSON', 'ORGANIZATION', 'LOCATION'],
    entityNormalization: true,
    communityReport: false,
    relationExtraction: true
});

// 切换实体类型
const toggleEntityType = (entityType: string) => {
    const index = settings.value.selectedEntityTypes.indexOf(entityType);
    if (index > -1) {
        settings.value.selectedEntityTypes.splice(index, 1);
    } else {
        settings.value.selectedEntityTypes.push(entityType);
    }
};



// 状态变量
let renderer: Sigma | null = null;
let layout: ForceSupervisor | null = null;
let graph = new Graph({ multi: true });

// 响应式状态
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');

// 拖拽状态
let draggedNode: string | null = null;
let isDragging = false;

// 实现获取图数据的函数
const fetchGraphData = async (): Promise<void> => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const response = await fetch('http://localhost:8000/api/kg/process-all-files', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API请求失败：${response.statusText}`);
        }

        const data = await response.json() as ApiResponse[];

        if (data && data.length > 0 && data[0].graph_data) {
            updateGraph(data[0].graph_data);
        } else {
            errorMessage.value = '返回的数据格式不正确';
        }
    } catch (error) {
        console.error('获取图数据出错:', error);
        errorMessage.value = `获取图数据出错: ${error instanceof Error ? error.message : String(error)}`;
    } finally {
        isLoading.value = false;
    }
};

// 更新图谱的函数
const updateGraph = (graphData: GraphData): void => {
    if (!graphData || !graphData.nodes || !graphData.edges) {
        console.error('无效的图谱数据');
        return;
    }

    // 清空现有图谱
    graph.clear();

    // 为节点分配随机位置和颜色
    const nodeColors: Record<string, string> = {
        '人物': '#FF6B6B',
        '地点': '#4ECDC4',
        '组织': '#45B7D1',
        '概念': '#FFD166',
        '事件': '#06D6A0',
        '默认': '#90D8FF'
    };

    // 添加节点
    graphData.nodes.forEach((node, index) => {
        // 计算节点在圆形布局中的位置
        const angle = (index / graphData.nodes.length) * 2 * Math.PI;
        const radius = 10;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const nodeType = node.type || '默认';
        const color = nodeColors[nodeType] || nodeColors['默认'];

        graph.addNode(node.id, {
            x: x,
            y: y,
            size: 20,
            color: color,
            label: node.label + "//" + node.id,
        });
    });

    // 添加边
    // 添加边
    graphData.edges.forEach((edge, index) => {
        if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
            try {
                graph.addEdge(edge.source, edge.target, {
                    label: edge.label || '',
                    size: 2,
                    forceLabel: true,
                    // 添加唯一标识，确保多重边可区分
                    edgeId: `${edge.source}-${edge.target}-${index}`
                });
            } catch (error) {
                console.warn(`添加边时出错 (${edge.source} -> ${edge.target}): `, error);
            }
        }
    });

    // 重新应用力导向布局
    if (layout) {
        layout.kill();
    }

    layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted });
    layout.start();

    // 如果已有渲染器，需要先销毁它
    if (renderer) {
        renderer.kill();
        renderer = null;
    }

    // 重新创建渲染器
    const container = document.getElementById("sigma-container");
    if (container) {
        renderer = new Sigma(graph, container, {
            minCameraRatio: 0.5,
            maxCameraRatio: 2,
            renderEdgeLabels: true,
            edgeLabelSize: 12,
            edgeLabelWeight: "bold"
        });

        // 重新绑定事件
        bindEvents();
    }
};

// 封装事件绑定函数
const bindEvents = (): void => {
    if (!renderer) return;

    // On mouse down on a node
    renderer.on("downNode", (e) => {
        isDragging = true;
        draggedNode = e.node;
        graph.setNodeAttribute(draggedNode, "highlighted", true);
        if (renderer && !renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
    });

    // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
    renderer.on("moveBody", ({ event }) => {
        if (!isDragging || !draggedNode || !renderer) return;

        // Get new position of node
        const pos = renderer.viewportToGraph(event);

        graph.setNodeAttribute(draggedNode, "x", pos.x);
        graph.setNodeAttribute(draggedNode, "y", pos.y);

        // Prevent sigma to move camera:
        event.preventSigmaDefault();
        event.original.preventDefault();
        event.original.stopPropagation();
    });

    // On mouse up, we reset the dragging mode
    const handleUp = () => {
        if (draggedNode) {
            graph.removeNodeAttribute(draggedNode, "highlighted");
        }
        isDragging = false;
        draggedNode = null;
    };

    renderer.on("upNode", handleUp);
    renderer.on("upStage", handleUp);

    // When clicking on the stage, we add a new node and connect it to the closest node
    renderer.on("clickStage", ({ event }) => {
        if (!renderer) return;

        const coordForGraph = renderer.viewportToGraph({ x: event.x, y: event.y });

        // We create a new node
        const node = {
            ...coordForGraph,
            size: 10,
            color: chroma.random().hex(),
            label: "新节点"
        };

        // Searching the two closest nodes to auto-create an edge to it
        const closestNodes = graph
            .nodes()
            .map((nodeId) => {
                const attrs = graph.getNodeAttributes(nodeId);
                const distance = Math.pow(node.x - attrs.x, 2) + Math.pow(node.y - attrs.y, 2);
                return { nodeId, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 2);

        // We register the new node into graphology instance
        const id = uuid();
        graph.addNode(id, node);

        // We create the edges
        closestNodes.forEach((e) => graph.addEdge(id, e.nodeId, { label: "关联" }));
    });
};

// 生命周期钩子
onMounted(() => {
    // 在DOM渲染后再获取容器元素
    const container = document.getElementById("sigma-container");

    if (!container) {
        console.error("Container element not found!");
        return;
    }

    // 初始化示例图谱数据
    const initialNodes: GraphNode[] = [
        { id: "示例节点", label: "点击上方按钮生成知识图谱", x: 0, y: 0, size: 15, color: "#4B96FF" }
    ];

    initialNodes.forEach(node => {
        graph.addNode(node.id, {
            x: node.x,
            y: node.y,
            size: node.size,
            color: node.color,
            label: node.label,
        });
    });

    // Create the spring layout and start it
    layout = new ForceSupervisor(graph, { isNodeFixed: (_, attr) => attr.highlighted });
    layout.start();

    // Create the sigma with settings to enable edge labels
    renderer = new Sigma(graph, container, {
        minCameraRatio: 0.5,
        maxCameraRatio: 2,
        renderEdgeLabels: true,
        edgeLabelSize: 12,
        edgeLabelWeight: "bold"
    });

    // 绑定事件
    bindEvents();
});
</script>

<style scoped>
.graph-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
}

#sigma-container {
    position: relative;
    /* 为绝对定位的子元素提供定位上下文 */
    width: 100%;
    height: 600px;
    /* 固定高度 */
    overflow: hidden;
    /* 隐藏溢出的内容 */
}



#sigma-container :deep(canvas) {
    position: absolute !important;
    top: 0;
    left: 0;
}
</style>
