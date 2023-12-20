<template>
  <div class="about" v-if="isLoading" >
    <div id="preloader" class="preloader">
      <div class="spinner">
        <span class="ball-1"></span>
        <span class="ball-2"></span>
        <span class="ball-3"></span>
        <span class="ball-4"></span>
        <span class="ball-5"></span>
        <span class="ball-6"></span>
        <span class="ball-7"></span>
        <span class="ball-8"></span>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  components: {},
  data() {
    return {};
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  },
  emits: [],
  watch: {},
  created() {},
  methods: {},
};
</script>
<style scoped>
#preloader {
  overflow: hidden;
  background: #00000032;
  backdrop-filter: blur(3px);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  z-index: 9999;
}
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  height: 40px;
  width: 40px;
  transform: translate(-50%, -50%);
}
[class^="ball-"] {
  position: absolute;
  display: block;
  left: 30px;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  transition: all 0.5s;
  animation: circleRotate 4s both infinite;
  transform-origin: 0 250% 0;
}
@keyframes circleRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1440deg);
  }
}
.ball-1 {
  z-index: -1;
  background-color:  #1fca64;
  animation-timing-function: cubic-bezier(0.5, 0.3, 0.9, 0.9);
}
.ball-2 {
  z-index: -2;
  background-color: #1ab658;
  animation-timing-function: cubic-bezier(0.5, 0.6, 0.9, 0.9);
}
.ball-3 {
  z-index: -3;
  background-color:  #13b81e;
  animation-timing-function: cubic-bezier(0.5, 0.9, 0.9, 0.9);
}
.ball-4 {
  z-index: -4;
  background-color: #14ad1e;
  animation-timing-function: cubic-bezier(0.5, 1.2, 0.9, 0.9);
}
.ball-5 {
  z-index: -5;
  background-color: #34c45d;
  animation-timing-function: cubic-bezier(0.5, 1.5, 0.9, 0.9);
}
.ball-6 {
  z-index: -6;
  background-color:  #48dc6d;
  animation-timing-function: cubic-bezier(0.5, 1.8, 0.9, 0.9);
}
.ball-7 {
  z-index: -7;
  background-color:  #0ebf58;
  animation-timing-function: cubic-bezier(0.5, 2.1, 0.9, 0.9);
}
.ball-8 {
  z-index: -8;
  background-color:  #10ff7f;
  animation-timing-function: cubic-bezier(0.5, 2.4, 0.9, 0.9);
}
</style>
