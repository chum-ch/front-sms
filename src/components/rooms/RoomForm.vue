<template>
  <div class="hello">
    <!-- Dialog room form  -->
    <CustomDialog
      ref="dialogRoomForm"
      :modalHeader="'Room Form'"
      @onClickDialogSubmit="createRoomInfo"
      @onClickCloseDialog="closeDialogRoomForm"
      :footerLabel="footerLabel"
    >
      <template #bodyDialog>
        <CustomInputText
          :placeholder="'.......'"
          :label="'Room name'"
          v-model="roomForm.Name"
          :required="true"
          :messageError="message.Name"
          class=""
        />
        <CustomInputText
          :placeholder="'.......'"
          :label="'Floor'"
          v-model="roomForm.Floor"
          class=""
        />
      </template>
    </CustomDialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
defineEmits(['updatedRoom'])
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
const schoolId = route.currentRoute.value.params.schoolId
const roomID = ref('')
const dialogRoomForm = ref()
const roomForm = ref({
  Name: '',
  Floor: ''
})
// Error message
const message = ref({
  Name: '',
  Floor: ''
})
// Dialog
const footerLabel = ref('')
// Functions

const openDialogRoomForm = () => {
  dialogRoomForm.value.openDialog()
}
const closeDialogRoomForm = () => {
  footerLabel.value = ''
  dialogRoomForm.value.closeDialog()
  setDefaultValue()
}
const onlyUpdateRoom = (data = {}) => {
  if (data && Object.keys(data).length > 0) {
    roomForm.value.Name = data.Name
    roomForm.value.Floor = data.Floor
    // Get roomID
    roomID.value = data.ROOMS_ID
    if (roomID.value) {
      footerLabel.value = 'Update'
    }
  }
}

const createRoomInfo = async () => {
  try {
    if (roomForm.value.Name) {
      let room = {}
      if (roomID.value) {
        room = await $api.room.updateRoom(schoolId, roomForm.value, roomID.value)
      } else {
        room = await $api.room.createRoom(schoolId, roomForm.value)
      }
      instance.emit('updatedRoom', room.data)
      closeDialogRoomForm()
    } else {
      if (!roomForm.value.Name) {
        message.value.Name = "Room's name is required."
      } else {
        message.value.Name = ''
      }
    }
  } catch (error) {
    console.log('Error create room info', error)
  }
}
const setDefaultValue = () => {
  roomForm.value = {}
  message.value = {}
  roomID.value = ''
  footerLabel.value = ''
}
defineExpose({ openDialogRoomForm, onlyUpdateRoom })
</script>

<style scoped></style>
