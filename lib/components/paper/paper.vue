<template>
  <div class="le-paper">
    <div class="paper-header">
      <div class="paper-header-title">{{ title }}</div>
    </div>
    <el-card>
      <slot />
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LePaper',
  inheritAttrs: false,
};
</script>

<script setup>
import { useLoading } from '@lemoe-admin/composables';

useLoading();

defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss">
.le-paper {
  .paper-header {
    margin: -20px;
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-bottom: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    &-title {
      color: var(--el-text-color-primary);
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
