<template>
  <div class="mb-1">
    <section class="flex flex-column">
      <label v-show="!hideLabel" for="date"
        >Date<span v-if="required" class="text-red-500"> *</span></label
      >
      <Calendar
        class="text-white"
        v-model="values"
        :showIcon="isShowIcon"
        dateFormat="yy-mm-dd"
        :selectionMode="isMultipleDate ? 'multiple' : isRangeDate ? 'range' : 'single'"
        id="date"
        :class="[required || message_errors !== '' ? p_invalid : '']"
        @update:modelValue="updateModelValue"
      />
      <small v-if="message_errors !== ''" class="flex text-red-500">
        {{ message_errors }}
        <i :class="message_errors ? 'pi pi-info-circle' : ''" style="margin: 2px" />
      </small>
    </section>
  </div>
</template>

<script>
import Calendar from "primevue/calendar";
export default {
  name: "CustomCalendar",
  components: {
    Calendar,
  },
  data() {
    return {
      values: "",
      message_errors: this.message_error,
      p_invalid: "",
    };
  },
  props: {
    msg: String,
    required: Boolean,
    isShowIcon: Boolean,
    isMultipleDate: Boolean,
    isRangeDate: Boolean,
    modelValue: [String, Date],
    message_error: String,
    hideLabel: Boolean,
  },
  emits: ["update:modelValue"],
  watch: {
    values: {
      immediate: true,
      handler(data) {
        if (data) {
          this.$emit("update:modelValue", data);
          this.message_errors = "";
        }
      },
    },
    message_error: {
      immediate: true,
      handler(data) {
        if (data) {
          this.p_invalid = "p-invalid";
          this.message_errors = data;
        }
      },
    },
  },
  created() {
    this.updateModelValue(this.modelValue);
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
<style></style>
