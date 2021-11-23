<template>
  <div class="le-pagination">
    <el-pagination
      v-model:page-size="form.pageSize"
      v-model:current-page="form.currentPage"
      :total="form.total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSearch"
      @current-change="handleSearch"
    />
  </div>
</template>

<script>
export default {
  name: 'LePagination',
};
</script>

<script setup>
import lodash from 'lodash';
import { inject, ref, watch } from 'vue';

const updatePagination = inject('updatePagination');

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
});

const form = ref(lodash.cloneDeep(props.pagination));

watch(
  () => props.pagination,
  (value) => {
    form.value = lodash.cloneDeep(value);
  }
);

const handleSearch = () => {
  updatePagination(form);
};
</script>

<style lang="scss">
.le-pagination {
  margin-top: 24px;
  text-align: center;
}
</style>
