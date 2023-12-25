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
const refToChildCustomDownloadColumn = ref()
const checkBoxCategories = ref([])
const selectedCheckBox = ref([])
const origCol = ref([])
const refToChildCustomTable = ref()
const refToChildProgressBar = ref()
// Breadcrumb
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
const fileUpload = ref()
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
const menuItems = ref([
  {
    label: 'File',
    icon: 'pi pi-file',
    items: [
      {
        label: 'Download',
        icon: 'pi pi-download',
        command: async () => {
          openDialogDownloadColumn()
        }
      },
      {
        label: 'Upload',
        icon: 'pi pi-cloud-upload',
        command: async () => {
          fileUpload.value.click()
        }
      }
    ]
  }
])

const noted = [['Important noted'], ['- Required']]
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
const exportFile = async () => {
  console.log('or', origCol.value, 'he', selectedCheckBox.value);
  // $globalFunction.exportExcelFile(selectedCheckBox.value, noted)
}
const handleFileUpload = async () => {
  const selectedFile = fileUpload.value.files[0]
  const formData = new FormData()
  formData.append('uploadedFile', selectedFile)
  let uploadRoom = await $api.room.uploadFile(schoolId, formData)
  if (uploadRoom && uploadRoom.data) {
    const { PROGRESSES_ID } = uploadRoom.data
    const roomProgress = `/progresses/${PROGRESSES_ID}/room-progresses`
    refToChildProgressBar.value.checkProgress(roomProgress)
  }
}
const downloadTemplate = async () => {
  let uploadRoom = await $api.room.downloadColumnTemplate(schoolId)
  const [col] = uploadRoom.data;
  const arrObjCheckBox = Object.keys(col).map(item => ({ Value: item.replace('*', '') }));
  checkBoxCategories.value = arrObjCheckBox;
  origCol.value = col
  // checkBoxCategories.value = uploadRoom.data
}
const openDialogDownloadColumn = async() => {
  refToChildCustomDownloadColumn.value.openDialog()
  await downloadTemplate()
}
const closeDialogDownloadColumn = () => {
  refToChildCustomDownloadColumn.value.closeDialog()
}
const getDataCheckBox =(col)=>{
  selectedCheckBox.value = col
}
</script>

<template>
  <div class="room-list">
    <NavigationView :breadCrumb="breadCrumb" />
    <CustomProgressBar ref="refToChildProgressBar" @completedProgress="getListRooms" />

    <input type="file" id="fileUpload" ref="fileUpload" @change="handleFileUpload" hidden />
    <CustomTable
      ref="refToChildCustomTable"
      :tableData="tableDataRooms"
      :columns="columnsRoom"
      :isShowUploadBtn="true"
      :isShowDownloadTemplateBtn="true"
      :menuItems="menuItems"
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
      @onClickDialogSubmit="exportFile"
      @onClickCloseDialog="closeDialogDownloadColumn()"
      :footerLabel="'Download'"
      :disabledSubmitBtn="selectedCheckBox.length === 0"
      :modalHeader="'Customize column'"
    >
      <template #bodyDialog>
          <CustomColumnDownload
          :checkBoxCategories="checkBoxCategories"
          @getDataCheckBox="getDataCheckBox"
           />
      </template>
    </CustomDialog>
  </div>
</template>

<style scoped></style>
