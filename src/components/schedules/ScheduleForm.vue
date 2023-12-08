<template>
  <div class="hello">
    <!-- Dialog schedule form  -->
    <custom-dialog
      ref="dialogScheduleForm"
      :modal_header="'Schedule Form'"
      @onClickDialogSubmit="createScheduleInfo"
      @onClickCloseDialog="closeDialogScheduleForm"
      :footer_label="footer_label"
    >
      <template #bodyDialog>
        <div class="flex flex-wrap">
          <custom-calendar
            :isShowIcon="true"
            :label="'Date'"
            :required="true"
            v-model="scheduleForm.Date"
            :modelValue="scheduleForm.Date"
            :message_error="message.Date"
            class="col-12 py-0"
          />
          <custom-dropdown
            :options="trainerOptions"
            :placeholder="'Select trainer'"
            :label="'Trainer'"
            v-model="selectTrainer"
            :modelValue="selectTrainer"
            :required="true"
            :message_error="message.Trainer"
            class="col-6 py-0"
            @addNewDropdown="onClickCreateTrainer"
          />
          <custom-dropdown
            :options="coursesOptions"
            :placeholder="'Select course'"
            :label="'Courses'"
            class="col-6 py-0"
            v-model="selectCourse"
            :modelValue="selectCourse"
            :required="true"
            :message_error="message.Course"
            @addNewDropdown="onClickCreateCourse"
          />
          <custom-dropdown
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
          <custom-dropdown
            :options="roomOptions"
            :placeholder="'Select room'"
            :label="'Room'"
            class="col-6 py-0"
            v-model="selectRoom"
            :modelValue="selectRoom"
            :required="true"
            @addNewDropdown="onClickCreateRoom"
            :message_error="message.Room"
          />

          <custom-input-mask
            :placeholder="'hh:mm'"
            :mask="'99:99'"
            :label="'Start time'"
            :required="true"
            v-model="scheduleForm.StartTime"
            :modelValue="scheduleForm.StartTime"
            :message_error="message.StartTime"
            class="col-6 py-0"
          />
          <custom-input-mask
            :placeholder="'hh:mm'"
            :mask="'99:99'"
            class="col-6 py-0"
            :label="'End time'"
            v-model="scheduleForm.EndTime"
            :modelValue="scheduleForm.EndTime"
            :required="true"
            :message_error="message.EndTime"
          />
        </div>
      </template>
    </custom-dialog>
    <!-- Component  -->
    <!-- Child trainer form  -->
    <TrainerForm ref="refToChildTrainerForm" @updatedTrainer="updatedTrainer" />
    <!-- Child classes  -->
    <ClassForm ref="refToChildClassForm" @updatedClass="updatedClass" />
    <!-- Child course  -->
    <CourseForm ref="refToChildCourseForm" @updatedCourse="updatedCourse" />
    <!-- Child room form  -->
    <RoomForm ref="refToChildRoomForm" @updatedRoom="updatedRoom" />
  </div>
</template>
<script>
import TrainerForm from "../trainers/TrainerForm.vue";
import ClassForm from "../classes/ClassForm.vue";
import CourseForm from "../courses/CourseForm.vue";
import RoomForm from "../rooms/RoomForm.vue";
export default {
  name: "ScheduleForm",
  components: {
    ClassForm,
    TrainerForm,
    CourseForm,
    RoomForm,
  },
  data() {
    return {
      dateOptions: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Phnom_Penh",
      },
      schoolId: this.$route.params.schoolId,
      scheduleID: "",
      // Form schedule
      scheduleForm: {
        StartTime: "",
        EndTime: "",
        Date: "",
      },
      // Error message
      message: {
        Course: "",
        Date: "",
        StartTime: "",
        EndTime: "",
        Class: "",
        Trainer: "",
        Room: "",
      },
      // Class option
      selectClass: "",
      classesOptions: [],
      // Course option
      selectCourse: "",
      coursesOptions: [],
      // Trainer
      trainerOptions: [],
      selectTrainer: "",
      // Room
      selectRoom: "",
      roomOptions: [],
      // Dialog
      footer_label: "",
    };
  },
  props: {
    msg: String,
  },
  emits: ["updatedSchedule"],
  watch: {},
  created() {},
  methods: {
    openDialogScheduleForm() {
      this.$refs.dialogScheduleForm.openDialog();
      this.listClasses();
      this.listTrainers();
      this.listCourses();
      this.listRooms();
    },
    closeDialogScheduleForm() {
      this.$refs.dialogScheduleForm.closeDialog();
      this.setDefaultValue();
    },
    onlyUpdateSchedule(data = {}) {
      if (Object.keys(data).length > 0) {
        this.scheduleForm.Title = data.Title;
        this.scheduleForm.Date = new Date(data.Date);
        this.scheduleForm.StartTime = data.StartTime;
        this.scheduleForm.EndTime = data.EndTime;

        this.scheduleID = data.SCHEDULES_ID;
        if (this.scheduleID) {
          this.footer_label = "Edit";
        }
        // Trainer option
        if (data.Trainer && Object.keys(data.Trainer).length > 0) {
          this.selectTrainer = {
            Value: data.Trainer ? data.Trainer.Name : "",
            ID: data.Trainer ? data.Trainer.Id : "",
          };
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
        // Course option
        if (data.Course && Object.keys(data.Course).length > 0) {
          this.selectCourse = {
            Value: data.Course.Name,
            ID: data.Course.Id,
          };
        }
        // Room option
        if (data.Room && Object.keys(data.Room).length > 0) {
          this.selectRoom = {
            Value: data.Room ? data.Room.Name : "",
            ID: data.Room ? data.Room.Id : "",
          };
        }
      }
    },
    getDateFormat(dateToConvert) {
      let date = new Date(dateToConvert);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      // const hours = date.getHours().toString().padStart(2, "0");
      // const minutes = date.getMinutes().toString().padStart(2, "0");
      // const seconds = date.getSeconds().toString().padStart(2, "0");
      const localString = `${year}-${month}-${day}`;
      return localString;
    },
    async createScheduleInfo() {
      try {
        if (
          this.scheduleForm.Date &&
          this.scheduleForm.StartTime &&
          this.scheduleForm.EndTime &&
          this.selectClass &&
          Object.keys(this.selectClass).length > 0 &&
          this.selectTrainer &&
          Object.keys(this.selectTrainer).length > 0 &&
          this.selectCourse &&
          Object.keys(this.selectCourse).length > 0 &&
          this.selectRoom &&
          Object.keys(this.selectRoom).length > 0
        ) {
          this.scheduleForm.Date = this.getDateFormat(this.scheduleForm.Date);
          this.scheduleForm = {
            ...this.scheduleForm,
            Class: { Name: this.selectClass.Value, Id: this.selectClass.ID },
            Trainer: {
              Name: this.selectTrainer.Value,
              Id: this.selectTrainer.ID,
            },
            Course: { Name: this.selectCourse.Value, Id: this.selectCourse.ID },
            Room: { Name: this.selectRoom.Value, Id: this.selectRoom.ID },
          };

          let schedule = {};
          if (this.scheduleID) {
            schedule = await this.$api.schedule.updateSchedule(
              this.schoolId,
              this.scheduleForm,
              this.scheduleID
            );
          } else {
            schedule = await this.$api.schedule.createSchedule(
              this.schoolId,
              this.scheduleForm
            );
          }
          this.$emit("updatedSchedule", schedule.data);
          this.closeDialogScheduleForm();
        } else {
          if (!this.selectCourse) {
            this.message.Course = "Subject name is required";
          } else {
            this.message.Course = "";
          }
          if (!this.scheduleForm.Date) {
            this.message.Date = "Date  is required";
          } else {
            this.message.Date = "";
          }
          if (!this.selectClass) {
            this.message.Class = "Class is required";
          } else {
            this.message.Class = "";
          }
          if (!this.selectRoom) {
            this.message.Room = "Room is required";
          } else {
            this.message.Room = "";
          }
          if (!this.selectTrainer) {
            this.message.Trainer = "Trainer is required";
          } else {
            this.message.Trainer = "";
          }
          if (!this.scheduleForm.StartTime) {
            this.message.StartTime = "Start time is required";
          } else {
            this.message.StartTime = "";
          }
          if (!this.scheduleForm.EndTime) {
            this.message.EndTime = "End time is required";
          } else {
            this.message.EndTime = "";
          }
        }
      } catch (error) {
        console.log("Error create schedule info", error);
      }
    },
    /**
     *
     * Trainer
     */
    onClickCreateTrainer(value) {
      this.$refs.refToChildTrainerForm.openDialogTrainerForm();
      this.$refs.refToChildTrainerForm.onlyUpdateTrainer({ FirstName: value });
    },
    async listTrainers() {
      let trainers = await this.$api.trainer.listTrainers(this.schoolId);
      if (trainers && trainers.data.length > 0) {
        this.trainerOptions = trainers.data.map((trainer) => {
          return {
            Value: `${trainer.LastName} ${trainer.FirstName}`,
            ID: trainer.TRAINERS_ID,
          };
        });
      }
    },
    updatedTrainer(trainer) {
      if (trainer && Object.keys(trainer).length > 0) {
        this.selectTrainer = {
          Value: `${trainer.LastName} ${trainer.FirstName}`,
          ID: trainer.TRAINERS_ID,
        };
      }
      this.listTrainers();
    },

    /**
     *
     * Room
     */
    onClickCreateRoom(value) {
      this.$refs.refToChildRoomForm.openDialogRoomForm();
      this.$refs.refToChildRoomForm.onlyUpdateRoom({ Name: value });
    },
    updatedRoom(room) {
      if (room && Object.keys(room).length > 0 && !room.CloseDialog) {
        this.selectRoom = { Value: room.Name, ID: room.ROOMS_ID };
      }
      this.listRooms();
    },
    async listRooms() {
      try {
        let rooms = await this.$api.room.listRooms(this.schoolId);
        if (rooms && rooms.data.length > 0) {
          this.roomOptions = rooms.data.map((room) => {
            return { Value: `${room.Name}`, ID: room.ROOMS_ID };
          });
        }
      } catch (error) {
        console.log("Form class list room error", error);
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

    /**
     *
     * Courses
     */
    onClickCreateCourse(value) {
      this.$refs.refToChildCourseForm.openDialogCourseForm();
      this.$refs.refToChildCourseForm.onlyUpdateCourse({ Name: value });
    },
    updatedCourse(courseData) {
      if (courseData && Object.keys(courseData).length > 0) {
        this.selectCourse = {
          Value: courseData.Name,
          ID: courseData.COURSES_ID,
        };
      }
      this.listCourses();
    },
    async listCourses() {
      try {
        let courses = await this.$api.course.listCourses(this.schoolId);
        if (courses && courses.data && courses.data.length > 0) {
          this.coursesOptions = courses.data.map((item) => {
            return {
              Value: item.Name,
              ID: item.COURSES_ID,
            };
          });
        }
      } catch (error) {
        console.log("Error list course", error);
      }
    },
    /**
     * Clear value variable
     */
    setDefaultValue() {
      this.scheduleForm = {};
      this.message = {};
      this.scheduleID = "";
      this.selectClass = "";
      this.selectTrainer = "";
      this.selectCourse = "";
      this.selectRoom = "";
      this.footer_label = "";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
* {
  margin: 0;
  padding: 0;
}
</style>
