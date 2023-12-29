<script setup>
import { onMounted, reactive, ref, inject, getCurrentInstance, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode, FilterOperator } from 'primevue/api'
const instance = getCurrentInstance()

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  selectionMode: {
    type: String,
    default: () => 'multiple'
  },
  isHideAddBtn: {
    type: Boolean,
    required: false
  },
  isHideEditBtn: {
    type: Boolean,
    required: false
  },
  isHideDeleteBtn: {
    type: Boolean,
    required: false
  },
  isShowFileMenu: {
    type: Boolean,
    required: false
  },
  hasImage: {
    type: Boolean,
    default: () => true
  }
})
defineEmits([
  'onClickCreate',
  'onClickEdit',
  'onClickDelete',
  'update:selection',
  'onClickDetails',
  'downloadAllDataInTable',
  'downloadTemplateExcel',
  'uploadedExcelFile'
])
onMounted(() => {
  // initFilters()
})
// Variables
const selection = ref([])
const globalFilterFields = ref([])
const filters = ref()
// Button
const disabledDelete = ref(true)
const disabledEdit = ref(true)
const isGo = ref(true)
const menuItems = ref([
  {
    label: 'File',
    icon: 'pi pi-file',
    items: [
      {
        label: 'Download',
        disabled: true,
        icon: 'pi pi-download',
        command: async () => {
          instance.emit('downloadAllDataInTable')
        }
      },
      {
        label: 'Get template',
        icon: 'pi pi-cloud-download',
        command: async () => {
          instance.emit('downloadTemplateExcel')
        }
      },
      {
        label: 'Upload',
        icon: 'pi pi-cloud-upload',
        command: async () => {
          instance.emit('uploadedExcelFile')
        }
      }
    ]
  }
])
// Function
const onRowClick = (data) => {
  if (isGo.value) {
    instance.emit('onClickDetails', [data.data])
  } else {
    isGo.value = true
  }
}
const selectedRow = () => {
  emitSelectedRowData('selectRow')
}
const unSelectedRow = () => {
  isGo.value = false
  emitSelectedRowData('unSelectRow')
}
const unSelectedAllRows = () => {
  disabledEdit.value = true
  disabledDelete.value = true
  selection.value = []
  emitSelectedRowData('unSelectAllRow')
}
const selectedAllRows = (event) => {
  selection.value = event.data
  emitSelectedRowData('selectAllRow')
}
const emitSelectedRowData = (checked) => {
  if (checked === 'selectRow' || checked === 'unSelectRow' || checked === 'selectAllRow') {
    instance.emit('update:selection', selection.value)
    disabledAction(selection.value)
  } else {
    instance.emit('update:selection', [])
  }
}
const disabledAction = (data) => {
  if (data.length === 0) {
    disabledDelete.value = true
    disabledEdit.value = true
  } else {
    disabledDelete.value = false
    if (data.length > 1) {
      disabledEdit.value = true
    } else {
      disabledEdit.value = false
    }
  }
}
const initFilters = () => {
  globalFilterFields.value = props.columns.map((item) => item.field)
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
}
// Watcher function
watch(() => props.tableData, (data) => {
  for (const obj of menuItems.value) {
    obj.items.forEach(item => {
      const hasPropertyDisabled = Object.prototype.hasOwnProperty.call(item, 'disabled')
      if (hasPropertyDisabled) {
        item.disabled = true
        if (data.length > 0) {
          item.disabled = false
        }
      }
      return item
    });
  }
});
initFilters()
defineExpose({
  unSelectedAllRows
})
</script>

<template>
  <div class="table mt-2">
    <div class="flex justify-content-between sm:flex-row-reverse flex-wrap mx-2">
      <CustomInputText
        v-model="filters['global'].value"
        placeholder="Search ..."
        :showIcon="true"
        :leftIcon="true"
        :searchIcon="true"
        class="search"
      />
      <div class="flex flex-wrap">
        <CustomButton
          :label="'Add'"
          class="mr-2 mb-2"
          @onClick="($event) => $emit('onClickCreate', $event)"
          v-if="!isHideAddBtn"
        />
        <CustomButton
          :label="'Edit'"
          class="mr-2"
          @onClick="() => $emit('onClickEdit', selection)"
          :outlined="true"
          :disabled="disabledEdit"
          v-if="!isHideEditBtn"
        />
        <CustomButton
          :label="'Delete'"
          class="mr-2"
          @onClick="() => $emit('onClickDelete', selection)"
          :danger="true"
          :outlined="true"
          :disabled="disabledDelete"
          v-if="!isHideDeleteBtn"
        />
        <CustomTieredMenu :menuItems="menuItems" v-if="isShowFileMenu" />
      </div>
    </div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selection"
      @row-click="onRowClick($event)"
      @row-select="selectedRow"
      @row-unselect="unSelectedRow"
      @row-select-all="selectedAllRows"
      @row-unselect-all="unSelectedAllRows"
      :rowHover="true"
      :resizableColumns="true"
      :rows="10"
      :rowsPerPageOptions="[10, 50, 100]"
      :globalFilterFields="globalFilterFields"
      :value="tableData"
      scrollable
      scrollHeight="450px"
      class="p-datatable-sm mt-2 z-0"
      tableStyle="min-width: 50rem"
      paginator
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="Show from {first} to {last} of {totalRecords}"
    >
      <template #empty>
        <div v-if="tableData.length !== 0" class="">
          The
          <span class="text-red-500 font-bold"> {{ filters['global'].value }}</span> is not found!
          🥺
        </div>
      </template>
      <Column :selectionMode="selectionMode" headerStyle="width: 3rem"></Column>
      <Column
        v-for="(item, index) in columns"
        :key="index"
        :field="item.field"
        :header="item.header"
      >
      </Column>
    </DataTable>
  </div>
</template>
<style>
@media (max-width: 600px) {
  .p-paginator-bottom .p-dropdown, .p-paginator-first, .p-paginator-last {
    display: none;
  }
  .flex {
    display: block;
  }
  .search {
    width: 100%;
  }
}
</style>
