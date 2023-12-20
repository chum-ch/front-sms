<script setup>
import { onMounted, reactive, ref, inject, getCurrentInstance, watch } from 'vue'
const instance = getCurrentInstance();

const home = reactive({
  icon: 'pi pi-home',
  route: '/'
})
defineProps({
  breadCrumb: {
    type: Array,
    // default: () => ([]),
  }
})
defineEmits(['updatedBreadCrumb'])
</script>

<template>
  <div class="sticky top-0 z-5 blur mb-3">
    <div class="flex justify-content-between align-items-center">
      <h4>SMS</h4>
      <!-- <marquee width="60%" direction="left" height="" class=""
        >ប្រព័ន្ធគ្រប់គ្រងសាលារៀន សូមស្វាគមន៏!</marquee
      > -->
      <div class="image flex justify-content-center flex-wrap">
        <img
          src="../assets/img/school-1.png"
          alt=""
          srcset=""
          width="50"
          class="cursor-pointer"
        />
      </div>
    </div>
    <div class="">
        <PrimeVueBreadcrumb :home="home" :model="breadCrumb">
            <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span :class="[item.icon, 'text-color']" />
                        <span class="text-primary font-semibold">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="text-color">{{ item.label }}</span>
                </a>
            </template>
        </PrimeVueBreadcrumb>
    </div>

    <!-- <PrimeVueBreadcrumb :home="home" :model="breadCrumb" class="m-0" /> -->
  </div>
</template>
<style scoped>
.p-breadcrumb {
  padding: 0px 0px 10px 10px;
  border-top: none;
  border-right: none;
  border-left: none;
  background: transparent;
  border-radius: 0;
}
.blur {
  background: #ffffffb2;
  backdrop-filter: blur(5px);
}
</style>
