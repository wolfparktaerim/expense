<template>
  <LoginModal @close='this.showLogin = false' v-if="showLogin"></LoginModal>
  <header :class="['sticky top-0 w-full z-20 transition-all duration-300 border-b border-gray-200', { 'bg-white/70 backdrop-blur-sm': isScrolled }]">
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center">
        <RouterLink to="/" class="text-2xl font-bold text-purple-600">oBEATsity</RouterLink>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <a href="#" class="text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold">Home</a>
        <a href="#HowItWorks" class="text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold">How It Works</a>
        <!-- THIS IS A TEMP FUNCTION, WILL BE REMOVED IN LATER UPDATES -->
        <router-link to="/search" class="text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold">
          Search
        </router-link>
        <!-- THIS IS A TEMP FUNCTION, WILL BE REMOVED IN LATER UPDATES -->

        <button @click="login" class="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300">Login</button>
      </div>
      
      <!-- Mobile Navigation Toggle -->
      <div class="md:hidden">
        <button @click="toggleMobileMenu" class="text-gray-600 hover:text-purple-600 focus:outline-none">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </nav>
    
    <!-- Mobile Navigation Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-white px-4 py-2 shadow-md">
      <a href="#" class="block py-2 text-gray-600 hover:text-purple-600">Home</a>
      <a href="#HowItWorks" class="block py-2 text-gray-600 hover:text-purple-600">How It Works</a>
      <a href="#About" class="block py-2 text-gray-600 hover:text-purple-600">About</a>
      <button @click="login" class="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300">Login</button>
    </div>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router';
export default {

  data() {
    return {
      mobileMenuOpen: false,
      isScrolled: false,
      showLogin: false,
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    login() {
      // Implement login functionality
      this.showLogin = true;
      
      console.log('Login clicked')
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 0
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>