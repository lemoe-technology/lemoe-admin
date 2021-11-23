<template>
  <div class="le-view">
    <template v-if="structure.searchable">
      <le-search :query="query" :structure="structure">
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </le-search>

      <el-divider />
    </template>

    <le-operation
      v-if="structure.operable"
      :structure="structure"
      @operate="(data) => $emit('operate', data)"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </le-operation>

    <le-selection
      v-if="structure.selectable"
      :selection="selection"
      :structure="structure"
      @operate="(data) => $emit('operate', data)"
    >
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </le-selection>

    <slot name="body" :list="list" :sort="sort" :structure="structure">
      <le-table
        :list="list"
        :sort="sort"
        :structure="structure"
        @operate="(data) => $emit('operate', data)"
      >
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </le-table>
    </slot>

    <le-pagination v-if="structure.pageable" :pagination="pagination" />
  </div>
</template>

<script>
export default {
  name: 'LeView',
  inheritAttrs: false,
};
</script>

<script setup>
import LeOperation from './operation.vue';
import LePagination from './pagination.vue';
import LeSearch from './search.vue';
import LeSelection from './selection.vue';
import LeTable from './table.vue';

defineEmits(['operate']);

defineProps({
  list: {
    type: Array,
    required: true,
  },
  query: {
    type: Object,
    required: true,
  },
  sort: {
    type: Object,
    required: true,
  },
  pagination: {
    type: Object,
    required: true,
  },
  selection: {
    type: Array,
    required: true,
  },
  structure: {
    type: Object,
    required: true,
  },
});
</script>
