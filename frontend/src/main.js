import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import LoginModal from './components/LoginModal.vue'
import router from './router'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "wad2-81802.firebaseapp.com",
  databaseURL: "https://wad2-81802-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad2-81802",
  storageBucket: "wad2-81802.appspot.com",
  messagingSenderId: "371929127417",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

// Create Vue app
const app = createApp(App);
const pinia = createPinia();

app.use(Toast,{
  transition: "Vue-Toastification__fade",
  maxToasts: 2,
  newestOnTop: true,
  filterToasts: toasts => {
    // Keep track of existing types
    const types = {};
    return toasts.reduce((aggToasts, toast) => {
      // Check if type was not seen before
      if (!types[toast.type]) {
        aggToasts.push(toast);
        types[toast.type] = true;
      }
      return aggToasts;
    }, []);
  }
});
app.use(pinia);
app.component('LoginModal', LoginModal);
app.use(router);
app.mount('#app');