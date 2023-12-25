<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import axios from 'axios'
import CustomSpinner from './components/customs/CustomSpinner.vue'
const route = useRouter()
const receivedData = ref(null)
const isLoading = ref(false)
const isSkeleton = ref(true)
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
        console.log('error')
        isLoading.value = false
        return Promise.reject(error)
      }
    )
  } catch (error) {
    console.log('error', error)
    isLoading.value = false
  }
})
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
