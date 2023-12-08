<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <custom-navigation :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <custom-table
        ref="refToChildCustomTable"
        :table_data="tableDataStudentsUnderSchool"
        :columns="columnsStudent"
        @selected-row-data="selectedRowData"
        :isHideAction="true"
        :selectionMode="'none'"
        @onClickDetails="onClickDetailsStudent"
      />
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      // Bread Crumb
      breadCrumb: [],
      // Table
      schoolId: this.$route.params.schoolId,
      tableDataStudentsUnderSchool: [],
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
          field: "GenerationName",
          header: "Generation",
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
    onClickDetailsStudent(event) {
      console.log(event);
      this.$router.push(`generations/${event[0].GENERATIONS_ID}/students/${event[0].STUDENTS_ID}`)
    },
    selectedRowData(data) {
      this.selectedStudent = data;
    },
    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId);
      if (school && school.data && Object.keys(school.data).length > 0) {
        school = school.data;
      }
      this.breadCrumb =
        [{ label: `${school.Name}`, to: "/" },
        { label: "Manages", to: `/schools/${schoolId}/manages` },
        {
          label: "Students",
          to: `/schools/${this.schoolId}/students`,
        }
      ]
      this.getListStudent();
    },

    async getListStudent() {
      try {
        let students = await this.$api.student.allStudentInSchool(
          this.schoolId,
        );
        if (students && students.data && students.data.length > 0) {
          this.tableDataStudentsUnderSchool = students.data;
        } else {
          this.tableDataStudentsUnderSchool = [];
        }
      } catch (error) {
        console.log("Error list student", error);
      }
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
