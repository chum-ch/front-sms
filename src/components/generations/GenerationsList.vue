
<script setup>
import GenerationForm from './GenerationForm.vue'
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(async () => {
  await getListGenerations()
})
defineEmits([''])
defineProps({
  msg: {
    type: String,
    required: false
  }
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
const refToChildCustomDialogDeleteGenerationForm = ref()
const refToChildGenerationForm = ref()
const refToChildCustomTable = ref()
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/generations`, label: 'Generations' }
  )
}
// Functions
// Table
const selectedGenerations = ref([])
const tableDataGenerations = ref([])
const columnsGeneration = ref([
  {
    field: 'Name',
    header: 'Generations'
  },
  {
    field: 'StudentNumber',
    header: 'Number of students'
  },
  {
    field: 'MaleTotals',
    header: 'Male students'
  },
  {
    field: 'FemaleTotals',
    header: 'Female students'
  }
])
const onClickCreateGeneration = () => {
  refToChildGenerationForm.value.openDialogGenerationForm()
}
const onClickEditGeneration = () => {
  refToChildGenerationForm.value.openDialogGenerationForm()
  refToChildGenerationForm.value.onlyUpdateGeneration(selectedGenerations.value[0])
}
const onClickDetailsGeneration = (event) => {
  $globalFunction.setDataLs('generationBc', event[0])
  route.push(`generations/${event[0].GENERATIONS_ID}/students`)
}
const unSelectRowGeneration = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}
const selectedRowData = (data) => {
  selectedGenerations.value = data
}
const getListGenerations = async () => {
  try {
    let { data } = await $api.generation.listGenerations(schoolId)
    if (data && data.length > 0) {
      tableDataGenerations.value = data
    } else {
      tableDataGenerations.value = []
    }
    unSelectRowGeneration()
  } catch (error) {
    console.log('Error list generations', error)
  }
}
const updatedGeneration = async () => {
  await getListGenerations()
}
const deleteGeneration = async (selectedGenerations) => {
  for (let item of selectedGenerations) {
    await $api.generation.deleteGeneration(schoolId, item.GENERATIONS_ID)
  }
  closeDialogDeleteGeneration()
  getListGenerations()
}
const openDialogDeleteGeneration = () => {
  refToChildCustomDialogDeleteGenerationForm.value.openDialog()
}
const closeDialogDeleteGeneration = () => {
  refToChildCustomDialogDeleteGenerationForm.value.closeDialog()
  unSelectRowGeneration()
}
defineExpose({})
</script>

<template>
  <div>
    <!-- Navigation with breadCrumb  -->
    <NavigationView :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <CustomTable
        ref="refToChildCustomTable"
        :tableData="tableDataGenerations"
        :columns="columnsGeneration"
        @update:selection="selectedRowData"
        @onClickCreate="onClickCreateGeneration"
        @onClickEdit="onClickEditGeneration"
        @onClickDelete="openDialogDeleteGeneration"
        @onClickDetails="onClickDetailsGeneration"
      />
    </div>
    <!-- Child generation form  -->
    <GenerationForm ref="refToChildGenerationForm" @updatedGeneration="updatedGeneration" />
    <!-- Dialog delete generation  -->
    <CustomDialog
      ref="refToChildCustomDialogDeleteGenerationForm"
      @onClickDialogSubmit="deleteGeneration(selectedGenerations)"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteGeneration()"
      :modalHeader="'Delete Generation'"
      :isDelete="true"
      :footerLabel="'Delete'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">
          You was selected {{ selectedGenerations.length }} to delete.
        </div>
      </template>
    </CustomDialog>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
