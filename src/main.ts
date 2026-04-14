import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createBootstrap} from 'bootstrap-vue-next';
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tippy.js/dist/tippy.css'
import VueTippy from 'vue-tippy'
// Import the CSS or use your own!
import '@programic/vue3-tooltip/dist/index.css';
import "vue-search-select/dist/VueSearchSelect.css"
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { createPinia } from 'pinia'
import '@/assets/css/main.css'

import { createVfm } from 'vue-final-modal';
import 'vue-final-modal/style.css';
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {far} from "@fortawesome/free-regular-svg-icons";
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import Notifications from '@kyvg/vue3-notification';
import '@splidejs/vue-splide/css'; 
import i18n from './i18n';

library.add(fas,fab,far);
const vfm = createVfm();
const pinia = createPinia();

/* const {  handleRedirect } = useAuth();
(async () => {

  try {
    // Iniciar la inicialización de myMSALObj
    await myMSALObj.initialize();

    // Manejar la redirección después de la autenticación
    await handleRedirect();


  } catch (error) {

  }
})(); */
const app =createApp(App);

app.use(router);
app.use(pinia);
app.use(Notifications);
app.use(
  VueTippy,
  // optional
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
  }
);
app.use(vfm);
app.use(createBootstrap());
// Use plugin defaults (optional)
app.use(setupCalendar, {})

// Use the components
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.component('VueDatePicker', VueDatePicker);
app.component("font-awesome-icon",FontAwesomeIcon);
//Usa el plugin de i18n
app.use(i18n);
app.mount('#app');
