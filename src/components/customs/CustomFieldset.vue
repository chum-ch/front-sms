<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits([''])
defineProps({
  legend: {
    type: String,
    required: false
  },
  toggleable: {
    type: Boolean,
    required: false,
    default: () => false
  },
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
// Functions
defineExpose({})
</script>

<template>
  <div class="fieldset">
    <PrimeVueFieldset :legend="legend" :toggleable="toggleable"
    >
      <template #legend>
      <slot name="legendFieldset"></slot>
      </template>
      <div
      class="overflow-scroll pb-5" style="height: 95vh"
      >
      <slot name="bodyFieldset"></slot>
      </div>
    </PrimeVueFieldset>
  </div>
</template>

<style>
.p-fieldset-content {
  padding: 0px 20px;
}

</style>
