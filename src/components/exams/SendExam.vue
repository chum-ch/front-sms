<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(()=>{});
defineEmits(['']);
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
// Functions
defineExpose({});
</script>

<template>
  <div class="send-exam">
    <h2 class="green">Coming soon ...</h2>
  </div>
</template>

<style scoped>
</style>