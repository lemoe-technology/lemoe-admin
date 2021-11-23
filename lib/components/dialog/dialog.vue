<template>
  <el-dialog
    :model-value="isVisible"
    width="70%"
    :fullscreen="isFullscreen"
    append-to-body
    custom-class="le-dialog"
    :close-on-click-modal="false"
    :show-close="false"
    draggable
    destroy-on-close
    @close="closeContent"
  >
    <template #title>
      <div class="dialog-header">
        <span class="dialog-header-title">{{ title }}</span>
        <div class="dialog-header-right">
          <el-button
            type="text"
            style="color: var(--el-color-info)"
            :icon="isFullscreen ? OffScreen : FullScreen"
            @click="() => (isFullscreen = !isFullscreen)"
          />

          <el-button
            type="text"
            style="color: var(--el-color-info)"
            :icon="Close"
            @click="() => (isVisible = false)"
          />
        </div>
      </div>
    </template>
    <slot />
  </el-dialog>
</template>

<script>
export default {
  name: 'LeDialog',
  inheritAttrs: false,
};
</script>

<script setup>
import { Close, FullScreen, OffScreen } from '@icon-park/vue-next';
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
  fullscreen: {
    type: Boolean,
    default: false,
  },
});

const isVisible = ref(true);
const isFullscreen = ref(props.fullscreen);
</script>

<style lang="scss">
.le-dialog {
  .dialog-header {
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
