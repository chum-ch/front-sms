<template>
  <div class="">
    <NavigationView :breadCrumb="breadCrumb" />
    <CustomTab
      :dataTabs="dataTabs"
      class="pe-2"
      :isFlex="true"
      :justifyContent="'start'"
    ></CustomTab>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
import SendExam from './SendExam.vue'
onMounted(async () => {
  await getExam(route.currentRoute.value.params.examId)
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
const examId = route.currentRoute.value.params.examId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
const examName = ref('')
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/exams`, label: 'Exams' },
    { route: `/schools/${schoolId}/exams/${examId}`, label: examName }
  )
}
// Functions
const examSections = ref({})
const dataTabs = [
  {
    Active: true,
    TabName: 'Exam details',
    Component: 'CustomQA',
    props: {examSections},
  },
  {
    TabName: 'Send exam',
    Component: SendExam
  }
]
const getExam = async (id) => {
  let exams = await $api.exam.getExam(schoolId, id)
  if (exams && exams.data) {
    examSections.value = exams.data
    examName.value = exams.data.ExamTitle
  }
}
defineExpose({})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
