import lodash from 'lodash';
import { markRaw, provide, ref } from 'vue';

export default function () {
  provide('mountContent', (content) => {
    content.mountKey = (Math.random() + 1).toString(36).substr(2, 8);
    contents.value.push(markRaw(content));
  });

  provide('unmountContent', (mountKey, status = null, data = {}) => {
    var content = lodash.first(
      lodash.remove(contents.value, (content) => content.mountKey === mountKey)
    );
    if (!content) {
      return;
    }
    if (status === true && content.success) {
      content.success(data);
    }
    if (status === false && content.fail) {
      content.fail(data);
    }
    if (status === null && content.complete) {
      content.complete(data);
    }
  });

  const contents = ref([]);

  return {
    contents,
  };
}
