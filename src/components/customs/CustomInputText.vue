<template>
  <div class="p-fluid mb-1">
    <div class="mb-1" :class="hideLabel ? 'd-none' : ''">
      <label v-if="label !== ''">{{ label }} </label>
      <span v-if="required" class="text-red-500"> *</span>
    </div>
    <div v-if="showIcon">
      <span :class="rightIcon ? 'p-input-icon-right' : 'p-input-icon-left'">
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
          :class="[required || messageError !== '' ? pInvalid : '']"
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
    <small v-if="messageError !== '' && showError" class="flex text-red-500">
      {{ messageError }}
      <i :class="messageError ? 'pi pi-info-circle' : ''" style="margin: 2px" />
    </small>
  </div>
</template>
<script setup>
import InputText from "primevue/inputtext";
import {
  onMounted,
  reactive,
  ref,
  inject,
  provide,
  getCurrentInstance,
  watch,
} from "vue";
onMounted(() => {});
defineEmits(["update:modelValue"]);
const props = defineProps({
  placeholder: String,
  required: Boolean,
  label: String,
  messageError: String,
  userIcon: Boolean,
  searchIcon: Boolean,
  spinnerIcon: Boolean,
  emailIcon: Boolean,
  showIcon: Boolean,
  rightIcon: Boolean,
  isDisabled: Boolean,
  border: String,
  style: Object,
  styleCustomInput: Boolean,
  hideLabel: Boolean,
  modelValue: String
});
const instance = getCurrentInstance();
const values = ref(props.modelValue);
const pInvalid = ref("");
const showError = ref(true);
const updateModelValue = (value) => {
  pInvalid.value = "";
  showError.value = false;
  if (!value && props.messageError && props.required) {
    pInvalid.value = "p-invalid";
    showError.value = true;
  }
  instance.emit("update:modelValue", value);
};
watch([() => props.messageError, () => props.modelValue], ([newPropMessageError, newPropModelValue]) => {
  if (newPropMessageError && !values.value ) {
    pInvalid.value = "p-invalid";
    showError.value = true;
  }
  if (newPropModelValue) {
    values.value = newPropModelValue;
  }
} , { immediate: true })


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
