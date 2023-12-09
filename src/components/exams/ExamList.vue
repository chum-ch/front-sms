<template>
  <div>
    <NavigationView :breadCrumb="breadCrumb" />
    <div>
      <CustomQAForm v-show="true" />
    </div>
    <ExamDetails v-show="false" />
  </div>
</template>

<script setup>
import ExamDetails from './ExamDetails.vue'
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
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

defineExpose({})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
