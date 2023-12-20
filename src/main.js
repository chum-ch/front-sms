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
import Divider from 'primevue/divider';
import Tag from "primevue/tag";
import Checkbox from "primevue/checkbox";
import RadioButton from "primevue/radiobutton";
import Tooltip from 'primevue/tooltip';

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
import CustomQA from './components/customs/CustomQA.vue';
import CustomQAForm from './components/customs/CustomQAForm.vue';
import CustomCheckBox from './components/customs/CustomCheckBox.vue';
import CustomInputTextAea from './components/customs/CustomInputTextAea.vue';
import CustomCalendar from './components/customs/CustomCalendar.vue';
import CustomInputMask from './components/customs/CustomInputMask.vue';
import CustomPeopleProfile from './components/customs/CustomPeopleProfile.vue';
import PeopleProfile from './components/customs/PeopleProfile.vue';
import CustomViewInfo from './components/customs/CustomViewInfo.vue';
import CustomTab from './components/customs/CustomTab.vue';
import CustomFullCalendar from './components/customs/CustomFullCalendar.vue';
import CustomCropImg from './components/customs/CustomCropImg.vue';

const app = createApp(App)
app.directive('tooltip', Tooltip);
// Config Axios
const $api = API(axios)
// axios.defaults.baseURL = 'https://svc-sms.onrender.com'
if (import.meta.env.PROD) {
  axios.defaults.baseURL = 'https://svc-sms.onrender.com'
} else {
  axios.defaults.baseURL = 'http://localhost:3003'
}
// Register component
// PrimeVue
app.component('PrimeVueButton', Button)
app.component('PrimeVueCard', Card)
app.component('PrimeVueBreadcrumb', Breadcrumb)
app.component('PrimeVueDialog', Dialog)
app.component('PrimeVueDivider', Divider);
app.component('PrimeVueTag', Tag);
app.component('PrimeVueCheckbox', Checkbox);
app.component('PrimeVueRadio', RadioButton);

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
app.component('CustomQA', CustomQA);
app.component('CustomQAForm', CustomQAForm);
app.component('CustomCheckBox', CustomCheckBox);
app.component('CustomTextArea', CustomInputTextAea);
app.component('CustomCalendar', CustomCalendar);
app.component('CustomInputMask', CustomInputMask);
app.component('CustomPeopleProfile', CustomPeopleProfile);
app.component('CustomProfile', PeopleProfile);
app.component('CustomViewInfo', CustomViewInfo);
app.component('CustomTab', CustomTab);
app.component('CustomFullCalendar', CustomFullCalendar);
app.component('CustomCropImg', CustomCropImg);
app.use(router)
app.use(PrimeVue)
app.provide('$api', $api)
app.provide('$globalFunction', utils)
app.mount('#app')
