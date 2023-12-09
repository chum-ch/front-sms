<template>
  <div class="hello">
    <!-- Dialog generation form  -->
    <CustomDialog
      ref="dialogGenerationForm"
      :modalHeader="'Generation Form'"
      @onClickDialogSubmit="createGenerationInfo"
      @onClickCloseDialog="closeDialogGenerationForm"
      :footerLabel="footerLabel"
    >
      <template #bodyDialog>
        <CustomInputText
          :placeholder="'.......'"
          :label="'Generation name'"
          v-model="generationForm.Name"
          :required="true"
          :messageError="message.Name"
          class="py-0"
        />
      </template>
    </CustomDialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits(['updatedGeneration'])
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
const dialogGenerationForm = ref()
// Functions
// Form generation
const generationID = ref()
const generationForm = ref({
  Name: ''
})

// Error message
const message = ref({
  Name: ''
})
// Dialog
const footerLabel = ref('')

const openDialogGenerationForm = () => {
  dialogGenerationForm.value.openDialog()
}
const closeDialogGenerationForm = () => {
  footerLabel.value = ''
  dialogGenerationForm.value.closeDialog()
  setDefaultValue()
}
const onlyUpdateGeneration = (data = {}) => {
  if (data && Object.keys(data).length > 0) {
    generationForm.value.Name = data.Name
    generationForm.value.Floor = data.Floor
    // Get generationID
    generationID.value = data.GENERATIONS_ID
    if (generationID.value) {
      footerLabel.value = 'Update'
    }
  }
}
const createGenerationInfo = async () => {
  try {
    if (generationForm.value.Name) {
      let generation = {}
      if (generationID.value) {
        generation = await $api.generation.updateGeneration(
          schoolId,
          generationForm.value,
          generationID.value
        )
      } else {
        generation = await $api.generation.createGeneration(schoolId, generationForm.value)
      }
      instance.emit('updatedGeneration', generation.data)
      closeDialogGenerationForm()
    } else {
      if (!generationForm.value.Name) {
        message.value.Name = "Generation's name is required."
      } else {
        message.value.Name = ''
      }
    }
  } catch (error) {
    console.log('Error create generation info', error)
  }
}
const setDefaultValue = () => {
  generationForm.value = {}
  message.value = {}
  generationID.value = ''
  footerLabel.value = ''
}
defineExpose({ openDialogGenerationForm, onlyUpdateGeneration })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
