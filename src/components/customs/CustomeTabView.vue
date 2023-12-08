<template>
  <div>
    <TabView>
      <TabPanel :header="nameTab">
        <slot></slot>
      </TabPanel>
    </TabView>
  </div>
</template>

<script>
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
export default {
  components: {
    TabView,
    TabPanel,
  },
  data() {
    return {
      values: "",
    };
  },
  props: {
    msg: String,
    nameTab: String,
  },
  emits: ["update:modelValue"],
  watch: {
    // values: {
    //   immediate: true,
    //   handler(data) {
    //     this.$emit("update:modelValue", data);
    //   },
    // },
  },
  created() {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
