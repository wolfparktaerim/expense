// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUPhxVXeYgeB1zNzYJvGZMjUrIK4r3kd0",
  authDomain: "expense-38776.firebaseapp.com",
  projectId: "expense-38776",
  storageBucket: "expense-38776.firebasestorage.app",
  messagingSenderId: "976334222204",
  appId: "1:976334222204:web:16609402f5338ee381eaf9",
  measurementId: "G-X420ZQXPJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);