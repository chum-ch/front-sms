<template>
  <div>
    <nav
      class=""
      :class="[
        isFlex ? 'flex' : '',
        justifyContent ? `d-flex justify-content-${justifyContent}` : '',
      ]"
    >
      <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <div v-for="(item, index) in dataTabs" :key="index">
          <button
            class="nav-link fw-bold"
            :class="item.Active ? 'active' : ''"
            :id="index"
            data-bs-toggle="tab"
            :data-bs-target="`#${item.TabName}`"
            type="button"
            role="tab"
            aria-controls="nav-home"
            aria-selected="true"
          >
            {{ item.TabName }}
          </button>
        </div>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent">
      
      <div
        v-for="(item, index) in dataTabs"
        :style="item.style"
        :key="index"
        class="tab-pane fade show overflow-scroll h-screen my-4"
        :class="[item.Active ? 'active' : '']"
        :id="item.TabName"
        role="tabpanel"
        :aria-labelledby="index"
      >
        <slot :name="item.ComponentName"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      values: "",
      p_invalid: "",
    };
  },
  props: {
    dataTabs: Array,
    isFlex: Boolean,
    justifyContent: String,
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
  created() {
    // this.values = this.modelValue;
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#nav-tab .active {
  color: var(--primary-color);
  background: var(--primary-50);
}
</style>
