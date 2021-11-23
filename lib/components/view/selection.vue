<template>
  <div v-if="selection.length > 0" class="le-selection">
    <div class="text">已选择 {{ selection.length }} 项</div>

    <slot name="selection-operation" :ids="selectionIds" />

    <slot name="selection-operation-destroy" :scope="scope">
      <el-popconfirm
        v-if="structure.destroyable"
        title="确认删除？"
        :icon="Info"
        icon-color="red"
        @confirm="
          $emit('operate', {
            action: 'bulk-destroy',
            data: { ids: selectionIds },
          })
        "
      >
        <template #reference>
          <el-button type="text">删除</el-button>
        </template>
      </el-popconfirm>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'LeSelection',
};
</script>

<script setup>
import { Info } from 'icon-park-vue3';
import { computed } from 'vue';

defineEmits(['operate']);

const props = defineProps({
  selection: {
    type: Array,
    required: true,
  },
  structure: {
    type: Object,
    required: true,
  },
});

const selectionIds = computed(() =>
  props.selection.map((item) =>
    !props.structure.pivot ? item.id : item[props.structure.pivot].id
  )
);
</script>

<style lang="scss">
.le-selection {
  display: flex;
  margin: 16px 0;
  padding: 6px 15px;
  height: 40px;
  border: 1px solid var(--el-color-primary-light-8);
  border-radius: 6px;
  background: var(--el-color-primary-light-9);

  .text {
    line-height: 40px;
    margin-right: 16px;
  }
}
</style>
