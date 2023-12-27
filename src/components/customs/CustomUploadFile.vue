<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits(['uploadedFile', 'upload'])
defineProps({
  msg: {
    type: String,
    required: false
  },
  chooseLabel: {
    type: String,
    default: () => 'Choose'
  }
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
const schoolBc = $globalFunction.getDataLs('schoolBc')
const fileUploadRef = ref(null)
if (!schoolBc) {
  route.push('/')
}
// Functions
const getSelectedFile = (event) => {
  const {
    files: [uploadedFile]
  } = event
  instance.emit('uploadedFile', uploadedFile)
}
const clearFileSelected = () => {
  fileUploadRef.value.clear()
}
const openFileBrowser = () => {
  fileUploadRef.value.choose()
}
defineExpose({ getSelectedFile, openFileBrowser, clearFileSelected })
</script>

<template>
  <div class="greetings">
    <PrimeVueFileUpload
      accept=".xlsx, .xls"
      :maxFileSize="1000000"
      :chooseLabel="chooseLabel"
      @select="getSelectedFile"
      class="secondary"
      style="padding: 0.6rem"
      ref="fileUploadRef"
      mode="basic"
    />
  </div>
</template>

<style scoped></style>
