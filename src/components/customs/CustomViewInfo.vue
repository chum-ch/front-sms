<template>
    <div class="flex justify-content-between mb-2 ">
      <p>{{ label }}</p>
      <h6 class="fw-bold" >{{ value }}</h6>
    </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    label: String,
    value: String,
  },
  emits: [""],
  watch: {
    // values: {
    //   immediate: true,
    //   handler(data) {
    //     this.$emit("update:modelValue", data);
    //   },
    // },
  },
  created() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
