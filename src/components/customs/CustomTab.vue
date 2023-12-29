<script setup>
import {
  onMounted,
  reactive,
  ref,
  inject,
  provide,
  getCurrentInstance,
  watch,
  shallowRef
} from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {
  const defaultActive = props.dataTabs.find((item) => item.Active)
  selectedComponent.value = defaultActive.Component
})
defineEmits(['update:modelValue', 'update:Component'])
const props = defineProps({
  msg: {
    type: String,
    required: false
  },
  dataTabs: {
    type: Array
  },
  isFlex: {
    type: Boolean
  },
  justifyContent: {
    type: String
  }
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
const selectedComponent = shallowRef(null)
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/rooms`, label: 'Rooms' }
  )
}
const showNav = (name) => {
  selectedComponent.value = name
  instance.emit('update:Component', name)
}
defineExpose({})
</script>

<template>
  <div>
    <nav class="mb-2">
      <ul
        :class="[
          isFlex ? 'flex' : '',
          justifyContent ? `d-flex justify-content-${justifyContent}` : ''
        ]"
      >
        <li
          class=""
          v-for="(item, index) in dataTabs"
          :key="index"
          @click="showNav(item.Component)"
          :class="[
            { active: selectedComponent === item.Component },
            { active: !selectedComponent === item.Active }
          ]"
        >
          {{ item.TabName }}
        </li>
      </ul>
    </nav>
    <PrimeVueDivider />
    <component :is="selectedComponent" />
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav ul {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
ul li {
  padding: 4px;
  margin: 0 4px;
  cursor: pointer;
  color: blue;
  /* background: red; */
}
li.active {
  border-bottom: 4px solid;
  color: var(--primary-color);
  border-radius: 5px;
}
</style>
