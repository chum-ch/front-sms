<template>
    <div>
         <!-- Navigation with breadCrum  -->
      <custom-navigation :breadCrumb="breadCrumb" />
      <div v-show="true">
        <!-- Table  -->
        <custom-table
          ref="refToChildCustomTable"
          :table_data="tableDataClasses"
          :columns="columnsClass"
          @selected-row-data="selectedRowData"
          @onClickCreate="onClickCreateClass"
          @onClickEdit="onClickEditClass"
          @onClickDelete="openDialogDeleteClass"
          @onClickDetails="onClickDetailsClass"
        />
      </div>
      <!-- Chil class form  -->
      <ClassForm ref="refToChildClassForm" @updatedClass="updatedClass"/>
      <!-- Dialog delete class  -->
      <custom-dialog
        ref="refToChildCustomDialogDeleteClass"
        @onClickDialogSubmit="deleteClass()"
        :danger="true"
        @onClickCloseDialog="closeDialogDeleteClass()"
        :is_delete="true"
        :footer_label="'Delete'"
        :modal_header="'Delete Class'"
      >
        <template #bodyDialog>
          <div class="text-center mt-4">
            You was selected  {{ selectedClasses.length }} to delete.
          </div>
        </template>
      </custom-dialog>
    </div>
</template>
<script>
import ClassForm from './ClassForm.vue';
export default {
  components: {
    ClassForm
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
       // Bread Crumb
       breadCrumb: [],
       // Table
      selectedClasses: [],
      tableDataClasses: [],
      columnsClass:[
        {
          field: "Name",
          header: "Class name",
        },
        {
          field: "Room.Name",
          header: "Room",
        },
        {
          field: "Trainer.Name",
          header: "Trainer in class",
        },
      ],
    };
  },
  props: {},
  watch: {},
  created() {
    this.getSchoolDetails(this.schoolId)
  },
  methods: {
    onClickCreateClass() {
      this.$refs.refToChildClassForm.openDialogClassForm();
  
    },
    onClickEditClass() {
      
      this.$refs.refToChildClassForm.openDialogClassForm();
      this.$refs.refToChildClassForm.onlyUpdateClasses(this.selectedClasses[0]);
    },
    onClickDetailsClass(event) {
      console.log('Details', event);
      // this.$router.push(`/classes/${event[0].trainersID}`);
    },
    unSelecteRowClass() {
      this.$refs.refToChildCustomTable.unSelectedAllRows();
    },
  
    selectedRowData(data) {
      this.selectedClasses = data;
    },
    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId)
      if(school && school.data && Object.keys(school.data).length > 0){
        this.breadCrumb = [];
        this.breadCrumb.push({ label: `${school.data.Name}`, to: '/' }, { label: 'Manages', to: `/schools/${schoolId}/manages` }, { label: 'Classes', to: `/schools/${schoolId}/classes` });
        this.listClasses()
      }
    },
    async listClasses() {
      try {
        let classes = await this.$api.classApi.listClasses(this.schoolId);
        if (classes && classes.data && classes.data.length > 0) {
          this.tableDataClasses = classes.data;
        } else {
          this.tableDataClasses = [];
        }
        this.unSelecteRowClass();
      } catch (error) {
        console.log('Error list class', error);
      }
    },
    updatedClass(event){
      if(event && event.CloseDialog){
        this.unSelecteRowClass();
      } else {
        this.getSchoolDetails(this.schoolId)
      }
    },
    async deleteClass(){
      for (let item of this.selectedClasses){
        await this.$api.classApi.deleteClass(this.schoolId, item.CLASSES_ID);
      }
      this.closeDialogDeleteClass();
      this.getSchoolDetails(this.schoolId);
    },
    openDialogDeleteClass() {
      this.$refs.refToChildCustomDialogDeleteClass.openDialog();
    },
    closeDialogDeleteClass() {
      this.$refs.refToChildCustomDialogDeleteClass.closeDialog();
      this.unSelecteRowClass();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>