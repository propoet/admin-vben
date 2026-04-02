<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { SystemUserProfileApi } from '#/api/system/user/profile';

import { watch } from 'vue';

import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { updateUserProfile } from '#/api/system/user/profile';

const props = defineProps<{
  profile?: SystemUserProfileApi.UserProfileRespVO;
}>();
const emit = defineEmits<{
  (e: 'success'): void;
}>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 70,
  },
  schema: [
    {
      label: '姓名',
      fieldName: 'name',
      component: 'Input',
      componentProps: {
        placeholder: '请输入姓名',
      },
      rules: 'required',
    },

  ],
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    content: '更新信息',
  },
  handleSubmit,
});

async function handleSubmit(values: Recordable<any>) {
  try {
    formApi.setLoading(true);
    // 提交表单
    await updateUserProfile(values as SystemUserProfileApi.UpdateProfileReqVO);
    // 关闭并提示
    emit('success');
    ElMessage.success($t('ui.actionMessage.operationSuccess'));
  } catch (error) {
    console.error(error);
  } finally {
    formApi.setLoading(false);
  }
}

/** 监听 profile 变化 */
watch(
  () => props.profile,
  (newProfile) => {
    if (newProfile) {
      formApi.setValues(newProfile);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="mt-4 md:w-full lg:w-1/2 2xl:w-2/5">
    <Form />
  </div>
</template>
