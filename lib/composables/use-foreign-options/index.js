import { ref } from 'vue';

export default function (structure) {
  const foreignOptions = ref({});

  const fetchForeignOptions = async (column, keyword) => {
    const option = foreignOptions.value[column.name];
    option.isLoading = true;
    option.data = await column.query(keyword).finally(() => {
      option.isLoading = false;
    });
  };

  const initForeignOptions = async (column) => {
    fetchForeignOptions(column, '');
  };

  structure.table
    .filter((column) => column.type === 'foreign')
    .forEach((column) => {
      foreignOptions.value[column.name] = {
        isLoading: false,
        data: [],
      };
      initForeignOptions(column);
    });

  return {
    foreignOptions,
    fetchForeignOptions,
    initForeignOptions,
  };
}
