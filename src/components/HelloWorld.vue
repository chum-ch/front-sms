<script setup>
import { onMounted, ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
const route = useRouter()
defineProps({
  msg: {
    type: String,
    required: false
  }
})
const passedValue = ref('')

// Handle the passed value from Nav.vue
const handlePassValue = (value) => {
  passedValue.value = value
}
</script>

<template>
  <div class="greetings">
    <NavigationView @updatedBreadCrumb="handlePassValue"/>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
