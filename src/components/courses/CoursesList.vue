<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <custom-navigation :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <custom-table
        ref="refToChildCustomTable"
        :table_data="tableDataCourses"
        :columns="columnsCourse"
        @selected-row-data="selectedRowData"
        @onClickCreate="onClickCreateCourse"
        @onClickEdit="onClickEditCourse"
        @onClickDelete="openDialogDeleteCourse"
        @onClickDetails="onClickDetailsCourse"
      />
    </div>
    <!-- Chil course form  -->
    <CourseForm
      ref="refToChildCoursForm"
      @updatedCourse="updatedCourse"
    />
    <!-- Dialog delete course  -->
    <custom-dialog
      ref="refToChildCustomDialogDeleteCourseForm"
      @onClickDialogSubmit="deleteCourse()"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteCourse()"
      :is_delete="true"
      :footer_label="'Delete'"
      :modal_header="'Delete Course'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">
          You was selected {{ selectedCourses.length }} to delete.
        </div>
      </template>
    </custom-dialog>
  </div>
</template>
<script>
import CourseForm from "./CourseForm.vue";
export default {
  components: {
    CourseForm,
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      // Bread Crumb
      breadCrumb: [],
      // Table
      selectedCourses: [],
      tableDataCourses: [],
      columnsCourse: [
        {
          field: "Name",
          header: "Course name",
        },
        {
          field: "Credit",
          header: "Credit(h)",
        },
        // {
        //   field: "Class.Name",
        //   header: "Class",
        // },
      ],
    };
  },
  props: {},
  watch: {},
  created() {
    this.getSchoolDetails(this.schoolId);
  },
  methods: {
    onClickCreateCourse() {
      this.$refs.refToChildCoursForm.openDialogCourseForm();
    },
    onClickEditCourse() {
      this.$refs.refToChildCoursForm.openDialogCourseForm();
      this.$refs.refToChildCoursForm.onlyUpdateCourse(this.selectedCourses[0]);
    },
    onClickDetailsCourse(event) {
      console.log("Details", event);
    },
    unSelecteRowCourse() {
      this.$refs.refToChildCustomTable.unSelectedAllRows();
    },

    selectedRowData(data) {
      this.selectedCourses = data;
    },
    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId);
      if (school && school.data && Object.keys(school.data).length > 0) {
        this.breadCrumb = [];
        this.breadCrumb.push(
          { label: `${school.data.Name}`, to: "/" },
          { label: "Manages", to: `/schools/${schoolId}/manages` },
          { label: "Courses", to: `/schools/${schoolId}/courses` }
        );
        this.getListCourses();
      }
    },
    async getListCourses() {
      try {
        let courses = await this.$api.course.listCourses(this.schoolId);
        if (courses && courses.data && courses.data.length > 0) {
          this.tableDataCourses = courses.data
        } else {
          this.tableDataCourses = [];
        }
        this.unSelecteRowCourse();
      } catch (error) {
        console.log("Error list course", error);
      }
    },
    updatedCourse() {
      this.getSchoolDetails(this.schoolId);
    },
    async deleteCourse() {
      for (let item of this.selectedCourses) {
        await this.$api.course.deleteCourse(this.schoolId, item.COURSES_ID);
      }
      this.closeDialogDeleteCourse();
      this.getListCourses();
    },
    openDialogDeleteCourse() {
      this.$refs.refToChildCustomDialogDeleteCourseForm.openDialog();
    },
    closeDialogDeleteCourse() {
      this.$refs.refToChildCustomDialogDeleteCourseForm.closeDialog();
      this.unSelecteRowCourse();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
