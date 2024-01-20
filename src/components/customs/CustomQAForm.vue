<template>
  <div class="grid mx-auto">
    <div class="add-qa col-2 mt-5">
      <CustomButton @click="addQuestSection(defaultDataTypeAnswer)" :label="'Add QA Answer'" />
      <CustomButton
        @click="addQuestSection(defaultDataTypeCheckbox)"
        :label="'Add QA Checkbox'"
        class="my-4"
      />
      <CustomButton @click="addQuestSection(defaultDataTypeOption)" :label="'Add QA Option'" />
      <PrimeVueDivider />
      <CustomButton
        @click="submit"
        :label="'Save exam'"
        :warning="true"
        :disabled="
          schemaExam.Questions.length === 0 ||
          schemaExam.Questions.some((question) => question.Text === '') ||
          schemaExam.ExamTitle === ''
        "
      />
    </div>
    <div class="col-6 scroll-div py-0">
      <div class="qa">
        <div class="sticky top-0 z-2 bg-white">
          <CustomInputText
            :placeholder="'Exam title*'"
            class=""
            :hideLabel="true"
            v-model="schemaExam.ExamTitle"
            :messageError="message.Date"
          />
        </div>
        <div
          class="my-2 all-question px-3 scroll-container"
          v-for="(itemQuestion, indexQuestion) in schemaExam.Questions"
          :key="indexQuestion"
          :id="indexQuestion"
          ref="scrollTest"
        >
          <div
            class="all-checkbox card mx-auto p-2 my-2 border-2 border-round-md border-primary-500"
          >
            <input
              type="text"
              id="sectionQA"
              v-model="itemQuestion.Text"
              :placeholder="itemQuestion.Placeholder"
              class="my-4 custom-inpute-text"
            />
            <div
              class="flex justify-content-between p-1 mb-2"
              v-for="(itemOption, indexOption) in itemQuestion.Options"
              :style="itemOption.IsCorrect ? style : ''"
              :class="!itemOption.Text && !itemQuestion.Disabled ? 'd-none' : ''"
              :key="indexOption"
              @mouseover="itemOption.Hovered = true"
              @mouseleave="itemOption.Hovered = false"
            >
              <div class="checkbox-qa flex w-11">
                <PrimeVueCheckbox
                  v-model="checkBoxCorrectItem"
                  :inputId="itemOption.Text"
                  :name="itemOption.Text"
                  :value="itemOption"
                  :disabled="itemQuestion.Disabled || !itemOption.Text"
                  @input="addCorrectAnswer(indexQuestion, indexOption)"
                  v-if="itemQuestion.Type === 'Checkbox'"
                />
                <PrimeVueRadio
                  v-model="checkCorrectRadio"
                  :inputId="itemOption.Text"
                  :name="itemOption.Text"
                  :value="itemOption"
                  :disabled="itemQuestion.Disabled || !itemOption.Text"
                  @change="addCorrectAnswer(indexQuestion, indexOption)"
                  v-if="itemQuestion.Type === 'Option'"
                />
                <label :for="itemOption.Text" class="ml-2" v-if="!itemQuestion.Disabled">
                  {{ itemOption.Text }}
                </label>
                <input
                  v-else
                  type="text"
                  ref="inputRefs"
                  v-model="itemOption.Text"
                  :placeholder="'Answer'"
                  class="ml-2"
                  :class="itemOption.IsCorrect ? 'focus' : 'custom-inpute-text'"
                  :disabled="itemOption.IsCorrect"
                  @keyup.enter="addQuestSection(itemQuestion, indexQuestion)"
                />
              </div>
              <i
                class="pi pi-trash text-red-500 mx-2 mt-1 cursor-pointer"
                @click="removeOption(indexQuestion, indexOption)"
                v-show="itemOption.Hovered"
              ></i>
            </div>
            <div class="add-checkbox flex mx-1">
              <CustomButton
                @click="addQuestSection(itemQuestion, indexQuestion)"
                :label="'Add option'"
                :text="true"
                v-show="itemQuestion.Disabled"
                :style="{ padding: '7px', margin: '5px 0px' }"
              />
            </div>
            <!-- <PrimeVueDivider class="m-0" /> -->
            <div class="delete-select-answer flex justify-content-between">
              <div class="flex">
                <CustomButton
                  @click="chooseAnswer(indexQuestion)"
                  :label="itemQuestion.Disabled ? 'Answer' : 'Save'"
                  v-show="itemQuestion.Type !== 'Answer'"
                  class="mr-2"
                  :style="{ padding: '7px', marginTop: '5px' }"
                  v-if="
                    itemQuestion.Options &&
                    itemQuestion.Options.length > 0 &&
                    itemQuestion.Options.some((item) => item.Text !== '')
                  "
                />
                <CustomButton
                  @click="removeQuestion(indexQuestion)"
                  :label="'Delete'"
                  :danger="true"
                  :style="{ padding: '7px', marginTop: '5px' }"
                />
              </div>
              <div
                class="point mt-5"
                v-if="
                  itemQuestion.Options &&
                  itemQuestion.Options.length > 0 &&
                  itemQuestion.Options.some((item) => item.IsCorrect === true)
                "
              >
                <input
                  type="number"
                  id="custom-number"
                  onkeypress="return (event.charCode == 8|| event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 46 && event.charCode <= 57"
                  placeholder=""
                  v-model="itemQuestion.Points"
                  @input="getTotalQAndPoint(schemaExam)"
                />
                <small class="fw-bolder">Points</small>
              </div>
            </div>
            <div class="text-right p-1 text-primary text-right">{{ indexQuestion + 1 }}</div>
          </div>
        </div>
      </div>
      <div ref="scrollTarget"></div>
    </div>

    <div v-show="true" class="col-4 scroll-div summary py-0">
      <div class="sticky top-0 bg-white w-full bg-white">
        <!-- <div class="sticky top-0 z-2 bg-white m-0">
          <p class="m-0 fw-bolder fs-5">Summary</p>
          <div class="row">
            <CustomCalendar
              :isShowIcon="true"
              :hideLabel="true"
              class="col-12 m-0"
              v-model="schemaExam.ExamDate"
              :modelValue="schemaExam.ExamDate"
              :message_error="message.Date"
            />
            <div class="flex">
              <CustomInputMask
                :placeholder="'Start-time hh:mm'"
                :mask="'99:99'"
                class="col-6 py-0"
                v-model="schemaExam.StartTime"
                :modelValue="schemaExam.StartTime"
                :message_error="message.StartTime"
              />
              <CustomInputMask
                :placeholder="'End-time hh:mm'"
                :mask="'99:99'"
                class="col-6 py-0"
                v-model="schemaExam.EndTime"
                :modelValue="schemaExam.EndTime"
                :message_error="message.EndTime"
              />
            </div>
            <CustomTextArea
              :placeholder="'Enter description about this exam'"
              v-model="schemaExam.Description"
              class="mt-2"
            />
          </div>
        </div> -->
        <div class="flex justify-content-between">
          <p class="m-0">
            Questions:
            <span class="fw-bolder">{{ schemaExam.Questions.length }}</span>
          </p>
          <p class="m-0">
            Points: <span class="fw-bolder">{{ totalPoint }}</span>
          </p>
        </div>
        <PrimeVueDivider class="mb-2" />
        <p class="m-0 pb-3 fw-bolder">List questions</p>
      </div>
      <ol class="m-0 px-3 text-sm">
        <li v-for="(itemLi, indexLi) in schemaExam.Questions" :key="indexLi">
          <div style="display: grid; grid-template-columns: 80% 20%">
            <a :href="`#${indexLi}`" class="text-900 mb-1 text-justify">
              {{ itemLi.Text || itemLi.Placeholder }}</a
            >
            <span class="ml-2 fw-bolder">({{ itemLi.Points || 0 }}pts)</span>
          </div>
        </li>
      </ol>
    </div>
  </div>
  <div v-if="isMobile" class="" style="">
    <!-- ||
        schemaExam.ExamDate === '' ||
        schemaExam.StartTime === '' ||
        schemaExam.EndTime === '' ||
        schemaExam.ExamTitle === '' -->
    <CustomButton
      @click="submit"
      :label="'Save exam'"
      :warning="true"
      :disabled="
        schemaExam.Questions.length === 0 ||
        schemaExam.Questions.some((question) => question.Text === '') ||
        schemaExam.ExamDate === ''
      "
      class="absolute bottom-0 left-0 m-2"
    />
    <PrimeVueSpeedDial
      :model="itemTest"
      :radius="80"
      type="quarter-circle"
      direction="up-left"
      :style="{ right: 0, bottom: 0 }"
      class="m-2 p-0"
    />
  </div>
</template>
<script setup>
import { reactive, onMounted, ref, inject, provide, getCurrentInstance, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

defineEmits([''])
defineProps({})
onMounted(() => {
  const { matches } = window.matchMedia('(max-width: 767px)') // Adjust the breakpoint as needed
  isMobile.value = matches
  const checkbox = getDefaultDataTypeCheckbox()
  addQuestSection(checkbox)
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
const isMobile = ref(false)
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/rooms`, label: 'Rooms' }
  )
}
// Functions
const totalPoint = ref(0)
const checkBoxCorrectItem = ref([])
const checkCorrectRadio = ref([])
const inputRefs = ref('')
const scrollTarget = ref(null)
const scrollTest = ref()
const style = {
  backgroundColor: 'var( --primary-100)',
  borderTop: 'none',
  borderBottom: 'none',
  borderLeft: '4px solid var( --primary-500)',
  borderRight: 'none',
  outline: 'none',
  borderRadius: '4px'
}

const schemaExam = ref({
  ExamDate: '',
  StartTime: '',
  EndTime: '',
  ExamTitle: '',
  Description: '',
  Questions: []
})
// Error message
const message = ref({})
const itemTest = ref([
  {
    label: 'Radio',
    icon: 'pi pi-circle-fill',
    command: () => {
      const radio = getDefaultDataTypeOption()
      addQuestSection(radio)
    }
  },
  {
    label: 'Checkbox',
    icon: 'pi pi-check-square',
    command: () => {
      const checkbox = getDefaultDataTypeCheckbox()
      addQuestSection(checkbox)
    }
  },
  {
    label: 'Answer',
    icon: 'pi pi-question',
    command: () => {
      const question = getDefaultDataTypeAnswer()
      addQuestSection(question)
    }
  }
])
const getDefaultDataTypeAnswer = () => {
  return {
    Type: 'Answer',
    Text: '',
    Points: '',
    Disabled: false,
    UserAnswer: '',
    Placeholder: 'Enter the question for long or short paragraph'
  }
}
const getDefaultDataTypeCheckbox = () => {
  return {
    Type: 'Checkbox',
    Text: '',
    Points: '',
    UserAnswer: [],
    Placeholder: 'Enter the question for checkbox option',
    Disabled: true,
    Options: [
      {
        Text: '',
        IsCorrect: false
      }
    ]
  }
}
const getDefaultDataTypeOption = () => {
  return {
    Type: 'Option',
    Text: '',
    Points: '',
    UserAnswer: {},
    Placeholder: 'Enter question for option',
    Disabled: true,
    Options: [
      {
        Text: '',
        IsCorrect: false
      }
    ]
  }
}
const defaultDataTypeCheckbox = ref(getDefaultDataTypeCheckbox())
const defaultDataTypeAnswer = ref(getDefaultDataTypeAnswer())
const defaultDataTypeOption = ref(getDefaultDataTypeOption())
const submit = async () => {
  if (schemaExam.value.Questions.length > 0 && schemaExam.value.ExamTitle !== '') {
    // schemaExam.value.ExamDate = $globalFunction.getDateFormatYYMMDD(schemaExam.value.ExamDate)
    const exam = await $api.exam.createExam(schoolId, schemaExam.value)
    if (exam && exam.data) {
      route.push(`/schools/${schoolId}/exams/${exam.data.EXAMS_ID}`)
    }
    setDefaultValue()
  } else {
    if (!schemaExam.value.ExamDate) {
      message.value.Date = 'Date is required'
    } else {
      message.value.Date = ''
    }
    if (!schemaExam.value.StartTime) {
      message.value.StartTime = 'Start time is required'
    } else {
      message.value.StartTime = ''
    }
    if (!schemaExam.value.EndTime) {
      message.value.EndTime = 'End time is required'
    } else {
      message.value.EndTime = ''
    }
  }
}
const addQuestSection = (data, indexQuestion = '') => {
  if (indexQuestion || indexQuestion === 0) {
    schemaExam.value.Questions[indexQuestion].Options.push({
      Text: '',
      IsCorrect: false
    })
    nextTick(() => {
      inputRefs.value[inputRefs.value.length - 1].focus()
    })
  } else {
    schemaExam.value.Questions.push(data)
    scrollTest.value
    nextTick(() => {
      scrollTarget.value.scrollIntoView({ 'scroll-behavior': 'smooth', block: 'end' })
    })
  }
  defaultDataTypeCheckbox.value = getDefaultDataTypeCheckbox()
  defaultDataTypeAnswer.value = getDefaultDataTypeAnswer()
  defaultDataTypeOption.value = getDefaultDataTypeOption()
  getTotalQAndPoint()
}
const removeQuestion = (indexQuestion) => {
  schemaExam.value.Questions.splice(indexQuestion, 1)
  getTotalQAndPoint()
}
const removeOption = (indexQuestion, indexCheckBox) => {
  schemaExam.value.Questions[indexQuestion].Options.splice(indexCheckBox, 1)
  if (!schemaExam.value.Questions[indexQuestion].Options.some((item) => item.IsCorrect === true)) {
    schemaExam.value.Questions[indexQuestion].Points = 0
    getTotalQAndPoint()
  }
}
const chooseAnswer = (indexQuestion) => {
  schemaExam.value.Questions[indexQuestion].Disabled =
    !schemaExam.value.Questions[indexQuestion].Disabled
}
const addCorrectAnswer = (indexQuestion, indexCheckBox) => {
  const { Text } = schemaExam.value.Questions[indexQuestion].Options[indexCheckBox]
  let itemExistCheckbox = checkBoxCorrectItem.value.some((item) => item.Text === Text)
  schemaExam.value.Questions[indexQuestion].Options[indexCheckBox].IsCorrect = itemExistCheckbox
  if (schemaExam.value.Questions[indexQuestion].Type === 'Option') {
    for (let index = 0; index < schemaExam.value.Questions[indexQuestion].Options.length; index++) {
      const element = schemaExam.value.Questions[indexQuestion].Options[index]
      let valueExists = Object.values(checkCorrectRadio.value).includes(element.Text)
      schemaExam.value.Questions[indexQuestion].Options[index].IsCorrect = valueExists
    }
  }
}
const getTotalQAndPoint = () => {
  totalPoint.value = 0
  for (let indexQuestion = 0; indexQuestion < schemaExam.value.Questions.length; indexQuestion++) {
    const element = schemaExam.value.Questions[indexQuestion]
    totalPoint.value += parseInt(element.Points || 0, 10)
  }
}
const setDefaultValue = () => {
  message.value = {}
}
defineExpose({})
</script>
<style scoped>
.scroll-container {
  overflow-y: auto;
}
input {
  border: none;
  outline: none;
}
.hidden {
  display: none;
}
.custom-inpute-text {
  border-bottom: 1px solid var(--primary-500);
  outline: none;
  width: 100%;
}
.fixed-element {
  position: fixed;
  top: 20px;
  left: 20px;
  /* Additional styling properties */
}
#custom-number {
  border-bottom: 1px solid var(--primary-500);
  width: 50px;
  text-align: center;
}
#custom-number::placeholder {
  margin: 0;
  padding: 0;
}
#custom-number:focus {
  outline: none;
}
.focus:focus {
  outline: none;
}
.scroll-div {
  height: 65vh;
  overflow: scroll;
  /* Add scrollbar to the div when its height exceded 150px*/
  /* Can be used horizanlty or vertically according to your layout*/
}
@media (max-width: 600px) {
  .scroll-div {
    /* display: block; */
    padding: 0;
    width: 100%;
  }
  .listQa {
    display: none;
  }
  .hidden {
    display: flex;
  }
  /* Styles applied for viewport width up to 767px */
  .add-qa,
  .summary {
    display: none;
  }
}
</style>
