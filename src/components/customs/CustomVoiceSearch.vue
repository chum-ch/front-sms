<script setup>
import { onMounted, reactive, ref, inject, provide, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'
onMounted(() => {})
defineEmits([''])
defineProps({
  listening: {
    type: String,
    required: false
  }
})
// Variable
const instance = getCurrentInstance()
const route = useRouter()
const $api = inject('$api')
const $globalFunction = inject('$globalFunction')
// Functions
const data = [
  { Name: 'chum', age: 11 },
  { Name: 'dara', age: 12 }
]
const searchInput = ref('')
const dialogVoice = ref('')
// Function to search for a name in the data array
function searchByName(name) {
  // Convert the input to lowercase for case-insensitive search
  const searchTerm = name.toLowerCase()
  // Filter the data array based on the name
  const results = data.filter((item) => item.Name.toLowerCase().includes(searchTerm))
  // Return the search results
  return results
}

// Function to handle the voice search
function handleVoiceSearch(duration) {
  const recognition = new webkitSpeechRecognition() // Create a SpeechRecognition object (browser-specific)
  recognition.lang = 'km-KH' // Set the language to Khmer
  recognition.start() // Start the voice recognition
  // Event listener for when the voice recognition receives a result
  recognition.onresult = function (event) {
    const voiceInput = event.results[0][0].transcript.trim() // Get the transcribed voice input
    searchInput.value = voiceInput // Set the input field value
    // Perform the search by calling the searchByName function
    const searchResults = searchByName(voiceInput)

    // Display the search results
    console.log(searchResults, voiceInput) // You can modify this to display the results in your desired format
    // Close voice form
    closeDialogVoice()
  }
  // Stop the recognition after the specified duration
  setTimeout(function () {
    recognition.stop() // Stop the voice recognition
    closeDialogVoice()
  }, duration)
}
// Function to handle the search button click
function handleSearch() {
  const searchResults = searchByName(searchInput.value)
  console.log(searchResults) // You can modify this to display the results in your desired format
}
const openDialogVoice = () => {
  dialogVoice.value.openDialog()
  handleVoiceSearch(6000)
}
const closeDialogVoice = () => {
  dialogVoice.value.closeDialog()
}
defineExpose({
  openDialogVoice,
  closeDialogVoice
})
</script>

<template>
  <div class="voice">
    <CustomDialog
      ref="dialogVoice"
      :modalHeader="' '"
      @onClickDialogSubmit="openDialogVoice"
      @onClickCloseDialog="closeDialogVoice"
      :hideFooter="true"
    >
      <template #bodyDialog>
        <div class="load-wrapp">
          <div class="load-3 flex">
            <p class="mr-2">{{ listening??'Listening' }}</p>
            <div class="mt-4 line"></div>
            <div class="mt-4 line"></div>
            <div class="mt-4 line"></div>
          </div>
        </div>
        <div class="mt-8">
          <div id="icon-mic"></div>
        </div>
      </template>
    </CustomDialog>

    <div>
      <input type="text" v-model="searchInput" placeholder="Search by name" />
    </div>
  </div>
</template>

<style scoped>
body {
  overflow: hidden;
}
#icon-mic {
  font-family: 'fontello';
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  height: 90px;
  width: 90px;
  box-shadow:
    inset 0 0 1px 1px var(--primary-color),
    inset 1px 1px 2px 1px var(--primary-color);

  left: 50%;
  top: 55%;
  position: absolute;
  transform: translate(-50%, -50%);
}
#icon-mic::before {
  content: ' ';
  position: absolute;
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 1px var(--primary-color);
  border-radius: 50%;
  height: 90px;
  width: 90px;
  opacity: 0;
  z-index: -1;
  animation: ping 1s ease-out; /* weird number to appear more random */
  animation-iteration-count: infinite;
}

@keyframes ping {
  0% {
    transform: scale(0.5, 0.5);
    opacity: 0;
  }
  50% {
    opacity: 0.65;
  }
  100% {
    transform: scale(1.5, 1.5);
    opacity: 0;
  }
}

#icon-mic::after {
  display: block;
  content: ' ';
  background: url('../../assets/img/microphone.png') no-repeat center;
  background-size: 50%;
  height: 1.5em;
  width: 1em;
  font-size: 73px;
  line-height: 1em;
  position: relative;
  text-align: center;
  left: 50%;
  top: 50%;
  margin: -52.75px 0 0 -35.5px;
}

.line {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  border-radius: 15px;
  background-color: var(--primary-color);
}
.load-3 .line:nth-last-child(1) {
  animation: loadingC 0.6s 0.1s linear infinite;
}
.load-3 .line:nth-last-child(2) {
  animation: loadingC 0.6s 0.2s linear infinite;
}
.load-3 .line:nth-last-child(3) {
  animation: loadingC 0.6s 0.3s linear infinite;
}

@keyframes loadingC {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 10px);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
