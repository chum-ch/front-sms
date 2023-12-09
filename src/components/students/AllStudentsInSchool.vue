<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
defineEmits([''])
onMounted(() => {})
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
const refToChildCustomDialogDeleteStudent = ref();
const refToChildCustomTable = ref()
const breadCrumb = ref([
  { label: 'Manages', route: `/schools/${schoolId}/manages` },
  {
    label: 'Students',
    route: `/schools/${schoolId}/students`
  }
])

// Functions
const tableDataStudentsUnderSchool = ref([])
const selectedStudent = ref([])
const columnsStudent = ref([
  {
    field: 'ID',
    header: "Student's ID"
  },
  {
    field: 'GenerationName',
    header: 'Generation'
  },
  {
    field: 'LastName',
    header: 'Last name'
  },
  {
    field: 'FirstName',
    header: 'First name'
  },
  {
    field: 'Gender',
    header: 'Gender'
  },
  {
    field: 'Email',
    header: 'Email'
  },
  {
    field: 'Class.Name',
    header: 'Class'
  }
])
onMounted(() => {
  getSchoolDetails(schoolId)
})

const onClickDetailsStudent = (event) => {
  console.log(event)
}
const selectedRowData = (data) => {
  selectedStudent.value = data
}
const getSchoolDetails = async (schoolId) => {
  let school = await $api.school.getSchool(schoolId)
  if (school && school.data && Object.keys(school.data).length > 0) {
    school = school.data
  }
  getListStudents()
}

const getListStudents = async () => {
  try {
    let students = await $api.student.allStudentInSchool(schoolId)
    if (students && students.data && students.data.length > 0) {
      tableDataStudentsUnderSchool.value = students.data
    } else {
      tableDataStudentsUnderSchool.value = []
    }
  } catch (error) {
    console.log('Error list student', error)
  }
}
const openDialogDeleteStudent = () => {
  refToChildCustomDialogDeleteStudent.value.openDialog()
}
const closeDialogDeleteRoom = () => {
  refToChildCustomDialogDeleteStudent.value.closeDialog()
  unSelectRowRoom()
}
const unSelectRowRoom = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}
const deleteRoom = async (dataDelete) => {
  try {
    for (let item of dataDelete) {
      await $api.student.deleteStudent(schoolId, item.GENERATIONS_ID, item.STUDENTS_ID)
    }
    closeDialogDeleteRoom()
    getListStudents()
  } catch (error) {
    console.error(error);
  }
}
defineExpose({})
</script>
<template>
  <div class="all-students">
    <!-- Navigation with breadCrum  -->
    <NavigationView :breadCrumb="breadCrumb" />
    <!-- Table  -->
    <CustomTable
      ref="refToChildCustomTable"
      :tableData="tableDataStudentsUnderSchool"
      :columns="columnsStudent"
      @update:selection="selectedRowData"
      :isHideAddBtn="true"
      :isHideEditBtn="true"
      @onClickDelete="openDialogDeleteStudent"
    />
    <!-- Dialog delete room  -->
    <CustomDialog
      ref="refToChildCustomDialogDeleteStudent"
      @onClickDialogSubmit="deleteRoom(selectedStudent)"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteRoom()"
      :isDelete="true"
      :footerLabel="'Delete'"
      :modalHeader="'Delete Room'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">You was selected {{ selectedStudent.length }} to delete.</div>
      </template>
    </CustomDialog>
  </div>
</template>
<style scoped></style>
