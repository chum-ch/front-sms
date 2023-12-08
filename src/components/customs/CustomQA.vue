<template>
  <div class="card w-8 mx-auto my-1 border-top-3 border-blue-500 text-justify py-3 px-7">
    <div>
      <h1 class="text-center text-blue-600">Final OOP</h1>
      <divider-primevue />
        <h4>{{ examSections.Title }}</h4>
      <div
        class="qa my-3 card mx-auto p-4"
        v-for="(itemQa, indexQa) in examSections.Questions"
        :key="indexQa"
      >

        <div class="desc point mb-3">
          <span>
            {{ itemQa.Text }}
          </span>
          <span class="float-end">
            <tag-primevue :value="`${itemQa.Points} Points`" severity="success" v-if="itemQa.Points"/>
          </span>
        </div>
        <div class="answer-type" v-if="itemQa.Type === 'Option'">
          <custom-radio-button
            v-model="option"
            :hideLabel="true"
            class="col-12 py-0"
            :categories="
              itemQa.Options.map((item) => {
                if(item.Text !== '') {
                item.Value = item.Text;
                }
                return item;
              })
            "
          />
        </div>
        <div class="answer-type" v-else-if="itemQa.Type === 'Checkbox'">
          <custom-check-box
            v-model="checkbox"
            class="col-12 py-0"
            @update:modelValue="addUserAnswer(examSections, 'Checkbox', $event)"
            :hideLabel="true"
            :checkBoxCategories="
              itemQa.Options.map((item) => {
                item.Value = item.Text;
                return item;
              })
            "
          />
        </div>
        <div class="answer-type" v-else-if="itemQa.Type === 'Answer'">
          <custom-text-area
            :placeholder="`${itemQa.Type.charAt(0).toUpperCase()}${itemQa.Type.slice(1)}`"
            @update:modelValue="addUserAnswer(examSections, 'Answer', $event)"
            v-model="answer"
          />
        </div>
      </div>
    </div>
    <div class="submit">
      <custom-button
        @onClick="submitAnswer(examSections)"
        class="float-end"
        :label="'Submit'"
        :disabled="
          answer || Object.keys(option).length > 0 || checkbox.length > 0 ? false : true
        "
      />
    </div>
  </div>
</template>

<script>
// import Editor from "primevue/editor";
export default {
  components: {
    // Editor,
  },
  data() {
    return {
      answer: "",
      option: {},
      checkbox: [],
      values: "",
      p_invalid: "",
    };
  },
  props: {
    examSections: Object,
    value: String,
    modelValue: String,
  },
  emits: ["update:modelValue"],
  watch: {
    option: {
      immediate: true,
      handler(data) {
        if (data && Object.keys(data).length > 0) {
          this.addUserAnswer(this.examSections, "Option", data);
        }
      },
    },
    // message_error: {
    //   immediate: true,
    //   handler(data) {
    //     if (data) {
    //       this.p_invalid = "p-invalid";
    //     }
    //   },
    // },
  },
  created() {
    // this.values = this.modelValue;
  },
  methods: {
    addUserAnswer(examSchema, questionType, answer) {
      let schema = examSchema.Questions;
      schema.forEach((question) => {
        if (question.Type === questionType) {
          question.UserAnswer = answer;
        }
      });
    },
    submitAnswer(answer) {
      console.log(answer);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
