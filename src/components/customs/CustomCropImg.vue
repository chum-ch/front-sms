<template>
  <div>
    <CustomDialog
      ref="refToChildCustomDialog"
      :modalHeader="'Crop Image'"
      @onClickDialogSubmit="save"
      @onClickCloseDialog="closeDialogCropImg"
      :footerLabel="'Save'"
      :disabledSubmitBtn="isSave"
    >
      <template #bodyDialog>
        <div class="m-auto p-3">
          <div class="flex justify-content-between text-center flex-wrap">
            <div class="crop-image">
              <cropper
                ref="cropper"
                class="cropper"
                :src="image.src"
                :auto-zoom="true"
                :stencil-props="{
                  handlers: {},
                  movable: false,
                  resizable: false,
                }"
                :stencil-size="{
                  width: 180,
                  height: 180,
                }"
                :resize-image="{
                  adjustStencil: false,
                }"
                image-restriction="stencil"
              />
              <div class="flex justify-content-between flex-wrap mt-3">
                <CustomButton
                  class=""
                  @click="openFileInput"
                  :label="'Upload image'"
                  :secondary="true"
                />
                <CustomButton
                  class=""
                  :label="'Crop'"
                  :disabled="!image.name"
                  @onClick="crop"
                />
              </div>
            </div>
            <PrimeVueDivider layout="vertical" />
            <div class="result">
              <h3>Result</h3>
              <CustomProfile :ProfileURL="image.src"> </CustomProfile>
              <!-- <CustomButton class="" :label="'Save'" @onClick="save" /> -->
            </div>
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              id="imageInput"
              ref="imageInput"
              @change="handleFileChange"
              hidden
            />
          </div>
        </div>
      </template>
    </CustomDialog>
  </div>
</template>
<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
// import { saveAs } from 'file-saver';
export default {
  components: {
    Cropper,
  },
  data() {
    return {
      coordinates: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
      img: "http://127.0.0.1:3003/1691742117993-20230324_094750.jpg",
      isCrop: true,
      isSave: true,

      image: {
        name: null,
        type: null,
        src:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
      },
      blob: null,
    };
  },
  props: {},
  emits: ["image"],
  methods: {
    openDialogCropImg() {
      this.$refs.refToChildCustomDialog.openDialog();
    },
    closeDialogCropImg() {
      this.$refs.refToChildCustomDialog.closeDialog();
      this.setDefaultValue();
    },

    openFileInput() {
      this.$refs.imageInput.click();
    },
    handleFileChange() {
      const imageFile = this.$refs.imageInput.files[0];
      // Reference to the DOM input element
      // Ensure that you have a file before attempting to read it
      if (imageFile) {
        // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
        if (this.image.src) {
          URL.revokeObjectURL(this.image.src);
        }
        // 2. Create the blob link to the file to optimize performance:
        const blob = URL.createObjectURL(imageFile);
        // 3. The steps below are designated to determine a file mime type to use it during the
        // Create a new FileReader to read this image binary data
        const reader = new FileReader();
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = () => {
          // Note: arrow function used here, so that "this.image" refers to the image of Vue component
          this.image = {
            // Read image as base64 and set it as src:
            name: imageFile.name,
            src: blob,
            type: imageFile.type,
          };
        };
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsArrayBuffer(imageFile);
      }
    },
    crop() {
      const { canvas } = this.$refs.cropper.getResult();
      canvas.toBlob((blob) => {
        // Do something with blob: upload to a server, download and etc.
        this.blob = blob;
      }, this.image.type);
      this.image.src = canvas.toDataURL();
      this.isSave = false;
    },
    save() {
      this.$emit("image", this.blob);
      this.closeDialogCropImg();
    },
    setDefaultValue() {
      this.isSave = true;
      this.blob = null;
      this.image = {
        name: null,
        type: null,
        src:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
      };
    },
  },
};
</script>
<style>
.cropper {
  height: 220px;
  width: 220px;
  background: #ddd;
}
.preview-result {
  width: 100%;
}
.preview-result img {
  width: 100%;
  object-fit: cover; /* scale the image to cover the container */
  object-position: center center; /* center the image within the container */
}
</style>
