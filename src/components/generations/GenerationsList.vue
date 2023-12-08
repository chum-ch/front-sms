<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <custom-navigation :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <custom-table
        ref="refToChildCustomTable"
        :table_data="tableDataGenerations"
        :columns="columnsGeneration"
        @selected-row-data="selectedRowData"
        @onClickCreate="onClickCreateGeneration"
        @onClickEdit="onClickEditGeneration"
        @onClickDelete="openDialogDeleteGeneration"
        @onClickDetails="onClickDetailsGeneration"
      />
    </div>
    <!-- Chil generation form  -->
    <GenerationForm
      ref="refToChildGenerationForm"
      @updatedGeneration="updatedGeneration"
    />
    <!-- Dialog delete generation  -->
    <custom-dialog
      ref="refToChildCustomDialogDeleteGenerationForm"
      @onClickDialogSubmit="deleteGeneration()"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteGeneration()"
      :is_delete="true"
      :footer_label="'Delete'"
      :modal_header="'Delete Generation'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">
          You was selected {{ selectedGenerations.length }} to delete.
        </div>
      </template>
    </custom-dialog>
  </div>
</template>
<script>
import GenerationForm from "./GenerationForm.vue";
export default {
  components: {
    GenerationForm,
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      // Bread Crumb
      breadCrumb: [],
      // Table
      selectedGenerations: [],
      tableDataGenerations: [],
      columnsGeneration: [
        {
          field: "Name",
          header: "Generation",
        },
        {
          field: "StudentNumber",
          header: "Number of student",
        },
      ],
    };
  },
  props: {},
  watch: {},
  created() {
    this.getSchoolDetails(this.schoolId);
  },
  methods: {
    onClickCreateGeneration() {
      this.$refs.refToChildGenerationForm.openDialogGenerationForm();
    },
    onClickEditGeneration() {
      this.$refs.refToChildGenerationForm.openDialogGenerationForm();
      this.$refs.refToChildGenerationForm.onlyUpdateGeneration(
        this.selectedGenerations[0]
      );
    },
    onClickDetailsGeneration(event) {
      this.$router.push(`generations/${event[0].GENERATIONS_ID}/students`);
    },
    unSelecteRowGeneration() {
      this.$refs.refToChildCustomTable.unSelectedAllRows();
    },
    selectedRowData(data) {
      this.selectedGenerations = data;
    },
    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId);
      if (school && school.data && Object.keys(school.data).length > 0) {
        this.breadCrumb = [
          { label: `${school.data.Name}`, to: "/" },
          { label: "Manages", to: `/schools/${schoolId}/manages` },
          { label: "Generations", to: `/schools/${schoolId}/generations` },
        ];
        this.getListGenerations();
      }
    },
    async getListGenerations() {
      try {
        let generations = await this.$api.generation.listGenerations(this.schoolId);
        if (generations && generations.data && generations.data.length > 0) {
          this.tableDataGenerations = generations.data;
        } else {
          this.tableDataGenerations = [];
        }
        this.unSelecteRowGeneration();
      } catch (error) {
        console.log("Error list generations", error);
      }
    },
    updatedGeneration() {
      this.getSchoolDetails(this.schoolId);
    },
    async deleteGeneration() {
      for (let item of this.selectedGenerations) {
        await this.$api.generation.deleteGeneration(this.schoolId, item.GENERATIONS_ID);
      }
      this.closeDialogDeleteGeneration();
      this.getListGenerations();
    },
    openDialogDeleteGeneration() {
      this.$refs.refToChildCustomDialogDeleteGenerationForm.openDialog();
    },
    closeDialogDeleteGeneration() {
      this.$refs.refToChildCustomDialogDeleteGenerationForm.closeDialog();
      this.unSelecteRowGeneration();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
