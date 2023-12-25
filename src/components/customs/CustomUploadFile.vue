<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(()=>{});
defineEmits(['uploadedFile']);
defineProps({
  msg: {
    type: String,
    required: false
  },
  chooseLabel: {
    type: String, 
    default: ()=> 'Choose'
  }
})
// Variable
const instance = getCurrentInstance();
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction');
const schoolBc = $globalFunction.getDataLs('schoolBc')
const fileInput = ref();
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
const chooseFile =()=>{
  console.log('chooseFile');
  fileInput.value.click();
}
defineExpose({chooseFile});
</script>

<template>
  <div class="greetings">
    <PrimeVueFileUpload
      mode="basic"
      ref="fileInput"
      id="fileInput"
      accept=".xlsx, .xls"
      :maxFileSize="1000000"
      @select="getSelectedFile"
      :chooseLabel="chooseLabel"
      class="secondary"
      style="padding: .6rem;"
    />
  </div>
</template>

<style scoped>
</style>