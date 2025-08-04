<template>
  <t-dialog
    header="编辑用户信息"
    :visible="visible"
    mode="modal"
    draggable
    :onConfirm="handleSubmit"
    :onCancel="closeDialog"
  >
    <div slot="body">
      <t-form-item label="用户名">
        <t-input v-model="formData.name" placeholder="请输入用户名" />
      </t-form-item>

      <t-form-item label="签名">
        <t-input v-model="formData.signatur" placeholder="请输入个人签名" />
      </t-form-item>

      <t-form-item label="头像">
        <t-input v-model="formData.avatar" placeholde="请输入头像地址" />
      </t-form-item>
      <div v-if="previewUrl" class="preview">
        <img :src="previewUrl" alt="头像预览" class="preview-img" />
      </div>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import { useDataUserStore } from "@/store";

const DataUserStore = useDataUserStore();
const props = defineProps({
  visible: Boolean,
  userData: Object,
});

const emit = defineEmits(["update:visible", "update:userData"]);
// 表单数据
const formData = reactive({
  name: "",
  signatur: "",
  avatar: "",
});

// 头像预览URL
const previewUrl = ref("");
// 当对话框显示时初始化表单
watch(
  () => props.visible,
  (visible) => {
    if (visible && props.userData) {
      formData.name = props.userData.name || "";
      formData.signatur = props.userData.signatur || "";
      formData.avatar = "";
      previewUrl.value = props.userData.avatarUrl || "";
    }
  }
);
// 关闭对话框
const closeDialog = () => {
  emit("update:visible", false);
};

// 提交表单
const handleSubmit = async () => {
  DataUserStore.updateUserData(formData.name, formData.signatur, formData.avatar);
};
</script>

<style scoped>
.preview {
  margin-top: 10px;
}
.preview-img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 50%;
}
</style>
