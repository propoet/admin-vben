<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, onMounted, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { getCaptchaApi } from '#/api/core/auth';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const loginRef = ref();
const captchaImage = ref('');
const captchaKey = ref('');

async function fetchImageCaptcha() {
  const data = await getCaptchaApi();
  captchaImage.value = data.imageBase64;
  captchaKey.value = data.key;
}

/** 处理登录 */
async function handleLogin(values: any) {
  try {
    await authStore.authLogin('username', {
      ...values,
      captchaKey: captchaKey.value,
      clientType: 'PC_PLATFORM'
    });
  } catch (error) {
    // loginRef.value?.getFormApi()?.setFieldValue('captchaCode', '');
    await fetchImageCaptcha();
    throw error;
  }
}

onMounted(() => {
  fetchImageCaptcha();
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.usernameTip') })
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.passwordTip'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.passwordTip') })
    },
    {
      component: 'VbenImageCaptcha',
      componentProps: {
        captchaImage: captchaImage.value,
        onRefresh: fetchImageCaptcha,
        placeholder: $t('page.auth.imageCaptchaCodeTip'),
      },
      fieldName: 'captchaCode',
      label: $t('page.auth.imageCaptchaCode'),
      rules: 'required'
    },
  ];
});
</script>

<template>
  <div>
    <AuthenticationLogin
      ref="loginRef"
      :form-schema="formSchema"
      :loading="authStore.loginLoading"
      @submit="handleLogin"
      :show-remember-me="false"
      :show-forget-password="false"
      :show-third-party-login="false"
      :show-register="false"
      :show-code-login="false"
      :show-qrcode-login="false"
    />
  </div>
</template>
