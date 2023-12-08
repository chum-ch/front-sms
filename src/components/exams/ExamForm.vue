
<template>
  <div class="">
    <custom-qa-form/>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      values: "",
      p_invalid: "",
    };
  },
  props: {
  },
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
    // this.values = this.modelValue;
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
