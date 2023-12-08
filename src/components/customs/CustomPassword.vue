<template>
  <div class="p-fluid">
    <label v-if="label !== ''">{{ label }} </label>
    <span v-if="required" class="text-red-500"> *</span>
    <div class="my-1">
      <Password
      promptLabel="ខ្សោយណាស់"
      weakLabel="ខ្សោយ"
      mediumLabel="មធ្យម"
      strongLabel="ខ្លាំង"
        v-model="values"
        :toggleMask="eye_icon"
        :placeholder="placeholder"
        class="cursor-pointer"
        :class="required && message_error !== '' ? p_invalid : ''"
      >
        <template #header>
          <h6>ស្ថានភាពពាក្យសម្ងាត់</h6>
        </template>
        <template #footer>
          <divider-primevue />
          <p class="mt-2">ការណែនាំ៖</p>
          <ul class="pl-2 ml-2 mt-0" style="line-height: 1.6">
            <li>អាចបញ្ចូលជាអក្សរខ្មែរ ។</li>
            <li>បើបញ្ចូលជាភាសាអង់គ្លេស ត្រូវលាយអក្សរពុម្ភ តូចនិងធំ ។</li>
            <li>អាចបញ្ចូលជាលេខខ្មែរ ឬសកល ។</li>
            <li>ពាក្យសម្ងាត់មានយ៉ាងតិច ៨ខ្ទង់ ។</li>
          </ul>
        </template>
      </Password>
    </div>

    <small v-if="message_error !== ''" class="flex text-red-500">
      <i :class="message_error ? 'pi pi-info-circle mr-1' : ''" />
      {{ message_error }}</small
    >
  </div>
</template>

<script>
import Password from "primevue/password";
export default {
  name: "CustomPassword",
  components: {
    Password,
  },
  data() {
    return {
      values: "",
      p_invalid: ""
    };
  },
  
  props: {
    msg: String,
    modelValue: String,
    placeholder: String,
    required: Boolean,
    label: String,
    message_error: String,
    eye_icon: Boolean,
  },
  emits: ["update:modelValue"],
  watch: {
    values: {
      immediate: true,
      handler(data) {
        this.$emit("update:modelValue", data);
      },
    },
    message_error: {
      immediate: true,
      handler(data) {
        if(data){
          this.p_invalid = "p-invalid"
        }
      },
    },
  },
  created() {
    this.values = this.modelValue;
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
