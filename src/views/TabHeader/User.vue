<template>
  <div class="user-profile-container">
    <t-card :bordered="true" hover-shadow class="user-profile-card">
      <t-space direction="vertical" size="large" style="width: 100%">
        <t-space align="center" size="large">
          <t-avatar size="100px" :image="DataUserStore.userData.avatar"></t-avatar>
          <t-space direction="vertical" size="small" class="user-info-text">
            <div class="user-profile-name">{{ DataUserStore.userData.name }}</div>
            <div class="user-profile-username">
              {{ LocalStorage.getItem("email") || "空" }}
            </div>
            <div class="user-profile-description">
              {{ DataUserStore.userData.signatur }}
            </div>
          </t-space>
        </t-space>

        <t-divider />

        <t-descriptions bordered column="1" title="个人信息">
          <t-descriptions-item label="邮箱">{{
            LocalStorage.getItem("email") || "空"
          }}</t-descriptions-item>
          <t-descriptions-item label="简介">
            <t-tag>用户</t-tag>
            <t-tag>测试</t-tag>
          </t-descriptions-item>
        </t-descriptions>

        <div class="activity-section">
          <p class="activity-title">你的账户</p>
          <t-list :split="true" style="max-height: 150px">
            <t-list-item v-for="item in data" :key="item[3]">{{ item[1] }}</t-list-item>
          </t-list>
        </div>

        <t-space>
          <t-button theme="primary" @click="visible=!visible">编辑资料</t-button>
          <t-button variant="outline">操作账户</t-button>
        </t-space>
      </t-space>
    </t-card>
  </div>
  <editUserData  :visible="visible" :userData="currentUser"/>
</template>

<script setup lang="ts">
import { get } from "@/utils/ASFaxios";
import { onMounted, ref, computed } from "vue";
import { useDataUserStore } from "@/store";
import { LocalStorage } from "quasar";
import editUserData from "@/components/edit-userData/edit-userData.vue";

const data = ref([]);
const DataUserStore = useDataUserStore();
const GetUsersData = get("/api/GetUserAllData").then((req: any) => {
  console.log(req.data);
  data.value = req.data;
});
const visible = ref(false);
const currentUser = ref({ 
  name: DataUserStore.userData.name, 
  signatur: DataUserStore.userData.signatur,
  avatar: DataUserStore.userData.avatar
});


onMounted(() => {
  GetUsersData;
  DataUserStore.fetchUserData();
});
</script>

<style scoped>
.user-profile-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  background-color: var(--td-bg-color-container-hover);
  min-height: 100vh;
}

.user-profile-card {
  width: 100%;
  max-width: 600px;
}

.user-info-text {
  text-align: left;
}

.user-info-text > div {
  word-break: break-all;
}

.user-profile-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--td-text-color-primary);
}

.user-profile-username {
  font-size: 16px;
  color: var(--td-text-color-secondary);
}

.user-profile-description {
  font-size: 14px;
  color: var(--td-text-color-placeholder);
}

.activity-section {
  width: 100%;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 12px;
}
</style>
