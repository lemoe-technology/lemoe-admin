<template>
  <div class="le-search">
    <el-form
      ref="formEl"
      :model="form"
      inline
      :class="{ 'has-more': isShowMoreSearch }"
      @keyup.enter="handleSearch"
    >
      <slot name="search-head" :form="form" />
      <template v-for="column in searchableColumns" :key="column.name">
        <slot :name="`search-before-${column.name}`" :form="form" />
        <slot :name="`search-${column.name}`" :form="form" :column="column">
          <el-form-item :label="column.title" :prop="column.name" size="small">
            <slot
              :name="`search-${column.name}-content`"
              :form="form"
              :column="column"
            >
              <template v-if="column.type === 'foreign'">
                <el-select-v2
                  v-model="form[column.name]"
                  :options="foreignOptions[column.name].data"
                  clearable
                  :placeholder="column.title"
                  filterable
                  remote
                  :remote-method="
                    (keyword) => fetchForeignOptions(column, keyword)
                  "
                  :loading="foreignOptions[column.name].isLoading"
                />
              </template>
              <template
                v-else-if="
                  ['text', 'paragraph', 'number'].includes(column.type)
                "
              >
                <el-input
                  v-model="form[column.name]"
                  :placeholder="column.title"
                  clearable
                />
              </template>
              <template
                v-else-if="
                  ['select', 'radio', 'checkbox'].includes(column.type)
                "
              >
                <el-select-v2
                  v-model="form[column.name]"
                  :options="column.options"
                  clearable
                  :placeholder="column.title"
                  filterable
                />
              </template>
              <template v-else-if="column.type === 'date'">
                <el-date-picker
                  v-model="form[column.name]"
                  type="daterange"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  :shortcuts="shortcuts"
                  clearable
                />
              </template>
              <template v-else-if="column.type === 'time'">
                <el-time-picker
                  v-model="form[column.name]"
                  is-range
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :placeholder="column.title"
                  value-format="HH:mm:ss"
                  clearable
                />
              </template>
              <template v-else-if="column.type === 'datetime'">
                <el-date-picker
                  v-model="form[column.name]"
                  type="datetimerange"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :shortcuts="shortcuts"
                  clearable
                />
              </template>
            </slot>
          </el-form-item>
        </slot>
        <slot :name="`search-after-${column.name}`" :form="form" />
      </template>
      <slot name="search-tail" :form="form" />

      <el-form-item>
        <slot name="search-reset">
          <el-button type="default" size="small" @click="handleReset">
            重置
          </el-button>
        </slot>
        <slot name="search-search">
          <el-button
            type="primary"
            :loading="isLoading"
            size="small"
            @click="handleSearch"
          >
            搜索
          </el-button>
        </slot>
        <slot name="search-operation" />
        <el-button
          v-if="hasMoreSearch"
          type="text"
          :icon="isShowMoreSearch ? Down : Up"
          @click="handleShowMore"
        >
          {{ isShowMoreSearch ? '展开' : '收起' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'LeSearch',
  inheritAttrs: false,
};
</script>

<script setup>
import { Down, Up } from '@icon-park/vue-next';
import dayjs from 'dayjs';
import lodash from 'lodash';
import { computed, inject, ref, watch } from 'vue';

import { useForeignOptions } from '@lemoe-admin/composables';

const { foreignOptions, fetchForeignOptions } = useForeignOptions(
  props.structure
);

const isLoading = inject('isLoading');
const updateQuery = inject('updateQuery');

const props = defineProps({
  query: {
    type: Object,
    required: true,
  },
  structure: {
    type: Object,
    required: true,
  },
});

const formEl = ref(null);
const isShowMoreSearch = ref(true);
const form = ref(lodash.cloneDeep(props.query));
const shortcuts = ref([
  {
    text: '今天',
    value: () => [dayjs().startOf('day'), dayjs().endOf('day')],
  },
  {
    text: '昨天',
    value: () => [
      dayjs().subtract(1, 'day').startOf('day'),
      dayjs().subtract(1, 'day').endOf('day'),
    ],
  },
  {
    text: '最近一周',
    value: () => [
      dayjs().subtract(7, 'day').startOf('day'),
      dayjs().endOf('day'),
    ],
  },
  {
    text: '最近一个月',
    value: () => [
      dayjs().subtract(30, 'day').startOf('day'),
      dayjs().endOf('day'),
    ],
  },
  {
    text: '最近三个月',
    value: () => [
      dayjs().subtract(90, 'day').startOf('day'),
      dayjs().endOf('day'),
    ],
  },
  {
    text: '最近六个月',
    value: () => [
      dayjs().subtract(180, 'day').startOf('day'),
      dayjs().endOf('day'),
    ],
  },
  {
    text: '最近一年',
    value: () => [
      dayjs().subtract(365, 'day').startOf('day'),
      dayjs().endOf('day'),
    ],
  },
]);

const searchableColumns = computed(() =>
  props.structure.table.filter((column) => column.searchable)
);
const hasMoreSearch = computed(() => {
  if (formEl.value) {
    return formEl.value.$el.querySelectorAll('.el-form-item').length > 4;
  }
  return false;
});

watch(
  () => props.query,
  (value) => {
    form.value = lodash.cloneDeep(value);
  }
);

const handleSearch = () => {
  updateQuery(form);
};

const handleReset = () => {
  if (
    Object.values(form.value).some(
      (field) => typeof field != 'undefined' && field !== ''
    )
  ) {
    formEl.value.resetFields();
  }
  updateQuery(form);
};

const handleShowMore = () => {
  isShowMoreSearch.value = !isShowMoreSearch.value;
};
</script>

<style lang="scss">
.le-search {
  margin: 16px 0;
  padding: 0px 16px;

  .el-form {
    &.has-more {
      .el-form-item:nth-child(n + 4):not(:last-child) {
        display: none;
      }
    }
  }
}
</style>
