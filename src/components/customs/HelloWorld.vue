<template>
  <div class="hello">
    <div>
      <button-primevue label="Check" />
    </div>
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
    msg: String,
    placeholder: String,
    is_required: Boolean,
    label: String,
    message_error: String,
    user_icon: Boolean,
    search_icon: Boolean,
    spinner_icon: Boolean,
    has_icon: Boolean,
    right_icon: Boolean,
    // sm_size: Boolean,
    // lg_size: Boolean,
    is_disabled: Boolean,
    border: String,
    value: String,
    modelValue: String,
  },
  emits: ["update:modelValue"],
  watch: {
    values: {
      immediate: true,
      handler(data) {
        this.$emit("update:modelValue", data);
      },
    },
    message_error: {
      immediate: true,
      handler(data) {
        if (data) {
          this.p_invalid = "p-invalid";
        }
      },
    },
  },
  created() {
    this.values = this.modelValue;
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
