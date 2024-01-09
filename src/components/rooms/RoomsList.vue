<script setup>
import { onMounted, onUpdated, ref, computed, inject, provide, reactive } from 'vue'
import RoomForm from './RoomForm.vue'
import { useRouter } from 'vue-router'
defineProps({})
defineEmits([''])
onMounted(async () => {
  await getListRooms()
})
// Variables
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
// Ref child
const refToChildRoomForm = ref()
const refToChildCustomDialogDeleteRoomForm = ref()
const selectedCheckBox = ref([])
const origCol = ref([])
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

// Breadcrumb
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/rooms`, label: 'Rooms' }
  )
}

// Table
const tableDataRooms = ref([])
const selectedRooms = ref([])
const columnsRoom = ref([
  {
    field: 'Name',
    header: 'Room name'
  },
  {
    field: 'Floor',
    header: 'Floor'
  }
])


// Functions
const getListRooms = async () => {
  try {
    let rooms = await $api.room.listRooms(schoolId)
    if (rooms && rooms.data && rooms.data.length > 0) {
      tableDataRooms.value = rooms.data
    } else {
      tableDataRooms.value = []
    }
    unSelectRowRoom()
  } catch (error) {
    console.log('Error list room', error)
  }
}
const createRoom = () => {
  refToChildRoomForm.value.openDialogRoomForm()
}
const editRoom = (dataEdit) => {
  refToChildRoomForm.value.openDialogRoomForm()
  refToChildRoomForm.value.onlyUpdateRoom(dataEdit[0])
}
const deleteRoom = async (dataDelete) => {
  try {
    for (let item of dataDelete) {
      await $api.room.deleteRoom(schoolId, item.ROOMS_ID)
    }
    closeDialogDeleteRoom()
    getListRooms()
  } catch (error) {
    console.error(error)
  }
}
const openDialogDeleteRoom = () => {
  refToChildCustomDialogDeleteRoomForm.value.openDialog()
}
const closeDialogDeleteRoom = () => {
  refToChildCustomDialogDeleteRoomForm.value.closeDialog()
  unSelectRowRoom()
}
const getSelectionRoom = (data) => {
  selectedRooms.value = data
}
const unSelectRowRoom = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}
// Child form
const updatedRoom = () => {
  getListRooms()
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
    selectedRooms.value.length > 0 ? selectedRooms.value : tableDataRooms.value
  const arrObjCol = $globalFunction.getDataForDownload(allDataInTable, columnsRoom.value)
  if (tableDataRooms.value.length > 0) {
    $globalFunction.exportToExcel({ arrObjCol }, noted)
  }
}
const openDialogDownloadDefaultTemplate = async () => {
  refToChildCustomDownloadColumn.value.openDialog()
  let downloadTemplate = await $api.room.downloadColumnTemplate(schoolId, { showLoading: false })
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
    let uploadRoom = await $api.room.uploadFile(schoolId, formData, { showLoading: false})
    if (uploadRoom && uploadRoom.data) {
      const { PROGRESSES_ID } = uploadRoom.data
      const URLRoomProgress = `/progresses/${PROGRESSES_ID}/room-progresses`
      refToChildProgressBar.value.checkProgress(URLRoomProgress)
    }
  } catch (error) {
    const { data } = error.response
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      $globalFunction.exportToExcel(data)
    }
  }
}
//
</script>

<template>
  <div class="room-list">
    <NavigationView :breadCrumb="breadCrumb" />
    <CustomProgressBar ref="refToChildProgressBar" @completedProgress="getListRooms" />
    <CustomUploadFile @uploadedFile="processFileUpload" ref="refToChildCustomFileUpload" hidden />
    <!-- <input type="file" id="fileUpload" ref="fileUpload" @change="processFileUpload" hidden /> -->
    <CustomTable
      ref="refToChildCustomTable"
      :tableData="tableDataRooms"
      :columns="columnsRoom"
      :isShowUploadBtn="true"
      :isShowFileMenu="true"
      @downloadAllDataInTable="downloadAllDataInTable"
      @uploadedExcelFile="openFileBrowser"
      @downloadTemplateExcel="openDialogDownloadDefaultTemplate"
      @onClickCreate="createRoom"
      @onClickEdit="editRoom"
      @onClickDelete="openDialogDeleteRoom"
      @update:selection="getSelectionRoom"
    />
    <!-- Child room form  -->
    <RoomForm ref="refToChildRoomForm" @updatedRoom="updatedRoom" />
    <!-- Dialog delete room  -->
    <CustomDialog
      ref="refToChildCustomDialogDeleteRoomForm"
      @onClickDialogSubmit="deleteRoom(selectedRooms)"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteRoom()"
      :isDelete="true"
      :footerLabel="'Delete'"
      :modalHeader="'Delete Room'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">You was selected {{ selectedRooms.length }} to delete.</div>
      </template>
    </CustomDialog>
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

<style scoped></style>
