<script setup lang="ts">
import type { SystemUserProfileApi } from '#/api/system/user/profile';

import { IconifyIcon } from '@vben/icons';

import { ElDescriptions, ElDescriptionsItem } from 'element-plus';

defineProps<{
  profile?: SystemUserProfileApi.UserProfileRespVO;
}>();
</script>
<template>
  <div v-if="profile">
    <div class="mt-8">
      <ElDescriptions :column="2" border label-width="100px">
        <ElDescriptionsItem label="用户账号">
          <template #label>
            <div class="flex items-center">
              <IconifyIcon icon="ant-design:user-outlined" class="mr-1" />
              用户账号
            </div>
          </template>
          {{ profile.username }}
        </ElDescriptionsItem>

        <ElDescriptionsItem label="用户账号">
          <template #label>
            <div class="flex items-center">
              <IconifyIcon icon="ant-design:user-outlined" class="mr-1" />
              姓名
            </div>
          </template>
          {{ profile.name }}
        </ElDescriptionsItem>
        <ElDescriptionsItem>
          <template #label>
            <div class="flex items-center">
              <IconifyIcon icon="ant-design:phone-outlined" class="mr-1" />
              手机号码
            </div>
          </template>
          {{ profile.phone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem>
          <template #label>
            <div class="flex items-center">
              <IconifyIcon icon="ant-design:user-switch-outlined" class="mr-1" />
              所属角色
            </div>
          </template>
          {{ profile.roleName.join(',') }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
  </div>
</template>
