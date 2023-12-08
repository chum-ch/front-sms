<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <custom-navigation :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <custom-table
        ref="refToChildCustomTable"
        :table_data="tableDataSchedules"
        :columns="columnsSchedules"
        @selected-row-data="selectedRowData"
        @onClickCreate="onClickCreateSchedule"
        @onClickEdit="onClickEditSchedule"
        @onClickDelete="onClickDeleteSchedule"
        @onClickDetails="onClickDetailsSchedule"
      />
      <!-- Dialog delete room  -->
      <custom-dialog
        ref="refToChildCustomDialogDeleteSchedule"
        @onClickDialogSubmit="deleteSchedule()"
        :danger="true"
        @onClickCloseDialog="closeDialogDeleteSchedule()"
        :is_delete="true"
        :footer_label="'Delete'"
        :modal_header="'Delete Schedule'"
      >
        <template #bodyDialog>
          <div class="text-center mt-4">
            You was selected {{ selectedSchedules.length }} to delete.
          </div>
        </template>
      </custom-dialog>
    </div>
    <custom-full-calendar :events="events" />

    <!-- Component  -->
    <!-- Chil schedule form  -->
    <ScheduleForm ref="refToChildScheduleForm" @updatedSchedule="updatedSchedule" />
  </div>
</template>
<script>
import ScheduleForm from "./ScheduleForm.vue";
export default {
  components: {
    ScheduleForm,
  },
  data() {
    return {
      // Calendar
      events: [],
      trainerOptions: [],
      roomOptions: [{ Name: "B2" }, { Name: "B3" }, { Name: "C4" }],
      something: "",
      // Bread Crumb
      schoolId: this.$route.params.schoolId,
      breadCrumb: [],
      // Table
      selectedSchedules: [],
      tableDataSchedules: [],
      columnsSchedules: [
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
      ],
    };
  },
  props: {},
  watch: {
    // something() {
    //   console.log("items", this.something);
    // },
  },
  created() {
    this.getSchoolDetails(this.schoolId);
  },
  methods: {
    onClickCreateSchedule() {
      this.$refs.refToChildScheduleForm.openDialogScheduleForm();
    },
    onClickEditSchedule() {
      this.$refs.refToChildScheduleForm.openDialogScheduleForm();
      this.$refs.refToChildScheduleForm.onlyUpdateSchedule(this.selectedSchedules[0]);
    },
    onClickDetailsSchedule(event) {
      this.$router.push(`/cleaners/${event[0].cleanersID}`);
    },
    unSelecteRowSchedule() {
      this.$refs.refToChildCustomTable.unSelectedAllRows();
    },
    // Delete schedule
    onClickDeleteSchedule() {
      this.openDialogDeleteSchedule();
    },
    selectedRowData(data) {
      this.selectedSchedules = data;
    },
    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId);
      if (school && school.data && Object.keys(school.data).length > 0) {
        this.breadCrumb = [];
        this.breadCrumb.push(
          { label: `${school.data.Name}`, to: "/" },
          { label: "Manages", to: `/schools/${schoolId}/manages` },
          { label: "Schedules", to: `/schools/${schoolId}/schedules` }
        );
        this.listSchedules();
      }
    },
    updatedSchedule(event) {
      if (event && event.CloseDialog) {
        this.unSelecteRowSchedule();
      } else {
        this.getSchoolDetails(this.schoolId);
      }
    },

    async listSchedules() {
      try {
        let schedules = await this.$api.schedule.listSchedules(this.schoolId);
        if (schedules && schedules.data.length > 0) {
          this.events = schedules.data.map((item) => {
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
          this.tableDataSchedules = schedules.data;
        } else {
          this.tableDataSchedules = [];
        }
        this.unSelecteRowSchedule();
      } catch (error) {
        console.log("List schedules error", error);
      }
    },
    async deleteSchedule() {
      for (let item of this.selectedSchedules) {
        await this.$api.schedule.deleteSchedule(this.schoolId, item.SCHEDULES_ID);
      }
      this.closeDialogDeleteSchedule();
      this.listSchedules();
    },
    openDialogDeleteSchedule() {
      this.$refs.refToChildCustomDialogDeleteSchedule.openDialog();
    },
    closeDialogDeleteSchedule() {
      this.$refs.refToChildCustomDialogDeleteSchedule.closeDialog();
      this.unSelecteRowSchedule();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
