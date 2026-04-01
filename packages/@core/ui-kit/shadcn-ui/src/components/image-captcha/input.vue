<script setup lang="ts">
import type { ImageCaptchaProps } from './types';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { Input } from '../../ui';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ImageCaptchaProps>(), {
  captchaImage: '',
  disabled: false,
  imgAlt: 'captcha',
});

const emit = defineEmits<{
  refresh: [];
}>();

const modelValue = defineModel<string>();

const imageSrc = computed(() => {
  const image = props.captchaImage?.trim();
  if (!image) {
    return '';
  }
  if (image.startsWith('data:image')) {
    return image;
  }
  return `data:image/png;base64,${image}`;
});

function handleRefresh() {
  if (props.disabled) {
    return;
  }
  emit('refresh');
}
</script>

<template>
  <div class="flex w-full items-center gap-2">
    <Input
      v-bind="$attrs"
      v-model="modelValue"
      :class="cn('grow', props.class)"
      :disabled="disabled"
    />
    <button
      class="border-input bg-background inline-flex h-10 w-40 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border px-1 text-xs"
      type="button"
      :disabled="disabled"
      @click="handleRefresh"
    >
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="imgAlt"
        class="h-full w-full object-cover"
      />
      <span v-else class="text-muted-foreground">captcha</span>
    </button>
  </div>
</template>
