<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import axios from 'axios'
import CustomSpinner from './components/customs/CustomSpinner.vue'
const route = useRouter()
const receivedData = ref(null)
const isLoading = ref(false)
onMounted(() => {
  try {
    axios.interceptors.request.use((config) => {
      isLoading.value = true
      return config
    })
    axios.interceptors.response.use(
      (response) => {
        isLoading.value = false
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

  <RouterView />
</template>

<style scoped></style>
