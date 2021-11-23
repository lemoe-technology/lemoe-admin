<template>
  <div class="le-form">
    <el-skeleton :loading="isShowSkeleton" animated>
      <template #template>
        <div v-for="index in skeletonLength" :key="index" class="skeleton">
          <div class="skeleton-title">
            <el-skeleton-item variant="text" />
          </div>
          <el-skeleton-item variant="text" />
        </div>
      </template>
    </el-skeleton>

    <el-form
      v-show="!isShowSkeleton"
      ref="formEl"
      :model="form"
      :rules="rules"
      label-width="120px"
      @submit.prevent
    >
      <slot name="form-head" :form="form" />
      <template v-for="column in editableColumns" :key="column.name">
        <slot :name="`before-${column.name}`" :form="form" />
        <slot :name="column.name" :form="form" :column="column">
          <el-form-item :label="column.title" :prop="column.name">
            <slot
              :name="`${column.name}-content`"
              :form="form"
              :column="column"
            >
              <template v-if="column.type === 'foreign'">
                <el-select-v2
                  v-model="form[column.name]"
                  class="foreign-select"
                  :options="foreignOptions[column.name].data"
                  clearable
                  :placeholder="column.title"
                  filterable
                  remote
                  :remote-method="
                    (keyword) => fetchForeignOptions(column, keyword)
                  "
                  :loading="foreignOptions[column.name].isLoading"
                  style="width: 194.5px"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                />
                <el-tooltip content="新建" placement="bottom">
                  <el-button
                    v-if="lodash.get(column, 'foreignOptions.form')"
                    class="foreign-btn"
                    type="info"
                    :icon="Newlybuild"
                    @click="handleForeignForm(item[column.name], column)"
                  />
                </el-tooltip>
              </template>
              <template v-else-if="column.type === 'text'">
                <el-input
                  v-model="form[column.name]"
                  :placeholder="column.title"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                >
                  <template
                    v-if="lodash.get(column, 'typeOptions.prepend')"
                    #prepend
                  >
                    {{ column.typeOptions.prepend }}
                  </template>
                  <template
                    v-if="lodash.get(column, 'typeOptions.append')"
                    #append
                  >
                    {{ column.typeOptions.append }}
                  </template>
                </el-input>
              </template>
              <template v-else-if="column.type === 'paragraph'">
                <el-input
                  v-model="form[column.name]"
                  :placeholder="column.title"
                  type="textarea"
                  :autosize="{ minRows: 5, maxRows: 20 }"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                />
              </template>
              <template v-else-if="column.type === 'number'">
                <el-input-number
                  v-model="form[column.name]"
                  :placeholder="column.title"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                />
              </template>
              <template v-else-if="column.type === 'select'">
                <el-select-v2
                  v-model="form[column.name]"
                  :options="column.options"
                  clearable
                  :placeholder="column.title"
                  filterable
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                />
              </template>
              <template v-else-if="column.type === 'radio'">
                <el-radio-group
                  v-model="form[column.name]"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                >
                  <el-radio
                    v-for="option in column.options"
                    :key="option.value"
                    :label="option.value"
                  >
                    {{ option.label }}
                  </el-radio>
                </el-radio-group>
              </template>
              <template v-else-if="column.type === 'checkbox'">
                <el-checkbox-group
                  v-model="form[column.name]"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                >
                  <el-checkbox
                    v-for="option in column.options"
                    :key="option.value"
                    :label="option.value"
                  >
                    {{ option.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-else-if="column.type === 'date'">
                <el-date-picker
                  v-model="form[column.name]"
                  type="date"
                  :placeholder="column.title"
                  value-format="YYYY-MM-DD"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                />
              </template>
              <template v-else-if="column.type === 'time'">
                <el-time-picker
                  v-model="form[column.name]"
                  :placeholder="column.title"
                  value-format="HH:mm:ss"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                />
              </template>
              <template v-else-if="column.type === 'datetime'">
                <el-date-picker
                  v-model="form[column.name]"
                  type="datetime"
                  :placeholder="column.title"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :="column.typeOptions"
                  @change="
                    (value) =>
                      emits('change', {
                        data: { name: column.name, value },
                        form,
                      })
                  "
                />
              </template>
              <template v-else-if="column.type === 'media'">
                <media-uploader
                  v-model="form[column.name]"
                  :upload="column.upload"
                  :="column.typeOptions"
                />
              </template>
            </slot>
          </el-form-item>
        </slot>
        <slot :name="`after-${column.name}`" :form="form" />
      </template>
      <slot name="form-tail" :form="form" />
    </el-form>

    <slot name="footer" :form="form" />

    <div class="save-btn">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="isLoading" @click="handleSave">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeForm',
  inheritAttrs: false,
};
</script>

<script setup>
import { Newlybuild } from '@icon-park/vue-next';
import lodash from 'lodash';
import { computed, inject, nextTick, ref, useSlots, watch } from 'vue';

import { MediaUploader } from '@lemoe-admin/components';
import { useForeignOptions } from '@lemoe-admin/composables';

const { foreignOptions, fetchForeignOptions, initForeignOptions } =
  useForeignOptions(props.structure);
const slots = useSlots();

const closeContent = inject('closeContent');
const isLoading = inject('isLoading');
const mountContent = inject('mountContent');

const emits = defineEmits(['change', 'save']);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  structure: {
    type: Object,
    required: true,
  },
  isNew: {
    type: Boolean,
    required: true,
  },
});

const formEl = ref(null);
const isSplashScreen = ref(!props.isNew && !props.structure.pivot);
const form = ref(
  lodash.cloneDeep(
    props.isNew || !props.structure.pivot
      ? props.item
      : props.item[props.structure.pivot]
  )
);

const editableColumns = computed(() =>
  props.structure.table.filter((column) => {
    if (
      ['id', 'created_at', 'updated_at', 'deleted_at'].includes(column.name)
    ) {
      return false;
    }
    return props.isNew ? column.storable : column.updatable;
  })
);
const rules = computed(() => {
  const rules = {};
  editableColumns.value.forEach((column) => {
    if (column.rules) {
      rules[column.name] = column.rules;
    } else {
      if (
        [
          'foreign',
          'select',
          'radio',
          'checkbox',
          'date',
          'time',
          'datetime',
        ].includes(column.type)
      ) {
        rules[column.name] = [
          {
            required: true,
            message: `请选择${column.title}`,
          },
        ];
      } else if (column.type === 'image') {
        rules[column.name] = [
          {
            type: 'array',
            required: true,
            message: `请上传${column.title}`,
          },
        ];
      } else if (column.type === 'text') {
        rules[column.name] = [
          {
            required: true,
            message: `请输入${column.title}`,
          },
        ];
      } else if (column.type === 'number') {
        rules[column.name] = [
          {
            type: 'number',
            required: true,
            message: `请输入${column.title}`,
          },
        ];
      } else {
        rules[column.name] = [
          {
            required: true,
            message: `请输入${column.title}`,
          },
        ];
      }
    }
  });
  return rules;
});
const isShowSkeleton = computed(() => isSplashScreen.value && isLoading.value);
const skeletonLength = computed(() => {
  if (lodash.values(slots).length > 0) {
    let count = 0;
    lodash
      .keys(slots)
      .filter((key) => {
        if (key === 'form-head' || key === 'form-tail') {
          return true;
        } else if (key.startsWith('before') || key.startsWith('after')) {
          return true;
        }
        return false;
      })
      .forEach((key) => {
        count += slots[key](props.item).length;
      });
    return editableColumns.value.length + count;
  }
  return editableColumns.value.length;
});

watch(
  () => props.item,
  (value) => {
    const obj = !props.structure.pivot ? value : value[props.structure.pivot];
    const extraFields = lodash.get(props.structure, 'extraFields', []);
    form.value = lodash.cloneDeep(
      Object.keys(obj)
        .filter(
          (key) =>
            editableColumns.value.some((column) => column.name === key) ||
            extraFields.some((field) => field === key)
        )
        .reduce((previousValue, currentValue) => {
          return Object.assign(previousValue, {
            [currentValue]: obj[currentValue],
          });
        }, {})
    );
  }
);
const stopWatchIsLoading = watch(isLoading, (value) => {
  if (!value && isSplashScreen.value) {
    isSplashScreen.value = false;
    stopWatchIsLoading();
  }
});

// eslint-disable-next-line no-unused-vars
const getForm = () => form.value;

// eslint-disable-next-line no-unused-vars
const updateForm = (data) => {
  form.value = {
    ...form.value,
    ...data,
  };
};

// eslint-disable-next-line no-unused-vars
const validate = (name = '') => {
  nextTick(() => {
    if (name) {
      formEl.value.validateField(name);
    } else {
      formEl.value.validate().catch(() => null);
    }
  });
};

const handleCancel = () => {
  closeContent();
};

const handleSave = async () => {
  if (!(await formEl.value.validate().catch(() => null))) {
    return;
  }
  emits('save', form);
};

const handleForeignForm = (id, column) => {
  mountContent({
    medium: 'dialog',
    content: column.foreignOptions.form,
    attrs: {
      id: 0,
      title: `编辑${column.title}`,
    },
    success: () => initForeignOptions(column),
  });
};

defineExpose({
  getForm,
  updateForm,
  validate,
});
</script>

<style lang="scss">
.le-form {
  .skeleton {
    display: flex;
    height: 40px;
    margin-bottom: 22px;

    &-title {
      width: 120px;
      padding-right: 12px;
    }
  }

  .foreign {
    &-select {
      .el-select-v2__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    &-btn {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
  }

  .save-btn {
    text-align: center;
  }
}
</style>
