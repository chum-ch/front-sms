<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits([''])
const props = defineProps({
  avatarName: {
    type: String,
    required: false
  }
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
// Functions
defineExpose({})
</script>

<template>
  <div class="fieldset">
    <CustomFieldset>
      <template #legendFieldset>
        <div class="flex align-items-center pl-2">
          <PrimeVueAvatar
            image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
            shape="circle"
            class="p-avatar-lg"
          />
          <span class="font-bold ml-2"> {{ props.avatarName }}</span>
        </div>
      </template>
      <template #bodyFieldset>
        <div class="grid">
          <div class="personal xl:col-5 col-12">
            <CustomViewInfo :label="'Full name:'" :value="props.avatarName"> </CustomViewInfo>
          </div>
        </div>
      </template>
    </CustomFieldset>
  </div>
</template>

<style scoped></style>
