<template>
  <div class="hello">
    <!-- Dialog course form  -->
    <custom-dialog
      ref="dialogCourseForm"
      :modal_header="'Course Form'"
      @onClickDialogSubmit="createCourseInfo"
      @onClickCloseDialog="closeDialogCourseForm"
      :footer_label="footer_label"
    >
      <template #bodyDialog>
        <div class="row">
          <custom-input-text
            :placeholder="'.......'"
            :label="'Course name'"
            v-model="courseForm.Name"
            :required="true"
            :message_error="message.Name"
            class="py-0"
          />
          <custom-input-number
            :placeholder="'.......'"
            :label="'Credit(s)'"
            v-model="courseForm.Credit"
            :required="true"
            :isDecimal="true"
            :message_error="message.Credit"
            class="col-12 py-0"
          />
          <custom-dropdown
            v-show="false"
            :options="classesOptions"
            :placeholder="'Select class'"
            :label="'Classes'"
            class="col-6 py-0"
            v-model="selectClass"
            :modelValue="selectClass"
            :required="true"
            :message_error="message.Class"
            @addNewDropdown="onClickCreateClass"
          />
        </div>
      </template>
    </custom-dialog>
        <!-- Child classes  -->
        <ClassForm ref="refToChildClassForm" @updatedClass="updatedClass" />
  </div>
</template>

<script>
import ClassForm from "../classes/ClassForm.vue";
export default {
  components: {
    ClassForm
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      // Form course
      courseID: "",
      courseForm: {
        Name: "",
        Credit: null,
      },
      // Class option
      selectClass: "",
      classesOptions: [],

      // Error message
      message: {
        Name: "",
        Credit: "",
      },
      // Dialog
      footer_label: "",
    };
  },
  props: {
    msg: String,
  },
  emits: ["updatedCourse"],
  watch: {},
  updated() {},
  created() {},
  methods: {
    openDialogCourseForm() {
      this.$refs.dialogCourseForm.openDialog();
      this.listClasses();
    },
    closeDialogCourseForm() {
      this.footer_label = "";
      this.$refs.dialogCourseForm.closeDialog();
      this.setDefaultValue();
    },
    onlyUpdateCourse(data = {}) {
      if (data && Object.keys(data).length > 0) {
        this.courseForm.Name = data.Name;
        this.courseForm.Credit = data.Credit;
        this.courseForm.Floor = data.Floor;
        // Class option
        if (data.Class && Object.keys(data.Class).length > 0) {
          this.selectClass = {
            Value: data.Class.Name,
            ID: data.Class.Id,
            Room: data.Class.Room,
            Trainer: data.Class.Trainer,
          };
        }
        // Get courseID
        this.courseID = data.COURSES_ID;
        if (this.courseID) {
          this.footer_label = "Edit";
        }
      }
    },
    async createCourseInfo() {
      try {
        if (
          this.courseForm.Name &&
          this.courseForm.Credit
        ) {
          let course = {};
          this.courseForm = {
            ...this.courseForm,
            Class: { Name: this.selectClass.Value, Id: this.selectClass.ID },
          };
          if (this.courseID) {
            course = await this.$api.course.updateCourse(
              this.schoolId,
              this.courseForm,
              this.courseID
            );
          } else {
            course = await this.$api.course.createCourse(this.schoolId, this.courseForm);
          }
          this.$emit("updatedCourse", course.data);
          this.closeDialogCourseForm();
        } else {
          if (!this.courseForm.Name) {
            this.message.Name = "Course's name is required";
          } else {
            this.message.Name = "";
          }
          if (!this.courseForm.Credit) {
            this.message.Credit = "Credit is required";
          } else {
            this.message.Credit = "";
          }
          if (!this.selectClass) {
            this.message.Class = "Class is required";
          } else {
            this.message.Class = "";
          }
        }
      } catch (error) {
        console.log("Error create course info", error);
      }
    },

    /**
     *
     * Classes
     */
    onClickCreateClass(value) {
      this.$refs.refToChildClassForm.openDialogClassForm();
      this.$refs.refToChildClassForm.onlyUpdateClasses({ Name: value });
    },
    updatedClass(classData) {
      if (classData && Object.keys(classData).length > 0) {
        this.selectClass = {
          Value: classData.Name,
          ID: classData.CLASSES_ID,
          Room: classData.Room,
          Trainer: classData.Trainer,
        };
      }
      this.listClasses();
    },
    async listClasses() {
      try {
        let classes = await this.$api.classApi.listClasses(this.schoolId);
        if (classes && classes.data && classes.data.length > 0) {
          this.classesOptions = classes.data.map((item) => {
            return {
              Value: item.Name,
              ID: item.CLASSES_ID,
              Room: item.Room,
              Trainer: item.Trainer,
            };
          });
        }
      } catch (error) {
        console.log("Error list class", error);
      }
    },
    setDefaultValue() {
      this.courseForm = {};
      this.message = {};
      this.courseID = "";
      this.footer_label = "";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
