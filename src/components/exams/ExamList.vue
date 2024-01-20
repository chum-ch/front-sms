<template>
  <div>
    <NavigationView :breadCrumb="breadCrumb" />
    <!-- <div>
      <CustomQAForm v-show="false" />
    </div>
    <ExamDetails v-show="true" /> -->
    <!-- Table  -->
    <CustomTab
      :dataTabs="dataTabs"
      class="pe-2"
      :isFlex="true"
      :justifyContent="'start'"
      @update:Component="updateComponent"
    ></CustomTab>
    <CustomTable
      ref="refToChildCustomTable"
      :tableData="tableDataExam"
      :columns="columnsExam"
      @update:selection="selectedRowData"
      @onClickDelete="openDialogDeleteExam"
      @onClickDetails="examDetails"
      :isHideAddBtn="true"
      :isHideEditBtn="true"
      v-show="isShowExamListComponent"
    />
    <!-- Dialog delete room  -->
    <CustomDialog
      ref="refToChildCustomDialogDeleteExam"
      @onClickDialogSubmit="deleteExam(selectedExam)"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteExam()"
      :isDelete="true"
      :footerLabel="'Delete'"
      :modalHeader="'Delete Exam'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">You was selected {{ selectedExam.length }} to delete.</div>
      </template>
    </CustomDialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(async () => {
  getListExams()
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
const refToChildCustomTable = ref()
const selectedExam = ref([])
const tableDataExam = ref([])
const refToChildCustomDialogDeleteExam = ref()
const columnsExam = ref([
  {
    field: 'ExamTitle',
    header: 'Exams'
  },
  {
    field: 'TotalQuestions',
    header: 'Questions'
  },
  {
    field: 'TotalPoints',
    header: 'Points'
  },
  {
    field: 'ExamDate',
    header: 'Dates'
  },
  {
    field: 'StartTime',
    header: 'Start times'
  },
  {
    field: 'EndTime',
    header: 'End times'
  },
])
const isShowExamListComponent = ref(true)
const dataTabs = [
  {
    Active: true,
    TabName: 'Exams',
    Component: 'ExamList'
  },
  {
    TabName: 'Create Exam',
    Component: 'CustomQAForm'
  }
]
// Functions
const selectedRowData = (data) => {
  selectedExam.value = data
}
const openDialogDeleteExam = () => {
  refToChildCustomDialogDeleteExam.value.openDialog()
}
const closeDialogDeleteExam = () => {
  refToChildCustomDialogDeleteExam.value.closeDialog()
  unSelectRowRoom()
}
const unSelectRowRoom = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}
const getListExams = async () => {
  try {
    let exams = await $api.exam.listExams(schoolId)
    if (exams && exams.data && exams.data.length > 0) {
      tableDataExam.value = exams.data
    } else {
      tableDataExam.value = []
    }
  } catch (error) {
    console.log('Error list student', error)
  }
}
const deleteExam = async (dataDelete) => {
  try {
    for (let item of dataDelete) {
      await $api.exam.deleteExam(schoolId, item.EXAMS_ID)
    }
    closeDialogDeleteExam()
    getListExams()
  } catch (error) {
    console.error(error)
  }
}
const updateComponent = (componentName) => {
  isShowExamListComponent.value = false
  if (componentName === 'ExamList') {
    isShowExamListComponent.value = true
  }
}
const examDetails = (data) => {
  const [exam] = data
  route.push(`/schools/${schoolId}/exams/${exam.EXAMS_ID}`)
}
defineExpose({})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
