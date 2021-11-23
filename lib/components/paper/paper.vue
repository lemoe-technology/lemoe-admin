<template>
  <div>
    <h3>{{ title }}</h3>
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
defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>
