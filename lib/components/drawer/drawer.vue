<template>
  <el-drawer
    :model-value="isVisible"
    append-to-body
    :close-on-click-modal="false"
    custom-class="le-drawer"
    destroy-on-close
    :show-close="false"
    size="50%"
    @close="closeContent"
  >
    <template #title>
      <div class="drawer-header">
        <span class="drawer-header-title">{{ title }}</span>
        <div class="drawer-header-right">
          <el-button
            type="text"
            style="color: var(--el-color-info)"
            :icon="Close"
            @click="() => (isVisible = false)"
          />
        </div>
      </div>
    </template>
    <div style="padding: var(--el-main-padding)">
      <slot />
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'LeDrawer',
  inheritAttrs: false,
};
</script>

<script setup>
import { Close } from '@icon-park/vue-next';
import { ref } from 'vue';

import { useCloseContent, useLoading } from '@lemoe-admin/composables';

const { closeContent } = useCloseContent(props.mountKey);
useLoading();

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  mountKey: {
    type: String,
    required: true,
  },
});

const isVisible = ref(true);
</script>

<style lang="scss">
.le-drawer {
  .drawer-header {
    display: flex;

    &-title {
      line-height: 32px;
      color: var(--el-text-color-primary);
      font-size: 18px;
      font-weight: bold;
    }

    &-right {
      margin-left: auto;
    }
  }
}
</style>
