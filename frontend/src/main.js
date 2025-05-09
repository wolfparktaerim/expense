import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import LoginModal from "./components/LoginModal.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// PWA settings
import { registerSW } from 'virtual:pwa-register'
const updateSW = registerSW({
  onNeedRefresh() {
    // Show a prompt to the user
    if (confirm('New content available. Reload?')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  }
})

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "expense-38776.firebaseapp.com",
  projectId: "expense-38776",
  storageBucket: "expense-38776.firebasestorage.app",
  messagingSenderId: "976334222204",
  databaseURL:
    "https://expense-38776-default-rtdb.asia-southeast1.firebasedatabase.app",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

// Create Vue app
const app = createApp(App);
const pinia = createPinia();

app.use(Toast, {
  transition: "Vue-Toastification__fade",
  maxToasts: 2,
  newestOnTop: true,
  filterToasts: (toasts) => {
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
  },
});
app.use(pinia);
app.component("LoginModal", LoginModal);
app.use(router);
app.mount("#app");
