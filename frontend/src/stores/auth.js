// src/stores/auth.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const showLoginModal = ref(false)
  const pendingRoute = ref(null)
  const isInitialized = ref(false) // Add this line

  // Initialize Firebase Auth listener
  const auth = getAuth()
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    isAuthenticated.value = !!firebaseUser
    if (firebaseUser && pendingRoute.value) {
      showLoginModal.value = false
      pendingRoute.value = null
    }
    isInitialized.value = true // Set to true once we have the initial auth state
  })

  return {
    user,
    isAuthenticated,
    showLoginModal,
    pendingRoute,
    isInitialized // Export the new ref
  }
})