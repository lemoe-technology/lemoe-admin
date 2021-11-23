<template>
  <el-drawer
    :model-value="true"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :title="title"
    size="50%"
    @close="closeContent"
  >
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
import { useCloseContent } from '@lemoe-admin/composables';

const { closeContent } = useCloseContent(props.mountKey);

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
</script>
