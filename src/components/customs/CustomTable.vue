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
  hasImage: {
    type: Boolean,
    default: () => true
  }
})
defineEmits(['onClickCreate', 'onClickEdit', 'onClickDelete', 'update:selection', 'onClickDetails'])
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
          class="mr-2"
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
          class=""
          @onClick="() => $emit('onClickDelete', selection)"
          :danger="true"
          :outlined="true"
          :disabled="disabledDelete"
          v-if="!isHideDeleteBtn"
        />
        <!-- <CustomButton
          :label="'More'"
          class="mt-3 me-3"
          @onClick="($event) => $emit('onClickDetails', selection)"
          :warning="true"
          :outlined="true"
          :disabled="disabledEdit"
          v-if="!isHideDetailsBtn"
        /> -->
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
      class="p-datatable-sm"
      tableStyle="min-width: 50rem"
      paginator
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="Showing from {first} to {last} of {totalRecords}"
    >
      <template #empty>
        <div v-if="tableData.length !== 0" class="text-center">
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
<style scoped>
@media (max-width: 600px) {
  /* Styles applied for viewport width up to 767px */
  .flex {
    display: block;
  }
  .search {
    width: 100%;
  }
}
</style>