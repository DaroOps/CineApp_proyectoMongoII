import { createApp } from 'vue'
import './assets/styles/main.css'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import VueBarcode from '@chenfengyuan/vue-barcode';
import { useSocketStore } from '@stores/socket.js';
import VueCookies from 'vue-cookies';


const pinia = createPinia()
const app = createApp(App)

app.component(VueBarcode.name, VueBarcode);
app.use(router)
app.use(VueCookies)
app.use(pinia)

const socketStore = useSocketStore()
socketStore.initSocket()

app.mount('#app')