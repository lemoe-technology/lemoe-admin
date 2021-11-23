<template>
  <component
    :is="mediumComponent"
    :title="title"
    :mount-key="mountKey"
    :fullscreen="fullscreen"
  >
    <slot>
      <component :is="content" :="$attrs" />
    </slot>
  </component>
</template>

<script>
export default {
  name: 'LeContainer',
  inheritAttrs: false,
};
</script>

<script setup>
import { computed } from 'vue';

import { LeDialog, LeDrawer, LePaper } from '@lemoe-admin/components';

const props = defineProps({
  medium: {
    type: String,
    required: true,
    validator(value) {
      return ['paper', 'dialog', 'drawer'].includes(value);
    },
  },
  content: {
    type: Object,
    default() {
      return null;
    },
  },
  title: {
    type: String,
    default: '',
  },
  mountKey: {
    type: String,
    default: '',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
});

const mediumDict = {
  dialog: LeDialog,
  drawer: LeDrawer,
  paper: LePaper,
};
const mediumComponent = computed(() => mediumDict[props.medium]);
</script>
