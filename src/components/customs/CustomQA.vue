<template>
  <div class="card mx-auto my-1 listQa text-justify py-3">
    <div>
      <h1 class="text-center">{{ examSections.ExamTitle }}</h1>
      <div class="flex justify-content-between">
        <p class="">Total questions: {{ examSections.TotalQuestions }}</p>
        <p class="">Total points: {{ examSections.TotalPoints }}</p>
      </div>
      <PrimeVueDivider class="p-0 m-0" />
      <h4>{{ examSections.Title }}</h4>
      <ol class="px-3">
        <li
          class="qa my-3 card mx-auto"
          v-for="(itemQa, indexQa) in examSections.Questions"
          :key="indexQa"
        >
          <div class="desc point mb-3">
            <span>
              {{ itemQa.Text }}
            </span>
            <span class="float-end ml-1 sm">
              <!-- <PrimeVueTag :value="`${itemQa.Points} Points`" severity="success" v-if="itemQa.Points"/> -->
              <span v-if="itemQa.Points" class="text-green-500">({{ itemQa.Points }}pts)</span>
            </span>
          </div>
          <div class="answer-type" v-if="itemQa.Type === 'Option'">
            <CustomRadioButton
              v-model="option"
              :hideLabel="true"
              @update:modelValue="addUserAnswer(examSections, 'Option', $event, indexQa)"
              class="col-12 p-0"
              :categories="
                itemQa.Options.map((item) => {
                  if (item.Text !== '') {
                    item.Value = item.Text
                  }
                  return item
                })
              "
            />
          </div>
          <div class="answer-type" v-else-if="itemQa.Type === 'Checkbox'">
            <CustomCheckBox
              v-model="checkbox"
              class="col-12 p-0"
              @update:modelValue="addUserAnswer(examSections, 'Checkbox', $event, indexQa)"
              :hideLabel="true"
              :checkBoxCategories="
                itemQa.Options.map((item) => {
                  item.Value = item.Text
                  return item
                })
              "
            />
          </div>
          <div class="answer-type" v-else-if="itemQa.Type === 'Answer'">
            <CustomTextArea
              :placeholder="`${itemQa.Type.charAt(0).toUpperCase()}${itemQa.Type.slice(1)}`"
              @update:modelValue="addUserAnswer(examSections, 'Answer', $event, indexQa)"
              v-model="answer"
            />
          </div>
        </li>
      </ol>
    </div>
    <div class="submit">
      <CustomButton
        @onClick="submitAnswer(examSections)"
        class="float-end"
        :label="'Submit'"
        :hide="hideSubmitBtn"
        :disabled="answer || Object.keys(option).length > 0 || checkbox.length > 0 ? false : true"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits([''])
defineProps({
  examSections: {
    type: Object,
    required: true
  },
  hideSubmitBtn: {
    type: Boolean,
    default: () => true
  }
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
const schoolId = route.currentRoute.value.params.schoolId
const examId = route.currentRoute.value.params.examId
// Functions
const answer = ref('')
const option = ref({})
const checkbox = ref([])
const addUserAnswer = (examSchema, questionType, answer, indexQa) => {
  let schema = examSchema.Questions
  schema.forEach((question, index) => {
    if (question.Type === questionType && indexQa === index) {
      question.UserAnswer = answer
    }
  })
}
const submitAnswer = async (answer) => {
  const { data } = await $api.exam.submitExam(schoolId, examId, answer)
  console.log(data)
}

defineExpose({})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.listQa {
  border: 5px solid var(--primary-color);
  border-width: 5px 2px 2px 2px;
  border-radius: 10px;
  width: 65%;
  padding: 0 2.5rem;
}
@media (max-width: 885px) {
  /* Styles applied for viewport width up to 767px */
  .listQa {
    width: 90%;
  }
}
</style>
