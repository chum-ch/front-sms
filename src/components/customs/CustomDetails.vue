<template>
  <div>
    <div class="hello flex p-2 column-gap-2">
      <div class="shadow-8 md:shadow-2 surface-overlay p-2 w-29rem h-full">
        <div class="text-center">
          <div class="my-3 flex justify-content-center flex-wrap">
            <div class="profile-picture" :style="style">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
              />
            </div>
          </div>
          <h3>{{ fullName }}</h3>
          <p>{{ email }}</p>
        </div>
        <divider-primevue />
        <slot name="view_info"></slot>
      </div>

      <div class="w-full">
      
        <slot name="view_tab"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    msg: String,
    fullName: String,
    email: String,
    style: Object,
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

.profile-picture:hover::after {
  content: ""; /* addan empty content */
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
  content: ""; /* add text content */
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
</style>
