<template>
  <div class="le-pagination">
    <el-pagination
      small
      background
      :page-size="form.pageSize"
      :total="form.total"
      :current-page="form.currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'LePagination',
  inheritAttrs: false,
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

const handleSizeChange = (value) => {
  form.value.pageSize = value;
  updatePagination(form);
};

const handleCurrentChange = (value) => {
  form.value.currentPage = value;
  updatePagination(form);
};
</script>

<style lang="scss">
.le-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
