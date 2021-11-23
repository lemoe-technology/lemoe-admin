<template>
  <div class="le-table">
    <el-table
      ref="tableEl"
      v-loading="isLoading"
      :data="list"
      stripe
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column v-if="structure.selectable" type="selection" />

      <slot name="table-head" />
      <template v-for="(column, index) in visibleColumns" :key="index">
        <slot :name="`table-before-${column.name}`" :column="column" />
        <slot :name="`table-${column.name}`" :column="column">
          <el-table-column
            :prop="column.name"
            :label="column.title"
            :sortable="structure.sortable && column.sortable"
            :min-width="column.type === 'media' ? 108 : 80"
          >
            <template #default="scope">
              <slot
                :name="`table-${column.name}-content`"
                :scope="scope"
                :column="column"
              >
                <template v-if="column.type === 'select'">
                  <el-tag>
                    {{ column.optionDict[getValue(scope.row, column)] }}
                  </el-tag>
                </template>
                <template v-else-if="column.type === 'radio'">
                  <el-tag
                    v-if="column.typeOptions.whether === true"
                    :type="getTagType(getValue(scope.row, column))"
                  >
                    {{ column.optionDict[getValue(scope.row, column)] }}
                  </el-tag>
                  <el-tag v-else>
                    {{ column.optionDict[getValue(scope.row, column)] }}
                  </el-tag>
                </template>
                <template v-else-if="column.type === 'checkbox'">
                  <el-space wrap>
                    <el-tag
                      v-for="value in getValue(scope.row, column)"
                      :key="value"
                    >
                      {{ column.optionDict[value] }}
                    </el-tag>
                  </el-space>
                </template>
                <template v-else-if="column.type === 'foreign'">
                  <el-space v-if="column.typeOptions.multiple === true" wrap>
                    <el-tag
                      v-for="value in getForeignValues(scope.row, column)"
                      :key="value"
                    >
                      <div style="display: flex">
                        <span>
                          {{
                            value[
                              lodash.get(column, 'foreignOptions.field', 'name')
                            ]
                          }}
                        </span>
                        <el-icon
                          v-if="lodash.get(column, 'foreignOptions.view')"
                          size="12"
                          class="el-icon--right"
                          @click="handleForeignView(value.id, column)"
                        >
                          <internal-expansion />
                        </el-icon>
                      </div>
                    </el-tag>
                  </el-space>
                  <el-tag v-else-if="scope.row[column.name] !== null">
                    <div style="display: flex">
                      <span>{{ getForeignValue(scope.row, column) }}</span>
                      <el-icon
                        v-if="lodash.get(column, 'foreignOptions.view')"
                        size="12"
                        class="el-icon--right"
                        @click="
                          handleForeignView(getValue(scope.row, column), column)
                        "
                      >
                        <internal-expansion />
                      </el-icon>
                    </div>
                  </el-tag>
                </template>
                <template v-else-if="column.type === 'media'">
                  <el-space wrap alignment="start">
                    <template v-if="column.typeOptions.type === 'image'">
                      <el-image
                        v-for="url in getValue(scope.row, column)"
                        :key="url"
                        :src="url"
                        fit="contain"
                        lazy
                        :preview-src-list="getValue(scope.row, column)"
                        preview-teleported
                        class="media"
                      />
                    </template>
                    <template v-if="column.typeOptions.type === 'video'">
                      <video
                        v-for="url in getValue(scope.row, column)"
                        :key="url"
                        :src="url"
                        class="media"
                        @click="(e) => e.target.requestFullscreen()"
                      />
                    </template>
                  </el-space>
                </template>
                <template v-else-if="column.type === 'paragraph'">
                  <span class="paragraph">
                    {{ getValue(scope.row, column) }}
                  </span>
                </template>
                <template v-else>
                  <slot
                    :name="`table-${column.name}-prefix`"
                    :scope="scope"
                    :column="column"
                  />
                  {{ getValue(scope.row, column) }}
                  <slot
                    :name="`table-${column.name}-suffix`"
                    :scope="scope"
                    :column="column"
                  />
                </template>
              </slot>
            </template>
          </el-table-column>
        </slot>
        <slot :name="`table-after-${column.name}`" :column="column" />
      </template>
      <slot name="table-tail" />

      <el-table-column
        v-if="structure.tableOperable"
        label="操作"
        fixed="right"
        min-width="200"
        align="center"
      >
        <template #default="scope">
          <slot name="table-operation-view" :scope="scope">
            <el-button
              v-if="structure.viewable"
              type="text"
              @click="$emit('operate', { action: 'show', data: scope.row })"
            >
              查看
            </el-button>
          </slot>

          <slot name="table-operation-update" :scope="scope">
            <el-button
              v-if="structure.updatable"
              type="text"
              @click="$emit('operate', { action: 'update', data: scope.row })"
            >
              编辑
            </el-button>
          </slot>

          <slot name="table-operation" :scope="scope" />

          <slot name="table-operation-destroy" :scope="scope">
            <el-popconfirm
              v-if="structure.destroyable"
              title="确认删除？"
              @confirm="
                $emit('operate', { action: 'destroy', data: scope.row })
              "
            >
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </slot>

          <el-dropdown
            v-if="$slots['table-operation-more']"
            style="margin-left: 10px"
            @command="
              (command) =>
                $emit('operate', { action: command, data: scope.row })
            "
          >
            <el-button type="text">
              更多
              <el-icon class="el-icon--right"><down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <slot name="table-operation-more" :scope="scope" />
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'LeTable',
  inheritAttrs: false,
};
</script>

<script setup>
import { Down, InternalExpansion } from '@icon-park/vue-next';
import lodash from 'lodash';
import { computed, inject, ref } from 'vue';

const isLoading = inject('isLoading');
const mountContent = inject('mountContent');
const updateSelection = inject('updateSelection');
const updateSort = inject('updateSort');

defineEmits(['operate']);

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
  sort: {
    type: Object,
    required: true,
  },
  structure: {
    type: Object,
    required: true,
  },
});

const tableEl = ref(null);

const visibleColumns = computed(() => {
  const columns = props.structure.table.filter((column) => column.viewVisible);
  if (tableEl.value) {
    tableEl.value.doLayout();
  }
  return columns;
});

const handleSelectionChange = (selection) => {
  updateSelection(selection);
};

const handleSortChange = (sort) => {
  updateSort(sort);
};

const getValue = (data, column) => {
  const value = props.structure.pivot
    ? lodash.get(data, `${props.structure.pivot}.${column.name}`)
    : lodash.get(data, column.name);
  return column.formatter ? column.formatter(value, data, column) : value;
};

const getForeignValue = (data, column) => {
  const found = column.name.match(/^(\w+)_id$/);
  const model = column.foreignOptions.model || found[1];
  const field = column.foreignOptions.field || 'name';
  if (column.foreignOptions.isPivotForeignKey) {
    return lodash.get(data, field);
  } else if (props.structure.pivot) {
    return lodash.get(data, `${props.structure.pivot}.${model}.${field}`);
  } else {
    return lodash.get(data, `${model}.${field}`);
  }
};

const getForeignValues = (data, column) => {
  const model = column.foreignOptions.model;
  if (props.structure.pivot) {
    return lodash.get(data, `${props.structure.pivot}.${model}`);
  } else {
    return lodash.get(data, model);
  }
};

const getTagType = (value) => {
  if (value === 0) {
    return 'danger';
  } else if (value === 1) {
    return 'success';
  } else {
    return '';
  }
};

const handleForeignView = (id, column) => {
  mountContent({
    medium: 'dialog',
    content: column.foreignOptions.view,
    attrs: {
      id,
      title: `查看${column.title}`,
    },
  });
};
</script>

<style lang="scss">
.le-table {
  .el-table .cell {
    text-overflow: initial;
  }

  .media {
    width: 100px;
    height: 100px;
    border-radius: 6px;
    object-fit: contain;
  }

  .paragraph {
    white-space: pre-line;
  }
}
</style>
