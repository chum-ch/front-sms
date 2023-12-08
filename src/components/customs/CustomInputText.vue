<template>
  <div class="p-fluid mb-2">
    <div :class="hideLabel ? 'd-none' : ''">
      <label v-if="label !== ''">{{ label }} </label>
      <span v-if="required" class="text-red-500"> *</span>
    </div>
    <div v-if="showIcon">
      <span :class="rightRcon ? 'p-input-icon-right' : 'p-input-icon-left'">
        <i
          :class="
            userIcon
              ? 'pi pi-user'
              : searchIcon
              ? 'pi pi-search'
              : spinnerIcon
              ? 'pi pi-spin pi-spinner'
              : emailIcon
              ? 'pi pi-envelope'
              : 'pi pi-user'
          "
        />
        <InputText
          :class="[required && messageError !== '' ? pInvalid : '']"
          :style="style"
          :placeholder="placeholder"
          v-model="values"
          @update:modelValue="updateModelValue"
        />
      </span>
    </div>
    <div class="" v-else>
      <InputText
        :style="style"
        :class="[required || messageError !== '' ? pInvalid : '']"
        :placeholder="placeholder"
        :disabled="isDisabled"
        v-model="values"
        @update:modelValue="updateModelValue"
      />
    </div>
    <small
      v-if="messageError !== ''"
      class="flex text-red-500"
    >
      {{ messageError }}
      <i :class="messageError ? 'pi pi-info-circle' : ''" style="margin: 2px" />
    </small>
  </div>
</template>
<script>
import InputText from "primevue/inputtext";
export default {
  name: "styleCustomInputText",
  components: {
    InputText,
  },
  data() {
    return {
      values: "",
      pInvalid: "",
    };
  },
  updated() {
    if (this.modelValue) {
      this.values = this.modelValue;
    } else {
      this.values = "";
    }
  },
  created() {
    this.updateModelValue(this.modelValue);
  },
  props: {
    msg: String,
    placeholder: String,
    required: Boolean,
    label: String,
    messageError: String,
    userIcon: Boolean,
    searchIcon: Boolean,
    spinnerIcon: Boolean,
    emailIcon: Boolean,
    showIcon: Boolean,
    rightRcon: Boolean,
    isDisabled: Boolean,
    border: String,
    style: Object,
    styleCustomInput: Boolean,
    hideLabel: Boolean,
    // value: String,
    modelValue: [String, Number, Object],
  },
  emits: ["update:modelValue"],
  watch: {
    // values: {
    //   immediate: true,
    //   handler(data) {
    //     this.values = data
    //     console.log('da', data);
    //   },
    // },
    messageError: {
      immediate: true,
      handler(data) {
        if (data) {
          this.pInvalid = "p-invalid";
        }
      },
    },
  },
  methods: {
    // setDefaultValue(){
    //   this.values = ""
    // },
    updateModelValue(value) {
      this.values = value;
      this.$emit("update:modelValue", this.values);
      // console.log("value text input", value);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-input {
  border: none;
  outline: none;
  padding: 0 0 0 5px;
  background: transparent;
}
</style>
