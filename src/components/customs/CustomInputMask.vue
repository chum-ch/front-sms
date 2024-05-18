<script setup>
import InputMask from 'primevue/inputmask'
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
defineEmits(['update:modelValue', 'get:value'])
const instance = getCurrentInstance()
const props = defineProps({
  msg: String,
  label: String,
  required: Boolean,
  placeholder: String,
  modelValue: [String, Date],
  message_error: String,
  mask: String
})
const values = ref('')
const p_invalid = ref('')
const show_error = ref(true)
const hmError = 'Hours or Minutes are not allowed'
const message_errors = ref(props.message_error)
const showErrorSms = () => {
  show_error.value = true
  p_invalid.value = 'p-invalid'
  instance.emit('update:modelValue', values.value)
}
const hideErrorSms = () => {
  show_error.value = false
  p_invalid.value = ''
  instance.emit('update:modelValue', values.value)
}
const updateModelValue = (value) => {
  if (value) {
    hideErrorSms()
    let [hh, mm] = value.split(':')
    if (
      (!hh.includes('_') && parseInt(hh, 10) > 24) ||
      (!mm.includes('_') && parseInt(mm, 10) > 59)
    ) {
      message_errors.value = hmError
      showErrorSms()
    }
  } else if (props.message_error) {
    showErrorSms()
  }
}
const handleValue = (event) => {
  console.log('vv', event);
  instance.emit('get:value', event)
}
watch(
  [() => props.message_error, () => props.modelValue],
  ([newPropMessageError, newPropModelValue]) => {
    if (newPropMessageError) {
      message_errors.value = newPropMessageError
      showErrorSms()
    }
    if (newPropModelValue) {
      values.value = newPropModelValue
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="mb-1">
    <section class="flex flex-column">
      <label for="date">{{ label }}<span v-if="required" class="text-red-500"> *</span></label>
      <InputMask
        ref="inputmask"
        class=""
        v-model="values"
        :class="[required || message_error !== '' ? p_invalid : '']"
        :mask="mask"
        :placeholder="placeholder"
        @update:modelValue="updateModelValue"
        @:keyup="handleValue(values)"
      />
      <small v-if="message_errors !== '' && show_error" class="flex text-red-500">
        {{ message_errors }}
        <i :class="message_errors ? 'pi pi-info-circle' : ''" style="margin: 2px" />
      </small>
    </section>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
