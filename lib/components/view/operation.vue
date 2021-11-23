<template>
  <div class="le-operation">
    <slot name="operation-store">
      <el-button
        v-if="structure.storable"
        size="small"
        type="primary"
        :icon="Plus"
        @click="$emit('operate', { action: 'store' })"
      >
        新建
      </el-button>
    </slot>

    <slot name="operation" />

    <div class="operation-right">
      <el-popover
        v-if="structure.columnConfigable"
        trigger="click"
        :width="400"
        popper-class="column-config-table"
      >
        <template #reference>
          <el-button size="small" type="text" :icon="Setting" />
        </template>
        <el-table
          :key="structure.table.reduce((acc, value) => acc + value.name, '')"
          :data="configableColumns"
        >
          <el-table-column property="title" label="名称" />
          <el-table-column property="viewVisible" label="是否显示">
            <template #default="scope">
              <el-switch v-model="scope.row.viewVisible" />
            </template>
          </el-table-column>
          <el-table-column label="排序">
            <template #default>
              <el-icon><drag /></el-icon>
            </template>
          </el-table-column>
        </el-table>
      </el-popover>

      <el-tooltip content="刷新" placement="top">
        <el-button
          size="small"
          type="text"
          :icon="Refresh"
          @click="handleSearch"
        />
      </el-tooltip>

      <slot name="operation-right" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeOperation',
  inheritAttrs: false,
};
</script>

<script setup>
import { Drag, Plus, Refresh, Setting } from '@icon-park/vue-next';
import Sortable from 'sortablejs';
import { computed, inject, nextTick, onMounted } from 'vue';

const handleSearch = inject('handleSearch');

defineEmits(['operate']);

const props = defineProps({
  structure: {
    type: Object,
    required: true,
  },
});

const configableColumns = computed(() =>
  props.structure.table.filter((column) => column.columnConfigable)
);

onMounted(() => {
  if (props.structure.columnConfigable) {
    initSort();
  }
});

const initSort = () => {
  Sortable.create(document.querySelector('.column-config-table tbody'), {
    onEnd({ newIndex, oldIndex }) {
      const structure = props.structure;
      const temp = structure.table.splice(oldIndex, 1)[0];
      structure.table.splice(newIndex, 0, temp);
      nextTick(initSort);
    },
  });
};
</script>

<style lang="scss">
.le-operation {
  display: flex;
  margin: 16px 0;
  padding: 0px 16px;

  .operation-right {
    display: flex;
    margin-left: auto;
  }
}
</style>
