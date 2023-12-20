<script setup>
// import StudentsList from "./StudentsList.vue";
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import StudentForm from './StudentForm.vue'
onMounted(() => {})
defineEmits([''])
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
const generationId = route.currentRoute.value.params.generationId
const studentId = route.currentRoute.value.params.studentId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const generationBc = $globalFunction.getDataLs('generationBc')
const studentBc = $globalFunction.getDataLs('studentBc')
const breadCrumb = ref([])
const refToChildCropImg = ref()
const fullName = ref(`${studentBc.LastName} ${studentBc.FirstName}`)
const email = ref(studentBc.Email)
if (!schoolBc || !generationBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/generations`, label: 'Generations' },
    { route: `/schools/${schoolId}/generations`, label: `${generationBc.Name}` },
    {
      route: `/schools/${schoolId}/generations/${generationId}/students`,
      label: 'Students'
    },
    {
      label: fullName,
      route: `/schools/${schoolId}/generations/${generationId}/students/${studentId}`
    }
  )
}
// Functions
const ProfileURL = ref('')
const myImage = ref('')
// Profile
// Bread crumb
const itemsViewInfo = ref([
  {
    label: 'Gender',
    path: 'Gender'
  },
  {
    label: 'Province',
    path: ''
  },
  {
    label: 'ID',
    path: 'ID'
  },
  {
    label: 'Generation name',
    path: 'GenerationName'
  },
  {
    label: 'Class',
    path: 'Class.Name'
  },
  {
    label: 'Room',
    path: 'Class.Room.Name'
  }
])
// Tabs
const dataTabs = [
  {
    TabName: 'Overview',
    Component: 'null',
    Active: true,
  },
  {
    TabName: 'Schedule',
    Component: 'CustomFullCalendar',
  }
]
const changProfile = () => {
  refToChildCropImg.openDialogCropImg()
}
const handleSubmit = async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  const uploadImage = await $api.student.uploadImage(studentId, formData)
  ProfileURL.value = uploadImage.data.ProfileURL
}
const getSchoolDetails = async (schoolId) => {
  let school = await $api.school.getSchool(schoolId)
  if (school && school.data && Object.keys(school.data).length > 0) {
    school = school.data
  }
  let generation = await $api.generation.getGeneration(schoolId, generationId)
  if (generation && generation.data && Object.keys(generation.data).length > 0) {
    generation = generation.data
  }
  let student = await $api.student.getStudent(schoolId, generationId, studentId)
  if (student && student.data && Object.keys(student.data).length > 0) {
    student = { ...student.data, GenerationName: generation.Name }
    ProfileURL.value = student.ProfileURL
    itemsViewInfo.value = $globalFunction.getValueNestedObject(itemsViewInfo, student)
  }
}
defineExpose({})
</script>

<template>
  <div class="overflow-hidden h-screen">
    <NavigationView :breadCrumb="breadCrumb" />
    <div class="gap-2 p-2" style="display: grid; grid-template-columns: 30% 70%">
      <CustomPeopleProfile
        :fullName="fullName"
        :email="email"
        :ProfileURL="ProfileURL"
      >
        <!-- @onClick="changProfile" -->
        <template #view_info>
          <CustomViewInfo
            v-for="(item, index) in itemsViewInfo"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </CustomViewInfo>
        </template>
      </CustomPeopleProfile>
      <CustomTab :dataTabs="dataTabs" class="pe-2" :isFlex="true">
      </CustomTab>
    </div>
    <CustomCropImg ref="refToChildCropImg" @image="handleSubmit" />
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
