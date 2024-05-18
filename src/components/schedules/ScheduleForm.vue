<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
import TrainerForm from '../trainers/TrainerForm.vue'
import ClassForm from '../classes/ClassForm.vue'
import CourseForm from '../courses/CourseForm.vue'
import RoomForm from '../rooms/RoomForm.vue'
onMounted(() => {})
defineEmits(['updatedSchedule'])
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
const dialogScheduleForm = ref()
const refToChildTrainerForm = ref()
const refToChildRoomForm = ref()
const refToChildClassForm = ref()
const refToChildCourseForm = ref()
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/rooms`, label: 'Rooms' }
  )
}
// Functions

const dateOptions = ref({
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Asia/Phnom_Penh'
})
const scheduleID = ref('')
// Form schedule
const scheduleForm = ref({
  StartTime: '',
  EndTime: '',
  Date: ''
})
// Error message
const message = ref({
  Course: '',
  Date: '',
  StartTime: '',
  EndTime: '',
  Class: '',
  Trainer: '',
  Room: ''
})
// Class option
const selectClass = ref('')
const classesOptions = ref([])
// Course option
const selectCourse = ref('')
const coursesOptions = ref([])
// Trainer
const trainerOptions = ref([])
const selectTrainer = ref('')
// Room
const selectRoom = ref('')
const roomOptions = ref([])
// Dialog
const footerLabel = ref('')
const errorStartTime = 'Start time greater than end time not allowed.'
const errorEndTime = 'End time lower than start time not allowed.'

const openDialogScheduleForm = () => {
  dialogScheduleForm.value.openDialog()
  listClasses()
  listTrainers()
  listCourses()
  listRooms()
}
const closeDialogScheduleForm = () => {
  dialogScheduleForm.value.closeDialog()
  setDefaultValue()
}
const onlyUpdateSchedule = (data = {}) => {
  if (Object.keys(data).length > 0) {
    scheduleForm.value.Date = new Date(data.Date)
    scheduleForm.value.StartTime = data.StartTime
    scheduleForm.value.EndTime = data.EndTime

    scheduleID.value = data.SCHEDULES_ID
    if (scheduleID.value) {
      footerLabel.value = 'Update'
    }
    // Trainer option
    if (data.Trainer && Object.keys(data.Trainer).length > 0) {
      selectTrainer.value = {
        Value: data.Trainer ? data.Trainer.Name : '',
        ID: data.Trainer ? data.Trainer.Id : ''
      }
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
    // Course option
    if (data.Course && Object.keys(data.Course).length > 0) {
      selectCourse.value = {
        Value: data.Course.Name,
        ID: data.Course.Id
      }
    }
    // Room option
    if (data.Room && Object.keys(data.Room).length > 0) {
      selectRoom.value = {
        Value: data.Room ? data.Room.Name : '',
        ID: data.Room ? data.Room.Id : ''
      }
    }
  }
}
const getDateFormat = (dateToConvert) => {
  let date = new Date(dateToConvert)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  // const hours = date.getHours().toString().padStart(2, "0");
  // const minutes = date.getMinutes().toString().padStart(2, "0");
  // const seconds = date.getSeconds().toString().padStart(2, "0");
  const localString = `${year}-${month}-${day}`
  return localString
}
const checkStartTimeWithEndTimeValue = (event) => {
  let isAlloweStartTime = true;
  if (event && scheduleForm.value.EndTime) {
    const [hh] = event.split(':');
    if (parseInt(hh, 10) > parseInt(scheduleForm.value.EndTime, 10)) {
      isAlloweStartTime = false;
      message.value.StartTime = errorStartTime;
    }
  }
  return isAlloweStartTime
}
const checkEndTimeWithStartTimeValue = (event) => {
  let isAlloweEndTime = true;
  if (event && scheduleForm.value.StartTime) {
    const [hh] = event.split(':');
    if (parseInt(hh, 10) < parseInt(scheduleForm.value.StartTime, 10)) {
      isAlloweEndTime = false;
      message.value.EndTime = errorEndTime;
    }
  }
  return isAlloweEndTime
}
const createScheduleInfo = async () => {
  try {
    if (
      scheduleForm.value.Date &&
      scheduleForm.value.StartTime &&
      checkStartTimeWithEndTimeValue(scheduleForm.value.StartTime) &&
      scheduleForm.value.EndTime &&
      checkEndTimeWithStartTimeValue(scheduleForm.value.EndTime) &&
      Object.keys(selectClass).length > 0 &&
      selectTrainer &&
      Object.keys(selectTrainer).length > 0 &&
      selectCourse &&
      Object.keys(selectCourse).length > 0 &&
      selectRoom &&
      Object.keys(selectRoom).length > 0
    ) {
      scheduleForm.value.Date = getDateFormat(scheduleForm.value.Date)
      scheduleForm.value = {
        ...scheduleForm.value,
        Class: { Name: selectClass.value.Value, Id: selectClass.value.ID },
        Trainer: {
          Name: selectTrainer.value.Value,
          Id: selectTrainer.value.ID
        },
        Course: { Name: selectCourse.value.Value, Id: selectCourse.value.ID },
        Room: { Name: selectRoom.value.Value, Id: selectRoom.value.ID }
      }

      let schedule = {}
      if (scheduleID.value) {
        schedule = await $api.schedule.updateSchedule(
          schoolId,
          scheduleForm.value,
          scheduleID.value
        )
      } else {
        schedule = await $api.schedule.createSchedule(schoolId, scheduleForm.value)
      }
      instance.emit('updatedSchedule', schedule.data)
      closeDialogScheduleForm()
    } else {
      if (!selectCourse.value) {
        message.value.Course = 'Subject name is required'
      } else {
        message.value.Course = ''
      }
      if (!scheduleForm.value.Date) {
        message.value.Date = 'Date  is required'
      } else {
        message.value.Date = ''
      }
      if (!selectClass.value) {
        message.value.Class = 'Class is required'
      } else {
        message.value.Class = ''
      }
      if (!selectRoom.value) {
        message.value.Room = 'Room is required'
      } else {
        message.value.Room = ''
      }
      if (!selectTrainer.value) {
        message.value.Trainer = 'Trainer is required'
      } else {
        message.value.Trainer = ''
      }
      if (!scheduleForm.value.StartTime) {
        message.value.StartTime = 'Start time is required'
      } else {
        message.value.StartTime = ''
      }
      // if (!checkStartTimeWithEndTimeValue(scheduleForm.value.StartTime)){
      //   message.value.StartTime = errorStartTime;
      // }
      if (!scheduleForm.value.EndTime) {
        message.value.EndTime = 'End time is required'
      } else {
        message.value.EndTime = ''
      }
      // if (!checkEndTimeWithStartTimeValue(scheduleForm.value.EndTime)){
      //   message.value.EndTime = errorEndTime
      // }
    }
  } catch (error) {
    console.log('Error create schedule info', error)
  }
}
/**
 *
 * Trainer
 */
const onClickCreateTrainer = (value) => {
  refToChildTrainerForm.value.openDialogTrainerForm()
  refToChildTrainerForm.value.onlyUpdateTrainer({ FirstName: value })
}
const listTrainers = async () => {
  let trainers = await $api.trainer.listTrainers(schoolId)
  if (trainers && trainers.data.length > 0) {
    trainerOptions.value = trainers.data.map((trainer) => {
      return {
        Value: `${trainer.LastName} ${trainer.FirstName}`,
        ID: trainer.TRAINERS_ID
      }
    })
  }
}
const updatedTrainer = (trainer) => {
  if (trainer && Object.keys(trainer).length > 0) {
    selectTrainer.value = {
      Value: `${trainer.LastName} ${trainer.FirstName}`,
      ID: trainer.TRAINERS_ID
    }
  }
  listTrainers()
}
/**
 *
 * Room
 */
const onClickCreateRoom = (value) => {
  refToChildRoomForm.value.openDialogRoomForm()
  refToChildRoomForm.value.onlyUpdateRoom({ Name: value })
}
const updatedRoom = (room) => {
  if (room && Object.keys(room).length > 0 && !room.CloseDialog) {
    selectRoom.value = { Value: room.Name, ID: room.ROOMS_ID }
  }
  listRooms()
}
const listRooms = async () => {
  try {
    let rooms = await $api.room.listRooms(schoolId)
    if (rooms && rooms.data.length > 0) {
      roomOptions.value = rooms.data.map((room) => {
        return { Value: `${room.Name}`, ID: room.ROOMS_ID }
      })
    }
  } catch (error) {
    console.log('Form class list room error', error)
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
 *
 * Courses
 */
const onClickCreateCourse = (value) => {
  refToChildCourseForm.value.openDialogCourseForm()
  refToChildCourseForm.value.onlyUpdateCourse({ Name: value })
}
const updatedCourse = (courseData) => {
  if (courseData && Object.keys(courseData).length > 0) {
    selectCourse.value = {
      Value: courseData.Name,
      ID: courseData.COURSES_ID
    }
  }
  listCourses()
}
const listCourses = async () => {
  try {
    let courses = await $api.course.listCourses(schoolId)
    if (courses && courses.data && courses.data.length > 0) {
      coursesOptions.value = courses.data.map((item) => {
        return {
          Value: item.Name,
          ID: item.COURSES_ID
        }
      })
    }
  } catch (error) {
    console.log('Error list course', error)
  }
}
/**
 * Clear value variable
 */
const setDefaultValue = () => {
  scheduleForm.value = {}
  message.value = {}
  scheduleID.value = ''
  selectClass.value = ''
  selectTrainer.value = ''
  selectCourse.value = ''
  selectRoom.value = ''
  footerLabel.value = ''
}
defineExpose({ openDialogScheduleForm, onlyUpdateSchedule })
</script>

<template>
  <div class="hello">
    <!-- Dialog schedule form  -->
    <CustomDialog
      ref="dialogScheduleForm"
      :modalHeader="'Schedule Form'"
      @onClickDialogSubmit="createScheduleInfo"
      @onClickCloseDialog="closeDialogScheduleForm"
      :footerLabel="footerLabel"
    >
      <template #bodyDialog>
        <div class="flex flex-wrap">
          <CustomCalendar
            :isShowIcon="true"
            :label="'Date'"
            :required="true"
            v-model="scheduleForm.Date"
            :modelValue="scheduleForm.Date"
            :message_error="message.Date"
            class="col-12 py-0"
          />
          <CustomDropdown
            :options="trainerOptions"
            :placeholder="'Select trainer'"
            :label="'Trainer'"
            v-model="selectTrainer"
            :modelValue="selectTrainer"
            :required="true"
            :messageError="message.Trainer"
            class="col-6 py-0"
            @addNewDropdown="onClickCreateTrainer"
          />
          <CustomDropdown
            :options="coursesOptions"
            :placeholder="'Select course'"
            :label="'Courses'"
            class="col-6 py-0"
            v-model="selectCourse"
            :modelValue="selectCourse"
            :required="true"
            :messageError="message.Course"
            @addNewDropdown="onClickCreateCourse"
          />
          <CustomDropdown
            :options="classesOptions"
            :placeholder="'Select class'"
            :label="'Classes'"
            class="col-6 py-0"
            v-model="selectClass"
            :modelValue="selectClass"
            :required="true"
            :messageError="message.Class"
            @addNewDropdown="onClickCreateClass"
          />
          <CustomDropdown
            :options="roomOptions"
            :placeholder="'Select room'"
            :label="'Room'"
            class="col-6 py-0"
            v-model="selectRoom"
            :modelValue="selectRoom"
            :required="true"
            @addNewDropdown="onClickCreateRoom"
            :messageError="message.Room"
          />

          <CustomInputMask
            :placeholder="'hh:mm'"
            :mask="'99:99'"
            :label="'Start time'"
            :required="true"
            v-model="scheduleForm.StartTime"
            :modelValue="scheduleForm.StartTime"
            :message_error="message.StartTime"
            @update:modelValue="checkStartTimeWithEndTimeValue($event)"
            class="col-6 py-0"
          />
          <CustomInputMask
            :placeholder="'hh:mm'"
            :mask="'99:99'"
            class="col-6 py-0"
            :label="'End time'"
            v-model="scheduleForm.EndTime"
            :modelValue="scheduleForm.EndTime"
            @update:modelValue="checkEndTimeWithStartTimeValue($event)"
            :required="true"
            :message_error="message.EndTime"
          />
        </div>
      </template>
    </CustomDialog>
    <!-- Component  -->
    <!-- Child trainer form  -->
    <TrainerForm ref="refToChildTrainerForm" @updatedTrainer="updatedTrainer" />
    <!-- Child classes  -->
    <ClassForm ref="refToChildClassForm" @updatedClass="updatedClass" />
    <!-- Child course  -->
    <CourseForm ref="refToChildCourseForm" @updatedCourse="updatedCourse" />
    <!-- Child room form  -->
    <RoomForm ref="refToChildRoomForm" @updatedRoom="updatedRoom" />
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
