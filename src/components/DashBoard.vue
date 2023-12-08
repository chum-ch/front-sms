<script setup>
import { onMounted, onUpdated, ref, computed, inject, provide } from 'vue'
import { useRouter } from 'vue-router'
import data from '../assets/data/startingData.json'
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction');
const breadCrumb = ref([])
const schoolBc = $globalFunction.getDataLs('schoolBc');
if (!schoolBc) {
  route.push('/');
} else {
  breadCrumb.value.push({ route: `/schools/${schoolBc.SCHOOLS_ID}/manages`, label: schoolBc.Name })
}
defineProps({
  msg: {
    type: String,
    required: false
  }
})
defineEmits([''])
const listServices = (name) => {
  route.push(`/schools/${schoolBc.SCHOOLS_ID}/${name}`)
}
</script>

<template>
  <NavigationView :breadCrumb="breadCrumb" />
  <div class="flex justify-content-center flex-wrap gap-3">
    <CustomCard
      class="text-center"
      v-for="(item, index) in data"
      :key="index"
      :showComponent="{ showTitle: true, title: item.title, showImage: true, ImageSrc: item.img }"
      :content="item.description"
      @componentClick="listServices(item.name)"
    />
    <!-- <div v-for="(item, index) in data" :key="index" class="col" @click="list(item.name)">
      <div class="card h-100 custom transition-duration-500 text-center">
        <div class="image d-flex justify-content-center cursor-pointer flex-wrap my-4">
          <img :src="item.img" alt="" srcset="" width="70" height="70" class="" />
          <div class="card-body">
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="card-text">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped></style>
