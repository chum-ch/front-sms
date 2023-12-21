
<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
import ScheduleForm from "./ScheduleForm.vue";
onMounted( async()=>{
  await listSchedules()
});
defineEmits(['']);
defineProps({
  msg: {
    type: String,
    required: false
  }
})
// Variable
const instance = getCurrentInstance();
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction');
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
const refToChildCustomDialogDeleteSchedule = ref()
const refToChildScheduleForm = ref();
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

      // Calendar
      const events = ref([])
      // Bread Crumb
      // Table
      const selectedSchedules = ref([])
      const tableDataSchedules =ref([])
      const columnsSchedules = ref([
        {
          field: "Course.Name",
          header: "Subject's name",
        },
        {
          field: "Date",
          header: "Date",
        },
        {
          field: "StartTime",
          header: "Start time",
        },
        {
          field: "EndTime",
          header: "End time",
        },
        {
          field: "Class.Name",
          header: "Class",
        },
        {
          field: "Room.Name",
          header: "Room",
        },
        {
          field: "Trainer.Name",
          header: "Trainer",
        },
      ])
      

    const onClickCreateSchedule =()=> {
      refToChildScheduleForm.value.openDialogScheduleForm();
    }
    const onClickEditSchedule =()=> {
      refToChildScheduleForm.value.openDialogScheduleForm();
      refToChildScheduleForm.value.onlyUpdateSchedule(selectedSchedules.value[0]);
    }
    const onClickDetailsSchedule = (event)=> {
    }
    const unSelectRowSchedule =()=> {
      refToChildCustomTable.value.unSelectedAllRows();
    }
    // Delete schedule
    const onClickDeleteSchedule =() =>{
      openDialogDeleteSchedule();
    }
    const selectedRowData =(data)=> {
      selectedSchedules.value = data;
    }
    // const  getSchoolDetails = async(schoolId)=> {
    //   let school = await $api.school.getSchool(schoolId);
    //   if (school && school.data && Object.keys(school.data).length > 0) {
    //     breadCrumb = [];
    //     breadCrumb.push(
    //       { label: `${school.data.Name}`, to: "/" },
    //       { label: "Manages", to: `/schools/${schoolId}/manages` },
    //       { label: "Schedules", to: `/schools/${schoolId}/schedules` }
    //     );
    //     listSchedules();
    //   }
    // }
    const updatedSchedule=(event) =>{
      if (event && event.CloseDialog) {
        unSelectRowSchedule();
      } else {
        listSchedules();
      }
    }

    const listSchedules= async() =>{
      try {
        let schedules = await $api.schedule.listSchedules(schoolId);
        if (schedules && schedules.data.length > 0) {
          events.value = schedules.data.map((item) => {
            const objEvent = {
              title: item.Course.Name,
              start: `${item.Date}T${item.StartTime}:00`,
              end: `${item.Date}T${item.EndTime}:00`,
              extendedProps: {
                className: item.Class.Name,
                teacherName: item.Trainer.Name,
                roomName: item.Room.Name,
                data: item
              },
            };
            return objEvent
          });
          tableDataSchedules.value = schedules.data;
        } else {
          tableDataSchedules.value = [];
        }
        unSelectRowSchedule();
      } catch (error) {
        console.log("List schedules error", error);
      }
    }
    const deleteSchedule =async(selectedSchedules)=> {
      for (let item of selectedSchedules) {
        await $api.schedule.deleteSchedule(schoolId, item.SCHEDULES_ID);
      }
      closeDialogDeleteSchedule();
      listSchedules();
    }
     const openDialogDeleteSchedule =()=> {
      refToChildCustomDialogDeleteSchedule.value.openDialog();
    }
    const closeDialogDeleteSchedule =()=> {
      refToChildCustomDialogDeleteSchedule.value.closeDialog();
      unSelectRowSchedule();
    }
  

defineExpose({});

</script>


<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <NavigationView :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <CustomTable
        ref="refToChildCustomTable"
        :tableData="tableDataSchedules"
        :columns="columnsSchedules"
        @update:selection="selectedRowData"
        @onClickCreate="onClickCreateSchedule"
        @onClickEdit="onClickEditSchedule"
        @onClickDelete="onClickDeleteSchedule"
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
    <CustomFullCalendar :events="events" />

    <!-- Component  -->
    <!-- Child schedule form  -->
    <ScheduleForm ref="refToChildScheduleForm" @updatedSchedule="updatedSchedule" />
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
