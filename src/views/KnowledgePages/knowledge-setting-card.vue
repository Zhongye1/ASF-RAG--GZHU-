<template>
    <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-medium mb-4">知识库设置</h2>

        <!-- 基本信息设置 -->
        <div class="mb-8 ">
            <h3 class="text-lg font-medium mb-4">基本信息</h3>
            <div class="grid md:grid-cols-2 md:grid-rows-[auto_1fr] gap-6">
                <!-- 左上：知识库名称 -->
                <div class="md:row-span-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">知识库名称</label>
                    <t-input type="text" v-model="localKbName" :class="[
                        'w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
                        errors.name ? 'border-red-300' : 'border-gray-300'
                    ]" placeholder="请输入知识库名称" />
                    <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                </div>

                <!-- 右侧：知识库描述（跨两行） -->
                <div class="md:row-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">知识库描述</label>
                    <t-textarea :autosize="true" v-model="localKbDescription" :rows="6" :class="[
                        'w-full border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none',
                        errors.description ? 'border-red-300' : 'border-gray-300'
                    ]" placeholder="请输入知识库描述" />
                    <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
                </div>

                <!-- 左下：知识库封面 -->
                <div class="md:row-span-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2">知识库封面</label>
                    <div class="flex items-center space-x-4">
                        <div class="w-20 h-20 rounded-md overflow-hidden border border-gray-300">
                            <img v-if="localKbImageUrl" :src="localKbImageUrl" alt="封面图片"
                                class="w-full h-full object-cover" @error="handleImageError" />
                            <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div class="flex flex-col space-y-2">
                            <input ref="imageInput" type="file" accept="image/*" @change="handleImageUpload"
                                class="hidden" />
                            <button @click="$refs.imageInput.click()"
                                class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm">
                                上传封面
                            </button>
                            <button v-if="localKbImageUrl" @click="removeImage"
                                class="px-4 py-2 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 text-red-600 text-sm">
                                移除封面
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- 文本处理设置 -->
        <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">文本处理设置</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">PDF解析器</label>
                    <select v-model="settings.pdfParser"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                        <option value="DeepDoc">DeepDoc (高精度)</option>
                        <option value="Standard">Standard (标准)</option>
                        <option value="Fast">Fast (快速)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">嵌入模型</label>
                    <select v-model="settings.embeddingModel"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                        <option value="bge-m3@GiteeAI">bge-m3@GiteeAI</option>
                        <option value="text-embedding-3-large">text-embedding-3-large</option>
                        <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">分段方法</label>
                    <select v-model="settings.segmentMethod" @change="handleSegmentMethodChange"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                        <option value="General">通用</option>
                        <option value="Semantic">语义</option>
                        <option value="Fixed">固定长度</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        文本块大小 ({{ settings.textBlockSize }} tokens)
                    </label>
                    <input type="range" v-model.number="settings.textBlockSize" min="128" max="4096" step="128"
                        class="w-full" />
                    <div class="flex justify-between text-sm text-gray-500 mt-1">
                        <span>128</span>
                        <span>4096</span>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">重叠长度</label>
                    <input type="number" v-model.number="settings.overlapSize" min="0"
                        :max="Math.floor(settings.textBlockSize / 2)" step="16"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>

            <div class="mt-4 space-y-3">
                <label class="flex items-center">
                    <input type="checkbox" v-model="settings.convertTableToHtml"
                        class="h-4 w-4 text-blue-600 rounded border-gray-300" />
                    <span class="ml-2 text-sm text-gray-700">将表格内容转换为HTML格式</span>
                </label>

                <label class="flex items-center">
                    <input type="checkbox" v-model="settings.preserveLayout"
                        class="h-4 w-4 text-blue-600 rounded border-gray-300" />
                    <span class="ml-2 text-sm text-gray-700">保持文档原始布局</span>
                </label>

                <label class="flex items-center">
                    <input type="checkbox" v-model="settings.removeHeaders"
                        class="h-4 w-4 text-blue-600 rounded border-gray-300" />
                    <span class="ml-2 text-sm text-gray-700">移除页眉页脚</span>
                </label>
            </div>
        </div>

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
                    <select v-model="settings.kgMethod"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                        <option value="General">通用 (适用于大多数文档)</option>
                        <option value="Advanced">高级 (更精确的实体识别)</option>
                        <option value="Domain">领域专用 (特定领域优化)</option>
                    </select>
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

        <!-- 高级设置 -->
        <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">高级设置</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">向量维度</label>
                    <select v-model.number="settings.vectorDimension"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                        <option :value="384">384 (小模型)</option>
                        <option :value="768">768 (中等模型)</option>
                        <option :value="1024">1024 (大模型)</option>
                        <option :value="1536">1536 (超大模型)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">相似度阈值</label>
                    <input type="range" v-model.number="settings.similarityThreshold" min="0.1" max="1.0" step="0.05"
                        class="w-full" />
                    <div class="flex justify-between text-sm text-gray-500 mt-1">
                        <span>0.1</span>
                        <span>{{ settings.similarityThreshold }}</span>
                        <span>1.0</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="border-t pt-6 flex justify-between">
            <div>
                <button @click="resetToDefaults"
                    class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-gray-700 font-medium">
                    重置为默认
                </button>
            </div>

            <div class="flex space-x-3">
                <button @click="onDeleteClick" :disabled="isLoading"
                    class="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md font-medium">
                    {{ isLoading ? '删除中...' : '删除知识库' }}
                </button>
                <button @click="onSaveClick" :disabled="isLoading || !isValid"
                    class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium">
                    {{ isLoading ? '保存中...' : '保存设置' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits } from 'vue';

interface KnowledgeBaseSettings {
    pdfParser: string;
    embeddingModel: string;
    segmentMethod: string;
    textBlockSize: number;
    overlapSize: number;
    convertTableToHtml: boolean;
    preserveLayout: boolean;
    removeHeaders: boolean;
    extractKnowledgeGraph: boolean;
    kgMethod: string;
    selectedEntityTypes: string[];
    entityNormalization: boolean;
    communityReport: boolean;
    relationExtraction: boolean;
    vectorDimension: number;
    similarityThreshold: number;
}

// 定义组件的输入属性
const props = defineProps({
    kbName: {
        type: String,
        required: true
    },
    kbDescription: {
        type: String,
        required: true
    },
    kbImageUrl: {
        type: String,
        default: ''
    },
    kbId: {  // 添加知识库ID属性
        type: String,
        required: true
    },
    initialSettings: {
        type: Object as () => Partial<KnowledgeBaseSettings>,
        default: () => ({})
    },

});

// 定义组件可触发的事件
const emit = defineEmits(['save', 'delete', 'image-upload']);

// 状态管理
const isLoading = ref(false);
const errors = ref<Record<string, string>>({});

// 创建本地响应式数据
const localKbName = ref(props.kbName);
const localKbDescription = ref(props.kbDescription);
const localKbImageUrl = ref(props.kbImageUrl);

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

// 默认设置
const defaultSettings: KnowledgeBaseSettings = {
    pdfParser: 'DeepDoc',
    embeddingModel: 'bge-m3@GiteeAI',
    segmentMethod: 'General',
    textBlockSize: 512,
    overlapSize: 64,
    convertTableToHtml: true,
    preserveLayout: false,
    removeHeaders: true,
    extractKnowledgeGraph: false,
    kgMethod: 'General',
    selectedEntityTypes: ['PERSON', 'ORGANIZATION', 'LOCATION'],
    entityNormalization: true,
    communityReport: false,
    relationExtraction: true,
    vectorDimension: 768,
    similarityThreshold: 0.7
};

// 设置数据
const settings = ref<KnowledgeBaseSettings>({
    ...defaultSettings,
    ...props.initialSettings
});

// 监听 props 变化
watch(() => props.kbName, (newVal) => {
    localKbName.value = newVal;
});

watch(() => props.kbDescription, (newVal) => {
    localKbDescription.value = newVal;
});

watch(() => props.kbImageUrl, (newVal) => {
    localKbImageUrl.value = newVal;
});

// 表单验证
const isValid = computed(() => {
    return validateForm() && Object.keys(errors.value).length === 0;
});

const validateForm = () => {
    errors.value = {};

    if (!localKbName.value.trim()) {
        errors.value.name = '知识库名称不能为空';
    }

    if (!localKbDescription.value.trim()) {
        errors.value.description = '知识库描述不能为空';
    }

    if (settings.value.textBlockSize < 128) {
        errors.value.textBlockSize = '文本块大小不能小于128';
    }

    return Object.keys(errors.value).length === 0;
};

// 处理分段方法变化
const handleSegmentMethodChange = () => {
    if (settings.value.segmentMethod === 'Fixed') {
        settings.value.textBlockSize = 512;
    }
};

// 切换实体类型
const toggleEntityType = (entityType: string) => {
    const index = settings.value.selectedEntityTypes.indexOf(entityType);
    if (index > -1) {
        settings.value.selectedEntityTypes.splice(index, 1);
    } else {
        settings.value.selectedEntityTypes.push(entityType);
    }
};


const fetchCoverImage = async () => {
    if (!props.kbId) return;

    try {
        console.log('开始获取封面图片...');
        const response = await fetch(`/api/get-knowledge-item/${props.kbId}`);
        if (!response.ok) {
            throw new Error(`获取知识库信息失败: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('API返回数据:', responseData);

        // 修改：正确访问嵌套的data.cover属性
        if (responseData.code === 200 && responseData.data && responseData.data.cover) {
            localKbImageUrl.value = responseData.data.cover;
            console.log('成功更新封面图片URL:', responseData.data.cover);
        } else {
            console.log('API未返回有效的cover值');
            // 设置默认图片或使用props传递的值作为备选
            if (props.kbImageUrl && !localKbImageUrl.value) {
                localKbImageUrl.value = props.kbImageUrl;
                console.log('使用props中的封面图片URL:', props.kbImageUrl);
            } else {
                // 设置一个默认图片
                localKbImageUrl.value = '/default-cover.png';
                console.log('使用默认封面图片');
            }
        }
    } catch (error) {
        console.error('获取知识库封面失败:', error);
        // 错误时也设置备选图片
        if (props.kbImageUrl && !localKbImageUrl.value) {
            localKbImageUrl.value = props.kbImageUrl;
        } else {
            // 设置一个默认图片
            localKbImageUrl.value = '/default-cover.png';
            console.log('使用默认封面图片');
        }
    }
};




// 处理图片上传
const handleImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    // 校验文件
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('图片大小不能超过5MB');
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
    }

    // 创建本地预览
    const reader = new FileReader();
    reader.onload = (e) => {
        localKbImageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // 上传到后端
    await uploadImage(file);
};

// 上传图片到后端
async function uploadImage(file: File) {
    isLoading.value = true;

    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('KLB_id', props.kbId); // 添加KLB_id到请求中

        console.log('KLB_id:', props.kbId);

        const response = await fetch('/api/upload-cover', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('上传图片失败');
        }

        const data = await response.json();
        // 更新为后端返回的图片URL
        const imageUrl = data.imageUrl.startsWith('http') ? data.imageUrl : `http://localhost:8000${data.imageUrl}`;
        localKbImageUrl.value = imageUrl;

        //localKbImageUrl.value = data.imageUrl;
        console.log('图片上传成功:', data.imageUrl);

        // 触发上传成功事件
        emit('image-upload', file, data.imageUrl);
    } catch (error) {
        console.error('上传图片失败:', error);
        alert('上传图片失败，请重试');
    } finally {
        isLoading.value = false;
    }
}

// 移除图片
const removeImage = () => {
    localKbImageUrl.value = '';
};

// 重置为默认设置
const resetToDefaults = () => {
    if (confirm('确定要重置为默认设置吗？这将丢失所有自定义配置。')) {
        settings.value = { ...defaultSettings };
    }
};

// 处理图片上传










// 保存设置
const onSaveClick = async () => {
    if (!validateForm()) return;

    isLoading.value = true;

    try {
        const settingsData = {
            name: localKbName.value,
            description: localKbDescription.value,
            imageUrl: localKbImageUrl.value,
            settings: settings.value
        };

        await emit('save', settingsData);
    } catch (error) {
        console.error('保存失败:', error);
    } finally {
        isLoading.value = false;
    }
};

// 删除知识库
const onDeleteClick = async () => {


    try {
        await emit('delete');
    } catch (error) {
        console.error('删除失败:', error);
    } finally {
        isLoading.value = false;
    }

};

import { onMounted } from 'vue';
watch(() => props.kbImageUrl, (newVal) => {
    if (!localKbImageUrl.value && newVal) {
        localKbImageUrl.value = newVal;
    }
});

// 在组件挂载时获取封面图片
onMounted(async () => {
    await fetchCoverImage(); // 等待获取最新图片URL完成
    console.log('onMounted with updated image URL:', localKbImageUrl.value);
});

// 图片加载错误处理
const handleImageError = () => {
    console.error('图片加载失败:', localKbImageUrl.value);
    // 可以设置为默认图片
    localKbImageUrl.value = '/default-cover.png'; // 替换为您的默认图片路径
};

</script>

<style scoped>
/* 自定义样式 */
.transition-colors {
    transition: background-color 0.2s ease, border-color 0.2s ease;
}

input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    outline: none;
}

input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}
</style>
