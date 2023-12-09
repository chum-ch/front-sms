<template>
  <div class="">
    <CustomQA :examSections="examSections" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(async () => {
  await getExam('exams:5b2a3fa695e34494a5bbc294cbea0b1a')
})
defineEmits(['update:modelValue'])
defineProps({
  msg: {
    type: String,
    required: false
  }
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/exams`, label: 'Exams' }
  )
}
// Functions
const examSections = ref({})
const getExam = async (id) => {
  let exams = await $api.exam.getExam(schoolId, id)
  console.log('exams', exams)
  if (exams && exams.data) {
    examSections.value = exams.data
  }
}
defineExpose({})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
