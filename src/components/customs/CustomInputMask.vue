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
      <small v-if="message_errors !== '' && show_error" class="flex text-red-500">
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
      p_invalid: "",
      show_error: true,
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
          let [hh, mm] = data.split(":");
          if (hh !== "_" && parseInt(hh, 10) > 24) {
            this.$emit("isNotMatch", true);
            this.message_errors = "Hour is wrong format.";
             this.showErrorSms()
            } else if (mm !== "_" && parseInt(mm, 10) > 59) {
              this.$emit("isNotMatch", true);
              this.message_errors = "Minute is wrong format.";
              this.showErrorSms()
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
          this.message_errors = data;
          this.showErrorSms()
        }
      },
    },
  },
  created() {
    this.updateModelValue(this.modelValue)
  },
  methods: {
    showErrorSms(){
      this.show_error = true
      this.p_invalid = "p-invalid"
    },
    updateModelValue(value) {
      this.values = value;
      this.$emit("update:modelValue", this.values);
      this.show_error = false
      this.p_invalid = ""
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
