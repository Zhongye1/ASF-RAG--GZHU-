<template>
    <div class="flex-1 p-6 overflow-auto">
        <div class="max-w-4xl">
            <h2 class="text-2xl font-bold mb-6">Ollama 设置</h2>

            <!-- 服务器配置 -->
            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <h3 class="text-lg font-medium mb-4">服务器配置</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">服务器地址</label>
                        <t-input v-model="serverUrl" placeholder="http://localhost:11434" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">连接超时（秒）</label>
                        <t-input-number v-model="timeout" :min="1" :max="300" />
                    </div>
                </div>
            </div>

            <!-- 其他设置 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium mb-4">其他设置</h3>
                <div class="space-y-4">
                    <t-checkbox v-model="autoRefresh">自动刷新模型列表</t-checkbox>
                    <t-checkbox v-model="showNotifications">显示操作通知</t-checkbox>
                </div>
            </div>

            <!-- 保存按钮 -->
            <div class="mt-6">
                <t-button theme="primary" @click="saveSettings">保存设置</t-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

// 设置状态
const serverUrl = ref('http://localhost:11434')
const timeout = ref(30)
const autoRefresh = ref(false)
const showNotifications = ref(true)

// 保存设置
const saveSettings = () => {
    // 实现设置保存逻辑
    MessagePlugin.success('设置已保存')
}
</script>
