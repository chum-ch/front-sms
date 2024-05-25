<script setup>
import TrainerForm from '../trainers/TrainerForm.vue'
import RoomForm from '../rooms/RoomForm.vue'
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits(['updatedClass'])
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
const schoolId = route.currentRoute.value.params.schoolId
const $globalFunction = inject('$globalFunction')
// Functions
// Form class
const classID = ref('')
const classForm = ref({
  Name: '',
  Floor: ''
})
// Room
const selectRoom = ref('')
const roomOptions = ref([])
// Trainer
const trainerOptions = ref([])
const selectTrainer = ref('')
const refToChildRoomForm = ref()
const refToChildCustomDialog = ref()
const refToChildTrainerForm = ref()
// Error message
const message = ref({
  Name: '',
  Room: ''
})
// Dialog
const footerLabel = ref('')

const openDialogClassForm = () => {
  refToChildCustomDialog.value.openDialog()
  listRooms()
  listTrainers()
}
const closeDialogClassForm = () => {
  refToChildCustomDialog.value.closeDialog()
  setDefaultValue()
}
const onlyUpdateClasses = (data = {}) => {
  if (data && Object.keys(data).length > 0) {
    classForm.value.Name = data.Name
    // Get class Id
    classID.value = data.CLASSES_ID
    if (classID.value) {
      footerLabel.value = 'Update'
    }
    // Room option
    if (data.Room && Object.keys(data.Room).length > 0) {
      selectRoom.value = {
        Value: data.Room ? data.Room.Name : '',
        ID: data.Room ? data.Room.Id : ''
      }
    }
    // Trainer option
    if (data.Trainer && Object.keys(data.Trainer).length > 0) {
      selectTrainer.value = {
        Value: data.Trainer ? data.Trainer.Name : '',
        ID: data.Trainer ? data.Trainer.Id : ''
      }
    }
  }
}
const createClassInfo = async () => {
  try {
    if (classForm.value.Name && selectRoom.value && Object.keys(selectRoom.value).length > 0) {
      classForm.value = {
        ...classForm.value,
        Trainer: { Name: selectTrainer.value.Value, Id: selectTrainer.value.ID },
        Room: { Name: selectRoom.value.Value, Id: selectRoom.value.ID }
      }
      let classes = {}
      if (classID.value) {
        classes = await $api.class.updateClass(schoolId, classForm.value, classID.value)
      } else {
        classes = await $api.class.createClass(schoolId, classForm.value)
      }
      instance.emit('updatedClass', classes.data)
      closeDialogClassForm()
    } else {
      if (!classForm.value.Name) {
        message.value.Name = "Class's name is required."
      } else {
        message.value.Name = ''
      }
      if (!selectRoom.value) {
        message.value.Room = "Room's name is required."
      } else {
        message.value.Room = ''
      }
    }
  } catch (error) {
    console.log('Error create class info', error)
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
 * Clear value variable
 */
const setDefaultValue = () => {
  classForm.value = {}
  message.value = {}
  classID.value = ''
  footerLabel.value = ''
  selectRoom.value = {}
  selectTrainer.value = ''
}
defineExpose({
  openDialogClassForm,
  onlyUpdateClasses
})
</script>

<template>
  <div class="hello">
    <!-- Dialog class form  -->
    <CustomDialog
      ref="refToChildCustomDialog"
      :modalHeader="'Class Form'"
      @onClickDialogSubmit="createClassInfo"
      @onClickCloseDialog="closeDialogClassForm"
      :footerLabel="footerLabel"
    >
      <template #bodyDialog>
        <CustomInputText
          :placeholder="'.......'"
          :label="'Class name'"
          :required="true"
          v-model="classForm.Name"
          :messageError="message.Name"
          class="col-12 py-0"
        />
        <CustomDropdown
          :options="roomOptions"
          :placeholder="'Select room'"
          :label="'Room'"
          class="col-12 py-0"
          v-model="selectRoom"
          :modelValue="selectRoom"
          :required="true"
          @addNewDropdown="onClickCreateRoom"
          :messageError="message.Room"
        />
        <CustomDropdown
          :options="trainerOptions"
          :placeholder="'Select trainer'"
          :label="'Trainer'"
          v-model="selectTrainer"
          :modelValue="selectTrainer"
          class="col-12 py-0"
          @addNewDropdown="onClickCreateTrainer"
        />
      </template>
    </CustomDialog>
    <!-- Child trainer form  -->
    <TrainerForm ref="refToChildTrainerForm" @updatedTrainer="updatedTrainer" />
    <!-- Child room form  -->
    <RoomForm ref="refToChildRoomForm" @updatedRoom="updatedRoom" />
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
