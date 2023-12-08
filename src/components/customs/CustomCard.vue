<script setup>
import { onMounted } from 'vue'
defineProps({
  msg: {
    type: String,
    required: false
  },
  showComponent: {
    type: Object,
    default: () => ({}),
  },
  content: {
    type: String,
    default: () => (''),
  }
})
defineEmits(['onClick', 'componentClick']);
onMounted(()=>{});
</script>


<template>
    <div class="card shadow-8 md:shadow-2 border-round-sm flex align-items-center justify-content-center">
        <PrimeVueCard style="width: 25em" @click="($event) => $emit('componentClick', $event)" >
            <template #header>
                <img v-show="showComponent.showImage" :src="showComponent.ImageSrc" width="50" />
            </template>
            <template #title> 
              <span v-show="showComponent.showTitle">
                {{ showComponent.title }}
              </span>
            </template>
            <template #subtitle> 
              <span v-show="showComponent.showSubtitle">
                {{ showComponent.subtitleText }}
              </span>
            </template>
            <template #content>
                <p class="m-0">
                    {{ content }}
                </p>
            </template>
            <template #footer>
              <div v-show="showComponent.showFooter">
                <CustomButton :label="showComponent.labelFooter"
                @onClick="($event) => $emit('onClick', $event)"
                />
                <!-- <PrimeVueButton icon="pi pi-times" label="Cancel" severity="secondary" style="margin-left: 0.5em" /> -->
              </div>
            </template>
        </PrimeVueCard>
    </div>
</template>

<style scoped>
</style>