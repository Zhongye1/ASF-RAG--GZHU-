<template>
  <div class="auth-container">
    <t-card class="auth-card" :title="cardTitle" :bordered="false" hover-shadow>
      <t-form ref="formRef" :data="formData" :rules="formRules" colon label-width="0" @submit="handleSubmit">
        <t-form-item name="email">
          <t-input v-model="formData.email" clearable size="large" placeholder="请输入您的邮箱">
            <template #prefix-icon>
              <t-icon name="mail" />
            </template>
          </t-input>
        </t-form-item>

        <t-form-item name="password">
          <t-input v-model="formData.password" type="password" clearable size="large" placeholder="请输入密码">
            <template #prefix-icon>
              <t-icon name="lock-on" />
            </template>
          </t-input>
        </t-form-item>

        <t-form-item v-if="formMode === 'register'" name="confirmPassword">
          <t-input v-model="formData.confirmPassword" type="password" clearable size="large" placeholder="请再次输入密码">
            <template #prefix-icon>
              <t-icon name="lock-on" />
            </template>
          </t-input>
        </t-form-item>

        <t-form-item>
          <t-button theme="primary" type="submit" block size="large">
            {{ submitButtonText }}
          </t-button>
        </t-form-item>
      </t-form>

      <div class="switch-mode">
        <t-link theme="primary" @click="toggleFormMode">{{ switchLinkText }}</t-link>
      </div>
    </t-card>
  </div>


</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { MessagePlugin, FormInstanceFunctions, FormRule } from "tdesign-vue-next";
import { Icon as TIcon } from "tdesign-icons-vue-next";
import { get, post } from "@/utils/ASFaxios";
import router from "@/router";

const formMode = ref<"login" | "register">("login");
const formRef = ref<FormInstanceFunctions | null>(null);

const formData = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const cardTitle = computed(() =>
  formMode.value === "login" ? "欢迎回来" : "创建新账户"
);
const submitButtonText = computed(() => (formMode.value === "login" ? "登 录" : "注 册"));
const switchLinkText = computed(() =>
  formMode.value === "login" ? "还没有账户？立即注册" : "已有账户？前往登录"
);

const formRules = computed<Record<string, FormRule[]>>(() => ({
  email: [
    { required: true, message: "邮箱不能为空", type: "error" },
    { email: true, message: "请输入正确的邮箱格式", type: "warning" },
  ],
  password: [
    { required: true, message: "密码不能为空", type: "error" },
    { min: 6, message: "密码长度不能少于6位", type: "warning" },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码", type: "error" },
    {
      validator: (val) => val === formData.password,
      message: "两次输入的密码不一致",
      type: "error",
    },
  ],
}));

const toggleFormMode = () => {
  formMode.value = formMode.value === "login" ? "register" : "login";
  formRef.value?.reset();
  Object.assign(formData, { email: "", password: "", confirmPassword: "" });
};

const handleSubmit = ({
  validateResult,
  firstError,
}: {
  validateResult: boolean;
  firstError?: string;
}) => {
  if (!validateResult) {
    MessagePlugin.warning(firstError || "校验失败");
    return;
  }
  const Data = new FormData();
  Data.append("email", formData.email);
  Data.append("password", formData.password);

  if (formMode.value === "login") {
    // 执行登录逻辑
    console.log("Login attempt with:", formData);

    // 在这里可以调用登录API

    post("/api/login", Data)
      .then((res: any) => {
        MessagePlugin.success("登录成功");
        console.log(res.token);
        localStorage.setItem("jwt", res.token);
        localStorage.setItem("email", formData.email);
        router.push("/");
      })
      .catch((err) => {
        MessagePlugin.error(`登录失败，发生${err.message}错误`);
      });
  } else {
    // 执行注册逻辑
    console.log("Registering with:", formData);
    console.log("Login attempt with:", {
      email: formData.email,
      password: formData.password,
    });
    // 在这里可以调用注册API
    post("/api/logon", Data)
      .then((res) => {
        MessagePlugin.success("注册成功");
      })
      .catch((err) => {
        MessagePlugin.error(`注册失败，发生${err.message}错误`);
      });
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-image: linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%);
  min-height: 100vh;
  box-sizing: border-box;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border-radius: 12px;
}

:deep(.t-form__label) {
  width: 0;
}

.switch-mode {
  margin-top: 16px;
  text-align: center;
}
</style>
