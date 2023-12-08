<template>
  <div class="grid mx-auto">
    <div class="add-qa col-2 mt-8">
      <custom-button
        @click="addQuestSection(defaultDataTypeAnswer)"
        :label="'Add QA Answer'"
      />
      <custom-button
        @click="addQuestSection(defaultDataTypeCheckbox)"
        :label="'Add QA Checkbox'"
        class="my-4"
      />
      <custom-button
        @click="addQuestSection(defaultDataTypeOption)"
        :label="'Add QA Option'"
      />
      <divider-primevue />
      <custom-button
        @click="submit"
        :label="'Save exam'"
        :warning="true"
        :disabled="
          (schemaExam.Questions.length > 0 &&
          schemaExam.Questions[0].Options[0].Text ==='') ||
          schemaExam.ExamDate ==='' ||
          schemaExam.StartTime === '' ||
          schemaExam.EndTime === '' ||
          schemaExam.ExamTitle === ''
        "
      />
    </div>
    <div class="col-6 scroll-div">
      <div class="qa">
        <div class=" sticky top-0 z-2 bg-white m-0">
          <p class="m-0 fw-bolder fs-4">Question section</p>
          <custom-input-text
            :placeholder="'Exam title'"
            class=""
            :hideLabel="true"
            v-model="schemaExam.ExamTitle"
            :message_error="message.Date"
          />
        </div>
        <div
          class="my-2 all-question px-3"
          v-for="(itemQuestion, indexQuestion) in schemaExam.Questions"
          :key="indexQuestion"
        >
          <div class="all-checkbox card mx-auto p-2 my-4 border-top-3 border-primary-500">
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
              <div class="checkbox-qa flex w-100">
                <checkbox-primevue
                  v-model="checkBoxCorrectItem"
                  :inputId="itemOption.Text"
                  :name="itemOption.Text"
                  :value="itemOption"
                  :disabled="itemQuestion.Disabled || !itemOption.Text"
                  @input="addCorrectAnswer(indexQuestion, indexOption)"
                  v-if="itemQuestion.Type === 'Checkbox'"
                />
                <radio-primevue
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
                  v-model="itemOption.Text"
                  :placeholder="'Answer'"
                  class="ml-2"
                  :ref="getRefName(indexQuestion, indexOption)"
                  :class="itemOption.IsCorrect ? 'focus' : 'custom-inpute-text'"
                  :disabled="itemOption.IsCorrect"
                  @keyup.enter="addQuestSection(itemQuestion, indexQuestion)"
                />
              </div>
              <i
                class="pi pi-trash text-danger mx-2"
                @click="removeOption(indexQuestion, indexOption)"
                v-show="itemOption.Hovered"
              ></i>
            </div>
            <div class="add-checkbox flex mx-1">
              <custom-button
                @click="addQuestSection(itemQuestion, indexQuestion)"
                :label="'Add option'"
                :text="true"
                v-show="itemQuestion.Disabled"
                :style="{ padding: '7px', margin: '5px 0px' }"
              />
            </div>
            <divider-primevue class="m-0" />
            <div class="delete-select-answer flex justify-content-between">
              <div class="flex">
                <custom-button
                  @click="chooseAnswer(indexQuestion)"
                  :label="itemQuestion.Disabled ? 'Correct answer' : 'Save'"
                  :success="true"
                  v-show="itemQuestion.Type !== 'Answer'"
                  class="me-2"
                  :style="{ padding: '7px', marginTop: '5px' }"
                  v-if="
                    itemQuestion.Options &&
                    itemQuestion.Options.length > 0 &&
                    itemQuestion.Options.some((item) => item.Text !== '')
                  "
                />
                <custom-button
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
                  placeholder=""
                  v-model="itemQuestion.Points"
                  @input="getTotalQAndPoint(schemaExam)"
                />
                <small class="fw-bolder">Points</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref="scrollTarget"></div>
    </div>

    <div class="col-4 scroll-div">
      <div class="sticky top-0 bg-white w-full bg-white">
        <!-- <h4>Summary</h4> -->
        <div class=" sticky top-0 z-2 bg-white m-0">
          <p class="m-0 fw-bolder fs-5">Summary</p>
          <div class="row">
            <custom-calendar
              :isShowIcon="true"
              :hideLabel="true"
              class="col-12 m-0"
              v-model="schemaExam.ExamDate"
              :modelValue="schemaExam.ExamDate"
              :message_error="message.Date"
            />
            <custom-input-mask
              :placeholder="'Start-time hh:mm'"
              :mask="'99:99'"
              class="col-6 py-0"
              v-model="schemaExam.StartTime"
              :modelValue="schemaExam.StartTime"
              :message_error="message.StartTime"
            />
            <custom-input-mask
              :placeholder="'End-time hh:mm'"
              :mask="'99:99'"
              class="col-6 py-0"
              v-model="schemaExam.EndTime"
              :modelValue="schemaExam.EndTime"
              :message_error="message.EndTime"
            />
            <custom-text-area
              :placeholder="'Enter description about this exam'"
              v-model="schemaExam.Description"
              class="mt-2"
            />
          </div>
        </div>
        <div class="flex justify-content-between">
          <p class="m-0">
            Total question:
            <span class="fw-bolder">{{ schemaExam.Questions.length }}</span>
          </p>
          <p class="m-0">
            Total points: <span class="fw-bolder">{{ totalPoint }}</span>
          </p>
        </div>
        <divider-primevue class="mb-2" />
        <p class="m-0 pb-3 fw-bolder">Question list</p>
      </div>
      <ol class="m-0 px-7">
        <li v-for="(itemLi, indexLi) in schemaExam.Questions" :key="indexLi">
          <div style="display: grid; grid-template-columns: 80% 20%">
            <span class=""> {{ itemLi.Text || itemLi.Placeholder }}</span>
            <span class="ml-2 fw-bolder">{{ itemLi.Points || 0 }} Points</span>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
<script>
import { nextTick } from "vue";
export default {
  components: {},
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      totalPoint: 0,
      checkBoxCorrectItem: [],
      checkCorrectRadio: [],
      style: {
        backgroundColor: "var( --primary-100)",
        borderTop: "none",
        borderBottom: "none",
        borderLeft: "4px solid var( --primary-500)",
        borderRight: "none",
        outline: "none",
        borderRadius: "4px",
      },
      defaultDataTypeAnswer: this.getDefaultDataTypeAnswer(),
      defaultDataTypeCheckbox: this.getDefaultDataTypeCheckbox(),
      defaultDataTypeOption: this.getDefaultDataTypeOption(),
      dataCheckBox: [], // Array to store checkbox values and v-model bindings
      schemaExam: {
        ExamDate: "",
        StartTime: "",
        EndTime: "",
        ExamTitle: "",
        Description: "",
        Questions: [],
      },
      // Error message
      message: {
        Date: "Date is required",
        StartTime: "Start time is required",
        EndTime: "End time is required",
      },
    };
  },
  mounted() {
    this.addQuestSection(this.defaultDataTypeCheckbox);
    this.addQuestSection(this.defaultDataTypeOption);
    this.getTotalQAndPoint();
  },
  watch: {
    // values: {
    //   immediate: true,
    //   handler(data) {
    //     this.values = data
    //     console.log('da', data);
    //   },
    // },
  },
  methods: {
    getDefaultDataTypeAnswer() {
      return {
        Type: "Answer",
        Text: "",
        Points: "",
        Disabled: false,
        UserAnswer: "",
        Placeholder: "Enter the question for long or short paragraph",
      };
    },
    getDefaultDataTypeCheckbox() {
      return {
        Type: "Checkbox",
        Text: "",
        Points: "",
        UserAnswer: [],
        Placeholder: "Enter the question for checkbox option",
        Disabled: true,
        Options: [
          {
            Text: "",
            IsCorrect: false,
          },
        ],
      };
    },
    getDefaultDataTypeOption() {
      return {
        Type: "Option",
        Text: "",
        Points: "",
        UserAnswer: {},
        Placeholder: "Enter question for option",
        Disabled: true,
        Options: [
          {
            Text: "",
            IsCorrect: false,
          },
        ],
      };
    },
    async submit() {
      if (
        this.schemaExam.Questions.length > 0 &&
        this.schemaExam.Questions[0].Options[0].Text &&
        this.schemaExam.ExamDate &&
        this.schemaExam.StartTime &&
        this.schemaExam.ExamTitle &&
        this.schemaExam.EndTime
      ) {
        await this.$api.exam.createExam(this.schoolId, this.schemaExam);
        this.setDefaultValue();
      } else {
        if (!this.schemaExam.ExamDate) {
          this.message.Date = "Date is required";
        } else {
          this.message.Date = "";
        }
        if (!this.schemaExam.StartTime) {
          this.message.StartTime = "Start time is required";
        } else {
          this.message.StartTime = "";
        }
        if (!this.schemaExam.EndTime) {
          this.message.EndTime = "End time is required";
        } else {
          this.message.EndTime = "";
        }
      }
    },
    getRefName(indexQuestion = "", indexOption) {
      return `inputRefs_${indexQuestion}_${indexOption}`;
    },
    addQuestSection(data, indexQuestion = "") {
      if (indexQuestion || indexQuestion === 0) {
        this.schemaExam.Questions[indexQuestion].Options.push({
          Text: "",
          IsCorrect: false,
        });
        nextTick(() => {
          const lastIndexOption =
            this.schemaExam.Questions[indexQuestion].Options.length - 1;
          const newOptionRef = this.$refs[
            this.getRefName(indexQuestion, lastIndexOption)
          ];
          if (newOptionRef && newOptionRef[0]) {
            newOptionRef[0].focus();
            newOptionRef[0].setSelectionRange(
              newOptionRef[0].value.length,
              newOptionRef[0].value.length
            );
          }
        });
      } else {
        this.schemaExam.Questions.push(data);

        nextTick(() => {
          this.$refs.scrollTarget.scrollIntoView({ behavior: "smooth", block: "end" });
        });
      }
      this.defaultDataTypeCheckbox = this.getDefaultDataTypeCheckbox();
      this.defaultDataTypeAnswer = this.getDefaultDataTypeAnswer();
      this.defaultDataTypeOption = this.getDefaultDataTypeOption();
      this.getTotalQAndPoint();
    },
    removeQuestion(indexQuestion) {
      this.schemaExam.Questions.splice(indexQuestion, 1);
      this.getTotalQAndPoint();
    },
    removeOption(indexQuestion, indexCheckBox) {
      this.schemaExam.Questions[indexQuestion].Options.splice(indexCheckBox, 1);
      if(!this.schemaExam.Questions[indexQuestion].Options.some((item) => item.IsCorrect === true)) {
        this.schemaExam.Questions[indexQuestion].Points = 0
        this.getTotalQAndPoint();
      }
    },
    chooseAnswer(indexQuestion) {
      this.schemaExam.Questions[indexQuestion].Disabled = !this.schemaExam.Questions[
        indexQuestion
      ].Disabled;
    },
    addCorrectAnswer(indexQuestion, indexCheckBox) {
      const { Text } = this.schemaExam.Questions[indexQuestion].Options[indexCheckBox];
      let itemExistCheckbox = this.checkBoxCorrectItem.some((item) => item.Text === Text);
      this.schemaExam.Questions[indexQuestion].Options[
        indexCheckBox
      ].IsCorrect = itemExistCheckbox;
      if (this.schemaExam.Questions[indexQuestion].Type === "Option") {
        for (
          let index = 0;
          index < this.schemaExam.Questions[indexQuestion].Options.length;
          index++
        ) {
          const element = this.schemaExam.Questions[indexQuestion].Options[index];
          let valueExists = Object.values(this.checkCorrectRadio).includes(element.Text);
          this.schemaExam.Questions[indexQuestion].Options[index].IsCorrect = valueExists;
        }
      }
    },
    getTotalQAndPoint() {
      this.totalPoint = 0;
      for (
        let indexQuestion = 0;
        indexQuestion < this.schemaExam.Questions.length;
        indexQuestion++
      ) {
        const element = this.schemaExam.Questions[indexQuestion];
        this.totalPoint += parseInt(element.Points || 0, 10);
      }
    },
    setDefaultValue() {
      this.message = {};
    },
  },
};
</script>
<style scoped>
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
  height: 88vh;
  overflow: scroll;
  /* Add scrollbar to the div when its height exceded 150px*/
  /* Can be used horizanlty or vertically according to your layout*/
}
</style>
