<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(()=>{});
defineEmits(['']);
defineProps({
  msg: {
    type: String,
    required: false
  },
  menuItems: {
    type: Array,
    required: true
  }
})
// Variable
const instance = getCurrentInstance();
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction');
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
if (!schoolBc) {
  route.push('/')
}
// Functions
defineExpose({});
</script>

<template>
  <div class="menu-bar">
    <PrimeVueTieredMenu
    :model="menuItems"
    class="p-0"
    />
  </div>
</template>

<style >
.p-tieredmenu .p-menuitem > .p-menuitem-content .p-menuitem-link {
  padding: .6rem 1.25rem;
}
</style>