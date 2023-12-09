<template>
  <div class="mb-1">
    <section class="flex flex-column">
      <label for="date"
        >{{ label }}<span v-if="required" class="text-red-500"> *</span></label
      >
      <InputNumber
        ref="InputNumber"
        
        v-model="values"
        :placeholder="placeholder"
        :inputId="isDecimal ? 'minmaxfraction' : 'integeronly'"
        :minFractionDigits="decimalDigit"
        :showButtons="isShowButtons"
        @update:modelValue="updateModelValue"
        @input="getValue"
        class=""
        :class="required && messageError !== '' ? p_invalid : ''"
      />
      <small v-if="messageError !== ''" class="flex text-red-500">
        {{ messageError }}
        <i :class="messageError ? 'pi pi-info-circle' : ''" style="margin: 2px" />
      </small>
    </section>
  </div>
</template>

<script>
import InputNumber from "primevue/inputnumber";
export default {
  name: "CustomInputNumber",
  components: {
    InputNumber,
  },
  data() {
    return {
      values: "",
      p_invalid: '',
      // messageError: this.messageError,
      decimalDigit: null,
    };
  },
  props: {
    style: Object,
    label: String,
    required: Boolean,
    placeholder: String,
    modelValue: [String, Date, Number],
    messageError: String,
    isShowButtons: Boolean,
    isDecimal: Boolean,
    // decimalDigit: Number
  },
  emits: ["update:modelValue"],
  watch: {
    messageError: {
      immediate: true,
      handler(data) {
        if (data) {
          this.p_invalid = "p-invalid";
        }
      },
    },
  },
  created() {
    this.updateModelValue(this.modelValue);
    this.getValue();
  },
  methods: {
    getValue(){
      if(this.isDecimal) {
        this.decimalDigit = 2;
      }
    },
    updateModelValue(value) {
      this.values = value;
      this.$emit("update:modelValue", this.values);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.p-inputnumber {
  padding: 0;
  margin: 0;
}
</style>
