<template>
  <div class="hello">
    <!-- Dialog student form  -->
    <custom-dialog
      ref="refToChildCustomDialog"
      :modal_header="'Student Form'"
      @onClickDialogSubmit="createStudentInfo"
      @onClickCloseDialog="closeDialogStudentForm"
      :footer_label="footer_label"
    >
      <template #bodyDialog>
        <div class="flex flex-wrap">
          <custom-input-text
            :placeholder="'......'"
            :label="'Last name'"
            :required="true"
            v-model="studentForm.LastName"
            :message_error="message.LastName"
            class="col-6 py-0"
          />
          <custom-input-text
            :placeholder="'.......'"
            :label="'First name'"
            :required="true"
            v-model="studentForm.FirstName"
            :message_error="message.FirstName"
            class="col-6 py-0"
          />
          <custom-input-text
            :placeholder="'.......'"
            :label="'Student ID'"
            v-model="studentForm.ID"
            class="col-6 py-0"
          />
          <custom-dropdown
            :options="classesOptions"
            :placeholder="'Select classes'"
            :label="'Classes'"
            class="col-6 py-0"
            v-model="selectClass"
            :modelValue="selectClass"
            :required="true"
            :message_error="message.Class"
            @addNewDropdown="onClickCreateClass"
          />
          <custom-input-text
            :placeholder="'.......'"
            :label="'Email'"
            v-model="studentForm.Email"
            class="col-12 py-0"
          />
          <custom-radio-button
            v-model="gender"
            :label="'Gender'"
            :defaultValue="gender"
            :isFlex="true"
            class="col-12 py-0"
            :categories="radioButtonOptionStudent"
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
    ClassForm,
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      generationId: this.$route.params.generationId,
      studentID: "",
      // Form student
      gender: {
        Value: "Male",
      },
      radioButtonOptionStudent: [
        {
          Value: "Male",
        },
        {
          Value: "Female",
        },
      ],
      studentForm: {
        ID: "",
        FirstName: "",
        LastName: "",
        Gender: "",
        Email: "",
        Class: "",
      },
      // Error message
      message: {
        FirstName: "",
        LastName: "",
        Class: "",
      },
      // Class
      selectClass: "",
      classesOptions: [],
      // Dialog
      footer_label: "",
    };
  },
  props: {
    msg: String,
  },
  emits: ["updatedStudent"],
  watch: {},
  updated() {},
  created() {},
  methods: {
    openDialogStudentForm() {
      this.$refs.refToChildCustomDialog.openDialog();
      this.listClasses();
    },
    closeDialogStudentForm() {
      this.$refs.refToChildCustomDialog.closeDialog();
      this.setDefaultValue();
    },
    onlyUpdateStudent(data = {}) {
      if (Object.keys(data).length > 0) {
        this.studentForm.FirstName = data.FirstName;
        this.studentForm.LastName = data.LastName;
        this.studentForm.Email = data.Email;
        this.gender = { Value: data.Gender };
        this.studentForm.ID = data.ID;
        // Get studentID
        this.studentID = data.STUDENTS_ID;
        if (this.studentID) {
          this.footer_label = "Edit";
        }
        // Class option
        if (data.Class && Object.keys(data.Class).length > 0) {
          this.selectClass = {
            Value: data.Class.Name,
            ID: data.Class.Id,
            Room: data.Class.Room,
            Trainer: data.Class.Trainer,
          };
        }
      }
    },
    async createStudentInfo() {
      try {
        if (this.studentForm.FirstName && this.studentForm.LastName && this.selectClass) {
          this.selectClass["Name"] = this.selectClass["Value"];
          this.selectClass["Id"] = this.selectClass["ID"];
          delete this.selectClass["Value"];
          delete this.selectClass["ID"];
          this.studentForm.Gender = this.gender.Value;
          this.studentForm.Class = this.selectClass;
          let student = {};
          if (this.studentID) {
            student = await this.$api.student.updateStudent(
              this.schoolId,
              this.generationId,
              this.studentForm,
              this.studentID
            );
          } else {
            student = await this.$api.student.createStudent(
              this.schoolId,
              this.generationId,
              this.studentForm
            );
          }
          this.$emit("updatedStudent", student.data);
          this.closeDialogStudentForm();
        } else {
          if (!this.studentForm.FirstName) {
            this.message.FirstName = "First name is required";
          } else {
            this.message.FirstName = "";
          }
          if (!this.studentForm.LastName) {
            this.message.LastName = "Last name is required";
          } else {
            this.message.LastName = "";
          }
          if (!this.selectClass) {
            this.message.Class = "Class is required";
          } else {
            this.message.Class = "";
          }
        }
      } catch (error) {
        console.log("Error create student info", error);
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
      if (classData && Object.keys(classData).length > 0 && !classData.CloseDialog) {
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
    /**
     * Clear value variable
     */
    setDefaultValue() {
      this.studentForm = {};
      this.message = {};
      this.studentID = "";
      this.footer_label = "";
      this.selectClass = "";
      this.gender = {};
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
