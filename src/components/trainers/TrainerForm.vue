<template>
  <div class="hello">
    <!-- Dialog trainer form  -->
    <custom-dialog
      ref="refToChildCustomDialog"
      :modal_header="'Trainer Form'"
      @onClickDialogSubmit="createTrainerInfo"
      @onClickCloseDialog="closeDialogTrainerForm"
      :footer_label="footer_label"
    >
      <template #bodyDialog>
        <div class="flex flex-wrap">
          <custom-input-text
            :placeholder="'......'"
            :label="'Last name'"
            :required="true"
            v-model="trainerForm.LastName"
            :message_error="message.LastName"
            class="col-6 py-0"
          />
          <custom-input-text
            :placeholder="'......'"
            :label="'First name'"
            :required="true"
            v-model="trainerForm.FirstName"
            :message_error="message.FirstName"
            class="col-6 py-0"
          />
          <custom-input-text
            :placeholder="'......'"
            :label="'Province'"
            v-model="trainerForm.Province"
            :message_error="message.Province"
            class="col-6 py-0"
          />
          <custom-input-text
            :placeholder="'......'"
            :label="'Phone'"
            v-model="trainerForm.Phone"
            :message_error="message.Phone"
            class="col-6 py-0"
          />
          <custom-input-text
            :placeholder="'......'"
            :label="'Email'"
            v-model="trainerForm.Email"
            class="col-12 py-0"
          />
          <custom-radio-button
            v-model="gender"
            :label="'Gender'"
            :defaultValue="'Male'"
            :isFlex="true"
            class="col-12 py-0"
            :categories="radioButtonOptionTriner"
          />
        </div>
      </template>
    </custom-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      schoolId: this.$route.params.schoolId,
      trainerID: "",
      // Form trainer
      trainerForm: {
        FirstName: "",
        LastName: "",
        Email: "",
        Province: "",
        Phone: "",
        Gender: "",
      },
      gender: "",
      radioButtonOptionTriner: [
        {
          Value: "Male",
        },
        {
          Value: "Female",
          Disable: false,
        },
      ],

      // Error message
      message: {
        FirstName: "",
        LastName: "",
        Gender: "",
      },
      // Dialog
      footer_label: "",
    };
  },
  props: {
    msg: String,
    modelValueUpdateTrainer: [String, Object],
  },
  emits: ["updatedTrainer"],
  watch: {},
  updated() {
  },
  created() {
    this.onlyUpdateTrainer();
  },
  methods: {
    openDialogTrainerForm() {
      this.$refs.refToChildCustomDialog.openDialog();
    },
    closeDialogTrainerForm() {
      this.$refs.refToChildCustomDialog.closeDialog();
      this.setDefaultValue();
    },
    onlyUpdateTrainer( data = {}) {
      if (
        data &&
        Object.keys(data).length > 0
      ) {
        this.trainerForm.FirstName = data.FirstName;
        this.trainerForm.LastName = data.LastName;
        this.trainerForm.Email = data.Email;
        this.gender = data.Gender;
        this.trainerForm.Province = data.Province;
        this.trainerForm.Phone = data.Phone;
        // Get trainer ID
        this.trainerID = data.TRAINERS_ID;
        if (this.trainerID) {
          this.footer_label = "Eidt";
        }
      }
    },

    async createTrainerInfo() {
      try {
        this.trainerForm.Gender = this.gender;
        if (this.trainerForm.FirstName && this.trainerForm.LastName) {
          let trainer = {};
          if (
            this.trainerID
          ) {
            trainer = await this.$api.trainer.updateTrainer(
              this.schoolId,
              this.trainerForm,
              this.trainerID
            );
          } else {
            trainer = await this.$api.trainer.createTrainer(
              this.schoolId,
              this.trainerForm
            );
          }
          this.$emit("updatedTrainer", trainer.data);
          this.closeDialogTrainerForm();
        } else {
          if (!this.trainerForm.FirstName) {
            this.message.FirstName = "First name is required";
          } else {
            this.message.FirstName = "";
          }
          if (!this.trainerForm.LastName) {
            this.message.LastName = "Last name is required";
          } else {
            this.message.LastName = "";
          }
        }
      } catch (error) {
        console.log("Error create trainer info", error);
      }
    },
    setDefaultValue() {
      this.trainerForm = {};
      this.message = {};
      this.trainerID = "";
      this.footer_label = "";
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
