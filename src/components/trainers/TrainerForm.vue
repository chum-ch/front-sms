<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
defineEmits(['updatedTrainer'])
onMounted(() => {})
defineProps({
  msg: {
    type: String,
    required: false
  },
  modelValueUpdateTrainer: [String, Object]
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
const schoolId = route.currentRoute.value.params.schoolId
const trainerID = ref('')
const refToChildCustomDialog = ref()
// Form trainer
const trainerForm = ref({
  FirstName: '',
  LastName: '',
  Email: '',
  Province: '',
  Phone: '',
  Gender: ''
})
const gender = ref({
    Value: 'Male'
  })
const radioButtonOptionTrainer = ref([
  {
    Value: 'Male'
  },
  {
    Value: 'Female'
  }
])

// Error message
const message = ref({
  FirstName: '',
  LastName: '',
  Gender: ''
})
// Dialog
const footerLabel = ref('')
const openDialogTrainerForm = () => {
  refToChildCustomDialog.value.openDialog()
}
const closeDialogTrainerForm = () => {
  refToChildCustomDialog.value.closeDialog()
  setDefaultValue()
}
const onlyUpdateTrainer = (data = {}) => {
  if (data && Object.keys(data).length > 0) {
    trainerForm.value.FirstName = data.FirstName
    trainerForm.value.LastName = data.LastName
    trainerForm.value.Email = data.Email
    gender.value = data.Gender
    trainerForm.value.Province = data.Province
    trainerForm.value.Phone = data.Phone
    // Get trainer ID
    trainerID.value = data.TRAINERS_ID
    if (trainerID.value) {
      footerLabel.value = 'Update'
    }
  }
}

const createTrainerInfo = async () => {
  try {
    trainerForm.value.Gender = gender.value
    if (trainerForm.value.FirstName && trainerForm.value.LastName) {
      let trainer = {}
      if (trainerID.value) {
        trainer = await $api.trainer.updateTrainer(schoolId, trainerForm.value, trainerID.value)
      } else {
        trainer = await $api.trainer.createTrainer(schoolId, trainerForm.value)
      }
      instance.emit('updatedTrainer', trainer.data)
      closeDialogTrainerForm()
    } else {
      if (!trainerForm.value.FirstName) {
        message.value.FirstName = 'First name is required'
      } else {
        message.value.FirstName = ''
      }
      if (!trainerForm.value.LastName) {
        message.value.LastName = 'Last name is required'
      } else {
        message.value.LastName = ''
      }
    }
  } catch (error) {
    console.log('Error create trainer info', error)
  }
}
const setDefaultValue = () => {
  trainerForm.value = {}
  message.value = {}
  trainerID.value = ''
  footerLabel.value = ''
  gender.value = {};
}
defineExpose({ openDialogTrainerForm, onlyUpdateTrainer })
</script>

<template>
  <div class="trainer-form">
    <!-- Dialog trainer form  -->
    <CustomDialog
      ref="refToChildCustomDialog"
      :modalHeader="'Trainer Form'"
      @onClickDialogSubmit="createTrainerInfo"
      @onClickCloseDialog="closeDialogTrainerForm"
      :footerLabel="footerLabel"
    >
      <template #bodyDialog>
        <div class="formgrid grid">
          <div class="field col">
            <CustomInputText
              :placeholder="'......'"
              :label="'Last name'"
              :required="true"
              v-model="trainerForm.LastName"
              :messageError="message.LastName"
              class="w-full"
            />
          </div>
          <div class="field col">
            <CustomInputText
              :placeholder="'......'"
              :label="'First name'"
              :required="true"
              v-model="trainerForm.FirstName"
              :messageError="message.FirstName"
              class="w-full"
            />
          </div>
        </div>
        <div class="formgrid grid">
          <div class="field col">
            <CustomInputText
              :placeholder="'......'"
              :label="'Province'"
              v-model="trainerForm.Province"
              :messageError="message.Province"
              class=""
            />
          </div>
          <div class="field col">
            <CustomInputText
              :placeholder="'......'"
              :label="'Phone'"
              v-model="trainerForm.Phone"
              :messageError="message.Phone"
              class=""
            />
          </div>
        </div>
        <CustomInputText
          :placeholder="'......'"
          :label="'Email'"
          v-model="trainerForm.Email"
          class=""
        />
        <CustomRadioButton
            v-model="gender"
            :label="'Gender'"
            :defaultValue="gender"
            :isFlex="true"
            class=""
            :categories="radioButtonOptionTrainer"
          />
      </template>
    </CustomDialog>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
