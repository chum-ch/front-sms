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

defineExpose({})
</script>

<template>
  <div>
    <!-- Navigation with breadCrumb  -->
    <NavigationView :breadCrumb="breadCrumb" />
    <CustomTab
      :dataTabs="dataTabs"
      class="pe-2"
      :isFlex="true"
      :justifyContent="'start'"
      @update:Component="updateComponent"
    ></CustomTab>
    <div>
      <!-- Table  -->
      <CustomTable
        ref="refToChildCustomTable"
        :tableData="tableDataSchedules"
        :columns="columnsSchedules"
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
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
