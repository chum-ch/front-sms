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
const refToChildCustomTable = ref()
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
    console.error(error);
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
</script>

<template>
  <div class="room-list">
    <NavigationView :breadCrumb="breadCrumb" />
    <CustomTable
      ref="refToChildCustomTable"
      :tableData="tableDataRooms"
      :columns="columnsRoom"
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
  </div>
</template>

<style scoped></style>
