import lodash from 'lodash';
import { reactive } from 'vue';

const defaultStructure = {
  columnConfigable: true,
  defaultItem: {},
  destroyable: true,
  operable: true,
  pageable: true,
  pivot: null,
  searchable: true,
  selectable: true,
  sortable: true,
  storable: true,
  tableOperable: true,
  title: '数据',
  updatable: true,
  viewable: true,
};

const defaultColumn = {
  columnConfigable: true,
  descriptionVisible: true,
  formatter: null,
  searchable: true,
  sortable: true,
  storable: true,
  typeOptions: {},
  updatable: true,
  viewVisible: true,
};

const defaultTypeOptions = {
  text: {
    prepend: '',
    append: '',
  },
  radio: {
    whether: false,
  },
  foreign: {
    multiple: false,
  },
  media: {
    type: '',
  },
};

const defaultForeignOptions = {
  isPivotForeignKey: false,
  view: null,
  form: null,
};

export default function (structure) {
  structure = lodash.cloneDeep(structure);
  structure = {
    ...defaultStructure,
    ...structure,
  };
  structure.table = structure.table.map((column) => {
    column.typeOptions = {
      ...lodash.get(defaultTypeOptions, column.type, {}),
      ...column.typeOptions,
    };
    if (column.type === 'foreign') {
      column.foreignOptions = {
        ...defaultForeignOptions,
        ...column.foreignOptions,
      };
    }
    return {
      ...defaultColumn,
      ...column,
    };
  });

  return reactive(structure);
}
