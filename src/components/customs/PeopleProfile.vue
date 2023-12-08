<template>
  <!-- <div class="profile-picture">
      <img src="../../assets/img/school-1.png" />
    </div> -->
  <div class="my-3 flex justify-content-center flex-wrap">
    <div class="profile-picture" :style="style">
      <!-- :src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png" -->
      <img :src="ProfileURL ? ProfileURL : defaultImg" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      defaultImg:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
    };
  },
  props: {
    style: Object,
    ProfileURL: String,
  },
  emits: [""],
  watch: {
    // values: {
    //   immediate: true,
    //   handler(data) {
    //     this.$emit("update:modelValue", data);
    //   },
    // },
  },
  created() {},
  methods: {},
};
</script>

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
</style>
