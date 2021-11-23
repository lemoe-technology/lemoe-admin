import lodash from 'lodash';
import { ElMessage } from 'element-plus';
import { inject, onMounted, ref } from 'vue';

import initStructure from '@lemoe-admin/utils/initStructure';
import { useRequest } from '@lemoe-admin/composables';

export default function useForm(structure, id, options = {}) {
  structure = initStructure(structure);

  const { request } = useRequest();
  const show = lodash.get(options, 'api.show', (id, data = {}) =>
    request(structure.api.show(id, data))
  );
  const store = lodash.get(options, 'api.store', (data) =>
    request(structure.api.store(data))
  );
  const update = lodash.get(options, 'api.update', (id, data) =>
    request(structure.api.update(id, data))
  );

  const closeContent = inject('closeContent');

  const isNew = ref(id === 0);
  const item = ref(lodash.get(structure, 'defaultItem', {}));

  onMounted(async () => {
    if (lodash.isObject(options.item)) {
      item.value = options.item;
    } else if (!isNew.value) {
      if (lodash.has(options, 'api.beforeShow')) {
        options.api.beforeShow(id);
      }
      const data = ref((await show(id)).data);
      if (lodash.has(options, 'api.afterShow')) {
        options.api.afterShow(data);
      }
      item.value = data.value;
    }
  });

  const handleSave = async (form) => {
    if (isNew.value) {
      if (lodash.has(options, 'api.beforeStore')) {
        options.api.beforeStore(form, item);
      }
      await store(form.value);
      if (lodash.has(options, 'api.afterStore')) {
        options.api.afterStore(form, item);
      }
    } else {
      if (lodash.has(options, 'api.beforeUpdate')) {
        options.api.beforeUpdate(form, item);
      }
      await update(id, form.value);
      if (lodash.has(options, 'api.afterUpdate')) {
        options.api.afterUpdate(form, item);
      }
    }
    ElMessage.success({
      message: '保存成功',
    });
    closeContent(true);
  };

  return {
    structure,
    isNew,
    item,
    handleSave,
  };
}
