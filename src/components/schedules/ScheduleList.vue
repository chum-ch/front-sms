<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
import ScheduleForm from './ScheduleForm.vue'
import AllSchedules from './AllSchedules.vue'
onMounted(async () => {
  await listSchedules()
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
const refToChildCustomDialogDeleteSchedule = ref()
const refToChildScheduleForm = ref()
const refToChildCustomTable = ref()
const refToChildProgressBar = ref()
// Process file
const refToChildCustomFileUpload = ref()
const refToChildCustomDownloadColumn = ref()
const checkBoxCategories = ref([])
const customSelectedCheckBox = ref([])
const autoSelectedCheckBox = ref([])
const allColumnsTemplate = ref([])
const autoSelectLabel = ref('')
const noted = [['Important noted'], ['- All column are required']]

if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/schedules`, label: 'Schedules' }
  )
}
// Functions
// Table
const selectedSchedules = ref([])
const tableDataSchedules = ref([])
const isShowScheduleListComponent = ref(true)
const columnsSchedules = ref([
  {
    field: 'Course.Name',
    header: "Subject's name"
  },
  {
    field: 'Date',
    header: 'Date'
  },
  {
    field: 'StartTime',
    header: 'Start time'
  },
  {
    field: 'EndTime',
    header: 'End time'
  },
  {
    field: 'Class.Name',
    header: 'Class'
  },
  {
    field: 'Room.Name',
    header: 'Room'
  },
  {
    field: 'Trainer.Name',
    header: 'Trainer'
  }
])

const onClickCreateSchedule = () => {
  refToChildScheduleForm.value.openDialogScheduleForm()
}
const onClickEditSchedule = () => {
  refToChildScheduleForm.value.openDialogScheduleForm()
  refToChildScheduleForm.value.onlyUpdateSchedule(selectedSchedules.value[0])
}
const unSelectRowSchedule = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}
// Delete schedule
const onClickDeleteSchedule = () => {
  openDialogDeleteSchedule()
}
const selectedRowData = (data) => {
  selectedSchedules.value = data
}
const dataTabs = [
  {
    Active: true,
    TabName: 'Schedules',
    Component: 'ScheduleList'
  },
  {
    TabName: 'Calendar',
    Component: AllSchedules
  }
]
const updateComponent = (componentName) => {
  isShowScheduleListComponent.value = false
  if (componentName === 'ScheduleList') {
    isShowScheduleListComponent.value = true
  }
}
const updatedSchedule = (event) => {
  if (event && event.CloseDialog) {
    unSelectRowSchedule()
  } else {
    listSchedules()
  }
}

const listSchedules = async () => {
  try {
    let schedules = await $api.schedule.listSchedules(schoolId)
    if (schedules && schedules.data.length > 0) {
      tableDataSchedules.value = schedules.data
    } else {
      tableDataSchedules.value = []
    }
    unSelectRowSchedule()
  } catch (error) {
    console.log('List schedules error', error)
  }
}
const deleteSchedule = async (selectedSchedules) => {
  for (let item of selectedSchedules) {
    await $api.schedule.deleteSchedule(schoolId, item.SCHEDULES_ID)
  }
  closeDialogDeleteSchedule()
  listSchedules()
}
const openDialogDeleteSchedule = () => {
  refToChildCustomDialogDeleteSchedule.value.openDialog()
}
const closeDialogDeleteSchedule = () => {
  refToChildCustomDialogDeleteSchedule.value.closeDialog()
  unSelectRowSchedule()
}
// Process file
const getDataCheckBox = (col) => {
  customSelectedCheckBox.value = []
  customSelectedCheckBox.value = [...autoSelectedCheckBox.value, ...col]
}
const closeDialogDownloadColumn = () => {
  refToChildCustomDownloadColumn.value.closeDialog()
}
const openFileBrowser = () => {
  refToChildCustomFileUpload.value.openFileBrowser()
}
const downloadAllDataInTable = () => {
  const allDataInTable =
    selectedSchedules.value.length > 0 ? selectedSchedules.value : tableDataSchedules.value
  const arrObjCol = $globalFunction.getDataForDownload(allDataInTable, columnsSchedules.value)
  if (tableDataSchedules.value.length > 0) {
    $globalFunction.exportToExcel({ arrObjCol }, noted)
  }
}
const openDialogDownloadDefaultTemplate = async () => {
  refToChildCustomDownloadColumn.value.openDialog()
  let downloadTemplate = await $api.schedule.downloadColumnTemplate(schoolId, { showLoading: false })
  const { data } = downloadTemplate
  const arrObjCheckBox = $globalFunction.getArrObjForCheckBox(data)
  const { CustomCol, ColAutoSelected, AllColumns } = arrObjCheckBox
  if (CustomCol.length > 0 || ColAutoSelected.length > 0) {
    checkBoxCategories.value = CustomCol
    autoSelectedCheckBox.value = ColAutoSelected
    customSelectedCheckBox.value = ColAutoSelected
  }
  allColumnsTemplate.value = AllColumns
  autoSelectLabel.value = arrObjCheckBox.AutoSelectLabel
}
const downloadDefaultTemplate = async () => {
  const arrObjCol = $globalFunction.getDataForDownload(
    allColumnsTemplate.value,
    customSelectedCheckBox.value
  )
  $globalFunction.exportToExcel({ arrObjCol }, noted)
  closeDialogDownloadColumn()
}

const clearFileSelected = () => {
  refToChildCustomFileUpload.value.clearFileSelected()
}
const processFileUpload = async (selectedFile) => {
  try {
    clearFileSelected()
    const formData = new FormData()
    formData.append('uploadedFile', selectedFile)
    let uploadSchedule = await $api.schedule.uploadFile(schoolId, formData, { showLoading: false})
    if (uploadSchedule && uploadSchedule.data) {
      const { PROGRESSES_ID } = uploadSchedule.data
      const URLRoomProgress = `/progresses/${PROGRESSES_ID}/schedule-progresses`
      refToChildProgressBar.value.checkProgress(URLRoomProgress)
    }
  } catch (error) {
    const { data } = error.response
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      $globalFunction.exportToExcel(data)
    }
  }
}

defineExpose({})
</script>

<template>
  <div>
    <!-- Navigation with breadCrumb  -->
    <NavigationView :breadCrumb="breadCrumb" />
    <CustomProgressBar ref="refToChildProgressBar" @completedProgress="listSchedules" />
    <CustomTab
      :dataTabs="dataTabs"
      class="pe-2"
      :isFlex="true"
      :justifyContent="'start'"
      @update:Component="updateComponent"
    ></CustomTab>
    <div>
      <CustomUploadFile @uploadedFile="processFileUpload" ref="refToChildCustomFileUpload" hidden />
      <!-- Table  -->
      <CustomTable
        ref="refToChildCustomTable"
        :tableData="tableDataSchedules"
        :columns="columnsSchedules"
        :isShowFileMenu="true"
        @downloadAllDataInTable="downloadAllDataInTable"
        @uploadedExcelFile="openFileBrowser"
        @downloadTemplateExcel="openDialogDownloadDefaultTemplate"
        @update:selection="selectedRowData"
        @onClickCreate="onClickCreateSchedule"
        @onClickEdit="onClickEditSchedule"
        @onClickDelete="onClickDeleteSchedule"
        v-show="isShowScheduleListComponent"
      />
      <!-- Dialog delete room  -->
      <CustomDialog
        ref="refToChildCustomDialogDeleteSchedule"
        @onClickDialogSubmit="deleteSchedule(selectedSchedules)"
        :danger="true"
        @onClickCloseDialog="closeDialogDeleteSchedule()"
        :isDelete="true"
        :footerLabel="'Delete'"
        :modalHeader="'Delete Schedule'"
      >
        <template #bodyDialog>
          <div class="text-center mt-4">
            You was selected {{ selectedSchedules.length }} to delete.
          </div>
        </template>
      </CustomDialog>
    </div>
    <!-- Component  -->
    <!-- Child schedule form  -->
    <ScheduleForm ref="refToChildScheduleForm" @updatedSchedule="updatedSchedule" />
    <!-- Dialog download column  -->
    <CustomDialog
      ref="refToChildCustomDownloadColumn"
      @onClickDialogSubmit="downloadDefaultTemplate"
      @onClickCloseDialog="closeDialogDownloadColumn"
      :footerLabel="'Download'"
      :disabledSubmitBtn="customSelectedCheckBox.length === 0 && autoSelectedCheckBox.length === 0"
      :modalHeader="'Customize column'"
    >
      <template #bodyDialog>
        <CustomColumnDownload
          :checkBoxCategories="checkBoxCategories"
          @getDataCheckBox="getDataCheckBox"
          :isFlex="true"
          :showCheckAll="checkBoxCategories.length > 0"
          :showAutoCheck="autoSelectedCheckBox.length > 0"
          :autoSelectLabel="autoSelectLabel"
        />
      </template>
    </CustomDialog>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
