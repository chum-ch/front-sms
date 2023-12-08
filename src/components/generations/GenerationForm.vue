<template>
  <div class="hello">
    <!-- Dialog generation form  -->
    <custom-dialog
      ref="dialogGenerationForm"
      :modal_header="'Generation Form'"
      @onClickDialogSubmit="createGenerationInfo"
      @onClickCloseDialog="closeDialogGenerationForm"
      :footer_label="footer_label"
    >
      <template #bodyDialog>
        <custom-input-text
          :placeholder="'.......'"
          :label="'Generation name'"
          v-model="generationForm.Name"
          :required="true"
          :message_error="message.Name"
          class="py-0"
        />
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
      // Form generation
      generationID: "",
      generationForm: {
        Name: "",
      },
      
      // Error message
      message: {
        Name: "",
      },
      // Dialog
      footer_label: "",
    };
  },
  props: {
    msg: String,
  },
  emits: ["updatedGeneration"],
  watch: {},
  updated() {},
  created() {},
  methods: {
    openDialogGenerationForm() {
      this.$refs.dialogGenerationForm.openDialog();
    },
    closeDialogGenerationForm() {
      this.footer_label = "";
      this.$refs.dialogGenerationForm.closeDialog();
      this.setDefaultValue();
    },
    onlyUpdateGeneration(data = {}) {
      if (data && Object.keys(data).length > 0) {
        this.generationForm.Name = data.Name;
        this.generationForm.Floor = data.Floor;
        // Get generationID
        this.generationID = data.GENERATIONS_ID;
        if (this.generationID) {
          this.footer_label = "Edit";
        }
      }
    },
    async createGenerationInfo() {
      try {
        if (this.generationForm.Name) {
          let generation = {};
          if (this.generationID) {
            generation = await this.$api.generation.updateGeneration(
              this.schoolId,
              this.generationForm,
              this.generationID
            );
          } else {
            console.log('g', this.generationForm);
            generation = await this.$api.generation.createGeneration(this.schoolId, this.generationForm);
            console.log('dfdf',generation);
          }
          this.$emit("updatedGeneration", generation.data);
          this.closeDialogGenerationForm();
        } else {
          if (!this.generationForm.Name) {
            this.message.Name = "Generation's name is required.";
          } else {
            this.message.Name = "";
          }
        }
      } catch (error) {
        console.log("Error create generation info", error);
      }
    },
    setDefaultValue() {
      this.generationForm = {};
      this.message = {};
      this.generationID = "";
      this.footer_label = "";
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
