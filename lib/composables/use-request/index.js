import { inject } from 'vue';

export default function (showLoading = null, hideLoading = null) {
  const show = inject('showLoading', showLoading);
  const hide = inject('hideLoading', hideLoading);

  const request = async (promise) => {
    show();
    return await promise.finally(hide);
  };

  return {
    request,
  };
}
