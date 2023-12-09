<script setup>
import TrainerForm from './TrainerForm.vue'
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
defineEmits([''])
onMounted( async() => {
 await getListTrainers()
})
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
    { route: `/schools/${schoolId}/rooms`, label: 'Rooms' }
  )
}
const refToChildCustomTable = ref()
const refToChildTrainerForm = ref()
const refToChildCustomDialogDeleteTrainer = ref()
// Functions

// Exam
const examSections = {}
// Checkbox
const gender = ''
const checkBoxCategories = [
  {
    Value: 'Male'
  },
  {
    Value: 'Female',
    Disable: true
  }
]
// Bread Crumb
// Table
const selectedTrainers = ref([])
const tableDataTrainers = ref([])
const columnsTrainer = ref([
  {
    field: 'LastName',
    header: 'Last name'
  },
  {
    field: 'FirstName',
    header: 'First name'
  },
  {
    field: 'Gender.Value',
    header: 'Gender'
  },
  {
    field: 'Phone',
    header: 'Phone'
  },
  {
    field: 'Email',
    header: 'Email'
  },
  {
    field: 'Province',
    header: 'Province'
  }
])

const onClickCreateTrainer = () => {
  refToChildTrainerForm.value.openDialogTrainerForm()
}
const onClickEditTrainer = () => {
  refToChildTrainerForm.value.openDialogTrainerForm()
  refToChildTrainerForm.value.onlyUpdateTrainer(selectedTrainers.value[0])
}
const onClickDetailsTrainer = (event) => {
  console.log(event)
  // $router.push(`/trainers/${event[0].trainersID}`);
}
const unSelectRowTrainer = () => {
  refToChildCustomTable.value.unSelectedAllRows()
}
const selectedRowData = (data) => {
  selectedTrainers.value = data
}
const getListTrainers = async () => {
  try {
    let trainers = await $api.trainer.listTrainers(schoolId)
    if (trainers && trainers.data && trainers.data.length > 0) {
      tableDataTrainers.value = trainers.data
    } else {
      tableDataTrainers.value = []
    }
    unSelectRowTrainer()
  } catch (error) {
    console.log('Error list trainer', error)
  }
}
const updatedTrainer = () => {
  getListTrainers()
}
// Delete trainer
const openDialogDeleteTrainer = () => {
  refToChildCustomDialogDeleteTrainer.value.openDialog()
}
const closeDialogDeleteTrainer = () => {
  refToChildCustomDialogDeleteTrainer.value.closeDialog()
  unSelectRowTrainer()
}
const deleteTrainer = async (selectedTrainers) => {
  for (let item of selectedTrainers) {
    await $api.trainer.deleteTrainer(schoolId, item.TRAINERS_ID)
  }
  closeDialogDeleteTrainer()
  getListTrainers()
}
defineExpose({ getListTrainers })
</script>

<template>
  <div>
    <!-- Navigation with breadCrum  -->
    <NavigationView :breadCrumb="breadCrumb" />

    <div v-show="true">
      <!-- Table  -->
      <CustomTable
        ref="refToChildCustomTable"
        :tableData="tableDataTrainers"
        :columns="columnsTrainer"
        @update:selection="selectedRowData"
        @onClickCreate="onClickCreateTrainer"
        @onClickEdit="onClickEditTrainer"
        @onClickDelete="openDialogDeleteTrainer"
      />
    </div>
    <!-- Child trainer form  -->
    <TrainerForm ref="refToChildTrainerForm" @updatedTrainer="updatedTrainer" />
    <!-- Dialog delete trainer  -->
    <CustomDialog
      ref="refToChildCustomDialogDeleteTrainer"
      @onClickDialogSubmit="deleteTrainer(selectedTrainers)"
      :danger="true"
      @onClickCloseDialog="closeDialogDeleteTrainer()"
      :isDelete="true"
      :footerLabel="'Delete'"
      :modalHeader="'Delete Trainer'"
    >
      <template #bodyDialog>
        <div class="text-center mt-4">
          You was selected {{ selectedTrainers.length }} to delete.
        </div>
      </template>
    </CustomDialog>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
