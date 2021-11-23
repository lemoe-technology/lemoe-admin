import lodash from 'lodash';
import { provide, ref, markRaw } from 'vue';

export default function () {
  provide('mountContent', (content) => {
    content.mountKey = (Math.random() + 1).toString(36).slice(2, 10);
    contents.value.push(markRaw(content));
  });

  provide('unmountContent', (mountKey, status = null, data = {}) => {
    var content = lodash.first(
      lodash.remove(contents.value, (content) => content.mountKey === mountKey)
    );
    if (!content) {
      return;
    }
    if (status === true && lodash.isFunction(content.success)) {
      content.success(data);
    }
    if (status === false && lodash.isFunction(content.fail)) {
      content.fail(data);
    }
    if (status === null && lodash.isFunction(content.complete)) {
      content.complete(data);
    }
  });

  const contents = ref([]);

  return {
    contents,
  };
}
