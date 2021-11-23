import { computed, provide, ref } from 'vue';

export default function () {
  const loadingCount = ref(0);

  provide('showLoading', () => {
    loadingCount.value++;
  });

  provide('hideLoading', () => {
    loadingCount.value--;
  });

  const isLoading = computed(() => loadingCount.value > 0);
  provide('isLoading', isLoading);

  return {
    isLoading,
  };
}
