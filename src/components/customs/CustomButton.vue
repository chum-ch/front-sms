<template>
    <div class="p-fluid text-white" :style="disabled ? objectStyleCSS : ''">
      <PrimeVueButton
        @click="($event) => $emit('onClick', $event)"
        :style="style"
        :badge="badge"
        :type="type ? type : 'button'"
        v-show="hide ? false : true"
        :raised="raised"
        :label="label"
        :rounded="rounded"
        :link="isLink"
        :iconPos="rightIcon ? 'right' : ''"
        :disabled="disabled"
        :text="text"
        :outlined="outlined"
        :size="normal ? 'normal' : large ? 'large' : 'small'"
        :severity="
          secondary
            ? 'secondary'
            : success
            ? 'success'
            : info
            ? 'info'
            : warning
            ? 'warning'
            : help
            ? 'help'
            : danger
            ? 'danger'
            : ''
        "
        :icon="
          checkIcon
            ? 'pi pi-check'
            : userIcon
            ? 'pi pi-user'
            : searchIcon
            ? 'pi pi-search'
            : spinnerIcon
            ? 'pi pi-spin pi-spinner'
            : emailIcon
            ? 'pi pi-envelope'
            : deleteIcon
            ? 'pi pi-trash'
            : cancelIcon
            ? 'pi pi-times'
            : plusIcon
            ? 'pi pi-plus'
            : imageIcon
            ? 'pi pi-images'
            : cloudIcon
            ? 'pi pi-cloud-upload'
            : ''
        "
      />
    </div>
</template>

<script>

export default {
  name: "CustomButton",
  components: {
  },
  data() {
    return {
      objectStyleCSS: {
        cursor: "not-allowed",
      },
    };
  },
  props: {
    badge: String,
    style: Object,
    normal: Boolean,
    large: Boolean,
    hide: Boolean,
    label: String,
    checkIcon: Boolean,
    userIcon: Boolean,
    searchIcon: Boolean,
    spinnerIcon: Boolean,
    rightIcon: Boolean,
    emailIcon: Boolean,
    deleteIcon: Boolean,
    cancelIcon: Boolean,
    plusIcon: Boolean,
    imageIcon: Boolean,
    cloudIcon: Boolean,
    isLink: Boolean,
    disabled: Boolean,
    secondary: Boolean,
    success: Boolean,
    info: Boolean,
    warning: Boolean,
    help: Boolean,
    danger: Boolean,
    raised: Boolean,
    rounded: Boolean,
    text: Boolean,
    outlined: Boolean,
    type: String,
  },
  emits: ["onClick"],
  watch: {},
  created() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.p-button {
  margin: 0;
}
</style>
