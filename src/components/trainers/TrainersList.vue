<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <custom-navigation :breadCrumb="breadCrumb" />
    
    
    <div v-show="true">
      <!-- Table  -->
      <custom-table
        ref="refToChildCustomTable"
        :table_data="tableDataTrainers"
        :columns="columnsTrainer"
        @selected-row-data="selectedRowData"
        @onClickCreate="onClickCreateTrainer"
        @onClickEdit="onClickEditTrainer"
        @onClickDelete="openDialogDeleteTrainer"
        @onClickDetails="onClickDetailsTrainer"
      />
    </div>
    <!-- Chil trainer form  -->
    <TrainerForm ref="refToChildTrainerForm" @updatedTrainer="updatedTrainer" />
    <!-- Dialog delete trainer  -->
    <custom-dialog
      ref="refToChildCustomDialogDeleteTrainer"
      @onClickDialogSubmit="deleteTrainer()"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteTrainer()"
      :is_delete="true"
      :footer_label="'Delete'"
      :modal_header="'Delete Trainer'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">
          You was selected {{ selectedTrainers.length }} to delete.
        </div>
      </template>
    </custom-dialog>
  </div>
</template>
<script>
import TrainerForm from "./TrainerForm.vue";

export default {
  components: {
    TrainerForm,
  },
  data() {
    return {
      // Exam 
      examSections: {},
      // Checkbox
      gender: "",
      checkBoxCategories: [
        {
          Value: "Male",
        },
        {
          Value: "Female",
          Disable: true,
        },
      ],
      schoolId: this.$route.params.schoolId,
      // Bread Crumb
      breadCrumb: [],
      // Table
      selectedTrainers: [],
      tableDataTrainers: [],
      columnsTrainer: [
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
          field: "Phone",
          header: "Phone",
        },
        {
          field: "Email",
          header: "Email",
        },
        {
          field: "Province",
          header: "Province",
        },
      ],
    };
  },
  props: {},
  watch: {
    something() {
      console.log("items", this.something);
    },
  },
  created() {
    this.getSchoolDetails(this.schoolId);
  },
  methods: {
    onClickCreateTrainer() {
      this.$refs.refToChildTrainerForm.openDialogTrainerForm();
    },
    onClickEditTrainer() {
      this.$refs.refToChildTrainerForm.openDialogTrainerForm();
      this.$refs.refToChildTrainerForm.onlyUpdateTrainer(this.selectedTrainers[0]);
    },
    onClickDetailsTrainer(event) {
      console.log(event);
      // this.$router.push(`/trainers/${event[0].trainersID}`);
    },
    unSelecteRowTrainer() {
      this.$refs.refToChildCustomTable.unSelectedAllRows();
    },
    selectedRowData(data) {
      this.selectedTrainers = data;
    },
    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId);
      if (school && school.data && Object.keys(school.data).length > 0) {
        this.breadCrumb = [];
        this.breadCrumb.push(
          { label: `${school.data.Name}`, to: "/" },
          { label: "Manages", to: `/schools/${schoolId}/manages` },
          { label: "Trainers", to: `/schools/${schoolId}/trainers` }
        );
        this.getListTrainers();
      }
    },
    async getListTrainers() {
      try {
        
        let trainers = await this.$api.trainer.listTrainers(this.schoolId);
        if (trainers && trainers.data && trainers.data.length > 0) {
          this.tableDataTrainers = trainers.data;
        } else {
          this.tableDataTrainers = [];
        }
        this.unSelecteRowTrainer();
      } catch (error) {
        console.log("Error list trainer", error);
      }
    },
    updatedTrainer() {
      this.getSchoolDetails(this.schoolId);
    },
    // Delete trainer
    openDialogDeleteTrainer() {
      this.$refs.refToChildCustomDialogDeleteTrainer.openDialog();
    },
    closeDialogDeleteTrainer() {
      this.$refs.refToChildCustomDialogDeleteTrainer.closeDialog();
      this.unSelecteRowTrainer();
    },
    async deleteTrainer() {
      for (let item of this.selectedTrainers) {
        await this.$api.trainer.deleteTrainer(this.schoolId, item.TRAINERS_ID);
      }
      this.closeDialogDeleteTrainer();
      this.getListTrainers();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
