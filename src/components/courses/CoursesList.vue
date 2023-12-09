<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
import CourseForm from './CourseForm.vue'
onMounted(async () => {
  await getListCourses()
})
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
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
const refToChildCourseForm = ref()
const refToChildCustomTable = ref()
const refToChildCustomDialogDeleteCourseForm = ref()
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/courses`, label: 'Courses' }
  )
}
// Functions
// Table
const selectedCourses = ref([])
const tableDataCourses = ref([])
const columnsCourse = ref([
  {
    field: 'Name',
    header: 'Course name'
  },
  {
    field: 'Credit',
    header: 'Credit(h)'
  }
  // {
  //   field: "Class.Name",
  //   header: "Class",
  // },
])
const onClickCreateCourse = () => {
  refToChildCourseForm.value.openDialogCourseForm()
}
const onClickEditCourse = () => {
  refToChildCourseForm.value.openDialogCourseForm()
  refToChildCourseForm.value.onlyUpdateCourse(selectedCourses.value[0])
}
const onClickDetailsCourse = (event) => {
  console.log('Details', event)
}
const unSelectRowCourse = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}

const selectedRowData = (data) => {
  selectedCourses.value = data
}
const getListCourses = async () => {
  try {
    let courses = await $api.course.listCourses(schoolId)
    if (courses && courses.data && courses.data.length > 0) {
      tableDataCourses.value = courses.data
    } else {
      tableDataCourses.value = []
    }
    unSelectRowCourse()
  } catch (error) {
    console.log('Error list course', error)
  }
}
const updatedCourse = async () => {
  await getListCourses()
}
const deleteCourse = async (selectedCourses) => {
  for (let item of selectedCourses) {
    await $api.course.deleteCourse(schoolId, item.COURSES_ID)
  }
  closeDialogDeleteCourse()
  getListCourses()
}
const openDialogDeleteCourse = () => {
  refToChildCustomDialogDeleteCourseForm.value.openDialog()
}
const closeDialogDeleteCourse = () => {
  refToChildCustomDialogDeleteCourseForm.value.closeDialog()
  unSelectRowCourse()
}
defineExpose({})
</script>

<template>
  <div>
    <NavigationView :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <CustomTable
        ref="refToChildCustomTable"
        :tableData="tableDataCourses"
        :columns="columnsCourse"
        @update:selection="selectedRowData"
        @onClickCreate="onClickCreateCourse"
        @onClickEdit="onClickEditCourse"
        @onClickDelete="openDialogDeleteCourse"
        @onClickDetails="onClickDetailsCourse"
      />
    </div>
    <!-- Child course form  -->
    <CourseForm ref="refToChildCourseForm" @updatedCourse="updatedCourse" />
    <!-- Dialog delete course  -->
    <CustomDialog
      ref="refToChildCustomDialogDeleteCourseForm"
      @onClickDialogSubmit="deleteCourse(selectedCourses)"
      @onClickCloseDialog="closeDialogDeleteCourse()"
      :danger="true"
      :modalHeader="'Delete Course'"
      :isDelete="true"
      :footerLabel="'Delete'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">You was selected {{ selectedCourses.length }} to delete.</div>
      </template>
    </CustomDialog>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
