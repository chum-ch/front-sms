<template>
  <div class="mb-1 p-fluid">
    <section class="flex flex-column">
      <div>
        <label v-if="label !== ''">{{ label }} </label>
        <span v-if="required" class="text-red-500"> *</span>
      </div>
      <Dropdown
        v-model="selectedValue"
        :options="options"
        filter
        @filter="handleFilterChange"
        :placeholder="placeholder"
        :filterPlaceholder="'Search'"
        optionLabel="Value"
        :class="required && messageError !== '' ? pInvalid : ''"
        @update:modelValue="updateModelValue"
        :resetFilterOnHide="true"
      >
        <template #content> </template>
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.Value }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.Value }}</div>
          </div>
        </template>

        <template #emptyfilter>
          <small v-show="filterValue" class="flex justify-content-between">
            <span
              >Value <span class="fw-bolder text-primary">{{ filterValue }}</span> is not
              found!</span
            >
            <span class="text-white customEmpty" @click="$emit('addNewDropdown', filterValue)"
              >Add New</span
            >
          </small>
        </template>
        <template #empty>
          <small class="flex justify-content-between">
            <span>No more item !</span>
            <span class="text-white customEmpty" @click="$emit('addNewDropdown', filterValue)"
              >Add New</span
            >
          </small>
        </template>
      </Dropdown>
      <small v-if="messageError !== '' && showError" class="flex text-red-500 mt-1">
        {{ messageError }}
        <i :class="messageError ? 'pi pi-info-circle' : ''" style="margin: 2px" />
      </small>
    </section>
  </div>
</template>

<script setup>
import Dropdown from 'primevue/dropdown'
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
const props = defineProps({
  msg: String,
  placeholder: String,
  options: Array,
  required: Boolean,
  messageError: String,
  label: String,
  modelValue: [String, Object, Number]
})

const selectedValue = ref()
const filterValue = ref()
const pInvalid = ref("");
const showError = ref(true);
const instance = getCurrentInstance()
defineEmits(['update:modelValue', 'addNewDropdown'])

const handleFilterChange = (event) => {
  filterValue.value = event.value
}
const updateModelValue = (value) => {
  selectedValue.value = value
  showError.value = false
  pInvalid.value = ""
  instance.emit('update:modelValue', value)
}
watch([() => props.messageError, () => props.modelValue], ([newPropMessageError, newPropModelValue]) => {
  if (newPropMessageError && !selectedValue.value ) {
    pInvalid.value = "p-invalid";
    showError.value = true;
  }
  if (newPropModelValue) {
    selectedValue.value = newPropModelValue;
    showError.value = false
    pInvalid.value = ""
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to component only -->
<style scoped>
.customEmpty {
  padding: 3px;
  border-radius: 4px;
  background: #007bff;
  cursor: pointer;
}
.customEmpty:hover {
  background: #006adc;
}
</style>
