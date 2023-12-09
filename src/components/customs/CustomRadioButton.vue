<template>
  <div class="p-fluid">
    <label v-if="label !== ''" class="mb-2" :class="hideLabel ? 'd-none' : ''"
      >{{ label }}
    </label>
    <div
      :class="
        isFlex ? 'flex flex-wrap column-gap-3' : 'flex flex-column flex-wrap row-gap-2'
      "
    >
      <div
        v-for="(item, index) in categories"
        :key="index"
        class="flex align-items-center"
      >
        <div v-if="item.Value">
          <RadioButton
            v-model="values"
            :inputId="item.Value"
            name="radio"
            :value="item"
            :disabled="item.Disable"
          />
          <label
            :for="item.Value"
            class="ml-2"
            :style="item.Disable ? objectStyleCSS : ''"
            >{{ item.Value }}</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadioButton from "primevue/radiobutton";
export default {
  components: {
    RadioButton,
  },
  data() {
    return {
      values: this.defaultValue ? this.defaultValue : {},
      pInvalid: "",
      objectStyleCSS: {
        color: "gray",
        cursor: "not-allowed",
      },
    };
  },
  props: {
    categories: Array,
    defaultValue: [Object, String],
    label: String,
    isFlex: Boolean,
    hideLabel: Boolean,
    modelValue: [String, Number, Object],
  },
  emits: ["update:modelValue"],
  watch: {
    values: {
      immediate: true,
      handler(data) {
        this.$emit("update:modelValue", data);
      },
    },
    messageError: {
      immediate: true,
      handler(data) {
        if (data) {
          this.pInvalid = "p-invalid";
        }
      },
    },
  },
  created() {
    if (this.modelValue) {
      this.values = this.modelValue;
      console.log('v', this.values);
    }
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
