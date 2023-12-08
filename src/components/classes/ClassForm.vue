<template>
  <div class="hello">
    <!-- Dialog class form  -->
    <custom-dialog
      ref="refToChildCustomDialog"
      :modal_header="'Class Form'"
      @onClickDialogSubmit="createClassInfo"
      @onClickCloseDialog="closeDialogClassForm"
      :footer_label="footer_label"
    >
      <template #bodyDialog>
        <custom-input-text
          :placeholder="'.......'"
          :label="'Class name'"
          :required="true"
          v-model="classForm.Name"
          :message_error="message.Name"
          class="col-12 py-0"
        />
        <custom-dropdown
          :options="roomOptions"
          :placeholder="'Select room'"
          :label="'Room'"
          class="col-12 py-0"
          v-model="selectRoom"
          :modelValue="selectRoom"
          :required="true"
          @addNewDropdown="onClickCreateRoom"
          :message_error="message.Room"
        />
        <custom-dropdown
          :options="trainerOptions"
          :placeholder="'Select trainer'"
          :label="'Trainer'"
          v-model="selectTrainer"
          :modelValue="selectTrainer"
          class="col-12 py-0"
          @addNewDropdown="onClickCreateTrainer"
        />
      </template>
    </custom-dialog>
    <!-- Child trainer form  -->
    <TrainerForm ref="refToChildTrainerForm" @updatedTrainer="updatedTrainer" />
    <!-- Child room form  -->
    <RoomForm ref="refToChildRoomForm" @updatedRoom="updatedRoom" />
  </div>
</template>
<script>
import TrainerForm from "../trainers/TrainerForm.vue";
import RoomForm from "../rooms/RoomForm.vue";
export default {
  components: {
    TrainerForm,
    RoomForm,
  },
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      // Form class
      classID: "",
      classForm: {
        Name: "",
        Floor: "",
      },
      // Room
      selectRoom: "",
      roomOptions: [],
      // Trainer
      trainerOptions: [],
      selectTrainer: "",
      // Error message
      message: {
        Name: "",
        Room: "",
      },
      // Dialog
      footer_label: "",
    };
  },
  props: {
    msg: String,
  },
  emits: ["updatedClass"],
  updated() {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    openDialogClassForm() {
      this.$refs.refToChildCustomDialog.openDialog();
      this.listRooms();
      this.listTrainers();
    },
    closeDialogClassForm() {
      this.$refs.refToChildCustomDialog.closeDialog();
      this.setDefaultValue();
    },
    onlyUpdateClasses(data = {}) {
      if (data && Object.keys(data).length > 0) {
        this.classForm.Name = data.Name;
        // Get class Id
        this.classID = data.CLASSES_ID;
        if (this.classID) {
          this.footer_label = "Edit";
        }
        // Room option
        if (data.Room && Object.keys(data.Room).length > 0) {
          this.selectRoom = {
            Value: data.Room ? data.Room.Name : "",
            ID: data.Room ? data.Room.Id : "",
          };
        }
        // Trainer option
        if (data.Trainer && Object.keys(data.Trainer).length > 0) {
          this.selectTrainer = {
            Value: data.Trainer ? data.Trainer.Name : "",
            ID: data.Trainer ? data.Trainer.Id : "",
          };
        }
      }
    },
    async createClassInfo() {
      try {
        if (
          this.classForm.Name &&
          this.selectRoom && Object.keys(this.selectRoom).length > 0
        ) {
          this.classForm = {
            ...this.classForm,
            Trainer: { Name: this.selectTrainer.Value, Id: this.selectTrainer.ID },
            Room: { Name: this.selectRoom.Value, Id: this.selectRoom.ID },
          };
          let classes = {};
          if (this.classID) {
            classes = await this.$api.classApi.updateClass(
              this.schoolId,
              this.classForm,
              this.classID
            );
          } else {
            classes = await this.$api.classApi.createClass(this.schoolId, this.classForm);
          }
          this.$emit("updatedClass", classes.data);
          this.closeDialogClassForm();
        } else {
          if (!this.classForm.Name) {
            this.message.Name = "Class's name is required.";
          } else {
            this.message.Name = "";
          }
          if (!this.selectRoom) {
            this.message.Room = "Room's name is required.";
          } else {
            this.message.Room = "";
          }
        }
      } catch (error) {
        console.log("Error create class info", error);
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
     * Clear value variable
     */
    setDefaultValue() {
      this.classForm = {};
      this.message = {};
      this.classID = "";
      this.footer_label = "";
      this.selectRoom = "";
      this.selectTrainer = "";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
