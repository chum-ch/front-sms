<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted( async()=>{
    await listSchedules()
});
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
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
const events = ref([])

if (!schoolBc) {
  route.push('/')
} else {
  breadCrumb.value.push(
    { route: `/schools/${schoolId}/manages`, label: schoolBc.Name },
    { route: `/schools/${schoolId}/rooms`, label: 'Rooms' }
  )
}
// Functions

const listSchedules = async () => {
  try {
    let schedules = await $api.schedule.listSchedules(schoolId, { showLoading: false })
    if (schedules && schedules.data.length > 0) {
      events.value = schedules.data.map((item) => {
        const objEvent = {
          title: item.Course.Name,
          start: `${item.Date}T${item.StartTime}:00`,
          end: `${item.Date}T${item.EndTime}:00`,
          extendedProps: {
            className: item.Class.Name,
            teacherName: item.Trainer.Name,
            roomName: item.Room.Name,
            data: item
          }
        }
        return objEvent
      })
    }
  } catch (error) {
    console.log('List schedules error', error)
  }
}

defineExpose({listSchedules});
</script>

<template>
  <div class="all-schedules">
    <CustomFullCalendar :events="events"/>
  </div>
</template>

<style scoped>
</style>