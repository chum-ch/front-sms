<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <custom-navigation :breadCrumb="breadCrumb" />
    <div>
      <custom-qa-form  v-show="false"/>
    </div>
    <ExamDetails/>
  </div>
</template>

<script>
import ExamDetails from "./ExamDetails.vue";
export default {
  components: {
    ExamDetails
  },
  data() {
    return {
      // Bread Crumb
      breadCrumb: [],
      schoolId: this.$route.params.schoolId,
    };
  },
  props: {},
  emits: ["update:modelValue"],
  watch: {
    // values: {
    //   immediate: true,
    //   handler(data) {
    //     this.$emit("update:modelValue", data);
    //   },
    // },
    // message_error: {
    //   immediate: true,
    //   handler(data) {
    //     if (data) {
    //       this.p_invalid = "p-invalid";
    //     }
    //   },
    // },
  },
  created() {
    this.getSchoolDetails(this.schoolId);
  },
  methods: {
    async getSchoolDetails(schoolId) {
      let school = await this.$api.school.getSchool(schoolId);
      if (school && school.data && Object.keys(school.data).length > 0) {
        this.breadCrumb = [];
        this.breadCrumb.push(
          { label: `${school.data.Name}`, to: "/" },
          { label: "Manages", to: `/schools/${schoolId}/manages` },
          { label: "Exams", to: `/schools/${schoolId}/exams` }
        );
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
