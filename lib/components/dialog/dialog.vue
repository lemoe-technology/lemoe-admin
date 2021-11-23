<template>
  <el-dialog
    :model-value="true"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :title="title"
    width="70%"
    @close="closeContent"
  >
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
