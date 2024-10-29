<template>
  <LoginModal @close="showLogin = false" v-if="showLogin" />
  <header
    :class="[
      'sticky top-0 w-full z-20 transition-all duration-300 border-b border-gray-200',
      { 'bg-white/70 backdrop-blur-sm': isScrolled }
    ]"
  >
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <RouterLink 
          to="/" 
          class="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors duration-300"
        >
          oBEATsity
        </RouterLink>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <!-- Search is available for both logged-in and logged-out users -->
        <RouterLink 
          to="/search"
          class="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
        >
          <Search class="w-4 h-4" />
          <span>Search</span>
        </RouterLink>

        <!-- Logged out navigation -->
        <template v-if="!isAuthenticated">
          <a 
            href="#HowItWorks"
            class="text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
          >
            How It Works
          </a>
          <button
            @click="login"
            class="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Login
          </button>
        </template>

        <!-- Logged in navigation -->
        <template v-else>
          <RouterLink 
            to="/discover"
            class="text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
          >
            Discover
          </RouterLink>
          <RouterLink 
            to="/foodtrivia"
            class="text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
          >
            Food Trivia
          </RouterLink>
          <RouterLink 
            to="/saved"
            class="text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
          >
            Saved
          </RouterLink>
          
          <!-- Profile Dropdown -->
          <div class="relative" v-click-outside="closeProfileMenu">
            <button
              @click="toggleProfileMenu"
              class="flex items-center space-x-1 text-gray-600 hover:text-purple-600 focus:outline-none"
            >
              <User class="w-6 h-6" />
              <ChevronDown 
                :class="['w-4 h-4 transition-transform duration-200', { 'rotate-180': profileMenuOpen }]"
              />
            </button>

            <!-- Profile Dropdown Menu -->
            <div
              v-if="profileMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <RouterLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              >
                Your Profile
              </RouterLink>
              <RouterLink
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              >
                Settings
              </RouterLink>
              <button
                @click="logout"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              >
                Logout
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Mobile Navigation Toggle -->
      <div class="md:hidden">
        <button
          @click="toggleMobileMenu"
          class="text-gray-600 hover:text-purple-600 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white px-4 py-2 shadow-md"
      >
        <RouterLink
          to="/search"
          class="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
          @click="mobileMenuOpen = false"
        >
          <Search class="w-4 h-4" />
          <span>Search</span>
        </RouterLink>

        <!-- Logged out mobile navigation -->
        <template v-if="!isAuthenticated">
          <a
            href="#HowItWorks"
            class="block py-2 text-gray-600 hover:text-purple-600"
            @click="mobileMenuOpen = false"
          >
            How It Works
          </a>
          <button
            @click="login"
            class="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
          >
            Login
          </button>
        </template>

        <!-- Logged in mobile navigation -->
        <template v-else>
          <RouterLink
            v-for="(item, index) in loggedInMenuItems"
            :key="index"
            :to="item.path"
            class="block py-2 text-gray-600 hover:text-purple-600"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </RouterLink>
          <button
            @click="logout"
            class="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
          >
            Logout
          </button>
        </template>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { Search, User, ChevronDown, Menu, X } from 'lucide-vue-next'
import LoginModal from './LoginModal.vue'

// Auth store
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const router = useRouter()

// State
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)
const showLogin = ref(false)
const profileMenuOpen = ref(false)

// Menu items for logged-in users
const loggedInMenuItems = [
  { name: 'Discover', path: '/discover' },
  { name: 'Food Trivia', path: '/foodtrivia' },
  { name: 'Saved', path: '/saved' },
  { name: 'Profile', path: '/profile' }
]

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

const closeProfileMenu = () => {
  profileMenuOpen.value = false
}

const login = () => {
  showLogin.value = true
  mobileMenuOpen.value = false
}

const logout = async () => {
  const auth = getAuth()
  try {
    await auth.signOut()
    profileMenuOpen.value = false
    mobileMenuOpen.value = false
    router.push('/')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

// Scroll handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>