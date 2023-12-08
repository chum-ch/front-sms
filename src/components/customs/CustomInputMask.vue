<template>
  <div class="mb-1">
    <section class="flex flex-column">
      <label for="date"
        >{{ label }}<span v-if="required" class="text-red-500"> *</span></label
      >
      <InputMask
        ref="inputmask"
        class=""
        v-model="values"
        :class="[required || message_error !== '' ? p_invalid : '']"
        :mask="mask"
        :placeholder="placeholder"
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
import InputMask from "primevue/inputmask";
export default {
  name: "CustomInputMask",
  components: {
    InputMask,
  },
  data() {
    return {
      values: "",
      message_errors: this.message_error,
      p_invalid: ''
    };
  },
  props: {
    msg: String,
    label: String,
    required: Boolean,
    placeholder: String,
    modelValue: [String, Date],
    message_error: String,
    mask: String,
  },
  emits: ["update:modelValue", "isNotMatch"],
  watch: {
    values: {
      immediate: true,
      handler(data) {
        if (data) {
          let splitTime = data.split(":");
          if (splitTime[0] !== "_" && parseInt(splitTime[0], 10) > 24) {
            this.$emit("isNotMatch", true);
            this.message_errors = "Hour is wrong format.";
          } else if (splitTime[1] !== "_" && parseInt(splitTime[1], 10) > 59) {
            this.$emit("isNotMatch", true);
            this.message_errors = "Minute is wrong format.";
          } else {
            this.message_errors = "";
          }
        }
        if (data && data.includes("_")) {
          this.$emit("isNotMatch", true);
        } else if (data) {
          this.$emit("isNotMatch", false);
        }
        this.$emit("update:modelValue", data);
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
    this.updateModelValue(this.modelValue)
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
