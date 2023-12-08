<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <custom-navigation :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <custom-table
        ref="refToChildCustomTable"
        :table_data="tableDataStudents"
        :columns="columnsStudent"
        @selected-row-data="selectedRowData"
        @onClickCreate="onClickCreateStudent"
        @onClickEdit="onClickEditStudent"
        @onClickDelete="onClickDeleteStudent"
        @onClickDetails="onClickDetailsStudent"
      />
      <!-- Child student form  -->
      <StudentForm ref="refToChildStudentForm" @updatedStudent="updatedStudent" />

      <!-- Dialog delete student  -->
      <custom-dialog
        ref="refToChildCustomDialogDeleteStudent"
        @onClickDialogSubmit="deleteStudent"
        :danger="true"
        @onClickCloseDialog="closeDialogDeleteStudent"
        :is_delete="true"
        :footer_label="'Delete'"
        :modal_header="'Delete Student'"
      >
        <template #bodyDialog>
          <div class="text-center mt-4">
            You was selected {{ selectedStudent.length }} to delete.
          </div>
        </template>
      </custom-dialog>
    </div>
    <div></div>
  </div>
</template>
<script>
import StudentForm from "./StudentForm.vue";
export default {
  components: {
    StudentForm,
  },
  data() {
    return {
      // Bread Crumb
      breadCrumb: [],
      // Table
      schoolId: this.$route.params.schoolId,
      generationId: this.$route.params.generationId,
      selectedStudent: [],
      tableDataStudents: [],
      columnsStudent: [
        {
          field: "ProfileURL",
          header: "Profile",
        },
        {
          field: "ID",
          header: "Student's ID",
        },
        {
          field: "LastName",
          header: "Last name",
        },
        {
          field: "FirstName",
          header: "First name",
        },
        {
          field: "Gender",
          header: "Gender",
        },
        {
          field: "Email",
          header: "Email",
        },
        {
          field: "Class.Name",
          header: "Class",
        },
      ],
    };
  },
  props: [],
  emits: [],
  watch: {},
  created() {
    this.getSchoolDetails(this.schoolId);
  },
  methods: {
    onClickCreateStudent() {
      this.$refs.refToChildStudentForm.openDialogStudentForm();
    },
    onClickEditStudent() {
      this.$refs.refToChildStudentForm.openDialogStudentForm();
      this.$refs.refToChildStudentForm.onlyUpdateStudent(this.selectedStudent[0]);
    },
    onClickDetailsStudent(event) {
      
      this.$router.push(`students/${event[0].STUDENTS_ID}`);
    },
    unSelecteRowStudent() {
      this.$refs.refToChildCustomTable.unSelectedAllRows();
    },
    selectedRowData(data) {
      this.selectedStudent = data;
    },

    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId);
      if (school && school.data && Object.keys(school.data).length > 0) {
        school = school.data;
      }
      let generation = await this.$api.generation.getGeneration(
        this.schoolId,
        this.generationId
      );
      if (generation && generation.data && Object.keys(generation.data).length > 0) {
        generation = generation.data;
      }
      this.breadCrumb =
        [{ label: `${school.Name}`, to: "/" },
        { label: "Manages", to: `/schools/${schoolId}/manages` },
        {
          label: `${generation.Name}`,
          to: `/schools/${schoolId}/generations`,
        },
        {
          label: "Students",
          to: `/schools/${this.schoolId}/generations/${this.generationId}/students`,
        }
      ]
      this.getListStudent();
    },

    async getListStudent() {
      try {
        let students = await this.$api.student.listStudents(
          this.schoolId,
          this.generationId
        );
        if (students && students.data && students.data.length > 0) {
          this.tableDataStudents = students.data;
        } else {
          this.tableDataStudents = [];
        }
        this.unSelecteRowStudent();
      } catch (error) {
        console.log("Error list student", error);
      }
    },
    updatedStudent() {
      this.getSchoolDetails(this.schoolId);
    },
    // Delete student
    onClickDeleteStudent() {
      this.openDialogDeleteStudent();
    },
    openDialogDeleteStudent() {
      this.$refs.refToChildCustomDialogDeleteStudent.openDialog();
    },
    closeDialogDeleteStudent() {
      this.$refs.refToChildCustomDialogDeleteStudent.closeDialog();
    },
    async deleteStudent() {
      for (let item of this.selectedStudent) {
        await this.$api.student.deleteStudent(this.schoolId, this.generationId, item.STUDENTS_ID);
      }
      this.closeDialogDeleteStudent();
      this.getListStudent();
    },
  },
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
