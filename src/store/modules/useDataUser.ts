import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { get, post, del } from '@/utils/ASFaxios'; 

// 定义用户资料的数据结构，与后端返回的对象匹配
interface UserProfile {
  user_id: number | null;
  name: string;
  signature: string; 
  avatar: string;
}
type UserProfileResponse = {
  status: 'success' | 'error';
  data?: [number, string, string, string];
  message?: string;
}

export const useDataUserStore = defineStore('dataUser', () => {
  const profile = reactive<UserProfile>({
    user_id: null,
    name: '',
    signature: '',
    avatar: '',
  });

  const email = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);


  async function fetchUserData() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await get<UserProfileResponse>('/api/user/api/GetUserData');
      if (response.status === 'success' && response.data) {
        const [userId, name, signature, avatar] = response.data;
        profile.user_id = userId;
        profile.name = name;
        profile.signature = signature;
        profile.avatar = avatar;
      } else {
        throw new Error(response.message || '获取用户资料失败');
      }
    } catch (e: any) {
      error.value = e.message || '发生未知错误';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }


  async function updateUserData(name: string, signature: string, avatar: string) {
    isLoading.value = true;
    error.value = null;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('signatur', signature);
    formData.append('avatar', avatar);

    try {

      const response: { status: 'success' | 'error'; message?: string }  = await post('/api/user/api/UpdateUserData', formData);
      if (response.status !== 'success') {
        throw new Error(response.message || '更新失败');
      }
      profile.name = name;
      profile.signature = signature;
      profile.avatar = avatar;
    } catch (e: any) {
      error.value = e.message || '发生未知错误';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAccount() {
    isLoading.value = true;
    error.value = null;
    try {
      const response: { status: 'success' | 'error'; message?: string }  = await del('/api/user/api/DeleteUserData');
      if (response.status !== 'success') {
        throw new Error(response.message || '注销失败');
      }
      resetState();
      localStorage.removeItem('jwt'); // 清除 token
    } catch (e: any) {
      error.value = e.message || '发生未知错误';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function resetState() {
    profile.user_id = null;
    profile.name = '';
    profile.signature = '';
    profile.avatar = '';
    email.value = '';
    isLoading.value = false;
    error.value = null;
  }

  return {
    profile,
    email,
    isLoading,
    error,
    fetchUserData,
    updateUserData,
    deleteAccount,
    resetState,
  };
});