import { inject, provide } from 'vue';

export default function (mountKey) {
  const unmountContent = inject('unmountContent');

  const closeContent = (status = null, data = {}) => {
    unmountContent(mountKey, status, data);
  };
  provide('closeContent', closeContent);

  return {
    closeContent,
  };
}
