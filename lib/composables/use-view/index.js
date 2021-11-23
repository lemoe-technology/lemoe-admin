import lodash from 'lodash';
import { ElMessage } from 'element-plus';
import { inject, onMounted, provide, ref } from 'vue';

import initStructure from '@lemoe-admin/utils/initStructure';
import { useRequest } from '@lemoe-admin/composables';

export default function (structure, options = {}) {
  structure = initStructure(structure);

  const { request } = useRequest();
  const bulkDestroy = lodash.get(options, 'api.bulkDestroy', (data) =>
    request(structure.api.bulkDestroy(data))
  );
  const destroy = lodash.get(options, 'api.destroy', (id, data = {}) =>
    request(structure.api.destroy(id, data))
  );
  const fetchAll = lodash.get(options, 'api.fetchAll', (data = {}) =>
    request(structure.api.fetchAll(data))
  );

  const mountContent = inject('mountContent');

  const list = ref([]);
  const query = ref({});
  const sort = ref({});
  const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    total: 0,
  });
  const selection = ref([]);

  const updateQuery = (newQuery) => {
    query.value = {
      ...query.value,
      ...newQuery.value,
    };
    handleSearch();
  };
  provide('updateQuery', updateQuery);

  const updateSort = (newSort) => {
    if (newSort.column) {
      sort.value = {
        key: newSort.prop,
        order: { ascending: 'asc', descending: 'desc' }[newSort.order],
      };
    } else {
      sort.value = {};
    }

    handleSearch();
  };
  provide('updateSort', updateSort);

  const updatePagination = (newPagination) => {
    pagination.value = {
      ...pagination.value,
      ...newPagination.value,
    };
    handleSearch();
  };
  provide('updatePagination', updatePagination);

  const updateSelection = (newSelection) => {
    selection.value = newSelection;
  };
  provide('updateSelection', updateSelection);

  const handleSearch = async () => {
    const form = ref({
      ...query.value,
      ...options.query,
    });
    if (structure.pageable) {
      form.value.page = pagination.value.currentPage;
      form.value.per_page = pagination.value.pageSize;
    }
    if (structure.sortable) {
      form.value.sort_key = sort.value.key;
      form.value.sort_order = sort.value.order;
    }
    if (lodash.has(options, 'api.beforeFetchAll')) {
      options.api.beforeFetchAll(form);
    }
    const res = await fetchAll(form.value);
    const data = ref(res.data);
    const meta = ref(res.meta);
    if (lodash.has(options, 'api.afterFetchAll')) {
      options.api.afterFetchAll(data, meta);
    }
    list.value = data.value;
    if (structure.pageable) {
      pagination.value = {
        currentPage: meta.value.current_page,
        pageSize: +meta.value.per_page,
        total: meta.value.total,
      };
    }
  };
  provide('handleSearch', handleSearch);

  const handleStore = () => {
    mountContent({
      medium: lodash.get(options, 'content.store.medium', 'dialog'),
      content: lodash.get(options, 'content.store.content'),
      attrs: {
        id: 0,
        title: `编辑${lodash.get(structure, 'title', '数据')}`,
        ...lodash.get(options, 'content.store.attrs', {}),
      },
      success: lodash.get(options, 'content.store.success', handleSearch),
      fail: lodash.get(options, 'content.store.fail'),
      complete: lodash.get(options, 'content.store.complete'),
    });
  };
  provide('handleStore', handleStore);

  const handleShow = (item) => {
    const id = !structure.pivot ? item.id : item[structure.pivot].id;
    mountContent({
      medium: lodash.get(options, 'content.show.medium', 'dialog'),
      content: lodash.get(options, 'content.show.content'),
      attrs: {
        id,
        title: `查看${lodash.get(structure, 'title', '数据')}`,
        ...lodash.get(options, 'content.show.attrs', {}),
      },
      success: lodash.get(options, 'content.show.success'),
      fail: lodash.get(options, 'content.show.fail'),
      complete: lodash.get(options, 'content.show.complete'),
    });
  };
  provide('handleShow', handleShow);

  const handleUpdate = (item) => {
    const id = !structure.pivot ? item.id : item[structure.pivot].id;
    mountContent({
      medium: lodash.get(options, 'content.update.medium', 'dialog'),
      content: lodash.get(options, 'content.update.content'),
      attrs: {
        id,
        title: `编辑${lodash.get(structure, 'title', '数据')}`,
        ...lodash.get(options, 'content.update.attrs', {}),
      },
      success: lodash.get(options, 'content.update.success', handleSearch),
      fail: lodash.get(options, 'content.update.fail'),
      complete: lodash.get(options, 'content.update.complete'),
    });
  };
  provide('handleUpdate', handleUpdate);

  const handleDestroy = async (item) => {
    const id = !structure.pivot ? item.id : item[structure.pivot].id;
    if (lodash.has(options, 'api.beforeDestroy')) {
      options.api.beforeDestroy(id, list);
    }
    await destroy(id);
    if (lodash.has(options, 'api.afterDestroy')) {
      options.api.afterDestroy(list);
    }
    ElMessage.success({
      message: '删除成功',
    });
    await handleSearch();
  };
  provide('handleDestroy', handleDestroy);

  const handleBulkDestroy = async (data) => {
    if (lodash.has(options, 'api.beforeBulkDestroy')) {
      options.api.beforeBulkDestroy(data, list);
    }
    await bulkDestroy(data);
    if (lodash.has(options, 'api.afterBulkDestroy')) {
      options.api.afterBulkDestroy(list);
    }
    selection.value = [];
    ElMessage.success({
      message: '删除成功',
    });
    await handleSearch();
  };
  provide('handleBulkDestroy', handleBulkDestroy);

  const handleOperate = (data) => {
    if (data.action === 'store') {
      handleStore();
    } else if (data.action === 'show') {
      handleShow(data.data);
    } else if (data.action === 'update') {
      handleUpdate(data.data);
    } else if (data.action === 'destroy') {
      handleDestroy(data.data);
    } else if (data.action === 'bulk-destroy') {
      handleBulkDestroy(data.data);
    }
  };

  onMounted(() => {
    if (lodash.isArray(options.list)) {
      list.value = options.list;
    } else {
      handleSearch();
    }
  });

  return {
    structure,
    list,
    query,
    sort,
    pagination,
    selection,
    updateQuery,
    updateSort,
    updatePagination,
    updateSelection,
    handleSearch,
    handleStore,
    handleShow,
    handleUpdate,
    handleDestroy,
    handleBulkDestroy,
    handleOperate,
  };
}
