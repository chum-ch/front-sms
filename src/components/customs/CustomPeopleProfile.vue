<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits(['onClick'])
defineProps({
  fullName: {
    type: String,
    default: () => ''
  },
  email: {
    type: String,
    default: () => ''
  },
  style: {
    type: Object,
    default: () => {}
  },
  ProfileURL: {
    type: String,
    default: () => ''
  }
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
const schoolId = route.currentRoute.value.params.schoolId
const schoolBc = $globalFunction.getDataLs('schoolBc')
const breadCrumb = ref([])
if (!schoolBc) {
  route.push('/')
}
// Functions
const defaultImg = ref()
defaultImg.value =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'
defineExpose({})
</script>

<template>
  <!-- <div class="profile-picture">
      <img src="../../assets/img/school-1.png" />
    </div> -->
  <div class="shadow-8 md:shadow-2 surface-overlay h-full p-2">
    <div class="text-center">
      <div class="my-3 flex justify-content-center flex-wrap" @click="$emit('onClick')">
        <div class="profile-picture" :style="style" v-tooltip.top="'Click to change profile'">
          <!-- :src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png" -->
          <img :src="ProfileURL ? ProfileURL : defaultImg" />
        </div>
      </div>
      <h3>{{ fullName }}</h3>
      <p class="email text-sm mb-2">{{ email }}</p>
    </div>
    <PrimeVueDivider />
    <slot name="view_info"></slot>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.profile-picture {
  cursor: pointer;
  width: 180px; /* set the width of the profile picture */
  height: 180px; /* set the height of the profile picture */
  border-radius: 50%; /* create a circular shape for the profile picture */
  overflow: hidden; /* hide any overflow from the image */
  border: 5px double #fff; /* add a white border */
  box-shadow: 0px 0px 5px #0000004d; /* add a shadow effect */
  position: relative; /* make the container position relative */
}

.profile-picture img {
  width: 100%; /* set the width of the image to 100% of the container */
  height: auto; /* allow the image to maintain its aspect ratio */
  object-fit: cover; /* scale the image to cover the container */
  object-position: center center; /* center the image within the container */
}

.profile-picture:hover::after {
  content: ''; /* addan empty content */
  position: absolute; /* make the overlay position absolute */
  top: 0; /* set the top position to 0 */
  left: 0; /* set the left position to 0 */
  width: 100%; /* set the width of the overlay to 100% of the container */
  height: 100%; /* set the height of the overlay to 100% of the container */
  background-color: #00000080; /* set the background color and opacity */
  opacity: 0; /* set the initial opacity to 0 */
  transition: opacity 0.3s ease-in-out; /* add a transition effect */
}

.profile-picture:hover::before {
  content: ''; /* add text content */
  position: absolute; /* make the text position absolute */
  bottom: -25px; /* set the bottom position to -25px */
  left: 50%; /* set the left position to 50% */
  transform: translateX(-50%); /* center the text horizontally */
  color: #fff; /* set the text color */
  font-size: 14px; /* set the text size */
  opacity: 0; /* set the initial opacity to 0 */
  transition: opacity 0.3s ease-in-out; /* add a transition effect */
}

.profile-picture:hover::after,
.profile-picture:hover::before {
  opacity: 1; /* set the opacity to 1 on hover */
}
.email {
  word-break: break-all;
}
</style>
