import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import LoginModal from './components/LoginModal.vue'
import router from './router'

const app = createApp(App)
// Global Component Registration
app.component('LoginModal', LoginModal)

app.use(router)
app.mount('#app')
