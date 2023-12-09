<template>
  <div>
    <!-- Navigation with breadCrumb  -->
    <NavigationView :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <CustomTable
        ref="refToChildCustomTable"
        :tableData="tableDataClasses"
        :columns="columnsClass"
        @update:selection="selectedRowData"
        @onClickCreate="onClickCreateClass"
        @onClickEdit="onClickEditClass"
        @onClickDelete="openDialogDeleteClass"
        @onClickDetails="onClickDetailsClass"
      />
    </div>
    <!-- Child class form  -->
    <ClassForm ref="refToChildClassForm" @updatedClass="updatedClass" />
    <!-- Dialog delete class  -->
    <CustomDialog
      ref="refToChildCustomDialogDeleteClass"
      @onClickDialogSubmit="deleteClass(selectedClasses)"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteClass()"
      :isDelete="true"
      :footerLabel="'Delete'"
      :modalHeader="'Delete Class'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">You was selected {{ selectedClasses.length }} to delete.</div>
      </template>
    </CustomDialog>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import ClassForm from './ClassForm.vue'
import { useRouter } from 'vue-router'
onMounted( async() => {
  await getListClasses()
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
const refToChildCustomDialogDeleteClass = ref()
const refToChildClassForm = ref()
const refToChildCustomTable = ref()
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/classes`, label: 'Classes' }
  )
}
// Functions
// Bread Crumb
// Table
const selectedClasses = ref([])
const tableDataClasses = ref([])
const columnsClass = ref([
  {
    field: 'Name',
    header: 'Class name'
  },
  {
    field: 'Room.Name',
    header: 'Room'
  },
  {
    field: 'Trainer.Name',
    header: 'Trainer in class'
  }
])
const onClickCreateClass = () => {
  refToChildClassForm.value.openDialogClassForm()
}
const onClickEditClass = () => {
  refToChildClassForm.value.openDialogClassForm()
  refToChildClassForm.value.onlyUpdateClasses(selectedClasses.value[0])
}
const onClickDetailsClass = (event) => {
  console.log('Details', event)
  // $router.push(`/classes/${event[0].trainersID}`);
}
const unSelectRowClass = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}

const selectedRowData = (data) => {
  selectedClasses.value = data
}
const getListClasses = async () => {
  try {
    let classes = await $api.class.listClasses(schoolId)
    if (classes && classes.data && classes.data.length > 0) {
      tableDataClasses.value = classes.data
    } else {
      tableDataClasses.value = []
    }
    unSelectRowClass()
  } catch (error) {
    console.log('Error list class', error)
  }
}
const updatedClass = async(event) => {
  if (event && event.CloseDialog) {
    unSelectRowClass()
  }
  await getListClasses()
}
const deleteClass = async (dataDeleteClass) => {
  for (let item of dataDeleteClass) {
    await $api.class.deleteClass(schoolId, item.CLASSES_ID)
  }
  closeDialogDeleteClass()
  await getListClasses()
}
const openDialogDeleteClass = () => {
  refToChildCustomDialogDeleteClass.value.openDialog()
}
const closeDialogDeleteClass = () => {
  refToChildCustomDialogDeleteClass.value.closeDialog()
  unSelectRowClass()
}
defineExpose({})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
