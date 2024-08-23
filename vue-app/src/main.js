import { createApp } from 'vue'
import './assets/styles/main.css'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import VueBarcode from '@chenfengyuan/vue-barcode';


const pinia = createPinia()
const app = createApp(App)

app.component(VueBarcode.name, VueBarcode);
app.use(router)
app.use(pinia)
app.mount('#app')