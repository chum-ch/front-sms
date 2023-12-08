<template lang="">
    <div>
         <!-- Navigation with breadCrum  -->
      <custom-navigation :breadCrumb="breadCrumb" />
      <div v-show="true">
        <!-- Table  -->
        <custom-table
          ref="toCallMethodUnSelectedRow"
          :table_data="tableDataCleaners"
          :columns="columnsCleaner"
          @selected-row-data="selectedRowData"
          @onClickCreate="onClickCreateCleaner"
          @onClickEdit="onClickEditCleaner"
          @onClickDelete="onClickDeleteCleaner"
          @onClickDetails="onClickDetailsCleaner"
          :data_key="dataKey"
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
       breadCrumb: [{ label: "អ្នកសម្អាត", to: "/cleaners" }],
       // Table
       dataKey: "cleanersID",
      selectedTrainers: [],
      tableDataCleaners: [],
      columnsCleaner:[
        {
          field: "LastName",
          header: "នាមត្រកូល",
        },
        {
          field: "FirstName",
          header: "នាមខ្លួន",
        },
        {
          field: "Gender",
          header: "ភេទ",
        },
        {
          field: "Phone",
          header: "លេខទូរសព្ទ",
        },
        {
          field: "Province",
          header: "ខេត្ត",
        },
      ],
    };
  },
  props: {},
  watch: {},
  created() {
    this.getListCleaners()
  },
  methods: {
    onClickCreateCleaner() {
      console.log('c');
      
    },
    onClickEditCleaner() {
      console.log('e');
    },
    onClickDetailsCleaner(event) {
      this.$router.push(`/cleaners/${event[0].cleanersID}`);
    },
    unSelecteRowStudent() {
      this.$refs.toCallMethodUnSelectedRow.unSelectedAllRows();
    },
    
     // Delete trainer
     onClickDeleteCleaner() {
      console.log('d');
    },
    selectedRowData(data) {
      this.selectedTrainers = data;
    },
    async getListCleaners() {
      try {
        let cleaners = await this.$api.school.cleaner().listCleaners();
        if (cleaners.data) {
          this.tableDataCleaners = cleaners.data;
        }
        this.unSelecteRowStudent();
      } catch (error) {
        console.log('List cleaners error', error);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>