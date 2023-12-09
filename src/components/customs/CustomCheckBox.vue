<template>
  <div class="p-fluid">
    <label v-if="label !== ''" class="mb-2" :class="hideLabel  ? 'd-none' : ''">{{ label }} </label>
    <div
      :class="
        isFlex ? 'flex flex-wrap column-gap-3' : 'flex flex-column flex-wrap row-gap-2'
      "
    >
      <div
        v-for="(item, index) in checkBoxCategories"
        :key="index"
        class="flex align-items-center"
      >
        <PrimeVueCheckbox
          v-model="values"
          :inputId="item.Value"
          name="checkBox"
          :value="item"
          :disabled="item.Disable"
          @input="inputValue"
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
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      values: this.defaultValue ? this.defaultValue : "",
      p_invalid: "",
      objectStyleCSS: {
        color: "gray",
        cursor: "not-allowed",
      },
    };
  },
  props: {
    checkBoxCategories: Array,
    defaultValue: Array,
    label: String,
    isFlex: Boolean,
    hideLabel: Boolean,
    modelValue: [String, Number, Object],
  },
  emits: ["update:modelValue"],
  watch: {
    // values: {
    //   immediate: true,
    //   handler(data) {
    //     console.log('cech', data);
    //     this.$emit("update:modelValue", data);
    //   },
    // },
    message_error: {
      immediate: true,
      handler(data) {
        if (data) {
          this.p_invalid = "p-invalid";
        }
      },
    },
  },
  created() {},
  methods: {
    inputValue(data){
      this.$emit("update:modelValue", data)
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
