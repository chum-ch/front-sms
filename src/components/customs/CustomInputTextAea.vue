<template>
  <div class="mb-1 p-fluid">
    <label v-if="label !== ''">{{ label }} </label>
    <span v-if="required" class="text-red-500"> *</span>
        <Textarea
          :class="required && message_error !== '' ? p_invalid : ''"
          :style="{ border: border }"
          :placeholder="placeholder"
          v-model="values"
          autoResize
          @update:modelValue="updateModelValue"
        />
    <small v-if="message_error !== ''" class="flex text-red-500">
      {{ message_error }}
      <i :class="message_error ? 'pi pi-info-circle' : ''" style="margin: 2px" />
    </small>
  </div>
</template>
<script>
import Textarea from 'primevue/textarea';
export default {
  name: "CustomInputTextArea",
  components: {
    Textarea,
  },
  data() {
    return {
      values: "",
      p_invalid: "",
    };
  },
  updated() {},
  created() {
    this.updateModelValue(this.modelValue);
  },
  props: {
    placeholder: String,
    required: Boolean,
    label: String,
    message_error: String,
    is_disabled: Boolean,
    border: String,
    // value: String,
    modelValue: [String, Number, Object],
  },
  emits: ["update:modelValue"],
  watch: {
    // values: {
    //   immediate: true,
    //   handler(data) {
    //     this.$emit("update:modelValue", data);
    //   },
    // },
    message_error: {
      immediate: true,
      handler(data) {
        if (data) {
          this.p_invalid = "p-invalid";
        }
      },
    },
  },
  methods: {
    updateModelValue(value) {
      this.values = value;
      this.$emit("update:modelValue", this.values);
      // console.log("value text input", value);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
