// 定义文件上传函数
import { Ref } from 'vue';
import axios from 'axios';

// 生成文件 hash，这里使用简单的示例，实际可使用更复杂的算法
const generateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};
// ... 已有代码 ...

export const uploadFiles = async (
    uploadedFiles: Ref<File[]>,
    isUploading: Ref<boolean>,
    uploadProgress: Ref<number>
) => {
    if (uploadedFiles.value.length === 0) return;

    isUploading.value = true;
    uploadProgress.value = 0;

    // 存储每个文件的 fileName、fileHash 和 totalChunks
    const fileInfoList: { fileName: string; fileHash: string; totalChunks: number }[] = [];

    try {
        for (const file of uploadedFiles.value) {
            const chunkSize = 10 * 1024; // 每个分块大小
            const totalChunks = Math.ceil(file.size / chunkSize);
            console.log(`文件 ${file.name} 分成了 ${totalChunks} 个分块`);
            let uploadedChunks = 0;

            // 生成文件唯一标识，可根据文件内容生成 hash
            const fileHash = await generateFileHash(file);
            console.log(`文件 ${file.name} 的唯一标识为 ${fileHash}`);

            // 存储当前文件的信息，包含总块数
            fileInfoList.push({ fileName: file.name, fileHash, totalChunks });

            // 上传每个分块
            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(file.size, start + chunkSize);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append('chunk', chunk);
                formData.append('fileHash', fileHash);
                formData.append('chunkIndex', i.toString());
                formData.append('totalChunks', totalChunks.toString());
                formData.append('fileName', file.name);

                // 调用后端接口发送分块数据
                console.log(`正在上传文件 ${file.name} 的第 ${i + 1} 个分块`);
                console.log(`分块大小: ${chunk.size} bytes`);
                console.log(`分块索引: ${i}`);
                console.log(formData);

                await axios.post('/api/upload-chunk', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        // 检查 progressEvent.total 是否存在
                        const total = progressEvent.total || 0;
                        // 计算当前分块的上传进度
                        const chunkProgress = (progressEvent.loaded / total) * (100 / totalChunks);
                        // 更新总的上传进度
                        uploadProgress.value = Math.round(uploadedChunks * (100 / totalChunks) + chunkProgress);
                    }
                });
                uploadedChunks++;
            }
        }

        console.log('文件上传完成');
        // 遍历文件信息列表，逐个调用上传完成接口
        for (const fileInfo of fileInfoList) {
            await axios.post('/api/upload-complete', {
                fileName: fileInfo.fileName,
                fileHash: fileInfo.fileHash,
                // 传递总块数
                totalChunks: fileInfo.totalChunks 
            });
        }

        isUploading.value = false;
        // 上传完成后可添加刷新文档列表等操作
    } catch (error) {
        console.error('文件上传失败:', error);
        isUploading.value = false;
    }
};
