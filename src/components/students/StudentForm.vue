
<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import ClassForm from '../classes/ClassForm.vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits(['updatedStudent'])
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
const refToChildClassForm = ref()
const refToChildCustomDialog = ref()
if (!schoolBc || !generationBc) {
  route.push('/')
}
// Functions
const studentID = ref()
// Form student
const gender = ref({
  Value: 'Male'
})
const radioButtonOptionStudent = ref([
  {
    Value: 'Male'
  },
  {
    Value: 'Female'
  }
])
const studentForm = ref({
  ID: '',
  FirstName: '',
  LastName: '',
  Gender: '',
  Email: '',
  Class: ''
})
// Error message
const message = ref({
  FirstName: '',
  LastName: '',
  Class: ''
})
// Class
const selectClass = ref('')
const classesOptions = ref([])
// Dialog
const footerLabel = ref('')
const openDialogStudentForm = () => {
  refToChildCustomDialog.value.openDialog()
  listClasses()
}
const closeDialogStudentForm = () => {
  refToChildCustomDialog.value.closeDialog()
  setDefaultValue()
}
const onlyUpdateStudent = (data = {}) => {
  if (Object.keys(data).length > 0) {
    studentForm.value.FirstName = data.FirstName
    studentForm.value.LastName = data.LastName
    studentForm.value.Email = data.Email
    gender.value = { Value: data.Gender }
    studentForm.value.ID = data.ID
    // Get studentID
    studentID.value = data.STUDENTS_ID
    if (studentID.value) {
      footerLabel.value = 'Update'
    }
    // Class option
    if (data.Class && Object.keys(data.Class).length > 0) {
      selectClass.value = {
        Value: data.Class.Name,
        ID: data.Class.Id,
        Room: data.Class.Room,
        Trainer: data.Class.Trainer
      }
    }
  }
}
const createStudentInfo = async () => {
  try {
    if (studentForm.value.FirstName && studentForm.value.LastName && selectClass.value) {
      selectClass.value['Name'] = selectClass.value['Value']
      selectClass.value['Id'] = selectClass.value['ID']
      delete selectClass.value['Value']
      delete selectClass.value['ID']
      studentForm.value.Gender = gender.value.Value
      studentForm.value.Class = selectClass
      let student = {}
      if (studentID.value) {
        student = await $api.student.updateStudent(
          schoolId,
          generationId,
          studentForm.value,
          studentID.value
        )
      } else {
        student = await $api.student.createStudent(schoolId, generationId, studentForm.value)
      }
      instance.emit('updatedStudent', student.data)
      closeDialogStudentForm()
    } else {
      if (!studentForm.value.FirstName) {
        message.value.FirstName = 'First name is required'
      } else {
        message.value.FirstName = ''
      }
      if (!studentForm.value.LastName) {
        message.value.LastName = 'Last name is required'
      } else {
        message.value.LastName = ''
      }
      if (!selectClass.value) {
        message.value.Class = 'Class is required'
      } else {
        message.value.Class = ''
      }
    }
  } catch (error) {
    console.log('Error create student info', error)
  }
}
/**
 *
 * Classes
 */
const onClickCreateClass = (value) => {
  refToChildClassForm.value.openDialogClassForm()
  refToChildClassForm.value.onlyUpdateClasses({ Name: value })
}
const updatedClass = (classData) => {
  if (classData && Object.keys(classData).length > 0 && !classData.CloseDialog) {
    selectClass.value = {
      Value: classData.Name,
      ID: classData.CLASSES_ID,
      Room: classData.Room,
      Trainer: classData.Trainer
    }
  }
  listClasses()
}
const listClasses = async () => {
  try {
    let classes = await $api.class.listClasses(schoolId)
    if (classes && classes.data && classes.data.length > 0) {
      classesOptions.value = classes.data.map((item) => {
        return {
          Value: item.Name,
          ID: item.CLASSES_ID,
          Room: item.Room,
          Trainer: item.Trainer
        }
      })
    }
  } catch (error) {
    console.log('Error list class', error)
  }
}
/**
 * Clear value variable
 */
const setDefaultValue = () => {
  studentForm.value = {}
  message.value = {}
  studentID.value = ''
  footerLabel.value = ''
  selectClass.value = ''
  gender.value = {}
}

defineExpose({ openDialogStudentForm, onlyUpdateStudent })
</script>

<template>
  <div class="hello">
    <h1>Student form</h1>
    <!-- Dialog student form  -->
    <CustomDialog
      ref="refToChildCustomDialog"
      :modal_header="'Student Form'"
      @onClickDialogSubmit="createStudentInfo"
      @onClickCloseDialog="closeDialogStudentForm"
      :footerLabel="footerLabel"
    >
      <template #bodyDialog>
        <div class="flex flex-wrap">
          <CustomInputText
            :placeholder="'......'"
            :label="'Last name'"
            :required="true"
            v-model="studentForm.LastName"
            :messageError="message.LastName"
            class="col-6 py-0"
          />
          <CustomInputText
            :placeholder="'.......'"
            :label="'First name'"
            :required="true"
            v-model="studentForm.FirstName"
            :messageError="message.FirstName"
            class="col-6 py-0"
          />
          <CustomInputText
            :placeholder="'.......'"
            :label="'Student ID'"
            v-model="studentForm.ID"
            class="col-6 py-0"
          />
          <CustomDropdown
            :options="classesOptions"
            :placeholder="'Select classes'"
            :label="'Classes'"
            class="col-6 py-0"
            v-model="selectClass"
            :modelValue="selectClass"
            :required="true"
            :messageError="message.Class"
            @addNewDropdown="onClickCreateClass"
          />
          <CustomInputText
            :placeholder="'.......'"
            :label="'Email'"
            v-model="studentForm.Email"
            class="col-12 py-0"
          />
          <CustomRadioButton
            v-model="gender"
            :label="'Gender'"
            :defaultValue="gender"
            :isFlex="true"
            class="col-12 py-0"
            :categories="radioButtonOptionStudent"
          />
        </div>
      </template>
    </CustomDialog>
    <!-- Child classes  -->
    <ClassForm ref="refToChildClassForm" @updatedClass="updatedClass" />
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
