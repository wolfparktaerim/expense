import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import LoginModal from './components/LoginModal.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

// Global Component Registration
app.component('LoginModal', LoginModal)

app.use(router)
app.mount('#app')