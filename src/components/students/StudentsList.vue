<template>
  <div>
    <NavigationView :breadCrumb="breadCrumb" />
    <div v-show="true">
      <!-- Table  -->
      <CustomTable
        ref="refToChildCustomTable"
        :tableData="tableDataStudents"
        :columns="columnsStudent"
        @update:selection="selectedRowData"
        @onClickCreate="onClickCreateStudent"
        @onClickEdit="onClickEditStudent"
        @onClickDelete="onClickDeleteStudent"
      />
        <!-- @onClickDetails="onClickDetailsStudent" -->
      <!-- Child student form  -->
      <StudentForm ref="refToChildStudentForm" @updatedStudent="updatedStudent" />

      <!-- Dialog delete student  -->
      <CustomDialog
        ref="refToChildCustomDialogDeleteStudent"
        @onClickDialogSubmit="deleteStudent(selectedStudent)"
        :danger="true"
        @onClickCloseDialog="closeDialogDeleteStudent"
        :isDelete="true"
        :footerLabel="'Delete'"
        :modalHeader="'Delete Student'"
      >
        <template #bodyDialog>
          <div class="text-center mt-4">
            You was selected {{ selectedStudent.length }} to delete.
          </div>
        </template>
      </CustomDialog>
    </div>
    <div></div>
  </div>
</template>
<script setup>
import StudentForm from './StudentForm.vue'
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(async () => {
  await getListStudent()
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
const generationId = route.currentRoute.value.params.generationId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const generationBc = $globalFunction.getDataLs('generationBc')
const breadCrumb = ref([])
if (!schoolBc || !generationBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/generations`, label: 'Generations' },
    {
      route: `/schools/${schoolId}/generations/${generationBc.GENERATION_ID}/students`,
      label: 'Students'
    }
  )
}
// Functions
const selectedStudent = ref([])
const tableDataStudents = ref([])
const refToChildStudentForm = ref();
const refToChildCustomTable = ref()
const refToChildCustomDialogDeleteStudent = ref()

const columnsStudent = ref([
  {
    field: 'ID',
    header: "Student's ID"
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
const onClickCreateStudent = () => {
  refToChildStudentForm.value.openDialogStudentForm()
}
const onClickEditStudent = () => {
  refToChildStudentForm.value.openDialogStudentForm()
  refToChildStudentForm.value.onlyUpdateStudent(selectedStudent.value[0])
}
const onClickDetailsStudent = (event) => {
  route.push(`students/${event[0].STUDENTS_ID}`)
}
const unSelectRowStudent = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}
const selectedRowData = (data) => {
  selectedStudent.value = data
}

const getListStudent = async () => {
  try {
    let students = await $api.student.listStudents(schoolId, generationId)
    if (students && students.data && students.data.length > 0) {
      tableDataStudents.value = students.data
    } else {
      tableDataStudents.value = []
    }
    unSelectRowStudent()
  } catch (error) {
    console.log('Error list student', error)
  }
}
const updatedStudent = async () => {
  await getListStudent()
}
// Delete student
const onClickDeleteStudent = () => {
  openDialogDeleteStudent()
}
const openDialogDeleteStudent = () => {
  refToChildCustomDialogDeleteStudent.value.openDialog()
}
const closeDialogDeleteStudent = () => {
  refToChildCustomDialogDeleteStudent.value.closeDialog()
}
const deleteStudent = async (selectedStudent) => {
  for (let item of selectedStudent) {
    await $api.student.deleteStudent(schoolId, generationId, item.STUDENTS_ID)
  }
  closeDialogDeleteStudent()
  getListStudent()
}

defineExpose({})
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
