<template>
  <div class="mb-1 p-fluid">
    <section class="flex flex-column">
      <div>
        <label v-if="label !== ''">{{ label }} </label>
        <span v-if="required" class="text-red-500"> *</span>
      </div>
      <Dropdown
        v-model="selectedValue"
        :options="options"
        filter
        @filter="handleFilterChange"
        :placeholder="placeholder"
        :filterPlaceholder="'Search'"
        optionLabel="Value"
        :class="required && messageError !== '' ? p_invalid : ''"
        @update:modelValue="updateModelValue"
      >
        <template #content> </template>
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <div>{{ slotProps.value.Value }}</div>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.Value }}</div>
          </div>
        </template>

        <template #emptyfilter>
          <small v-show="filterValue" class="flex justify-content-between">
            <span
              >Value <span class="fw-bolder text-primary">{{ filterValue }}</span> is not
              found!</span
            >
            <span class="text-white customEmpty" @click="$emit('addNewDropdown', filterValue)"
              >Add New</span
            >
          </small>
        </template>
        <template #empty>
          <small class="flex justify-content-between">
            <span>No more item !</span>
            <span class="text-white customEmpty" @click="$emit('addNewDropdown', filterValue)"
              >Add New</span
            >
          </small>
        </template>
      </Dropdown>
      <small v-if="messageError !== ''" class="flex text-red-500 mt-1">
        {{ messageError }}
        <i :class="messageError ? 'pi pi-info-circle' : ''" style="margin: 2px" />
      </small>
    </section>
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown'
export default {
  name: 'CustomDropdown',
  components: {
    Dropdown
  },
  data() {
    return {
      selectedValue: '',
      filterValue: '',
      p_invalid: ''
    }
  },
  props: {
    msg: String,
    placeholder: String,
    options: Array,
    required: Boolean,
    messageError: String,
    label: String,
    modelValue: [String, Object, Number]
  },
  emits: ['update:modelValue', 'addNewDropdown'],
  watch: {},
  updated() {
    if (this.messageError) {
      this.p_invalid = 'p-invalid'
    } else {
      this.p_invalid = ''
    }
    this.updateModelValue(this.modelValue)
  },
  created() {
    this.filterValue = ''
  },
  methods: {
    handleFilterChange(event) {
      this.filterValue = event.value
    },
    updateModelValue(value) {
      this.selectedValue = value
      this.$emit('update:modelValue', this.selectedValue)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.customEmpty {
  padding: 3px;
  border-radius: 4px;
  background: #007bff;
  cursor: pointer;
}
.customEmpty:hover {
  background: #006adc;
}
</style>
