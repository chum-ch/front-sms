<script setup>
import ClassForm from '../classes/ClassForm.vue'
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits(['updatedCourse'])
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
// Functions
// Form course
const courseID = ref('')
const courseForm = ref({
  Name: '',
  Credit: null
})
// Class option
const selectClass = ref('')
const classesOptions = ref([])
const dialogCourseForm = ref()
const refToChildClassForm = ref()
// Error message
const message = ref({
  Name: '',
  Credit: ''
})
// Dialog
const footerLabel = ref('')

const openDialogCourseForm = () => {
  dialogCourseForm.value.openDialog()
  getListClasses()
}
const closeDialogCourseForm = () => {
  footerLabel.value = ''
  dialogCourseForm.value.closeDialog()
  setDefaultValue()
}
const onlyUpdateCourse = (data = {}) => {
  if (data && Object.keys(data).length > 0) {
    courseForm.value.Name = data.Name
    courseForm.value.Credit = data.Credit
    courseForm.value.Floor = data.Floor
    // Class option
    if (data.Class && Object.keys(data.Class).length > 0) {
      selectClass.value = {
        Value: data.Class.Name,
        ID: data.Class.Id,
        Room: data.Class.Room,
        Trainer: data.Class.Trainer
      }
    }
    // Get courseID
    courseID.value = data.COURSES_ID
    if (courseID.value) {
      footerLabel.value = 'Update'
    }
  }
}
const createCourseInfo = async () => {
  try {
    if (courseForm.value.Name && courseForm.value.Credit) {
      let course = {}
      courseForm.value = {
        ...courseForm.value,
        Class: { Name: selectClass.value.Value, Id: selectClass.value.ID }
      }
      if (courseID.value) {
        course = await $api.course.updateCourse(schoolId, courseForm.value, courseID.value)
      } else {
        course = await $api.course.createCourse(schoolId, courseForm.value)
      }
      instance.emit('updatedCourse', course.data)
      closeDialogCourseForm()
    } else {
      if (!courseForm.value.Name) {
        message.value.Name = "Course's name is required"
      } else {
        message.value.Name = ''
      }
      if (!courseForm.value.Credit) {
        message.value.Credit = 'Credit is required'
      } else {
        message.value.Credit = ''
      }
      if (!selectClass.value) {
        message.value.Class = 'Class is required'
      } else {
        message.value.Class = ''
      }
    }
  } catch (error) {
    console.log('Error create course info', error)
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
  if (classData && Object.keys(classData).length > 0) {
    selectClass.value = {
      Value: classData.Name,
      ID: classData.CLASSES_ID,
      Room: classData.Room,
      Trainer: classData.Trainer
    }
  }
  getListClasses()
}
const getListClasses = async () => {
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
const setDefaultValue = () => {
  courseForm.value = {}
  message.value = {}
  courseID.value = ''
  footerLabel.value = ''
}
defineExpose({ openDialogCourseForm, onlyUpdateCourse })
</script>

<template>
  <div class="hello">
    <!-- Dialog course form  -->
    <custom-dialog
      ref="dialogCourseForm"
      :modal_header="'Course Form'"
      @onClickDialogSubmit="createCourseInfo"
      @onClickCloseDialog="closeDialogCourseForm"
      :footerLabel="footerLabel"
    >
      <template #bodyDialog>
        <div class="row">
          <CustomInputText
            :placeholder="'.......'"
            :label="'Course name'"
            v-model="courseForm.Name"
            :required="true"
            :messageError="message.Name"
            class=""
          />
          <CustomInputNumber
            :placeholder="'.......'"
            :label="'Credit(s)'"
            v-model="courseForm.Credit"
            :required="true"
            :isDecimal="true"
            :messageError="message.Credit"
            class=""
          />
          <custom-dropdown
            v-show="false"
            :options="classesOptions"
            :placeholder="'Select class'"
            :label="'Classes'"
            class=""
            v-model="selectClass"
            :modelValue="selectClass"
            :required="true"
            :messageError="message.Class"
            @addNewDropdown="onClickCreateClass"
          />
        </div>
      </template>
    </custom-dialog>
    <!-- Child classes  -->
    <ClassForm ref="refToChildClassForm" @updatedClass="updatedClass" />
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
