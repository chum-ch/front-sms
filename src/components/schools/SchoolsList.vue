<script setup>
import { onMounted, ref, inject, provide } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// const instance = getCurrentInstance();
// const $api = instance.appContext.config.globalProperties.$api; // In case not use provide
const $api = inject('$api')
const $globalFunction = inject('$globalFunction');
let schoolItems = ref(null)
defineProps({
  msg: {
    type: String,
    required: false
  }
})
defineEmits([''])
onMounted(async () => {
  try {
    window.localStorage.clear();
    let schools = await $api.school.listSchools()
    if (schools && schools.data && schools.data.length > 0) {
      schoolItems.value = schools.data
    }
  } catch (error) {
    console.error('Error', error)
  }
})
const manage = (id, school) => {
  // Clear all items from localStorage
  $globalFunction.setDataLs('schoolBc', school);
  router.push(`/schools/${id}/manages`)
  // this.$router.push(`/schools/${id}/manages`);
}
</script>

<template>
  <div class="">
    <!-- Navigation with breadCrum  -->
    <!-- <custom-navigation :home="home" /> -->
    <div class="flex justify-content-center flex-wrap gap-3">
      <CustomCard
        class="text-center"
        v-for="(item, index) in schoolItems"
        :key="index"
        :showComponent="{
          showTitle: true,
          title: item.Name,
          showFooter: true,
          labelFooter: 'Manage'
        }"
        @onClick="manage(item.SCHOOLS_ID, item)"
      />
    </div>
  </div>
</template>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
