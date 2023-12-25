<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(()=>{});
defineEmits(['getDataCheckBox']);
defineProps({
  msg: {
    type: String,
    required: false
  },
  checkBoxCategories: {
    type: Array,
    required: true
  },
  isFlex: {
    type: Boolean,
    required: false
  }
})
// Variable
const instance = getCurrentInstance();
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction');
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
if (!schoolBc) {
  route.push('/')
}
const getDataCheckBox = (data)=>{
  const modifiedData = data.reduce((acc, { Value }) => {
  return [...acc, { [Value]: Value }];
}, []);
instance.emit('getDataCheckBox', modifiedData)
}
defineExpose({});
</script>

<template>
  <div class="greetings">
  <CustomCheckBox
  :checkBoxCategories="checkBoxCategories"
  @update:modelValue="getDataCheckBox"
  :isFlex="isFlex"
  />
  </div>
</template>

<style scoped>
</style>