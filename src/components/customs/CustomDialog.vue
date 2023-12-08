<template>
  <div class="hello">
    <PrimeVueDialog
      :header="modalHeader ? modalHeader : 'Modal'"
      v-model:visible="displayModal"
      :positionDialog="position"
      :style="{ width: dialogWidth ? dialogWidth : '45vw' }"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
    >
      <div class="text-center" v-if="isDelete">
        <span class="mr-1 font-bold">Delete</span>
        <i class="pi pi-exclamation-triangle text-center text-red-500 font-bold"></i>
      </div>
      <slot name="bodyDialog"> </slot>

      <template #footer v-if="hideFooter ? !hideFooter : true">
        <div class="flex justify-content-end flex-wrap">
          <CustomButton
            @onClick="$emit('onClickCloseDialog')"
            :label="'Cancel'"
            class="mr-2"
            :outlined="true"
          />
          <CustomButton
            :label="footerLabel ? footerLabel : 'Submit'"
            :disabled="disabledSubmitBtn"
            :danger="danger"
            @onClick="($event) => $emit('onClickDialogSubmit', $event)"
          />
        </div>
      </template>
    </PrimeVueDialog>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      displayModal: false,
      position: 'top'
    }
  },
  props: {
    msg: String,
    disabledSubmitBtn: Boolean,
    showDialog: Boolean,
    modalHeader: String,
    dialogWidth: String,
    positionDialog: String,
    hideFooter: Boolean,
    footerLabel: String,
    danger: Boolean,
    isDelete: Boolean
  },
  emits: ['onClickDialogSubmit', 'onClickCloseDialog'],
  watch: {},
  updated() {
    // this.displayModal = this.showDialog
    // console.log('show dia', this.displayModal);
  },
  created() {},
  methods: {
    openDialog() {
      this.displayModal = true
    },
    closeDialog() {
      this.displayModal = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .p-dialog .p-dialog-header-icon {
  display: none;
  align-items: center;
} */
</style>
