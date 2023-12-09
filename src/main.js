import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import API from './api/api'
import utils from './utils/utils'
// PrimeVue
import PrimeVue from 'primevue/config'
import 'primeflex/primeflex.css'
//theme
// import "primevue/resources/themes/lara-light-indigo/theme.css";
import 'primevue/resources/themes/lara-light-green/theme.css'
// import "primevue/resources/themes/lara-light-blue/theme.css"
//core
import 'primevue/resources/primevue.min.css'

//icons
import 'primeicons/primeicons.css'

// Primevue component
import Button from 'primevue/button'
import Card from 'primevue/card'
import Breadcrumb from 'primevue/breadcrumb'
import Dialog from 'primevue/dialog'
// Custom component

// Custom component
import NavigationView from './views/NavigationView.vue'
import CustomButton from './components/customs/CustomButton.vue'
import CustomTable from './components/customs/CustomTable.vue'
import CustomCard from './components/customs/CustomCard.vue'
import CustomInputText from './components/customs/CustomInputText.vue'
import CustomDialog from './components/customs/CustomDialog.vue'
import CustomRadioButton from './components/customs/CustomRadioButton.vue'
import CustomDropdown from './components/customs/CustomDropdown.vue'
import CustomInputNumber from './components/customs/CustomInputNumber.vue'
const app = createApp(App)

// Config Axios
const $api = API(axios)
if (import.meta.env.PROD) {
  axios.defaults.baseURL = 'https://svc-sms.onrender.com'
} else {
  axios.defaults.baseURL = 'http://localhost:3003'
}
// Register component
// Primevue
app.component('PrimeVueButton', Button)
app.component('PrimeVueCard', Card)
app.component('PrimeVueBreadcrumb', Breadcrumb)
app.component('PrimeVueDialog', Dialog)

// Custom
app.component('NavigationView', NavigationView)
app.component('CustomButton', CustomButton)
app.component('CustomCard', CustomCard)
app.component('CustomTable', CustomTable)
app.component('CustomInputText', CustomInputText)
app.component('CustomDialog', CustomDialog)
app.component('CustomRadioButton', CustomRadioButton)
app.component('CustomDropdown', CustomDropdown)
app.component('CustomInputNumber', CustomInputNumber)

app.use(router)
app.use(PrimeVue)
app.provide('$api', $api)
app.provide('$globalFunction', utils)
app.mount('#app')
