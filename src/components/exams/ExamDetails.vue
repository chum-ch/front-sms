<template>
  <div class="">
      <custom-qa :examSections="examSections" v-show="true" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      examSections: {},
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
  updated() {
    
  },
  created() {
    // this.values = this.modelValue;
    this.getExam('exams:5b2a3fa695e34494a5bbc294cbea0b1a')
  },
  methods: {
    async getExam(id) {
      let exams = await this.$api.exam.getExam(this.schoolId, id);
      console.log(exams);
      if (exams && exams.data) {
        this.examSections = exams.data;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
