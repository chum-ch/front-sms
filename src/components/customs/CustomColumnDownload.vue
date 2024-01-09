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
  },
  showCheckAll: {
    type: Boolean,
    required: false
  },
  showAutoCheck: {
    type: Boolean,
    required: false
  },
  autoSelectLabel: String
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
  const modifiedData = data.reduce((acc, { field }) => {
    return [...acc, { field }];
  }, []);
instance.emit('getDataCheckBox', modifiedData)
}
defineExpose({});
</script>

<template>
  <div class="custom-download">
  <CustomCheckBox
  :checkBoxCategories="checkBoxCategories"
  @update:modelValue="getDataCheckBox"
  :isFlex="isFlex"
  :showCheckAll="showCheckAll"
  :showAutoCheck="showAutoCheck"
  :autoSelectLabel="autoSelectLabel"
  />
  </div>
</template>

<style scoped>
</style>