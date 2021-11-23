import lodash from 'lodash';
import { onMounted, ref } from 'vue';

import initStructure from '@lemoe-admin/utils/initStructure';
import { useRequest } from '@lemoe-admin/composables';

export default function (structure, id, options = {}) {
  structure = initStructure(structure);

  const { request } = useRequest();
  const show = lodash.get(options, 'api.show', (id, data = {}) =>
    request(structure.api.show(id, data))
  );

  const item = ref({});

  onMounted(async () => {
    if (lodash.isObject(options.item)) {
      item.value = options.item;
    } else {
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

  return {
    structure,
    item,
  };
}
