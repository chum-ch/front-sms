
<template>
  <div class="">
    <CustomQAForm/>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(()=>{});
defineEmits(['update:modelValue']);
defineProps({
  msg: {
    type: String,
    required: false
  }
})
// Variable
const instance = getCurrentInstance();
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction');
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/rooms`, label: 'Rooms' }
  )
}
// Functions
  defineExpose({});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
