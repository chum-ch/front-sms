<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import axios from 'axios'
import CustomSpinner from './components/customs/CustomSpinner.vue'
const route = useRouter()
const isLoading = ref(false)
const isSkeleton = ref(true)
const dialogMessage = ref()
const msg = ref('Something error.')
onMounted(() => {
  try {
    axios.interceptors.request.use((config) => {
      const hasKeyShowLoading = Object.keys(config).includes('showLoading')
      if (hasKeyShowLoading) {
        isLoading.value = config.showLoading
      } else {
        isLoading.value = true
      }
      return config
    })
    axios.interceptors.response.use(
      (response) => {
        isLoading.value = false
        isSkeleton.value = false
        return response
      },
      (error) => {
        if (error.response.status >= 400 && error.response.status <= 500) {
          const { message } = error.response.data;
          if (typeof message ==='string') {
            msg.value = message;
          }
          openDialogMessage()
          setTimeout(() => {
            closeDialogMessage()
          }, 10000) // Delay of 10000 milliseconds (10 seconds) before clearing progress
        }
        isLoading.value = false
        return Promise.reject(error)
      }
    )
  } catch (error) {
    console.error('Error', error)
    isLoading.value = false
  }
})
const openDialogMessage = () => {
  dialogMessage.value.openDialog()
}
const closeDialogMessage = () => {
  dialogMessage.value.closeDialog()
}
</script>

<template>
  <!-- {{ route.currentRoute.value.path }} -->
  <CustomSpinner :isLoading="isLoading" />

  <header>
    <!-- <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->
      </header>
  <CustomDialog
    ref="dialogMessage"
    :modalHeader="'Error message'"
    @onClickDialogSubmit="openDialogMessage"
    @onClickCloseDialog="closeDialogMessage"
    :secondary="true"
    :hideBtnSubmit="true"
  >
    <template #bodyDialog>
      <p class="text-center pt-3 text-red-500"> {{ msg }}
        <i class="pi pi-exclamation-triangle text-red-500 font-bold"></i>
      </p>
    </template>
  </CustomDialog>
  <div
    class="flex justify-content-center flex-wrap gap-3"
    v-if="isSkeleton && route.currentRoute.value.path === '/'"
  >
    <div class="relative" v-for="index in 2" :key="index">
      <PrimeVueSkeleton width="22rem" height="9rem" class="" />
      <div class="absolute bottom-0 top-50 ml-5 mt-3">
        <PrimeVueSkeleton
          width="18rem"
          height="2.7rem"
          class="bg-teal-50 border-2 border-teal-50"
        />
      </div>
    </div>
  </div>
    <RouterView />
</template>

<style scoped></style>
