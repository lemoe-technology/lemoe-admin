<template>
  <div class="le-description">
    <el-skeleton :loading="isShowSkeleton" animated>
      <template #template>
        <div v-for="index in skeletonLength" :key="index" class="skeleton">
          <el-skeleton-item variant="text" />
        </div>
      </template>
    </el-skeleton>

    <template v-if="!isLoading && !lodash.isEmpty(item)">
      <el-descriptions v-if="!isShowSkeleton" border :column="1">
        <slot name="descriptions-head" :form="item" />
        <template v-for="column in visibleColumns" :key="column.name">
          <slot :name="`before-${column.name}`" :form="item" />
          <slot :name="column.name" :form="item" :column="column">
            <el-descriptions-item
              :label="column.title"
              label-class-name="description-label"
            >
              <slot
                :name="`${column.name}-content`"
                :form="item"
                :column="column"
              >
                <template v-if="column.type === 'select'">
                  <el-tag>
                    {{ column.optionDict[getValue(item, column)] }}
                  </el-tag>
                </template>
                <template v-else-if="column.type === 'radio'">
                  <el-tag
                    v-if="column.typeOptions.whether === true"
                    :type="getTagType(getValue(item, column))"
                  >
                    {{ column.optionDict[getValue(item, column)] }}
                  </el-tag>
                  <el-tag v-else>
                    {{ column.optionDict[getValue(item, column)] }}
                  </el-tag>
                </template>
                <template v-else-if="column.type === 'checkbox'">
                  <el-space wrap>
                    <el-tag
                      v-for="value in getValue(item, column)"
                      :key="value"
                    >
                      {{ column.optionDict[value] }}
                    </el-tag>
                  </el-space>
                </template>
                <template v-else-if="column.type === 'foreign'">
                  <el-space v-if="column.typeOptions.multiple === true" wrap>
                    <el-tag
                      v-for="value in getForeignValues(item, column)"
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
                          v-if="column.foreignOptions.view"
                          size="12"
                          class="el-icon--right"
                          @click="handleForeignView(value.id, column)"
                        >
                          <internal-expansion />
                        </el-icon>
                      </div>
                    </el-tag>
                  </el-space>
                  <el-tag v-else-if="item[column.name] !== null">
                    <div style="display: flex">
                      <span>{{ getForeignValue(item, column) }}</span>
                      <el-icon
                        v-if="column.foreignOptions.view"
                        size="12"
                        class="el-icon--right"
                        @click="
                          handleForeignView(getValue(item, column), column)
                        "
                      >
                        <internal-expansion />
                      </el-icon>
                    </div>
                  </el-tag>
                </template>
                <template v-else-if="column.type === 'media'">
                  <template v-if="column.typeOptions.type === 'image'">
                    <el-image
                      v-for="url in getValue(item, column)"
                      :key="url"
                      :src="url"
                      fit="contain"
                      lazy
                      :preview-src-list="getValue(item, column)"
                      preview-teleported
                      class="media"
                    />
                  </template>
                  <template v-if="column.typeOptions.type === 'video'">
                    <video
                      v-for="url in getValue(item, column)"
                      :key="url"
                      :src="url"
                      class="media"
                      @click="(e) => e.target.requestFullscreen()"
                    />
                  </template>
                </template>
                <template v-else-if="column.type === 'paragraph'">
                  <span class="paragraph">
                    {{ getValue(item, column) }}
                  </span>
                </template>
                <template v-else>
                  <slot
                    :name="`${column.name}-prefix`"
                    :form="item"
                    :column="column"
                  />
                  {{ getValue(item, column) }}
                  <slot
                    :name="`${column.name}-suffix`"
                    :form="item"
                    :column="column"
                  />
                </template>
              </slot>
            </el-descriptions-item>
          </slot>
          <slot :name="`after-${column.name}`" :form="item" />
        </template>
        <slot name="descriptions-tail" :form="item" />
      </el-descriptions>
    </template>
    <el-empty v-else />

    <slot name="footer" :form="item" />

    <div class="close-btn">
      <el-button @click="handleCancel">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeDescription',
  inheritAttrs: false,
};
</script>

<script setup>
import { InternalExpansion } from '@icon-park/vue-next';
import lodash from 'lodash';
import { computed, inject, ref, useSlots, watch } from 'vue';

const slots = useSlots();

const closeContent = inject('closeContent');
const isLoading = inject('isLoading');
const mountContent = inject('mountContent');

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  structure: {
    type: Object,
    required: true,
  },
});

const isSplashScreen = ref(true);

const visibleColumns = computed(() =>
  props.structure.table.filter((column) => column.descriptionVisible)
);
const isShowSkeleton = computed(() => isSplashScreen.value && isLoading.value);
const skeletonLength = computed(() => {
  if (lodash.values(slots).length > 0) {
    let count = 0;
    lodash
      .keys(slots)
      .filter((key) => {
        if (key === 'descriptions-head' || key === 'descriptions-tail') {
          return true;
        } else if (key.startsWith('before') || key.startsWith('after')) {
          return true;
        }
        return false;
      })
      .forEach((key) => {
        count += slots[key](props.item).length;
      });
    return visibleColumns.value.length + count;
  }
  return visibleColumns.value.length;
});

const stopWatchIsLoading = watch(isLoading, (value) => {
  if (!value && isSplashScreen.value) {
    isSplashScreen.value = false;
    stopWatchIsLoading();
  }
});

const handleCancel = () => {
  closeContent();
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
.le-description {
  .skeleton {
    height: 20px;
    padding: 13px 0;
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

  .close-btn {
    margin-top: 22px;
    text-align: center;
  }
}
</style>
